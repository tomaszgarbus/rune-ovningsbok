function RuneRowToMapping(rune_row) {
  let result = {};
  for (const symbol of rune_row['symbols']) {
    result[symbol['rune']] = symbol['latin']
  }
  return result;
}

function IsSeparator(character) {
  if ([':', '᛫', '…', '|', ' ', '+', '-', '(', ')', '|', 'x'].includes(character)) {
    return true;
  }
  return false;
}

// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function IsValidHttpUrl(maybeLink) {
  let url;
  try {
    url = new URL(maybeLink);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

// Expands rune rows to canonical form (no inheritance).
function ExpandRuneRowsToCanonical(runeRows) {
  function InheritFrom(baseRunRow, childRuneRow) {
    var result = {};
    var mapping = RuneRowToMapping(baseRunRow);
    for (const override of childRuneRow['override_symbols']) {
      mapping[override['rune']] = override['latin'];
    }
    result['name'] = childRuneRow['name'];
    result['symbols'] = Object.entries(mapping).map((elem) => {
      return {
        'rune': elem[0],
        'latin': elem[1]
      };
    });
    return result;
  }

  var result = {};
  for (const [k, v] of Object.entries(runeRows)) {
    if ('symbols' in v) {
      // `v` is a base alphabet, can be copied
      // to output verbatim.
      result[k] = v;
    } else {
      // Assume that `v` has 'override_symbols'.
      result[k] = InheritFrom(
        runeRows[v['inherit_from']], v);
    }
  }
  return result;
}

export {IsSeparator, IsValidHttpUrl, RuneRowToMapping, ExpandRuneRowsToCanonical};