/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Copyright Prozis All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://prozis.com/license
 */
import { Color } from 'colors';
import { getWorkDir } from './utils';

const { writeFileSync } = require('fs-extra');
const colors: Color = require('colors');

/**
 * Init json config for the project.
 *
 * @param language - { string }
 * @public
 */
export function init(language: string): void {
  const workDir = getWorkDir();
  const supportedLanguages = ['en', 'pt'];

  if (!supportedLanguages.includes(language)) {
    console.log(
      colors.bgRed(
        `Language: ${language} is not supported. Please use one of the followings: en or pt`
      )
    );
    return;
  }

  const defaultConfig = {
    decisions: [],
    digits: 4,
    id: 0,
    language: language,
    path: 'docs/adr/',
    prefix: ''
  };

  writeFileSync(workDir + '/.adr.json', JSON.stringify(defaultConfig));
}
