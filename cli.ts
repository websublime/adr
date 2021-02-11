#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

import { Color } from 'colors';
import { CommanderStatic } from 'commander';

import { create } from './lib/create';
import { init } from './lib/init';
import { log } from './lib/log';
import { status } from './lib/status';

const colors: Color = require('colors');
const program: CommanderStatic = require('commander');

program
  .version('1.0.0')
  .usage('[options]')
  .option(
    '-init, init <lang>',
    'Initiate project to support ADR, like: `adr init en`',
    init
  )
  .option(
    '-c, create <title>',
    'Create a new ADR markdown. Surround your tilte always with quotes, like adr create `Use a new tool`',
    create
  )
  .option('-l, log', 'Show logging of all files', log)
  .option('-s, status <index>', 'Set new state to ADR', status);

program.parse(process.argv);

if (!process.argv.slice(2).length || !process.argv.length) {
  program.outputHelp(colors.green);
}
