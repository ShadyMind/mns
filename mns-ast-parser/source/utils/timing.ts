import { PerformanceObserver, performance } from 'node:perf_hooks';
import debug from 'debug';
import { name } from '../../package.json';

const tag = name.replace(/-/g, ':');
const log = debug(`${tag}:cli:timing`);
let po: PerformanceObserver;

const enableTiming = () => {
  if (po !== undefined) {
    return;
  }

  po = new PerformanceObserver((measures) => {
    measures.getEntries().forEach(({ name, duration }) => {
      log(name);
    });
  })

  po.observe({ entryTypes: ['measure'] })
};


const TOKEN_TO_DISPLAY_MAP = {
  'init': 'Initialization',
  'parse': 'Parsing',
  'serialize': 'Serializing',
  'zip': 'Compressing',
  'write': 'Writing'
};

export const timing = {
  mark(token: string) {
    enableTiming();
    performance.mark(token);

    return;
  },
  read(token: string) {
    let displayName: string;

    // @ts-ignore
    if (typeof TOKEN_TO_DISPLAY_MAP[token] === 'string') {
      // @ts-ignore
      displayName = TOKEN_TO_DISPLAY_MAP[token];
    } else {
      displayName = token;
    }

    performance.measure(displayName, token);

    return;
  }
};