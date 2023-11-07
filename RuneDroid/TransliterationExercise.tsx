import {
  Button,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableNativeFeedback,
  View
} from 'react-native';
import { ExerciseType, CanonicalRuneRowType, ExerciseState }  from './Types';
import { useBackHandler } from '@react-native-community/hooks'
import { StaticImages } from './StaticImages.autogen';
import commonStyles from './CommonStyles';
import { ReactElement, Ref, createRef, useEffect, useState } from 'react';
import { Linking } from 'react-native';
import {
  IsSeparator,
  IsValidHttpUrl,
  RuneMappingType,
  RuneRowToMapping,
  GetCountryFlag
} from './Utils';
import { useToolTips } from './ToolTipHook';
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
import Tooltip from 'react-native-walkthrough-tooltip';
import { useSolvedExercises } from './SolvedExercisesHook';
import { RuneInExercise, RuneInExerciseStatus } from './RuneInExercise';
import { RuneInput } from './RuneInput';
import { useUserAnswers } from './UserAnswersHook';

type TransliterationExercisePropsType = {
  exercise: ExerciseType,
  goBack: (() => void),
  runeRow: CanonicalRuneRowType,
};

function TransliterationExercise(props: TransliterationExercisePropsType): JSX.Element {
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(1);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [userAnswer, setUserAnswer, resetUserAnswer] = useUserAnswers(
    props.exercise.id, {
    inputs: mapRunes<string>(_ => ""),
    solved: false,
    index: 0,
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

  useEffect(() => {
    if (userAnswer.solved) {
      setExerciseSolved(props.exercise.id);
    }
  }, [userAnswer]);

  function handleCorrectInput(input: string) {
    const inputs: Array<string> = userAnswer.inputs;
    inputs[userAnswer.index] = input;
    var nextIndex = userAnswer.index;
    while (++nextIndex < props.exercise.runes.length
      && IsSeparator(props.exercise.runes[nextIndex]));
    setUserAnswer({
      ...userAnswer,
      inputs: inputs,
      index: nextIndex,
      solved: nextIndex === props.exercise.runes.length,
    })
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
      !userAnswer.solved && isExerciseSolved(props.exercise.id) &&
      <View
        style={styles.alreadySolvedView}>
        <Text style={styles.alreadySolvedText}>
          You have already solved this exercise. Kudos for revising it!
        </Text>
      </View>
    }

    {/* Country */}
    {props.exercise.country &&
      <View
        style={styles.country}>
        <Text style={styles.sectionName}>Country:</Text>
        <Text
          style={styles.sectionContent}>
          {GetCountryFlag(props.exercise.country)}
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
      content={<Text style={styles.toolTipText}>
        Tap the photo to zoom it!
        </Text>}
      placement="top"
      onClose={nextToolTip}
        >
      <TouchableNativeFeedback
        onPress={_ => {
          setModalVisible(true);
        }}
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
      </TouchableNativeFeedback>
    </Tooltip>

    {/* Image pop-up */}
    <Modal
      animationType='fade'
      transparent={false}
      style={styles.modal}
      visible={isModalVisible}>
      <Button
        title="Close preview"
        onPress={_ => {setModalVisible(false)}}
        />
      <ReactNativeZoomableView
        maxZoom={5}
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
          ]} />
      </ReactNativeZoomableView>
    </Modal>

    {/* Runic text with answers or blanks */}
    <View style={styles.runesSection}>
      <Text style={styles.sectionName}>Runes:</Text>
      <View style={styles.runes}>
        {
          mapRunes<ReactElement>(
            (rune, index) => <RuneInExercise
              rune={rune}
              latin={userAnswer.inputs[index]}
              key={index}
              status={
                index < userAnswer.index ?
                  RuneInExerciseStatus.Done :
                  index === userAnswer.index ?
                    RuneInExerciseStatus.Active :
                    RuneInExerciseStatus.Default
              }
            />
          )
        }
      </View>
    </View>

    {/* Rune input */}
    {!userAnswer.solved && 
      <View style={styles.runeInputParent}>
        <Text style={styles.sectionName}>Solve here:</Text>
        <RuneInput
          runeAndLatin={{
            rune: props.exercise.runes[userAnswer.index],
            latin: runeMapping[props.exercise.runes[userAnswer.index]]
          }}
          onSolve={(input: string) => handleCorrectInput(input)}
        />
      </View>
    }

    {/* Clear answer button */}
    { userAnswer.index > 0 &&
      <Button
        title='clear answer'
        onPress={resetUserAnswer} />
    }

    {/* Explanation after */}
    <View style={styles.feedback}>
      <Text style={styles.sectionName}>Feedback:</Text>
      { userAnswer.solved && 
        <View style={styles.alreadySolvedView}>
          <Text style={styles.sectionContent}>
            {props.exercise.explanationAfter}
          </Text>
        </View>
      }
      {
        !userAnswer.solved &&
        <Text style={styles.sectionContent}>
          Transliterate all runes first, and you'll see the explanation
          behind the inscription here.
        </Text>
      }
    </View>

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
    flexWrap: "wrap",
    flexShrink: 1,
  },
  description: {
    marginBottom: 20,
    marginTop: 10,
  },
  country: {
    marginBottom: 0,
    marginTop: 10,
  },
  feedback: {
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
  },
  modal: {
    backgroundColor: "#fff4"
  },
  runes: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  runesSection: {
    marginTop: 10,
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
  runeInputParent: {
    marginBottom: 20,
  },
  toolTipText: {
    color: "black",
  }
});

export default TransliterationExercise;