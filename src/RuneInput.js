function RuneInput(props) {
  return (
    <div className="SingleRuneInputDiv">
      <p className="SingleRuneOriginalSymbol">{props.runeSymbol}</p>
      <input
        type="text"
        className="RuneInputField"
        onChange={props.onChange}
        maxLength={1} />
    </div>
  )
}

export default RuneInput;