// @ts-ignore
import { getRandomValues } from 'node:crypto';

export const id = (signs: number): string => {
  // @ts-ignore
  return getRandomValues(new Uint8Array(signs)).reduce((acc, rand) => {
    let comp = rand & 63;

    if (comp < 36) {
      return acc + rand.toString(36);
    } else if (comp < 62) {
      return acc + (rand - 26).toString(36).toUpperCase();
    } else if (comp < 63) {
      return acc + '_';
    } else {
      return acc + '-';
    }
  }, '');
};