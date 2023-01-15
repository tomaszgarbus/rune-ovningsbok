function RuneRowToMapping(rune_row) {
  let result = {};
  for (const symbol of rune_row['symbols']) {
    result[symbol['rune']] = symbol['latin']
  }
  return result;
}

export {RuneRowToMapping};