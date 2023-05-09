import { render, screen } from '@testing-library/react';
import ExercisesListItem from './ExercisesListItem';

test('rune row name is displayed', () => {
  render(<ExercisesListItem
    exercise={{
      title: "Test inscription on a test stone",
      runes: [],
      img: "test.png"
    }}
    runeRow={{
      name: "Test Futhark"
    }} />)
  expect(screen.getByText('Test Futhark')).toBeInTheDocument();
});