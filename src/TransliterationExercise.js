import RuneInput from "./RuneInput";
import { useCallback, useEffect, useRef, useState } from "react";
import { IsSeparator, RuneRowToMapping } from './Utils';
import RuneSeparator from "./RuneSeparator";


function TransliterationExercise(props) {
  function loadUserAnswerIfExerciseIdMatches() {
    let loadedUserAnswer = window.sessionStorage.getItem('userAnswer');
    if (!loadedUserAnswer) {
      return null;
    }
    let parsedUserAnswer = JSON.parse(loadedUserAnswer);
    if (parsedUserAnswer.exerciseId === props.exercise.id) {
      return parsedUserAnswer;
    }
    return null;
  }

  const [userAnswer, setUserAnswer] = useState(
    loadUserAnswerIfExerciseIdMatches() ||
    {
      inputs: mapRunes(_ => ""),
      // "Ready" means "ready for checking". This is synonymous with "submit
      // button is unlocked".
      ready: false,
      // "Solved" means "checked and all inputs correct or corrected after hints".
      solved: false,
      // Read-only. This field is used to identify whether the userAnswer cached
      // in window.sessionStorage is for the current exercise.
      exerciseId: props.exercise.id,
    }
  )

  function setUserAnswerAndCacheInSessionStorage(newAnswer) {
    window.sessionStorage.setItem('userAnswer', JSON.stringify(newAnswer));
    setUserAnswer(newAnswer);
  }

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
    setUserAnswerAndCacheInSessionStorage({
      ...userAnswer,
      inputs: inputs,
      ready: isReady(inputs),
      solved: isSolved(inputs)
    });

    // Maybe move the cursor to the next input.
    // TODO: find a way to do it with Refs instead.
    let nextIndexToFocus = index;
    while (++nextIndexToFocus < inputs.length &&
      IsSeparator(props.exercise.runes[nextIndexToFocus]));
    if (nextIndexToFocus < inputs.length && inputs[index].length > 0) {
      document.getElementById("SingleRuneInputField" + (nextIndexToFocus)).focus();
    }
  }

  function isReady(inputs) {
    for (const [i, c] of inputs.entries()) {
      if (IsSeparator(props.exercise.runes[i])) continue;
      if (c === "") return false;
    }
    return true;
  }

  function isInputCorrect(input, groundTruth) {
    // TODO: better handling of undefined symbols.
    if (!groundTruth) {
      return false;
    }
    if (typeof(groundTruth) === 'string') {
      return input.toLowerCase() === groundTruth;
    } else {
      return groundTruth.includes(input.toLowerCase());
    }
  }

  const isSolved = useCallback((inputs) => {
    if (!showFeedback) {
      return false;
    }
    for (const i in inputs) {
      if (IsSeparator(props.exercise.runes[i])) continue;
      if (!isInputCorrect(inputs[i], runeMappingFn(props.exercise.runes[i]))) {
        return false;
      }
    }
    return true;
  }, [showFeedback, props, runeMappingFn]);

  // If the user requests feedback and they got everything right,
  // `solved` should automatically be set to true.
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

  // Runes can either be an array or a string.
  function mapRunes(fn) {
    if (typeof(props.exercise.runes) === 'string') {
      return props.exercise.runes.split('').map(fn);
    } else {
      return props.exercise.runes.map(fn);
    }
  }

  function maybeSeparateSymbols(str_or_arr) {
    if (typeof(str_or_arr) === 'string') {
      return str_or_arr;
    }
    return str_or_arr.join('/');
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
            mapRunes(
              (rune, index) => IsSeparator(rune) ?
                  <RuneSeparator
                    character={rune}
                    key={index}
                    />
                :
                  <RuneInput
                      index={index}
                      key={index}
                      runeSymbol={rune}
                      userInput={userAnswer.inputs[index]}
                      feedback={
                        showFeedback ?
                          {
                            "symbol": runeMapping[rune],
                            "correct": isInputCorrect(userAnswer.inputs[index], runeMapping[rune])
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
      { showFeedback && !userAnswer.solved &&
        <p className="ActiveExercisePromptToUseHints">
          Not quite! Please correct all the inputs according to the
          hints to read an explanation of the runic message.
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
                    <a href={source} target="_blank" rel="noreferrer">
                      {source}
                    </a>
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
                  {maybeSeparateSymbols(elem[1])}
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