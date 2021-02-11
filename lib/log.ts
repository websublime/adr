/* eslint-disable @typescript-eslint/no-var-requires */
import { I18N, StatusColor } from './constants';
import { Color } from 'colors';
import { DecisionConfig } from './types';
import { getConfig } from './utils';

const { table } = require('table');
const colors: Color = require('colors');

export function log() {
  const decisions = getConfig('decisions') as DecisionConfig[];
  const language = getConfig('language') as 'pt' | 'en';

  const status: any = I18N[language].STATUS;

  const findStatusColor = (state: string) => {
    let index = '';

    Object.keys(status).forEach(key => {
      if (status[key] === state) {
        index = key;
      }
    });

    return index;
  };

  const headers = [
    colors.yellow('ID'),
    colors.yellow('NAME'),
    colors.yellow('FILENAME'),
    colors.yellow('DATE'),
    colors.yellow('STATE')
  ];
  const body = decisions.reduce((acumulator: string[][], decision) => {
    // eslint-disable-next-line sort-destructure-keys/sort-destructure-keys
    const { id, name, filename, date, state } = decision;
    const colorize = StatusColor.get(findStatusColor(state));

    acumulator.push([
      colors.green(String(id)),
      name,
      filename,
      date,
      colorize ? colorize(state) : state
    ]);

    return acumulator;
  }, []);

  // eslint-disable-next-line no-console
  console.log(table([headers, ...body]));
}
