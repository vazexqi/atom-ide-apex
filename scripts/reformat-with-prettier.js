#!/usr/bin/env node

const path = require('path');
const shell = require('shelljs');

const prettierExecutable = path.join(
  __dirname,
  '..',
  'node_modules',
  '.bin',
  'prettier'
);

shell.exec(
  `${prettierExecutable} --single-quote --write "{scripts,lib}/**/*.js"`,
  {
    cwd: path.join(__dirname, '..')
  }
);
