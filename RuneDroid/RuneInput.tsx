import { Text, View } from "react-native";

type RuneInputPropsType = {
  index: number,
  rune: string
};

function RuneInput(props : RuneInputPropsType) {
  console.log(props);
  return <View>
    <Text>
      {props.rune}
    </Text>
  </View>
}

type RuneSeparatorPropsType = {
  character: string
};

function RuneSeparator(props: RuneSeparatorPropsType) {
  console.log(props);
  return <View>
    <Text>
      {props.character}
    </Text>
  </View>
}

export {
  RuneInput,
  RuneSeparator
};