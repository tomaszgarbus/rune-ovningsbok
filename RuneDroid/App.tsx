import {
    Text, SafeAreaView, StatusBar
} from 'react-native';
import { ListOfExercises } from './ListOfExercises';
import { useState } from 'react';
import ExerciseType from './Types';
import TransliterationExercise from './TransliterationExercise';

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
          setExercise={setExercise}
        />
        :
        <TransliterationExercise
          exercise={exercise}
          goBack={() => setExercise(null)}/>
      }
    </SafeAreaView>
  )
}

export default App;
