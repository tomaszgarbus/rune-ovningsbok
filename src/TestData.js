const testExercise = {
  id: "test",
  title: "Test exercise",
  runes: ["ᛏ", "ᛖ", "ᛊ", "ᛏ"],
  rowType: "elder_test",
  explanationAfter: "Good answer!",
  description: "Transliterate the word test.",
  sources: ["A cousin told me", "Rune shaman"],
}

const testRuneRow = {
  'name': 'Test Rune Row',
  'symbols': [
    {
      'rune': 'ᛏ',
      'latin': 't',
    },
    {
      'rune': 'ᛖ',
      'latin': 'e',
    },
    {
      'rune': 'ᛊ',
      'latin': 's',
    },
  ]
}

const testRuneRows = {
  'elder_test': testRuneRow
}

export { testExercise, testRuneRow, testRuneRows };