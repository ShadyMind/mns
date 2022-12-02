import type { NoteNode, NoteToken, CompositionNode, VoltaNode, AnyNode, BarNode, PauseNode } from './types';
import debug from 'debug';
import { name } from '../package.json';
import { arrayLast } from './utils/array-last';
import { id } from './utils/id';
import { renderCodePointer } from './utils/code-pointer';
import { parseCompostionConfig } from './config';
import { KEY_EN_NAMES } from './constants';

const NOTE_TOKEN_RE = /^[a-g][0-9a-f]+$/i;
const PAUSE_TOKEN_RE = /^\-\s+$/;

const tag = name.replace(/-/g, ':');
const log = debug(tag);

export const parseToAst = (content: string) => {
  const draftRoot: Partial<CompositionNode> = {
    id: id(4),
    type: 'root',
    children: []
  };

  log('create root node', draftRoot.id);

  log('prehandle file lines');
  const lines = content.trim().split(/[\n;]/g)
    .map(line => line.trim())
    .filter((line) => !line.startsWith('#'))

  const config = lines[0];

  log('parse first-line config');
  if (!config.startsWith('{') || !config.endsWith('}')) {
    log('error occurred at config parsing');
    throw new Error(`Cannot parse config declaration on first line:${renderCodePointer(lines, 0)}`);
  } else {
    draftRoot.config = parseCompostionConfig(config.slice(1, -1).trim());
  }
  log('first-line config parsed');

  const root = draftRoot as CompositionNode;

  const volta: VoltaNode = {
    id: id(8),
    type: 'volta',
    repeat: 0,
    children: [],
    config: {},
    parent: root
  };

  root.children.push(volta);

  let cursor: AnyNode = volta;

  lines.slice(1).forEach((line, idx) => {
    if (line === '') {
      if (cursor.type !== 'volta') {
        const volta: VoltaNode = {
          id: id(12),
          type: 'volta',
          repeat: 0,
          children: [],
          config: {},
          parent: root
        };

        root.children.push(volta);
        cursor = volta;
      }

      return;
    } else if (line.startsWith('{') && (cursor.type === 'bar' || cursor.type === 'volta')) {
      cursor.config = parseConfig()
    }

    if (!line.endsWith(',')) {
      log('error occurred while bar parsing');
      throw new Error(`Unexpected bar ending. Expected comma at the end.\n${renderCodePointer(lines, idx)}`);
    }

    if (cursor.type === 'volta') {
      const bar: BarNode = {
        id: id(16),
        type: 'bar',
        children: [],
        config: {},
        parent: cursor
      };

      cursor.children.push(bar);
      cursor = bar;
    } else if (cursor.type === 'bar') {
      cursor = cursor.parent;

      if (cursor.type === 'volta') {
        const bar: BarNode = {
          id: id(16),
          type: 'bar',
          children: [],
          config: {},
          parent: cursor
        };

        cursor.children.push(bar);
        cursor = bar;
      }

    }

    for (let i = 0, len = line.length; i < len; i = i + 4) {
      let token = line.slice(i, i + 3);

      if (cursor.type !== 'bar') {
        throw new Error(`Unexpected current node "${cursor.type}".\n${renderCodePointer(lines, idx)}`);
      }

      if (NOTE_TOKEN_RE.test(token)) {
        const note: NoteNode = {
          id: id(20),
          type: 'note',
          note: token.slice(0, 1).toUpperCase() as NoteToken,
          octave: Number.parseInt(token.slice(1, 2), 16),
          raw: token,
          parent: cursor,
          duration: 1
        };

        if (!KEY_EN_NAMES.includes(note.note) || !Number.isFinite(note.octave)) {
          throw new Error(`Unexpected note definition "${token}".\n${renderCodePointer(lines, idx)}`);
        }

        const possibleMod = token.slice(2, 3);

        if (possibleMod === '#') {
          note.mod = 'sharp';
        } else if (possibleMod === 'b') {
          note.mod = 'flat';
        }

        cursor.children.push(note);

      } else if (PAUSE_TOKEN_RE.test(token)) {
        const pause: PauseNode = {
          id: id(20),
          type: 'pause',
          raw: token,
          parent: cursor,
          duration: 1
        };

        cursor.children.push(pause);
      } else if (token.startsWith(' ') && token.endsWith(' ')) {
        const lastNode = arrayLast(cursor.children);

        if (lastNode) {
          lastNode.duration += 1;
        }
      }
    }
  });

  log(`parse of ${lines.length} lines complete`);

  return root;
};