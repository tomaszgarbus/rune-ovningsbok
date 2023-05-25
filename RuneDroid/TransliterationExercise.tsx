import {
  Button,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native';
import ExerciseType from './Types';
import { useBackHandler } from '@react-native-community/hooks'
import StaticImages from './StaticImages.autogen';
import commonStyles from './CommonStyles';
import { ReactElement, useState } from 'react';
import { RuneInput, RuneSeparator } from './RuneInput';
import { IsSeparator } from './Utils';



type TransliterationExercisePropsType = {
  exercise: ExerciseType,
  goBack: (() => void),
};

function TransliterationExercise(props: TransliterationExercisePropsType): JSX.Element {
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(1);
  const [hintsEnabled, setHintsEnabled] = useState<boolean>(false);

  useBackHandler(() => {
    props.goBack();
    return true;
  })

  function mapRunes<Type>(fn: (rune: string, index: number) => Type): Array<Type> {
    if (typeof(props.exercise.runes) === 'string') {
      return props.exercise.runes.split('').map(fn);
    } else {
      return props.exercise.runes.map(fn);
    }
  }

  function toggleHints() {
    setHintsEnabled(!hintsEnabled);
  }

  return <ScrollView
      style={[commonStyles.background, styles.scrollView]}>
    {/* Back button */}
    <Button title="back to the list" onPress={props.goBack} />
    {/* Title */}
    <SafeAreaView
      style={styles.titleBar}>
      <Text
        style={styles.title}>
        {props.exercise.title}
      </Text>
    </SafeAreaView>
    {/* Description */}
    <Text>
      {props.exercise.description}
    </Text>
    {/* Image */}
    <Image
      source={StaticImages[props.exercise.id]}
      style={[
        styles.image,
        {
          aspectRatio: imageAspectRatio
        }
      ]}
      onLoad={
        ({nativeEvent: {source: {width, height}}}) => setImageAspectRatio(width / height)
        } />
    {/* Rune inputs and separators */}
    <ScrollView
      horizontal={true}>
      {
        mapRunes<ReactElement>(
          (rune, index) => IsSeparator(rune) ?
          <RuneSeparator character={rune} key={index} />
          :
          <RuneInput
            index={index}
            key={index}
            rune={rune}
            onChange={() => {}}  // TODO
          />
        )
      }
    </ScrollView>
    {/* Hints toggler */}
    <View>
      <Text>Show hints after wrong answers?</Text>
      <Switch
        value={hintsEnabled}
        onValueChange={toggleHints} />
    </View>
  </ScrollView>
}

const styles = StyleSheet.create({
  titleBar: {
    width: "100%",
  },
  title: {
    alignSelf: "center",
    fontSize: 20,
  },
  image: {
    alignSelf: "center",
    margin: "auto",
    resizeMode: "contain",
    width: "80%",
    height: undefined,
    borderRadius: 20,
    // shadowColor: "black",
    // shadowOffset: {
    //   height: 5,
    //   width: 5
    // },
    // shadowRadius: 10,
  },
  scrollView: {
    display: "flex",
    flexDirection: "column",
  }
});

export default TransliterationExercise;