import RuneInput from "./RuneInput";
import { useCallback, useEffect, useRef, useState } from "react";
import {RuneRowToMapping} from './Utils';


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

  // Used to update the `display` property on the help modal.
  const helpModalRef = useRef(null);

  // TODO: This was created to silence warnings. Instead of this inefficient
  // function, runeMapping constant below should be made React-friendly so
  // that it's not recomputed on each re-render.
  const runeMappingFn = useCallback((rune) => {
    return RuneRowToMapping(props.runeRow)[rune];
  }, [props])

  const runeMapping = RuneRowToMapping(props.runeRow)

  function updateUserAnswer(index, char) {
    const inputs = userAnswer.inputs;
    inputs[index] = char;
    setUserAnswer({
      inputs: inputs,
      ready: isReady(inputs),
      solved: isSolved(inputs)
    });

    // Maybe move the cursor to the next input.
    // TODO: find a way to do it with Refs instead.
    if (index < inputs.length - 1 && char) {
      document.getElementById("SingleRuneInputField" + (index + 1)).focus();
    }
  }

  function isReady(inputs) {
    for (const c of inputs) {
      if (c === "") return false;
    }
    return true;
  }

  const isSolved = useCallback((inputs) => {
    if (!showFeedback) {
      return false;
    }
    for (const i in inputs) {
      if (runeMappingFn(props.exercise.runes[i]) !== inputs[i]) {
        return false;
      }
    }
    return true;
  }, [showFeedback, props, runeMappingFn]);

  // If the user requests feedback and they got everything right, `solved` should automatically be set to true.
  useEffect(
    () => {
      setUserAnswer(u => { return {
        ...u,
        solved: isSolved(u.inputs)
      };});
    },
    [showFeedback, isSolved]
  )

  function onSubmit(event) {
    event.preventDefault();
    setShowFeedback(true);
  }

  function toggleHelpModal(event) {
    event.preventDefault();
    helpModalRef.current.hidden = !helpModalRef.current.hidden;
  }

  return (
    <div className="ActiveTransliterationExercise">

      {/* Top bar */}
      <div className="ActiveExerciseTopBar">
        <button
          onClick={props.backToExerciseListFn}
          className="BackToListButton"
          data-testid="BackToListButton">
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
                        "symbol": runeMapping[rune],
                        "correct": runeMapping[rune] === userAnswer.inputs[index]
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
                  <li key={source}>
                    <a href={source}>{source}</a>
                  </li>
                )
              )
            }
          </ol>
        </div>
      }

      {/* Hints modal and button */}
      <div id="ActiveExerciseHelpContainer">

      {/* Modal */}
      <div
        id="ActiveExerciseHelpModal"
        ref={helpModalRef}
        hidden={true}
        data-testid="ActiveExerciseHelpModal">
        <div>
          <p>{props.runeRow.name}</p>
          <ul>
            {
              Object.entries(runeMapping).map((elem) =>
                <li
                  key={elem[0]}> {/* Just to silence some warnings. */}
                  {/* rune */}
                  {elem[0]}: 
                  {/* latin */}
                  {elem[1]}
                </li>)
            }
          </ul>
        </div>
      </div>

      {/* Help button */}
      <button
        id="ActiveExerciseToggleHelpButton"
        onClick={toggleHelpModal}>?</button>
      </div>

    </div>
  )
}

export default TransliterationExercise;