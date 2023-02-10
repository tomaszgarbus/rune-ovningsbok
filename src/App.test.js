import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { testExercise, testRuneRow } from './TestData.js'

test('renders test exercise in the list', () => {
  render(<App
    exercises={[testExercise]}
    runeRows={{'elder_test': testRuneRow}} />);

  const linkElement = screen.getByText('Test exercise');
  expect(linkElement).toBeInTheDocument();
});

test('open test exercise', () => {
  render(<App
    exercises={[testExercise]}
    runeRows={{'elder_test': testRuneRow}} />);
  
  const exerciseTitle = screen.getByText('Test exercise');
  expect(exerciseTitle).toBeInTheDocument();

  // Open the exercise.
  fireEvent.click(exerciseTitle, {});
  expect(exerciseTitle).not.toBeInTheDocument();
  // Check that different texts expected to be in the exercise are indeed in the screen.
  expect(screen.getByText(testExercise.description)).toBeInTheDocument();
  for (const source of testExercise.sources) {
    expect(screen.getByText(source)).toBeInTheDocument();
  }
});

test('back to exercise list', () => {
  render(<App
    exercises={[testExercise]}
    runeRows={{'elder_test': testRuneRow}} />);
  
  // Open the exercise.
  const exerciseTitle = screen.getByText('Test exercise');
  expect(exerciseTitle).toBeInTheDocument();
  fireEvent.click(exerciseTitle, {});
  // Quick verification that the exercise is opened.
  expect(screen.getByText(testExercise.description)).toBeInTheDocument();

  // Close the exercise.
  const backButton = screen.getByTestId("BackToListButton");
  expect(backButton).toBeInTheDocument();
  fireEvent.click(backButton, {});

  // Verify we're back to the list.
  expect(screen.queryByText(testExercise.description)).toBe(null);
});