/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-var-requires */
import {
  generateFileName,
  getConfig,
  markdownReplacements,
  setNewConfigDecision
} from './utils';
import { I18N } from './constants';

import { outputFileSync, readFileSync } from 'fs-extra';
import { Color } from 'colors';
import MarkdownIt from 'markdown-it';
import dayjs from 'dayjs';
import { join } from 'path';

const MarkDown = require('markdown-it');
const colors: Color = require('colors');
const day: typeof dayjs = require('dayjs');

/**
 * Creates a decision file.
 *
 * @param name - { string }
 * @param path - { string }
 */
function createDecision(name: string, path: string) {
  const markdown: MarkdownIt = new MarkDown();
  const filename = generateFileName(name);

  const language = getConfig('language') as 'pt' | 'en';
  const state = I18N[language].STATUS.PROPOSED;

  const raw = readFileSync(
    join(__dirname, 'templates', `${language}.md`),
    'utf-8'
  );

  const date = day().format('YYYY-MM-DD');
  const id = getConfig('id') as number;

  markdown.use(markdownReplacements, {
    replacements: [
      {
        regex: /{NUMBER}/g,
        sub: String(id)
      },
      {
        regex: /{TITLE}/g,
        sub: name
      },
      {
        regex: /{DATE}/g,
        sub: date
      },
      {
        regex: /{STATUS}/g,
        sub: state
      }
    ]
  });

  const content = markdown.renderInline(raw, {});
  outputFileSync(join(path, `${filename}.md`), content);
  setNewConfigDecision({
    date,
    filename,
    id,
    name,
    state
  });

  return filename;
}

/**
 * Command to create decision file.
 *
 * @param title - { string }
 */
export function create(title: string) {
  const adrPath = getConfig('path') as string;

  const filename = createDecision(title, adrPath);

  // eslint-disable-next-line no-console
  console.log(colors.green(`File: ${filename} created.`));
}
