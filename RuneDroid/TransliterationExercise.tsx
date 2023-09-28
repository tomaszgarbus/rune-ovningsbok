import {
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { ExerciseType, CanonicalRuneRowType}  from './Types';
import { useBackHandler } from '@react-native-community/hooks'
import { StaticImages } from './StaticImages.autogen';
import commonStyles from './CommonStyles';
import { ReactElement, Ref, createRef, useCallback, useState } from 'react';
import { RuneInput, RuneSeparator } from './RuneInput';
import { Linking } from 'react-native';
import {
  IsSeparator,
  IsValidHttpUrl,
  RuneMappingType,
  RuneRowToMapping
} from './Utils';
import { useToolTips } from './ToolTipHook';
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
import Tooltip from 'react-native-walkthrough-tooltip';
import { useSolvedExercises } from './SolvedExercisesHook';

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
  const [userAnswer, setUserAnswer] = useState<ExerciseState>({
    inputs: mapRunes<string>(_ => ""),
    ready: false,
    solved: false,
  });
  const [currentToolTip, nextToolTip] = useToolTips("TransliterationExercise", 3);
  const runeMapping: RuneMappingType = RuneRowToMapping(props.runeRow);
  const [isExerciseSolved, setExerciseSolved] = useSolvedExercises();

  // Used for moving focus to next field.
  const inputsRefs: Array<Ref<TextInput>> = mapRunes<Ref<TextInput>>(
    _ => createRef());
  
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
    if (inputs[index].length > 0) {
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

  function maybeMoveToNextInput(currentIndex: number) {
    const inputs = userAnswer.inputs;
    
    let nextIndexToFocus: number = currentIndex;
    while (++nextIndexToFocus < inputs.length && 
      IsSeparator(props.exercise.runes[nextIndexToFocus]));
    if (nextIndexToFocus < inputs.length) {
      inputsRefs[nextIndexToFocus].current.focus();
    }
  }

  function updateUserAnswer(index: number, char: string) {
    const inputs: Array<string> = userAnswer.inputs;
    inputs[index] = char;
    setUserAnswer({
      ...userAnswer,
      inputs: inputs,
      ready: isReady(inputs),
      solved: isSolved(inputs),
    });
    if (isSolved(inputs)) {
      setExerciseSolved(props.exercise.id);
    }
    // TODO: move to the next input
    if (inputs[index].length === 1) {
      maybeMoveToNextInput(index);
    }
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

    {/* Toast about having solved this exercise */}
    {
      !userAnswer.ready && isExerciseSolved(props.exercise.id) &&
      <View
        style={styles.alreadySolvedView}>
        <Text style={styles.alreadySolvedText}>
          You have already solved this exercise. Kudos for revising it!
        </Text>
      </View>
    }
    
    {/* Row type */}
    <View
      style={styles.rowType}>
      <Text style={styles.sectionName}>Runic alphabet:</Text>
      <Text style={styles.sectionContent}>
        {props.runeRow.name}
      </Text>
    </View>

    {/* Description */}
    <View
      style={styles.description}>
      <Text style={styles.sectionName}>About:</Text>
      <Text
        style={styles.sectionContent}>
        {props.exercise.description}
      </Text>
    </View>

    {/* Image */}
    <Tooltip
      isVisible={currentToolTip == 0}
      content={<Text>
        Use gestures (pinch, double tap) to zoom in and move the photo.
        Try to locate the runes you're transliterating on the photo!
        </Text>}
      placement="top"
      onClose={nextToolTip}
        >
      <ReactNativeZoomableView
        maxZoom={1.5}
        minZoom={0.5}
        zoomStep={0.5}
        initialZoom={1}
        bindToBorders={true}
      >
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
      </ReactNativeZoomableView>
    </Tooltip>

    {/* Rune inputs and separators */}
    <Tooltip
      isVisible={currentToolTip == 1}
      content={<Text>
        Enter characters of Latin alphabet below the runes.
        You will see a feedback immediately after input.
        If you are unsure how to translate some symbol (should ᚴ be K or G?),
        just input whichever and update according to the hint.
        </Text>}
      placement="top"
      onClose={nextToolTip}
    >
      <ScrollView
        contentContainerStyle={styles.horizontalScrollView}
        persistentScrollbar={true} 
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
              ref={inputsRefs[index]}
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
    </Tooltip>

    {/* Explanation after */}
    <Tooltip
      isVisible={currentToolTip == 2 && userAnswer.ready}
      content={
        <Text>
          When you input all the Latin characters, here you will receive your feedback.
          Once all fields are correct, you'll learn more about the meaning and
          interpretations of the inscription!
        </Text>
      }
      placement="top"
      onClose={nextToolTip}
      >
      {
        userAnswer.ready &&
        <Text style={styles.sectionName}>Feedback:</Text>
      }
      <Text style={styles.sectionContent}>
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
      </Text>
    </Tooltip>

    {/* Sources */}
    <View style={styles.sources}>
      <Text style={styles.sectionName}>Sources:</Text>
      <Text style={styles.sectionContent}>
        {
          props.exercise.sources && 
          props.exercise.sources.map((src: string) =>
            IsValidHttpUrl(src)
            ?
            <Text
              style={styles.link}
              onPress={() => Linking.openURL(src)}
              key={src}
              >{`• ${src}\n`}</Text>
            :
            `• ${src}\n`
          )
        }
      </Text>
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
    color: "black",
    marginTop: 10,
    fontFamily: "Aboreto-Regular",
  },
  alreadySolvedView: {
    backgroundColor: "lightgreen",
    borderRadius: 10,
    padding: 5,
    margin: 5,
  },
  alreadySolvedText: {
    color: "darkgreen",
    fontFamily: "Finlandica-Regular",
    alignSelf: "center",
  },
  sectionName: {
    color: "black",
    fontFamily: "Finlandica-Bold",
  },
  sectionContent: {
    color: "black",
    fontFamily: "Finlandica-Regular",
  },
  description: {
    marginBottom: 20,
    marginTop: 10,
  },
  rowType: {
    marginBottom: 0,
    marginTop: 10,
  },
  sources: {
    marginTop: 10,
  },
  link: {
    color: "blue",
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
    marginHorizontal: 20,
    fontFamily: "Finlandica-Regular",
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