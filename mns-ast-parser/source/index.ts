import { readFile } from './utils/read-file';
import { parseToAst } from './parser';

export const parse = async (filepath: string) => {
    const content = await readFile(filepath);
    const ast = parseToAst(content);

    return ast;
};