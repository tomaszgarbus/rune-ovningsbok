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

export {IsSeparator, RuneRowToMapping};