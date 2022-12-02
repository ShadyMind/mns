export const renderCodePointer = (lines: string[], lineIdx: number, expansion = 2) => {
  const from = Math.max(lineIdx - expansion, 0);
  const to = Math.min(lineIdx + expansion, lines.length);
  const expandedLines = lines.slice(from, to);

  return expandedLines.reduce((acc, line, idx) => {
    const realIdx = from + idx;
    return `${acc}\n${(realIdx + 1).toString().padStart(4, ' ')} | ${realIdx === lineIdx ? '>' : ' '} ${line.slice(0, process.stdout.columns - 9)}`;
  }, '');
};