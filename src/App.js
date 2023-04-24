import './App.css';
import TransliterationExercise from './TransliterationExercise';
import ListOfExercises from './ListOfExercises';
import { useState } from 'react';
import { ExpandRuneRowsToCanonical } from './Utils';

function App(props) {
  // If this way of setting initial state should cause troubles,
  // switch to useEffect() with empty dependency array.
  const [exercise, setExercise] = useState(
    JSON.parse(window.sessionStorage.getItem('exercise')));

  function setExerciseNotNull(newExercise) {
    window.sessionStorage.setItem('exercise', JSON.stringify(newExercise));
    setExercise(newExercise);
  }

  function clearExercise() {
    window.sessionStorage.setItem('exercise', null);
    setExercise(null);
  }

  const runeRows = ExpandRuneRowsToCanonical(props.runeRows);

  return (
    <div className="App">
      {exercise === null ?
        (
          <ListOfExercises
            items={props.exercises}
            setExercise={setExerciseNotNull}
            runeRows={runeRows}
            />
        ) :
        (
          <TransliterationExercise
            backToExerciseListFn={clearExercise}
            exercise={exercise}
            runeRow={runeRows[exercise.rowType]} />
        )
      }
    </div>
  );
}

export default App;
