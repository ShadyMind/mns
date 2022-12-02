/// <reference path="./util.d.ts" />

import { promises as fs } from 'node:fs';
import { promisify, parseArgs } from 'node:util';
import { brotliCompress } from 'node:zlib';
import path from 'node:path';
import debug from 'debug';
import { name, version } from '../package.json';
import { timing } from './utils/timing';
import { templateTrim } from './utils/template-trim';
import { parse } from './index';
import { OPTIONS, argsToOptions } from './options';

const brotliCompressAsync = promisify(brotliCompress);
const tag = name.replace(/-/g, ':');

const log = debug(`${tag}:cli`);

if (require.main !== module) {
  log.extend('error')('cli module called not from console');
  throw new Error(`CLI module is not for importing. ${module.children.map((child) => `  ${child}`).join('\n')}`);
}

const options = argsToOptions();
timing.mark('init');

if (options.help) {
  timing.read('init');
  log.extend('silly')('print help message');
  process.stdout.write(templateTrim(`
    Musical notes syntax AST parser v${version}.
    Makes Abstract Syntax Tree from .mns or .mnz files.

    Options:
    ${Object.entries(OPTIONS).map(([key, { type, short, description }]) => {
      return `\u00a0  --${`${key}${short ? `, -${short}` : ''}`.padEnd(15, ' ')} ${`[${type}]`.padStart(10, ' ')}  ${description}`;
    }).join('\n')}

  `));
  process.stdout.write('\n');
  process.exit(0);
}

if (!options.in) {
  log.extend('error')('input argument invalid');
  throw new Error(`"--in" or "-i" argument is required. Got ${options.in}! Exit.`)
}

(async () => {
  timing.read('init');

  log('start parsing file', options.in);
  timing.mark('parse');
  const ast = await parse(options.in);
  timing.read('parse');

  log('stringify js object and convert it to buffer');
  timing.mark('serialize');
  let content: Buffer = Buffer.from(JSON.stringify(ast, (key, value) => {
    if (key === 'parent') {
      return value.id;
    }

    return value;
  }, 4));
  timing.read('serialize');

  if (options.out === '2' || options.out === 'stdin' || options.out === '/dev/stdin') {
    timing.mark('write');
    process.stdout.write(content);
    process.stdout.write('\n');
    timing.read('write');

  } else {
    if (path.extname(options.out) === '.br') {
      log('detect compression extension in', options.out);
      timing.mark('zip');
      content = await brotliCompressAsync(content);
      timing.read('zip');
    }

    log('write output to', options.out);
    timing.mark('write');
    await fs.writeFile(options.out, content);
    timing.read('write');
  }
})();
