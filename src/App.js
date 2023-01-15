import './App.css';
import RuneRows from './RuneRows.json';
import {RuneRowToMapping} from './Utils';
import TransliterationExercise from './TransliterationExercise';
import ListOfExercises from './ListOfExercises';
import Exercises from './exercises.json';
import { useState } from 'react';

function App() {
  const [exercise, setExercise] = useState(null);

  return (
    <div className="App">
      <ListOfExercises items={Exercises} setExercise={setExercise}/>
      {
        exercise ?
          <TransliterationExercise
            exercise={exercise}
            runeMapping={RuneRowToMapping(RuneRows[exercise.rowType])} />
        : <div></div>
      }
    </div>
  );
}

export default App;
