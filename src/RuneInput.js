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
      {props.feedback && !props.feedback.correct &&
        <p className={"SingleRuneFeedbackSymbol" + feedbackClass()} data-testid="symbol-feedback">
          {props.feedback.symbol}
        </p>
      }
    </div>
  )
}

export default RuneInput;