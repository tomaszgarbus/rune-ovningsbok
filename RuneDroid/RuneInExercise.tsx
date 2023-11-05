import { StyleSheet, Text, View } from "react-native"

enum RuneInExerciseStatus {
  Default,
  Active,
  Done,
}

type RuneInExercisePropsType = {
  rune: string,
  latin: string,
  status: RuneInExerciseStatus,
}

function RuneInExercise(props: RuneInExercisePropsType) {
  function getBgColorFromStatus() {
    switch (props.status) {
      case RuneInExerciseStatus.Done:
        return "lightgreen";
      case RuneInExerciseStatus.Active:
        return "yellow";
      default:
        return "white";
    }
  }

  return <View style={
      [
        styles.container,
        {
          backgroundColor: getBgColorFromStatus()
        }
      ]
    }>
    <Text style={styles.text}>
      {props.rune}
    </Text>

    <Text style={styles.text}>
      {props.status === RuneInExerciseStatus.Active ? "?" : props.latin}
    </Text>
  </View>
}

const styles = StyleSheet.create({
  container: {
  },
  text: {
    color: "black",
    fontSize: 20,
  },
})

export { RuneInExercise, RuneInExerciseStatus };