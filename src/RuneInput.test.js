import { render, screen } from '@testing-library/react';
import RuneInput from './RuneInput';

test('incorrect answer: renders hint', () => {
  render(<RuneInput runeSymbol='ᚠ' feedback={{
    'correct': false,
    'symbol': 'f',
  }} />);
  const hintDiv = screen.getByTestId('symbol-feedback');
  expect(hintDiv).toBeInTheDocument();
});

test('correct answer: doesnt render hint', () => {
  render(<RuneInput runeSymbol='ᚠ' feedback={{
    'correct': true,
    'symbol': 'f',
  }} />);
  const hintDiv = screen.queryByTestId('symbol-feedback');
  expect(hintDiv).toBeNull();
});

test('no feedback: doesnt render hint', () => {
  render(<RuneInput runeSymbol='ᚠ' />);
  const hintDiv = screen.queryByTestId('symbol-feedback');
  expect(hintDiv).toBeNull();
});