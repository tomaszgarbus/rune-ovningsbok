import { render, screen, fireEvent } from '@testing-library/react';
import TransliterationExercise from './TransliterationExercise';
import { RuneRowToMapping } from './Utils';
import { testExercise, testRuneRow } from './TestData.js'

test('enable check once all inputs provided', () => {
  render(<TransliterationExercise
    exercise={testExercise}
    runeRow={testRuneRow}
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
    runeRow={testRuneRow}
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

test('show explanation after solved', () => {
  render(<TransliterationExercise
    exercise={testExercise}
    runeRow={testRuneRow}
  />)
  
  for (const [index, inputField] of screen.getAllByTestId("rune-input").entries()) {
    const latinSymbol = RuneRowToMapping(testRuneRow)[testExercise.runes[index]];
    inputField.setAttribute('value', latinSymbol);
    fireEvent.change(inputField, { target: { value: latinSymbol } });
  }

  const checkButton = screen.getByText("Check");
  expect(checkButton).toBeEnabled();
  fireEvent.submit(checkButton, {});

  const explanationAfter = screen.getByText(testExercise.explanationAfter);
  expect(explanationAfter).toBeInTheDocument();
});

test('toggle help modal', () => {
  render(<TransliterationExercise
    exercise={testExercise}
    runeRow={testRuneRow}
  />)
  
  const helpModalButton = screen.getByText('?');
  expect(helpModalButton).toBeInTheDocument();

  const helpModal = screen.getByTestId("ActiveExerciseHelpModal");
  expect(helpModal).toBeInTheDocument();
  expect(helpModal).toHaveAttribute("hidden");

  fireEvent.click(helpModalButton, {});
  expect(helpModal).not.toHaveAttribute("hidden");

  fireEvent.click(helpModalButton, {});
  expect(helpModal).toHaveAttribute("hidden");
});

test('show sources', () => {
  render(<TransliterationExercise
    exercise={testExercise}
    runeRow={testRuneRow}
  />)

  for (const source of testExercise.sources) {
    const sourceP = screen.getByText(source);
    expect(sourceP).toBeInTheDocument();
  }
});