
export type NoteToken = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export type NoteTokenClassic = 'do' | 're' | 'mi' | 'fa' | 'sol' | 'la' | 'si';

type OctaveToken = number;

type ModToken = 'sharp' | 'flat';

export type TimeSignature = {
  fraction: number;
  duration: number;
};

type StaveMod = {
  type: ModToken;
  note: NoteToken;
};

export type Config = {
  key?: NoteToken;
  mods?: StaveMod[];
};

export type CompositionConfig = {
  time: TimeSignature;
  bpm: number;
  key: NoteToken;
  mods?: StaveMod[];
};

type AstNode = {
  id: string;
  type: string;
  parent: AnyNode;
};


export type CompositionNode = Omit<AstNode, 'parent'> & {
  type: 'root';
  config: CompositionConfig;
  children: VoltaNode[];
};

export type VoltaNode = AstNode & {
  type: 'volta';
  repeat: number;
  config: Config;
  parent: CompositionNode;
  children: BarNode[];
};

export type BarNode = AstNode & {
  type: 'bar';
  config: Config;
  parent: VoltaNode;
  children: (NoteNode | PauseNode)[];
};

export type NoteNode = AstNode & {
  type: 'note';
  duration: number;
  note: NoteToken;
  octave: OctaveToken;
  mod?: ModToken;
  raw: string;
  parent: BarNode;
};

export type PauseNode = AstNode & {
  type: 'pause';
  raw: string;
  parent: BarNode;
  duration: number;
};

export type AnyNode = CompositionNode | VoltaNode | BarNode | NoteNode;

export type CliOptions = {
  help: boolean;
  strict: boolean;
  raw: boolean;
  in: string;
  out: string;
};