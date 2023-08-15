import {
    Text, SafeAreaView, StatusBar
} from 'react-native';
import { ListOfExercises } from './ListOfExercises';
import { useState } from 'react';
import {
  ExerciseType,
  CompressedRuneRowMap,
  CanonicalRuneRowMap
}  from './Types';
import TransliterationExercise from './TransliterationExercise';
import { ExpandRuneRowsToCanonical } from './Utils';

import UntypedExercises from './Exercises.json';
import UntypedRuneRows from './RuneRows.json';

const Exercises: Array<ExerciseType> = UntypedExercises;
const CompressedRuneRows: CompressedRuneRowMap = UntypedRuneRows;
const CanonicalRuneRows: CanonicalRuneRowMap = ExpandRuneRowsToCanonical(CompressedRuneRows);

function App(): JSX.Element {
  const [exercise, setExercise] = useState<ExerciseType | null>(null)

  return (
    <SafeAreaView>
      <StatusBar
        barStyle='dark-content'
      />
      {
        exercise === null ?
        <ListOfExercises
          exercises={Exercises}
          setExercise={setExercise}
          columns={1}
        />
        :
        <TransliterationExercise
          exercise={exercise}
          goBack={() => setExercise(null)}
          runeRow={CanonicalRuneRows[exercise.rowType]}/>
      }
    </SafeAreaView>
  )
}

export default App;
