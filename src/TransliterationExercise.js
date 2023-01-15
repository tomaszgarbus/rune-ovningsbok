import RuneInput from "./RuneInput";
import { useState } from "react";


function TransliterationExercise(props) {
  console.log(props.runeMapping);

  const [userAnswer, setUserAnswer] = useState(
    {
      inputs: props.exercise.runes.map(_ => ""),
      ready: false
    }
  )

  function updateUserAnswer(index, char) {
    const inputs = userAnswer.inputs;
    inputs[index] = char;
    setUserAnswer({
      inputs: inputs,
      ready: isReady(inputs)
    });
  }

  function isReady(inputs) {
    for (const c of inputs) {
      if (c === "") return false;
    }
    return true;
  }

  function validate() {
    for (let i = 0; i < userAnswer.inputs.length; ++i) {
      if (userAnswer.inputs[i] !== props.runeMapping[props.exercise.runes[i]]) {
        console.log("Wrong!!" + i + props.runeMapping[props.exercise.runes[i]]);
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
    <div className="ActiveTransliterationExercise">
      <h1>{props.exercise.title}</h1>
      <form onSubmit={onSubmit}>
        <div className="RuneInputsDiv">
          {
            props.exercise.runes.map(
              (rune, index) => <RuneInput
                  key={index}
                  runeSymbol={rune}
                  onChange={event => updateUserAnswer(index, event.target.value)}
                />
            )
          }
        </div>
        <input
          type="submit"
          onSubmit={onSubmit}
          disabled={!userAnswer.ready}
          value="Check"
          />
      </form>
    </div>
  )
}

export default TransliterationExercise;