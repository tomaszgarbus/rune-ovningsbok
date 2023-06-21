import type { CompressedRuneRowType, CanonicalRuneRowType, CompressedRuneRowMap, CanonicalRuneRowMap } from './Types';

function IsSeparator(character: string) : boolean {
  if ([':', '᛫', '…', '|', ' ', '+', '-', '(', ')', '|', 'x'].includes(character)) {
    return true;
  }
  return false;
}

type RuneMappingType = { [rune: string]: (string | Array<string>) };

function RuneRowToMapping(rune_row: CanonicalRuneRowType) : RuneMappingType {
  let result: RuneMappingType = {};
  for (const symbol of rune_row.symbols) {
    result[symbol.rune] = symbol.latin
  }
  return result;
}

// Expands rune rows to canonical form (no inheritance).
function ExpandRuneRowsToCanonical(compressed: CompressedRuneRowMap) : CanonicalRuneRowMap {
  function inheritFrom(baseRuneRow: CanonicalRuneRowType, childRuneRow: CompressedRuneRowType) {
    var result: CanonicalRuneRowType = {
      name: '',
      symbols: []
    };
    var mapping = RuneRowToMapping(baseRuneRow);
    // Guard against empty (undefined) override_symbols list.
    for (const override of (childRuneRow.override_symbols || [])) {
      mapping[override.rune] = override.latin;
    }
    result.name = childRuneRow.name;
    result.symbols = Object.entries(mapping).map((elem) => {
      return {
        rune: elem[0],
        latin: elem[1]
      }
    })
    return result;
  }

  var result: CanonicalRuneRowMap = {};
  for (const [k, v] of Object.entries(compressed)) {
    if ('symbols' in v) {
      // `v` is a base alphabet and can be copied to output verbatim.
      result[k] = v as CanonicalRuneRowType;
    } else {
      // `v` must inherit symbols from another alphabet.
      result[k] = inheritFrom(
        compressed[(v as CompressedRuneRowType).inherit_from] as CanonicalRuneRowType,
        v as CompressedRuneRowType
        );
    }
  }
  return result;
}

export {
  IsSeparator,
  RuneRowToMapping,
  ExpandRuneRowsToCanonical, type RuneMappingType
};