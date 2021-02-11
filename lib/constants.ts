/* eslint-disable @typescript-eslint/no-var-requires */
import { Color } from 'colors';
import { I18N_LANG } from './types';

const colors: Color = require('colors');

export const I18N: I18N_LANG = {
  en: {
    DECISION: 'Decision',
    STATE: 'State',
    STATUS: {
      ACCEPTED: 'Accepted',
      DEPRECATED: 'Deprecated',
      DONE: 'Done',
      PROPOSED: 'Proposed',
      SUPERSEDED: 'Superseded'
    }
  },
  pt: {
    DECISION: 'Decisão',
    STATE: 'Estado',
    STATUS: {
      ACCEPTED: 'Aceite',
      DEPRECATED: 'Descontinuado',
      DONE: 'Executado',
      PROPOSED: 'Proposto',
      SUPERSEDED: 'Substituido'
    }
  }
};

export const StatusColor = new Map<string, Color>([
  ['PROPOSED', colors.bgWhite],
  ['ACCEPTED', colors.bgCyan],
  ['DONE', colors.bgGreen],
  ['DEPRECATED', colors.bgRed],
  ['SUPERSEDED', colors.bgYellow]
]);
