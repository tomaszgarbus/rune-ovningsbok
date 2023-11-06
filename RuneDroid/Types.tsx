type ExerciseType = {
  id: string,
  title: string,
  img: string,
  img_credit?: string,
  runes: string | Array<string>,
  sources?: Array<string>
  description: string,
  explanationAfter: string,
  rowType: string,
  country: string,
};

type RuneRowSymbolPair = {
  rune: string,
  latin: string | Array<string>,
};

type CompressedRuneRowType = {
  name: string,
  inherit_from: string,
  override_symbols: Array<RuneRowSymbolPair>,
};

type CanonicalRuneRowType = {
  name: string,
  symbols: Array<RuneRowSymbolPair>,
}

type ExerciseState = {
  inputs: Array<string>,
  index: number,
  solved: boolean,
};

type CompressedRuneRowMap = { [name: string]: (CompressedRuneRowType | CanonicalRuneRowType) };
type CanonicalRuneRowMap = { [name: string]: CanonicalRuneRowType };

export type {
  ExerciseType,
  RuneRowSymbolPair,
  CompressedRuneRowType,
  CanonicalRuneRowType,
  CompressedRuneRowMap,
  CanonicalRuneRowMap,
  ExerciseState,
};