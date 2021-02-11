/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @license
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 *
 */

const {
  Extractor,
  ExtractorConfig
} = require('@microsoft/api-extractor');
const { rollup } = require('rollup');
const { dirname, join, resolve } = require('path');
const { ensureDirSync, removeSync } = require('fs-extra');

const { terser } = require('rollup-plugin-terser');

const nodeResolve = require('rollup-plugin-node-resolve');

const babel = require('rollup-plugin-babel');
const cjs = require('rollup-plugin-commonjs');

const ts = require('rollup-plugin-typescript2');
const requireContext = require('rollup-plugin-require-context');

const injectProcessEnv = require('rollup-plugin-inject-process-env');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');

const { assign, keys } = Object;

function isObject(item) {
  return typeof item === 'object' && !Array.isArray(item) && item !== null;
}

/**
 * Rollup base configuration.
 *
 * @param settings - { BuildPackage }
 */
const baseConfig = (settings) => {
  const {
    minify,
    options: { entryFile, name },
    sourceDir,
    tsConfigFile
  } = settings;
  const pkg = require(join(sourceDir, 'package.json'));

  const config = {
    external: [
      ...keys(pkg.dependencies),
      ...keys(pkg.peerDependencies),
      ...['path', 'url']
    ],
    input: entryFile,
    plugins: [
      ts({
        cacheRoot: resolve(sourceDir, 'node_modules/.rts2_cache'),
        tsconfig: join(sourceDir, tsConfigFile),
        tsconfigOverride: {
          compilerOptions: {
            declaration: true,
            // declarationDir: join(settings.outputDir, '@types'),
            moduleResolution: 'node',
            rootDir: settings.sourceDir
          }
        },
        useTsconfigDeclarationDir: true
      }),
      babel({
        exclude: /node_modules/,
        extensions: ['.js', '.ts'],
        include: [join(settings.sourceDir, '**/*')],
        runtimeHelpers: true
      }),
      nodeResolve({
        browser: false,
        extensions: ['.js', '.ts'],
        mainFields: ['main', 'module', 'browser']
      }),
      cjs(),
      requireContext(),
      injectProcessEnv({
        BUILD_MODE: process.env.BUILD_MODE || 'prod',
        NODE_ENV: process.env.NODE_ENV
      })
    ]
  };

  if (minify) {
    config.plugins.push(terser());
  }

  return config;
};

/**
 * Produce an CommonJS config for buildRollup function.
 *
 * @param settings - { BuildPackage }
 */
const commonConfig = (settings) => {
  const {
    options: { name },
    outputDir,
    sourceDir,
    tsConfigFile
  } = settings;

  const config = baseConfig(settings);

  const conf = assign({}, config, {
    output: {
      exports: 'named',
      extend: true,
      // file: join(outputDir, `${name}.js`),
      format: 'cjs',
      globals: {
        'core-js': 'core-js',
        tslib: 'tslib'
      },
      name
    }
  });

  conf.plugins = [
    ts({
      cacheRoot: resolve(sourceDir, 'node_modules/.rts2_cache'),
      tsconfig: join(sourceDir, tsConfigFile),
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          module: 'es2015',
          // declarationDir: join(settings.outputDir, '@types'),
          moduleResolution: 'node',
          rootDir: settings.sourceDir
        }
      },
      useTsconfigDeclarationDir: true
    }),
    globals(),
    builtins(),
    nodeResolve({
      preferBuiltins: false
    }),
    cjs(),
    requireContext(),
    injectProcessEnv({
      BUILD_MODE: process.env.BUILD_MODE || 'prod',
      NODE_ENV: process.env.NODE_ENV
    })
  ];

  if (isObject(config.input) || Array.isArray(config.input)) {
    conf.output.dir = outputDir;
  } else {
    conf.output.file = join(outputDir, `${name}.js`); // join(outputDir, `${name}.esm.js`);
  }

  return conf;
};

/**
 * Unify declaration types, creates api md docs files.
 *
 * @param options - { RollupOptions }
 */
async function buildApiExtractor(options) {
  const { output } = options || {};

  const sourceDir = dirname(options.input);
  const outputDir = dirname(output.file);

  ensureDirSync(join(outputDir, 'docs'));
  ensureDirSync(join(sourceDir, '@types'));

  const extractorConfig = ExtractorConfig.loadFileAndPrepare(
    join(sourceDir, 'api-extractor.json')
  );

  const extractorResult = Extractor.invoke(extractorConfig, {
    // Equivalent to the "--local" command-line parameter
    localBuild: true,
    // Equivalent to the "--verbose" command-line parameter
    showVerboseMessages: true
  });

  const result = extractorResult.succeeded
    ? Promise.resolve(extractorResult.succeeded)
    : Promise.reject(extractorResult.errorCount);

  await removeSync(join(sourceDir, 'declarations'));
  await removeSync(join(sourceDir, 'temp'));

  return result;
}

/**
 * Build rollup bundle
 *
 * @param options - RollupOptions
 */
async function buildRollup(options) {
  const bundle = await rollup(options);
  const { output } = options || {};

  return output
    ? bundle.write(output)
    : Promise.reject(new Error('Rollup output invalid'));
}

const packageSettings = {
  minify: false,
  options: {
    entryFile: join(__dirname, 'index.ts'),
    name: 'adr'
  },
  outputDir: join(__dirname, 'dist'),
  sourceDir: join(__dirname),
  tsConfigFile: 'tsconfig.build.json'
};

async function createCjs() {
  const config = commonConfig(packageSettings);

  return buildApiExtractor(config);
}

async function build() {
  await createCjs();
}

build();
