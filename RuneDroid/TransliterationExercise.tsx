import {
  Button,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native';
import { ExerciseType, CanonicalRuneRowType}  from './Types';
import { useBackHandler } from '@react-native-community/hooks'
import StaticImages from './StaticImages.autogen';
import commonStyles from './CommonStyles';
import { ReactElement, useCallback, useState } from 'react';
import { RuneInput, RuneSeparator } from './RuneInput';
import { IsSeparator, RuneMappingType, RuneRowToMapping } from './Utils';
import Toggle from 'react-native-toggle-element/lib/toggle';

type TransliterationExercisePropsType = {
  exercise: ExerciseType,
  goBack: (() => void),
  runeRow: CanonicalRuneRowType,
};

type ExerciseState = {
  inputs: Array<string>,
  ready: boolean,
  solved: boolean,
};

function TransliterationExercise(props: TransliterationExercisePropsType): JSX.Element {
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(1);
  const [hintsEnabled, setHintsEnabled] = useState<boolean>(false);
  // TODO: Consider caching solved exercises on disk?
  const [userAnswer, setUserAnswer] = useState<ExerciseState>({
    inputs: mapRunes<string>(_ => ""),
    ready: false,
    solved: false,
  });
  const runeMapping: RuneMappingType = RuneRowToMapping(props.runeRow);

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

  function shouldShowHintForField(index: number) {
    const inputs: Array<string> = userAnswer.inputs;
    // TODO: handle the case when all inputs are provided
    if (hintsEnabled && inputs[index].length > 0) {
      return true;
    }
    return false;
  }

  function isReady(inputs: Array<string>): boolean {
    for (const [i, c] of inputs.entries()) {
      if (IsSeparator(props.exercise.runes[i])) {
        continue;
      }
      if (c === '') {
        return false;
      }
    }
    return true;
  }

  function isInputCorrect(input: string, groundTruth: string | Array<string>) {
    if (typeof(groundTruth) === 'string') {
      return input.toLowerCase() === groundTruth;
    } else {
      return groundTruth.includes(input.toLowerCase());
    }
  }

  const isSolved = useCallback((inputs: Array<string>) => {
    for (const i in inputs) {
      if (IsSeparator(props.exercise.runes[i])) {
        continue;
      }
      if (!isInputCorrect(inputs[i], runeMapping[props.exercise.runes[i]])) {
        return false;
      }
    }
    return true;
  }, [props, runeMapping])

  function updateUserAnswer(index: number, char: string) {
    const inputs: Array<string> = userAnswer.inputs;
    inputs[index] = char;
    setUserAnswer({
      ...userAnswer,
      inputs: inputs,
      ready: isReady(inputs),
      solved: isSolved(inputs),
    });
    // TODO: move to the next input
  }

  return <ScrollView
      style={[commonStyles.background, styles.topLevelScrollView]}>
    
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
      contentContainerStyle={styles.horizontalScrollView}
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
            onChangeText={(text) => updateUserAnswer(index, text)}
            feedback={shouldShowHintForField(index) ? 
              {
                "symbol": runeMapping[rune],
                "correct": isInputCorrect(userAnswer.inputs[index], runeMapping[rune])
              } : undefined
            }
          />
        )
      }
    </ScrollView>

    {/* Explanation after */}
    { userAnswer.solved && 
      <Text>
        {props.exercise.explanationAfter}
      </Text>
    }
    {
      userAnswer.ready && !userAnswer.solved &&
      <Text>
        Not quite! Please correct all the inputs according to the
        hints to read an explanation of the runic message.
      </Text>
    }

    {/* Hints toggler */}
    <View>
      <Text>Show hints immediately after wrong answers?</Text>
      <Toggle
        value={hintsEnabled}
        leftTitle={"No"}
        rightTitle={"Yes"}
        trackBar={styles.toggler}
        thumbButton={styles.togglerButton}
        onPress={(val: boolean | undefined) => setHintsEnabled(val || false)} />
    </View>

    {/* Sources */}
    <ScrollView horizontal={true}>
      <View>
        <Text>Sources:</Text>
      {
        props.exercise.sources && 
        props.exercise.sources.map((src: string) =>
          <Text key={src}> • {src}</Text>
        )
      }
      </View>
    </ScrollView>

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
  horizontalScrollView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  topLevelScrollView: {
    display: "flex",
    flexDirection: "column",
  },
  toggler: {
    activeBackgroundColor: "#3c4145",
    inActiveBackgroundColor: "#3c4145",
    borderActiveColor: "#1c1c1c",
    borderInActiveColor: "#1c1c1c",
    borderWidth: 5,
    height: 30,
    width: 80,
  },
  togglerButton: {
    width: 45,
    height: 45,
    radius: 22,
    activeBackgroundColor: "#ffd0d0",
    inActiveBackgroundColor: "#ffd0d0",
  }
});

export default TransliterationExercise;