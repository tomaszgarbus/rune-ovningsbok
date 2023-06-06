import { StyleSheet, Text, TextInput, View } from "react-native";

type RuneInputPropsType = {
  index: number,
  rune: string,
  onChange: (nativeEvent: any) => void,
};

function RuneInput(props : RuneInputPropsType) {
  return <View style={styles.runeInputBox}>
    <Text>
      {props.rune}
    </Text>
    <TextInput
      style={styles.textInput}
      maxLength={1}
      onChange={props.onChange}>
    </TextInput>
  </View>
}

type RuneSeparatorPropsType = {
  character: string
};

function RuneSeparator(props: RuneSeparatorPropsType) {
  return <View>
    <Text>
      {props.character}
    </Text>
  </View>
}

const styles = StyleSheet.create({
  runeInputBox: {
    backgroundColor: "#ffd0d0",
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