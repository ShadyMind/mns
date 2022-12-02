import type { NoteTokenClassic, NoteToken } from './types';

export const KEY_FR_NAMES: NoteTokenClassic[] = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'];
export const KEY_EN_NAMES: NoteToken[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const KEY_CONVERSION_MAP: Record<NoteTokenClassic, NoteToken> = {
    do: 'C',
    re: 'D',
    mi: 'E',
    fa: 'F',
    sol: 'G',
    la: 'A',
    si: 'B'
};