import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import ExerciseType from './Types';
import { useBackHandler } from '@react-native-community/hooks'


type TransliterationExercisePropsType = {
  exercise: ExerciseType,
  goBack: (() => void),
};

function TransliterationExercise(props: TransliterationExercisePropsType): JSX.Element {
  useBackHandler(() => {
    props.goBack();
    return true;
  })

  return <ScrollView>
    <SafeAreaView
      style={styles.titleBar}>
      <Button title="back to the list" onPress={props.goBack} />
      <Text>
        {props.exercise.title}
      </Text>
    </SafeAreaView>
  </ScrollView>
}

const styles = StyleSheet.create({
  titleBar: {
    width: "100%",
    height: 50,
    backgroundColor: "red",
  },
});

export default TransliterationExercise;