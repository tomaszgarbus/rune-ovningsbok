import type { RuneRowType } from './Types';

function IsSeparator(character: string) : boolean {
  if ([':', '᛫', '…', '|', ' ', '+', '-', '(', ')', '|', 'x'].includes(character)) {
    return true;
  }
  return false;
}

type RuneMappingType = { [rune: string]: (string | Array<string>) };

function RuneRowToMapping(rune_row: RuneRowType) : RuneMappingType {
  let result: RuneMappingType = {};
  for (const symbol of rune_row.symbols) {
    result[symbol.rune] = symbol.latin
  }
  return result;
}

export { IsSeparator, RuneRowToMapping };