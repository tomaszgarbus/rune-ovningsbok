function RuneInput(props) {
  return (
    <div className="RuneInputDiv">
      <p>{props.runeSymbol}</p>
      <input
        type="text"
        className="RuneInputField"
        onChange={props.onChange}
        maxLength={1} />
    </div>
  )
}

export default RuneInput;