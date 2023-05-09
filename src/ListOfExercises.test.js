import { fireEvent, render, screen } from '@testing-library/react';
import ListOfExercises from './ListOfExercises';

const testExercise = {
  id: "test",
  title: "Test exercise",
  runes: ["ᛏ", "ᛖ", "ᛊ", "ᛏ"],
  rowType: "test_futhark",
  img: "test.png"
}

const testRuneRow = {
  'name': 'Test Futhark',
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

test('clicking an exercise fires calls the callback function', () => {
  const setExerciseFn = jest.fn(ex => {});

  render(<ListOfExercises
    items={[testExercise]}
    runeRows={{'test_futhark': testRuneRow}}
    setExercise={setExerciseFn}
    />);
  
  const renderedExercise = screen.getByText('Test exercise');
  expect(renderedExercise).toBeInTheDocument();

  fireEvent.click(renderedExercise);
  expect(setExerciseFn.mock.calls).toHaveLength(1);
});