import type { CompositionConfig, Config, NoteToken, TimeSignature } from './types';
import { KEY_CONVERSION_MAP, KEY_EN_NAMES, KEY_FR_NAMES } from './constants';

const parseKey = (value: string): NoteToken => {
  // @ts-ignore
  if (KEY_FR_NAMES.includes(value)) {
    // @ts-ignore
    return KEY_CONVERSION_MAP[value];
    // @ts-ignore
  } else if (KEY_EN_NAMES.includes(value)) {
    // @ts-ignore
    return value;
  }

  throw new Error('Cannot parse key config option');
};

const parseBPM = (value: string): number => {
  return Number.parseInt(value, 10);
};

const parseTimeSignature = (keyValue: string): TimeSignature => {
  const value = keyValue.toLowerCase();

  if (value === 'c') {
    return {
      fraction: 4,
      duration: 4
    };
  }

  const [fractionRaw, durationRaw] = value.split('/');

  return {
    fraction: Number.parseInt(fractionRaw, 10),
    duration: Number.parseInt(durationRaw, 10)
  };
};

export const parseCompostionConfig = (config: string): CompositionConfig => {
  return config.split(' ').reduce((acc, kv) => {
    const [key, valueRaw] = kv.split('=');


    if (key === 'time') {
      acc[key] = parseTimeSignature(valueRaw);
    } else if (key === 'bpm') {
      acc[key] = parseBPM(valueRaw);
    } else if (key === 'key') {
      acc[key] = parseKey(valueRaw);
    }

    return acc;
  }, {} as CompositionConfig);
};

export const parseConfig = (config: string): Config => {
  return config.split(' ').reduce((acc, kv) => {
    const [key, valueRaw] = kv.split('=');


    if (key === 'key') {
      acc[key] = parseKey(valueRaw);
    } else if (key === 'mod') {
      acc[key] = parseMod(valueRaw);
    }

    return acc;
  }, {} as Config);
};