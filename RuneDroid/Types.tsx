type ExerciseType = {
  id: string,
  title: string,
  img: string,
  img_credit?: string,
  runes: string | Array<string>,
  sources?: Array<String>
  description: string,
  explanationAfter: string
};

type RuneRowSymbolPair = {
  rune: string,
  latin: string | Array<string>,
};

type RuneRowType = {
  name: string,
  symbols: Array<RuneRowSymbolPair>,
};

export type { ExerciseType, RuneRowSymbolPair, RuneRowType };