import RuneInput from "./RuneInput";
import { useEffect, useState } from "react";


function TransliterationExercise(props) {
  const [userAnswer, setUserAnswer] = useState(
    {
      inputs: props.exercise.runes.map(_ => ""),
      // "Ready" means "ready for checking". This is synonymous with "submit button is unlocked".
      ready: false,
      // "Solved" means "checked and all inputs correct or corrected after hints".
      solved: false
    }
  )

  // True if user has clicked the "Check" button.
  const [showFeedback, setShowFeedback] = useState(false);

  // If the user requests feedback and they got everything right, `solved` should automatically be set to true.
  useEffect(
    () => {
      setUserAnswer({
        ...userAnswer,
        solved: isSolved(userAnswer.inputs)
      });
      console.log(isSolved(userAnswer.inputs));
    },
    [showFeedback]
  )

  function updateUserAnswer(index, char) {
    const inputs = userAnswer.inputs;
    inputs[index] = char;
    setUserAnswer({
      inputs: inputs,
      ready: isReady(inputs),
      solved: isSolved(inputs)
    });
    console.log(isSolved(inputs));
  }

  function isReady(inputs) {
    for (const c of inputs) {
      if (c === "") return false;
    }
    return true;
  }

  function isSolved(inputs) {
    if (!showFeedback) {
      return false;
    }
    for (const i in inputs) {
      if (props.runeMapping[props.exercise.runes[i]] != userAnswer.inputs[i]) {
        return false;
      }
    }
    return true;
  }

  function onSubmit(event) {
    event.preventDefault();
    setShowFeedback(true);
  }

  return (
    <div className="ActiveTransliterationExercise">

      {/* Top bar */}
      <div className="ActiveExerciseTopBar">
        <button onClick={props.backToExerciseListFn} className="BackToListButton">
          &#10094;
        </button>
        <h1 className="ActiveExerciseTitle">{props.exercise.title}</h1>
      </div>
      
      {/* Description */}
      <p className="ActiveExerciseDescription">
        {props.exercise.description}
      </p>
      
      {/* Image */}
      <div className="ActiveExerciseImgDiv">
        <img src={"./assets/" + props.exercise.img} className="ActiveExerciseImg" alt={props.exercise.title} />
      </div>

      {/* User input */}
      <form onSubmit={onSubmit}>
        <div className="ActiveExerciseRuneInputsDiv">
          {
            props.exercise.runes.map(
              (rune, index) => <RuneInput
                  index={index}
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

          {/* Check button */}
          <input
            id="ActiveExerciseCheckButton"
            type="submit"
            onSubmit={onSubmit}
            disabled={!userAnswer.ready}
            hidden={showFeedback}
            value="Check"
            />
        </div>
      </form>

      {/* Explanation after */}
      { userAnswer.solved && 
          <p className="ActiveExerciseExplanationAfter">
            {props.exercise.explanationAfter}
          </p>
        }

      {/* Sources */}
      {props.exercise.sources &&
        <div className="ActiveExerciseSources">
          Sources:
          <ol>
            {
              props.exercise.sources.map(
                source => (
                  <li><a href={source}>{source}</a></li>
                )
              )
            }
          </ol>
        </div>
      }
    </div>
  )
}

export default TransliterationExercise;