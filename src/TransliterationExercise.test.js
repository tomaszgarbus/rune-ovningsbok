import { render, screen, fireEvent } from '@testing-library/react';
import TransliterationExercise from './TransliterationExercise';

const testExercise = {
  id: "test",
  title: "Test exercise",
  runes: ["ᛏ", "ᛖ", "ᛊ", "ᛏ"],
  rowType: "elder_test",
}

const testRuneMapping = {
  "ᛏ": "t",
  "ᛖ": "e",
  "ᛊ": "s"
}

test('enable check once all inputs provided', () => {
  render(<TransliterationExercise
    exercise={testExercise}
    runeMapping={testRuneMapping}
  />);
  const checkButton = screen.getByText("Check");
  expect(checkButton).toBeDisabled();

  for (let inputField of screen.getAllByTestId("rune-input")) {
    inputField.setAttribute('value', 'a');
    fireEvent.change(inputField, { target: { value: 'a' } });
  }

  expect(checkButton).toBeEnabled();
});

test('check button enables feedback', () => {
  render(<TransliterationExercise
    exercise={testExercise}
    runeMapping={testRuneMapping}
  />);
  for (let inputField of screen.getAllByTestId("rune-input")) {
    inputField.setAttribute('value', 'a');
    fireEvent.change(inputField, { target: { value: 'a' } });
  }

  expect(screen.queryAllByTestId("symbol-feedback").length).toBe(0);

  const checkButton = screen.getByText("Check");
  fireEvent.submit(checkButton, {});

  expect(screen.getAllByTestId("symbol-feedback").length).toBe(4);
});