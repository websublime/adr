/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
import {
  getConfig,
  getWorkDir,
  markdownStateUpdate,
  setUpdateConfigDecision
} from './utils';
import { outputFileSync, readFileSync } from 'fs-extra';
import { Color } from 'colors';
import { DecisionConfig } from './types';
import { I18N } from './constants';
import { Inquirer } from 'inquirer';
import MarkdownIt from 'markdown-it';
import dayjs from 'dayjs';
import { join } from 'path';

const colors: Color = require('colors');
const inquirer: Inquirer = require('inquirer');
const MarkDown = require('markdown-it');
const day: typeof dayjs = require('dayjs');

/**
 * Updat adr json and add new entry on markdonw
 *
 * @param decision - { DecisionConfig }
 * @param state - { string }
 * @internal
 */
function updateStatusDecision(decision: DecisionConfig, state: string) {
  const { filename, id, name } = decision;
  const path = join(getWorkDir(), getConfig('path') as string);
  const date = day().format('YYYY-MM-DD');

  const markdown: MarkdownIt = new MarkDown();

  const raw = readFileSync(join(path, `${decision.filename}.md`), 'utf-8');

  markdown.use(markdownStateUpdate, {
    newState: `* ${date} ${state}`,
    oldState: `* ${decision.date} ${decision.state}`
  });

  const content = markdown.renderInline(raw, {});

  outputFileSync(join(path, `${filename}.md`), content);
  setUpdateConfigDecision({
    date,
    filename,
    id,
    name,
    state
  });

  return filename;
}

/**
 * Command to update status of a decision
 *
 * @param index - { string }
 * @public
 */
export function status(index: string) {
  const decisions = getConfig('decisions') as DecisionConfig[];
  const language = getConfig('language') as 'en' | 'pt';
  const decision = decisions.find(decision => decision.id === Number(index));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const status: any = I18N[language].STATUS;

  const statusList = Object.keys(status).reduce((acumulator: string[], key) => {
    acumulator.push(status[key]);
    return acumulator;
  }, []);

  if (decision) {
    inquirer
      .prompt<{ status: string }>([
        {
          choices: statusList,
          message: `${decision.filename}(${decision.state}) new status:`,
          name: 'status',
          type: 'list'
        }
      ])
      .then(answer => {
        const statusKey = Object.keys(status).find(
          key => status[key] === answer.status
        );

        if (statusKey) {
          const state = status[statusKey];
          updateStatusDecision(decision, state);
          console.log(
            `Decision: ${colors.bgGreen(
              decision.name
            )} updated to state: ${colors.bgMagenta(state)}`
          );
        } else {
          console.log(
            colors.bgRed(
              `Unable to update decision with current selection: ${statusKey}`
            )
          );
        }
      });
  } else {
    console.log(colors.bgRed(`Unable to find decision id index: ${index}`));
  }
}
