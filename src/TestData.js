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

const testRuneRowInheriting = {
  'name': 'Test rune row inheriting from another',
  'inherit_from': 'elder_test',
  'override_symbols': [
    {
      'rune': 'ᛏ',
      'latin': 'd',
    }
  ]
}

const testExercise = {
  id: "test",
  title: "Test exercise",
  runes: "ᛏᛖᛊᛏ",
  rowType: "elder_test",
  explanationAfter: "Good answer!",
  description: "Transliterate the word test.",
  sources: ["A cousin told me", "Rune shaman"],
  img: "test.png"
}

const testExerciseWithSeparators = {
  id: "test_with_separators",
  title: "Test exercise with separators",
  runes: ["ᛏ", ":", "ᛖ", ":", "ᛊ", ":", "ᛏ"],
  description: "Transliterate the word test with separators.",
  rowType: "elder_test",
  explanationAfter: "Ye!",
  img: "test.png"
}

const testExerciseWithMultipleCorrectAnswers = {
  id: "test_multi",
  title: "Test exercise with multiple correct answers",
  runes: ["ᛏ", "ᛖ", "ᛊ", "ᛏ"],
  rowType: "elder_test_multi",
  explanationAfter: "Good answer! One of many good answers!",
  description: "Transliterate the word test.",
  img: "test.png"
}

const testExerciseInheriting = {
  id: "test_inherit",
  title: "Test exercise with inherited alphabet",
  runes: ["ᛏ", "ᛖ", "ᛊ", "ᛏ"],
  rowType: "elder_test_inherit",
  explanationAfter: "Good answer!",
  description: "Transliterate the word test.",
  img: "test.png"
}

const testRuneRows = {
  'elder_test': testRuneRow,
  'elder_test_multi': testRuneRowWithMultipleTransliterations,
  'elder_test_inherit': testRuneRowInheriting
}

export {
  testExercise,
  testExerciseWithSeparators,
  testExerciseWithMultipleCorrectAnswers,
  testExerciseInheriting,
  testRuneRow,
  testRuneRowWithMultipleTransliterations,
  testRuneRowInheriting,
  testRuneRows
};