import RuneInput from "./RuneInput";
import { useCallback, useEffect, useRef, useState } from "react";
import { IsSeparator, IsValidHttpUrl, RuneRowToMapping, GetCountryFlag } from './Utils';
import RuneSeparator from "./RuneSeparator";
import ActiveExerciseImage from "./ActiveExerciseImage";
import Keyboard from "./Keyboard";


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

  // Used to update the `display` property on the help modal.
  const helpModalRef = useRef(null);

  // TODO: This was created to silence warnings. Instead of this inefficient
  // function, runeMapping constant below should be made React-friendly so
  // that it's not recomputed on each re-render.
  const runeMappingFn = useCallback((rune) => {
    return RuneRowToMapping(props.runeRow)[rune];
  }, [props])

  const runeMapping = RuneRowToMapping(props.runeRow)

  function focusOnInput(inputIndex) {
    let element = document.getElementById(
      "SingleRuneInputField" + (inputIndex));
    element.focus();
    element.setSelectionRange(1, 1);
  }

  function maybeMoveToPreviousInput(current_index) {
    // TODO: find a way to do it with Refs instead.
    let previousIndexToFocus = current_index;
    while (--previousIndexToFocus >= 0 &&
      IsSeparator(props.exercise.runes[previousIndexToFocus]));
    if (previousIndexToFocus >= 0) {
      focusOnInput(previousIndexToFocus);
    }
  }

  function maybeMoveToNextInput(current_index) {
    const inputs = userAnswer.inputs;

    // TODO: find a way to do it with Refs instead.
    let nextIndexToFocus = current_index;
    while (++nextIndexToFocus < inputs.length &&
      IsSeparator(props.exercise.runes[nextIndexToFocus]));
    if (nextIndexToFocus < inputs.length) {
      focusOnInput(nextIndexToFocus);
    }
  }

  function updateUserAnswer(index, char) {
    const inputs = userAnswer.inputs;
    inputs[index] = char;
    setUserAnswerAndCacheInSessionStorage({
      ...userAnswer,
      inputs: inputs,
      solved: isSolved(inputs)
    });

    if (inputs[index].length === 1) {
      maybeMoveToNextInput(index);
    }
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
    for (const i in inputs) {
      if (IsSeparator(props.exercise.runes[i])) continue;
      if (!isInputCorrect(inputs[i], runeMappingFn(props.exercise.runes[i]))) {
        return false;
      }
    }
    return true;
  }, [props, runeMappingFn]);

  // If the user requests feedback and they got everything right,
  // `solved` should automatically be set to true.
  useEffect(
    () => {
      setUserAnswer(u => { return {
        ...u,
        solved: isSolved(u.inputs)
      };});
    },
    [isSolved]
  )

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

  function handleKeyDown(input_index, e) {
    if (e.keyCode === 37) {  // left arrow
      e.preventDefault();
      maybeMoveToPreviousInput(input_index);
    }
    if (e.keyCode === 39) {  // right arrow
      e.preventDefault();
      maybeMoveToNextInput(input_index);
    }
  }

  return (
    <div className="ActiveTransliterationExercise">

      {/* Top bar */}
      <div className="ActiveExerciseTopBar">
        <button
          onClick={props.backToExerciseListFn}
          className="BackToListButton"
          data-testid="BackToListButton"
          title="Back to exercises list">
          &#10094;
        </button>
        <h1 className="ActiveExerciseTitle">{props.exercise.title}</h1>
      </div>

      {/* Country of origin */}
      {
        props.exercise.country && 
        <p className="ActiveExerciseInfoBlock">
          <b>Country: </b> {GetCountryFlag(props.exercise.country)}
        </p>
      }

      {/* Row type */}
      <p className="ActiveExerciseInfoBlock">
        <b>Runic alphabet: </b> {props.runeRow.name}
      </p>

      {/* Description */}
      <p className="ActiveExerciseInfoBlock">
        <b>Description: </b>{props.exercise.description}
      </p>

      <hr/>

      {/* Image */}
      <ActiveExerciseImage exercise={props.exercise}/>

      <hr/>

      {/* User input */}
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
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    feedback={userAnswer.inputs[index].length > 0 ? {
                          "symbol": runeMapping[rune],
                          "correct": isInputCorrect(userAnswer.inputs[index], runeMapping[rune])
                    } : undefined}
                    onChange={event => updateUserAnswer(index, event.target.value)}
                  />
          )
        }
      </div>

      {/* Explanation after */}
      { userAnswer.solved &&
          <p className="ActiveExerciseInfoBlock">
            <b>Feedback: </b>{props.exercise.explanationAfter}
          </p>
        }
      { !userAnswer.solved &&
        <p className="ActiveExerciseInfoBlock">
          <b>Feedback: </b>
          Please fill all the inputs with correct transliterations
          to read an explanation of the runic message.
        </p>
      }

      <hr/>

      {/* Sources */}
      {props.exercise.sources &&
        <div className="ActiveExerciseInfoBlock">
          <b>Sources:</b>
          <ol>
            {
              props.exercise.sources.map(
                source => (
                  <li key={source}> {
                    // Display as link if it resembles a link.
                    // Display as plaintext otherwise.
                    IsValidHttpUrl(source)
                    ?
                    <a href={source} target="_blank" rel="noreferrer">
                      {source}
                    </a>
                    :
                    <span>{source}</span>
                  } </li>
                )
              )
            }
          </ol>
        </div>
      }

      {/* All things floating */}
      <div id="ActiveExerciseFloaties">
        <div id="ActiveExerciseFloatiesGrid">

          {/* Funny keys keyboard */}
          <Keyboard />

          {/* Hints modal and button */}
          <div id="ActiveExerciseHelpContainer">

            {/* Modal */}
            <div
              id="ActiveExerciseHelpModal"
              ref={helpModalRef}
              hidden={true}
              data-testid="ActiveExerciseHelpModal">
                <p id="ActiveExerciseHelpModalRuneRowName">
                  {props.runeRow.name}
                </p>
                <table id="HelpModalTable">
                  <tbody>
                    <tr>
                      {
                        Object.entries(runeMapping).map((elem) =>
                          // rune
                          <td key={elem[0]}>{elem[0]}</td>
                        )
                      }
                    </tr>
                    <tr>
                      {
                        Object.entries(runeMapping).map((elem) =>
                          // latin
                          <td key={elem[0]}>{maybeSeparateSymbols(elem[1])}</td>
                        )
                      }
                    </tr>
                  </tbody>
                </table>
            </div>

            {/* Help button */}
            <button
              id="ActiveExerciseToggleHelpButton"
              onClick={toggleHelpModal}
              title={"Show or hide a popup with hints - assumed " +
              "transliterations of runic symbols to latin alphabet."}
              >?</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransliterationExercise;