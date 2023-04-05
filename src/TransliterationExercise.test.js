import { render, screen, fireEvent } from '@testing-library/react';
import TransliterationExercise from './TransliterationExercise';
import { RuneRowToMapping } from './Utils';
import { testExercise, testExerciseWithMultipleCorrectAnswers, testExerciseWithSeparators, testRuneRow, testRuneRowWithMultipleTransliterations } from './TestData.js'

afterEach(() => {
  window.sessionStorage.clear();
});

test('enable check once all inputs provided', () => {
  render(<TransliterationExercise
    exercise={testExercise}
    runeRow={testRuneRow}
  />);
  const checkButton = screen.getByText("Check");
  expect(checkButton).toBeDisabled();

  for (let inputField of screen.getAllByTestId(/RuneInput.*/)) {
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
  for (let inputField of screen.getAllByTestId(/RuneInput.*/)) {
    inputField.setAttribute('value', 'a');
    fireEvent.change(inputField, { target: { value: 'a' } });
  }

  expect(screen.queryAllByTestId("symbol-feedback").length).toBe(0);

  const checkButton = screen.getByText("Check");
  fireEvent.submit(checkButton, {});

  expect(screen.getAllByTestId("symbol-feedback").length).toBe(4);
});

test('accept upper case answers', () => {
  render(<TransliterationExercise
    exercise={testExercise}
    runeRow={testRuneRow}
  />)

  for (const [index, inputField] of screen.getAllByTestId(/RuneInput.*/).entries()) {
    const latinSymbol = RuneRowToMapping(testRuneRow)[testExercise.runes[index]];
    inputField.setAttribute('value', latinSymbol.toUpperCase());
    fireEvent.change(inputField, { target: { value: latinSymbol } });
  }

  const checkButton = screen.getByText("Check");
  expect(checkButton).toBeEnabled();
  fireEvent.submit(checkButton, {});

  const explanationAfter = screen.getByText(testExercise.explanationAfter);
  expect(explanationAfter).toBeInTheDocument();
});


test('show explanation after solved', () => {
  render(<TransliterationExercise
    exercise={testExercise}
    runeRow={testRuneRow}
  />)

  for (const [index, inputField] of screen.getAllByTestId(/RuneInput.*/).entries()) {
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

test('input moves cursor to next field', () => {
  render(<TransliterationExercise
    exercise={testExerciseWithSeparators}
    runeRow={testRuneRow}
  />)

  // Check that separators are rendered.
  expect(screen.getAllByText(":").length).toBe(3);

  // Input a symbol to each field then verify that the next one was focused.
  const inputFields = screen.getAllByTestId(/RuneInput.*/).sort(
    (a, b) => a.getAttribute('data-testid') < b.getAttribute('data-testid'));
  fireEvent.change(inputFields[0], { target: { value: 't' } });
  expect(inputFields[1]).toHaveFocus();
  fireEvent.change(inputFields[1], { target: { value: 'e' } });
  expect(inputFields[2]).toHaveFocus();
  fireEvent.change(inputFields[2], { target: { value: 's' } });
  expect(inputFields[3]).toHaveFocus();
});

test('solved exercise with separators', () => {
  render(<TransliterationExercise
    exercise={testExerciseWithSeparators}
    runeRow={testRuneRow}
  />)

  // Check that separators are rendered.
  expect(screen.getAllByText(":").length).toBe(3);

  const inputFields = screen.getAllByTestId(/RuneInput.*/).sort(
    (a, b) => a.getAttribute('data-testid') < b.getAttribute('data-testid'));
  fireEvent.change(inputFields[0], { target: { value: 't' } });
  fireEvent.change(inputFields[1], { target: { value: 'e' } });
  fireEvent.change(inputFields[2], { target: { value: 's' } });
  fireEvent.change(inputFields[3], { target: { value: 't' } });

  const checkButton = screen.getByText("Check");
  expect(checkButton).toBeEnabled();
  fireEvent.click(checkButton, {});

  expect(screen.getByText(
    testExerciseWithSeparators.explanationAfter)).toBeInTheDocument();
});

test('user input preserved on page refresh', () => {
  const {rerender} = render(<TransliterationExercise
    exercise={testExerciseWithSeparators}
    runeRow={testRuneRow}
  />);

  // Check that separators are rendered.
  expect(screen.getAllByText(":").length).toBe(3);

  // Input a symbol to 2 fields then verify they keep them after page refresh.
  const inputFields = screen.getAllByTestId(/RuneInput.*/).sort(
    (a, b) => a.getAttribute('data-testid') < b.getAttribute('data-testid'));
  fireEvent.change(inputFields[0], { target: { value: 't' } });
  fireEvent.change(inputFields[1], { target: { value: 'e' } });
  // Window.location.reload is not implemented, let's just rerender.
  rerender(<TransliterationExercise
    exercise={testExerciseWithSeparators}
    runeRow={testRuneRow}
  />);
  expect(inputFields[0]).toHaveValue('t');
  expect(inputFields[1]).toHaveValue('e');

  // Let's just make sure that field skipping works fine after reload...
  fireEvent.change(inputFields[2], { target: { value: 's' } });
  expect(inputFields[3]).toHaveFocus();
});

test('don\'t load user answer from session storage if exercise id mismatches', () => {
  // First render the component with exercise id "test".
  const {unmount} = render(<TransliterationExercise
    exercise={testExercise}
    runeRow={testRuneRow} />);

  // Input a symbol to each input field.
  for (let inputField of screen.getAllByTestId(/RuneInput.*/)) {
    inputField.setAttribute('value', 'a');
    fireEvent.change(inputField, { target: { value: 'a' } });
  }
  // Just make sure that all inputs are present:
  let checkButton = screen.getByText('Check');
  expect(checkButton).toBeEnabled();

  // Now rerender the component with different exercise.
  unmount();
  render(<TransliterationExercise
    exercise={testExerciseWithSeparators}
    runeRow={testRuneRow} />);
  expect(screen.getByText(testExerciseWithSeparators.description)).toBeInTheDocument();
  // Check that inputs are not loaded from cache.
  for (let inputField of screen.getAllByTestId(/RuneInput.*/)) {
    expect(inputField).toHaveValue('');
  }
  checkButton = screen.getByText('Check');
  expect(checkButton).toBeDisabled();
});

test('accepts alternative inputs as correct', () => {
  render(<TransliterationExercise
    exercise={testExerciseWithMultipleCorrectAnswers}
    runeRow={testRuneRowWithMultipleTransliterations}
  />);
  const inputFields = screen.getAllByTestId(/RuneInput.*/).sort(
    (a, b) => a.getAttribute('data-testid') < b.getAttribute('data-testid'));
  fireEvent.change(inputFields[0], { target: { value: 'd' } });
  fireEvent.change(inputFields[1], { target: { value: 'ä' } });
  fireEvent.change(inputFields[2], { target: { value: 'z' } });
  fireEvent.change(inputFields[3], { target: { value: 'd' } });

  // Check that the answer is accepted.
  let checkButton = screen.getByText('Check');
  expect(checkButton).toBeEnabled();
  fireEvent.click(checkButton, {});
  expect(
    screen.getByText(
      testExerciseWithMultipleCorrectAnswers.explanationAfter
      )).toBeInTheDocument();
});