import { StyleSheet, Text, TextInput, View } from "react-native";
import { RuneRowSymbolPair } from "./Types";
import { useRef, useState } from "react";

type RuneInputPropsType = {
  runeAndLatin: RuneRowSymbolPair,
  onSolve: (input: string) => void,
}

function RuneInput(props: RuneInputPropsType) {
  const inputRef = useRef<TextInput | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  function isInputCorrect(input: string, groundTruth: string | Array<string>) {
    if (typeof(groundTruth) === 'string') {
      return input.toLowerCase() === groundTruth;
    } else {
      return groundTruth.includes(input.toLowerCase());
    }
  }

  function feedbackSymbolsToString(): string {
    if (typeof(props.runeAndLatin.latin) === 'string') {
      return props.runeAndLatin.latin;
    }
    return props.runeAndLatin.latin.join('/');
  }

  function handleTextChange(text: string) {
    if (isInputCorrect(text, props.runeAndLatin.latin)) {
      // TODO: fix clearing
      props.onSolve(text);
      inputRef.current?.clear();
      setFeedback("");
    } else if (text.length === 1) {
      setFeedback(
        "Not quite. Correct answer: " +
        feedbackSymbolsToString() + 
        ". Type to proceed.");
    }
  }

  return <View style={styles.container}>
      {/* Rune */}
      <View style={styles.runeTextContainer}>
        <Text style={styles.runeText}>
          {props.runeAndLatin.rune}
        </Text>
      </View>

      {/* Input */}
      <TextInput
        autoCorrect={false} 
        autoComplete="off"
        spellCheck={false}
        placeholder="?"
        placeholderTextColor={"grey"}
        textAlign="center"
        maxLength={1}
        style={styles.textInput}
        onChangeText={(text: string) => {handleTextChange(text)}}
        ref={inputRef}>
      </TextInput>

      {/* Optional feedback */}
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackText}>
          {feedback}
        </Text>
      </View>
    </View>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "lightgrey",
    borderRadius: 20,
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  runeTextContainer: {
    borderRadius: 10,
    margin: 10,
    marginStart: 20,
    display: "flex",
    alignSelf: "center",
    alignContent: "center",
  },
  runeText: {
    color: "black",
    fontSize: 30,
  },
  textInput: {
    backgroundColor: "white",
    color: "black",
    borderRadius: 10,
    margin: 10,
    marginEnd: 20,
    fontSize: 20,
  },
  feedbackContainer: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    alignContent: "center",
    flexShrink: 1,
  },
  feedbackText: {
    color: "black",
    flexWrap: "wrap",
    flexDirection: "row",
    fontSize: 15,
    flexShrink: 1,
  }
})

export { RuneInput };