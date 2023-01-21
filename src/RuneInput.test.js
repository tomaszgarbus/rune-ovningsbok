import { render, screen } from '@testing-library/react';
import RuneInput from './RuneInput';

test('renders hint for incorrect answer', () => {
  render(<RuneInput runeSymbol='ᚠ' feedback={{
    'correct': false,
    'symbol': 'f',
  }} />);
  const hintDiv = screen.getByTestId('symbol-feedback');
  expect(hintDiv).toBeInTheDocument();
});