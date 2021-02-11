/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-var-requires */

const LRU = require('lru-cache');
const { existsSync, readFileSync } = require('fs');
const { join } = require('path');

import LRUCache from 'lru-cache';
import MarkdownIt from 'markdown-it';
import { writeFileSync } from 'fs-extra';

import { DecisionConfig, MarkDownReplacementOptions } from './types';
import { RenderRule } from 'markdown-it/lib/renderer';

const cache: LRUCache<string, string> = new LRU({
  max: 500
});

const DEFAULT_CONFIG: {
  decisions: DecisionConfig[];
  digits: number;
  language: string;
  path: string;
  prefix: string;
  id: number;
  [key: string]: string | number | DecisionConfig[];
} = {
  decisions: [],
  digits: 5,
  id: 0,
  language: 'en',
  path: join(getWorkDir(), '/docs/adr/'),
  prefix: ''
};

/**
 * Get current working directory
 *
 * @public
 */
export function getWorkDir(): string {
  return process.cwd();
}

/**
 * Slugify string
 *
 * @param text - { string }
 * @public
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/**
 * Generate a decision file. Creates a safe filename
 * and increments id on json.
 *
 * @param name - { string }
 * @param id - { number }
 * @public
 */
export function generateFileName(name: string, id = 0): string {
  const title = slugify(name);
  const idx = id ? id + 1 : (getConfig('id') as number) + 1;
  const digits = getConfig('digits') as number;
  const prefix = getConfig('prefix') as string;

  const serial = serialNum(idx, digits);

  const config = {
    ...getAllConfig(''),
    id: idx
  };

  updateAllConfig(config);

  return prefix.length ? `${prefix}-${serial}-${title}` : `${serial}-${title}`;
}

/**
 * Creates a serial prefixed by zeros length.
 *
 * @param id - { number }
 * @param length - { number }
 * @public
 */
export function serialNum(id: number, length = DEFAULT_CONFIG.digits): string {
  return id.toString().padStart(length, '0');
}

/**
 * Update config file.
 *
 * @param config - { DEFAULT_CONFIG }
 * @public
 */
export function updateAllConfig(config: typeof DEFAULT_CONFIG) {
  cache.set('config', config as any);

  writeFileSync(join(getWorkDir(), '/.adr.json'), JSON.stringify(config));
}

/**
 * Gets all config object.
 *
 * @param defaultValue - { string|number }
 * @public
 */
export function getAllConfig(defaultValue: string | number) {
  if (!existsSync(join(getWorkDir(), '/.adr.json'))) {
    return defaultValue;
  }

  const config: string = readFileSync(join(getWorkDir(), '/.adr.json'), 'utf8');

  try {
    const parsedConfig = JSON.parse(config);
    cache.set('config', parsedConfig);

    return parsedConfig;
  } catch (e) {
    console.error(e);
    return defaultValue;
  }
}

/**
 * Gets a property from config
 *
 * @param key - { string }
 * @public
 */
export function getConfig(key: string): string | number | DecisionConfig[] {
  const defaultValue = DEFAULT_CONFIG[key];

  let config;

  if (cache.get('config')) {
    config = cache.get('config');
  } else {
    config = getAllConfig(defaultValue as any);
  }

  if (config && config[key]) {
    return config[key];
  }

  return defaultValue;
}

/**
 * Add a new DecisionConfig to json.
 *
 * @param decision - { DecisionConfig }
 */
export function setNewConfigDecision(decision: DecisionConfig) {
  const decisions = getConfig('decisions') as DecisionConfig[];
  decisions.push(decision);

  const config = {
    ...getAllConfig(''),
    decisions
  };

  updateAllConfig(config);
}

/**
 * Update a new DecisionConfig to json.
 *
 * @param decision - { DecisionConfig }
 */
export function setUpdateConfigDecision(decision: DecisionConfig) {
  const decisions = getConfig('decisions') as DecisionConfig[];

  const idx = decisions.findIndex(item => item.id === decision.id);

  if (idx >= 0) {
    decisions[idx] = decision;
  }

  const config = {
    ...getAllConfig(''),
    decisions
  };

  updateAllConfig(config);
}

/**
 * Markdownit replacement plugin. Finds replacements to exchange it.
 *
 * @param md - { MarkdownIt }
 * @param options - { MarkDownReplacementOptions }
 */
export function markdownReplacements(
  md: MarkdownIt,
  options: MarkDownReplacementOptions = { replacements: [] }
) {
  const { replacements } = options;

  md.core.ruler.at('replacements', state => {
    for (const block of state.tokens) {
      if (block.type !== 'inline') {
        continue;
      }

      const childrens = block.children ? block.children : [];

      for (const token of childrens) {
        switch (token.type) {
          case 'text':
            // eslint-disable-next-line no-console
            for (const replacement of replacements) {
              token.content = token.content.replace(
                replacement.regex,
                replacement.sub
              );
            }
            break;
          default:
            break;
        }
      }
    }

    return true;
  });
}

/**
 * MarkdownIt plugin to update decision state
 *
 * @param md - { MarkdownIt }
 * @param option - { { oldState: string; newState: string } }
 */
export function markdownStateUpdate(
  md: MarkdownIt,
  option: { oldState: string; newState: string }
) {
  const defaultRender = md.renderer.rules.text as RenderRule;

  md.renderer.rules.text = (tokens, idx, options, env, self) => {
    const token = tokens[idx];

    const isOldStatus = token.content.startsWith(option.oldState);

    if (isOldStatus) {
      token.content = `${token.content}\n\n${option.newState}`;
    }

    return defaultRender(tokens, idx, options, env, self);
  };
}
