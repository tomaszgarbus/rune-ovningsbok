function RuneInput(props) {
  function feedbackClass() {
    if (!props.feedback) {
      return "";
    }
    return props.feedback.correct ? "Correct" : "Incorrect";
  }

  function feedbackSymbolsToString() {
    if (typeof(props.feedback.symbol) === 'string') {
      return props.feedback.symbol;
    }
    return props.feedback.symbol.join('/');
  }

  return (
    <div className={"SingleRuneInputDiv " + feedbackClass()} data-testid="single-rune-box">
      <p className={"SingleRuneOriginalSymbol " + feedbackClass()}>
        {props.runeSymbol}
      </p>
      <input
        id={"SingleRuneInputField" + props.index}
        type="text"
        className={"SingleRuneInputField " + feedbackClass()}
        onChange={props.onChange}
        onKeyDown={props.onKeyDown}
        maxLength={1}
        value={props.userInput}
        data-testid={"RuneInput" + props.index} />
      {props.feedback && !props.feedback.correct &&
        <p className={"SingleRuneFeedbackSymbol " + feedbackClass()} data-testid="symbol-feedback">
          {feedbackSymbolsToString()}
        </p>
      }
    </div>
  )
}

export default RuneInput;