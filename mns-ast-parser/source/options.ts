import { ParseArgs } from 'node:util';
import { parseArgs } from 'node:util';
import { CliOptions } from './types';

const options: ParseArgs<CliOptions> = {
  help: { type: 'boolean', short: 'h', description: 'Prints this help' },
  strict: { type: 'boolean', short: 's', description: 'Strict syntax parsing' },
  raw: { type: 'boolean', short: 'r', description: 'Output raw tree' },
  in: { type: 'string', short: 'i', description: 'Path to source .mns file' },
  out: { type: 'string', short: 'o', description: 'Path to output file json' }
};

export const argsToOptions = (args = process.argv.slice(2)) => {
  return parseArgs<CliOptions>({ args, options }).values;
};

export const OPTIONS = options;
