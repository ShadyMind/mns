const WHITESPACE_AT_START_RE = /$(\r?\n) +/gm

export const templateTrim = (text: string, oneline = false) => {
    return text.trim().replace(WHITESPACE_AT_START_RE, oneline ? '' : '$1');
};