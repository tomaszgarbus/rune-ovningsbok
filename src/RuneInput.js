function RuneInput(props) {
  function feedbackClass() {
    if (!props.feedback) {
      return "";
    }
    return props.feedback.correct ? "Correct" : "Incorrect";
  }

  return (
    <div className={"SingleRuneInputDiv " + feedbackClass()}>
      <p className={"SingleRuneOriginalSymbol " + feedbackClass()}>
        {props.runeSymbol}
      </p>
      <input
        type="text"
        className={"RuneInputField " + feedbackClass()}
        onChange={props.onChange}
        maxLength={1} />
      {props.feedback && 
        <p className={"SingleRuneFeedbackSymbol " + feedbackClass()}>
          {props.feedback.symbol}
        </p>
      }
    </div>
  )
}

export default RuneInput;