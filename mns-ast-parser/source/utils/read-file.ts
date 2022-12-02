import { promises as fs, Stats } from 'node:fs';
import path from 'node:path';

export const readFile = async (filepath: string): Promise<string> => {
    const target = path.resolve(process.cwd(), filepath);
    const buffer = await fs.readFile(target);
    return buffer.toString('utf-8');
};