import { StyleSheet, Text, TextInput, View } from "react-native";

type RuneInputPropsType = {
  index: number,
  rune: string
};

function RuneInput(props : RuneInputPropsType) {
  return <View>
    <Text>
      {props.rune}
    </Text>
    <TextInput style={styles.textInput}>

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
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
  }
});

export {
  RuneInput,
  RuneSeparator
};