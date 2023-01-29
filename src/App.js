import './App.css';
import RuneRows from './RuneRows.json';
import {RuneRowToMapping} from './Utils';
import TransliterationExercise from './TransliterationExercise';
import ListOfExercises from './ListOfExercises';
import Exercises from './Exercises.json';
import { useState } from 'react';

function App() {
  const [exercise, setExercise] = useState(null);

  return (
    <div className="App">
      {exercise === null ?
        (
          <ListOfExercises
            items={Exercises}
            setExercise={setExercise}
            runeRows={RuneRows}
            />
        ) :
        (
          <TransliterationExercise
            backToExerciseListFn={() => {setExercise(null)}}
            exercise={exercise}
            runeMapping={RuneRowToMapping(RuneRows[exercise.rowType])} />
        )
      }
    </div>
  );
}

export default App;
