import { NativeSyntheticEvent, StyleSheet, Text, TextInput, TextInputChangeEventData, View } from "react-native";

type Feedback = {
  correct: boolean,
  symbol: string | Array<string>,
};

type RuneInputPropsType = {
  index: number,
  feedback: Feedback | undefined,
  rune: string,
  onChangeText: (text: string) => void,
};

function RuneInput(props : RuneInputPropsType) {
  return <View style={styles.runeInputBox}>
    <Text
      style={styles.originalSymbol}>
      {props.rune}
    </Text>
    <TextInput
      style={styles.textInput}
      maxLength={1}
      onChangeText={props.onChangeText}>
    </TextInput>
    {props.feedback && 
      <Text>
        props.feedback.symbol
      </Text>
    }
  </View>
}

type RuneSeparatorPropsType = {
  character: string
};

function RuneSeparator(props: RuneSeparatorPropsType) {
  return <View
    style={styles.runeSeparatorBox}>
    <Text
      style={styles.runeSeparatorSymbol}>
      {props.character}
    </Text>
  </View>
}

const styles = StyleSheet.create({
  runeSeparatorSymbol: {
    fontSize: 20,
    alignSelf: "center",
  },
  runeSeparatorBox: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
  },
  originalSymbol: {
    fontSize: 15,
    marginBottom: 5,
    marginTop: 0,
    textAlign: 'center',
  },
  runeInputBox: {
    backgroundColor: '#ffd0d0',
    margin: 1,
    marginTop: 10,
    borderRadius: 15,
    paddingBottom: 8,
    paddingTop: 8,
    paddingLeft: 5,
    paddingRight: 5,
  },
  textInput: {
    backgroundColor: 'white',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 25,
    fontSize: 15,
    height: 30,
    padding: 0,
    textAlign: 'center',
  }
});

export {
  RuneInput,
  RuneSeparator
};