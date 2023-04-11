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

export {IsSeparator, IsValidHttpUrl, RuneRowToMapping};