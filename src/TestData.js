const testExercise = {
  id: "test",
  title: "Test exercise",
  runes: "ᛏᛖᛊᛏ",
  rowType: "elder_test",
  explanationAfter: "Good answer!",
  description: "Transliterate the word test.",
  sources: ["A cousin told me", "Rune shaman"],
}

const testExerciseWithSeparators = {
  id: "test_with_separators",
  title: "Test exercise with separators",
  runes: ["ᛏ", ":", "ᛖ", ":", "ᛊ", ":", "ᛏ"],
  description: "Transliterate the word test with separators.",
  rowType: "elder_test",
  explanationAfter: "Ye!"
}

const testExerciseWithMultipleCorrectAnswers = {
  id: "test",
  title: "Test exercise with multiple correct answers",
  runes: ["ᛏ", "ᛖ", "ᛊ", "ᛏ"],
  rowType: "elder_test_multi",
  explanationAfter: "Good answer! One of many good answers!",
  description: "Transliterate the word test.",
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

const testRuneRowWithMultipleTransliterations = {
  'name': 'Test Rune Row with multiple transliterations',
  'symbols': [
    {
      'rune': 'ᛏ',
      'latin': ['t', 'd'],
    },
    {
      'rune': 'ᛖ',
      'latin': ['e', 'ä'],
    },
    {
      'rune': 'ᛊ',
      'latin': ['s', 'z'],
    },
  ]
}

const testRuneRows = {
  'elder_test': testRuneRow,
  'elder_test_multi': testRuneRowWithMultipleTransliterations
}

export {
  testExercise,
  testExerciseWithSeparators,
  testExerciseWithMultipleCorrectAnswers,
  testRuneRow,
  testRuneRowWithMultipleTransliterations,
  testRuneRows
};