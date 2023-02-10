import './App.css';
import TransliterationExercise from './TransliterationExercise';
import ListOfExercises from './ListOfExercises';
import { useState } from 'react';

function App(props) {
  const [exercise, setExercise] = useState(null);

  return (
    <div className="App">
      {exercise === null ?
        (
          <ListOfExercises
            items={props.exercises}
            setExercise={setExercise}
            runeRows={props.runeRows}
            />
        ) :
        (
          <TransliterationExercise
            backToExerciseListFn={() => {setExercise(null)}}
            exercise={exercise}
            runeRow={props.runeRows[exercise.rowType]} />
        )
      }
    </div>
  );
}

export default App;
