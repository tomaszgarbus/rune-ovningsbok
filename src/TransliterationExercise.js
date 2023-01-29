import RuneInput from "./RuneInput";
import { useState } from "react";


function TransliterationExercise(props) {
  const [userAnswer, setUserAnswer] = useState(
    {
      inputs: props.exercise.runes.map(_ => ""),
      ready: false
    }
  )
  // True if user has clicked the "Check" button.
  const [showFeedback, setShowFeedback] = useState(false);

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

  function onSubmit(event) {
    event.preventDefault();
    setShowFeedback(true);
  }

  return (
    <div className="ActiveTransliterationExercise">

      <div className="ActiveExerciseTopBar">
        <button onClick={props.backToExerciseListFn} className="BackToListButton">
          ⮜
        </button>
        <h1 className="ActiveExerciseTitle">{props.exercise.title}</h1>
      </div>
      <div className="ActiveExerciseImgDiv">
        <img src={"./assets/" + props.exercise.img} className="ActiveExerciseImg" alt={props.exercise.title} />
      </div>
      <form onSubmit={onSubmit}>
        <div className="RuneInputsDiv">
          {
            props.exercise.runes.map(
              (rune, index) => <RuneInput
                  key={index}
                  runeSymbol={rune}
                  feedback={
                    showFeedback ? 
                      {
                        "symbol": props.runeMapping[rune],
                        "correct": props.runeMapping[rune] === userAnswer.inputs[index]
                      } : undefined
                    }
                  onChange={event => updateUserAnswer(index, event.target.value)}
                />
            )
          }
        </div>
        <input
          className="ActiveExerciseCheckButton"
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