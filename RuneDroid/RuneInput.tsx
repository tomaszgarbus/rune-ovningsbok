import { StyleSheet, Text, TextInput, View } from "react-native";
import { RuneRowSymbolPair } from "./Types";
import { useEffect, useRef } from "react";

type RuneInputPropsType = {
  runeAndLatin: RuneRowSymbolPair,
  onSolve: (input: string) => void,
}

function RuneInput(props: RuneInputPropsType) {
  const inputRef = useRef<TextInput | null>(null);

  function isInputCorrect(input: string, groundTruth: string | Array<string>) {
    if (typeof(groundTruth) === 'string') {
      return input.toLowerCase() === groundTruth;
    } else {
      return groundTruth.includes(input.toLowerCase());
    }
  }

  function handleTextChange(text: string) {
    if (isInputCorrect(text, props.runeAndLatin.latin)) {
      inputRef.current?.clear();
      console.log(inputRef.current === null);
      props.onSolve(text);
    }
    // TODO: handle wrong input
  }

  return <View style={styles.container}>
    <View style={styles.runeTextContainer}>
      <Text style={styles.runeText}>
        {props.runeAndLatin.rune}
      </Text>
    </View>
    <TextInput
      autoCorrect={false} 
      placeholder="?"
      placeholderTextColor={"grey"}
      textAlign="center"
      maxLength={1}
      style={styles.textInput}
      onChangeText={(text: string) => {handleTextChange(text)}}
      ref={inputRef}>
    </TextInput>
  </View>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "lightgrey",
    borderRadius: 20,
    marginHorizontal: 30,
    display: "flex",
    flexDirection: "row",
    alignContent: "stretch",
  },
  runeText: {
    color: "black",
  },
  runeTextContainer: {
    borderRadius: 10,
    margin: 10,
    marginStart: 20,
    backgroundColor: "grey",
  },
  textInput: {
    backgroundColor: "white",
    color: "black",
    borderRadius: 10,
    margin: 10,
    marginEnd: 20,
  }
})

export { RuneInput };