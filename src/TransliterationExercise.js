import RuneInput from "./RuneInput";
import { useState } from "react";


function TransliterationExercise(props) {
  const [userAnswer, setUserAnswer] = useState(
    {
      inputs: props.runes.map(_ => ""),
      ready: false
    }
  )

  function updateUserAnswer(index, char) {
    const inputs = userAnswer.inputs;
    inputs[index] = char;
    setUserAnswer({
      inputs: inputs,
      ready: isSubmitDisabled(inputs)
    });
  }

  function isSubmitDisabled(inputs) {
    for (const c of inputs) {
      console.log(c);
      if (c == "") return false;
    }
    return true;
  }

  function validate() {
    for (let i = 0; i < userAnswer.inputs.length; ++i) {
      if (userAnswer.inputs[i] != props.runeMapping[props.runes[i]]) {
        console.log("Wrong!!");
        return;
      }
    }
    console.log("Good!!");
  }

  function onSubmit(event) {
    event.preventDefault();
    validate();
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        {
          props.runes.map(
            (rune, index) => <RuneInput
                key={index}
                runeSymbol={rune}
                onChange={event => updateUserAnswer(index, event.target.value)}
              />
          )
        }
        <input
          type="submit"
          onSubmit={onSubmit}
          disabled={!userAnswer.ready}
          />
      </form>
    </div>
  )
}

export default TransliterationExercise;