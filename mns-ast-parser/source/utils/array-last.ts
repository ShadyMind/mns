export const arrayLast = <T>(array: Array<T>): T | undefined => array.length === 0
    ? undefined
    : array[array.length - 1];