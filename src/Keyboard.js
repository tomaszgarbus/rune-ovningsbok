function Keyboard(props) {
  const funnyLetters = ["ä", "æ", "å", "ą", "ø", "ö", "ó", "þ", "ð", "ʀ", "Ʀ"];

  function onButtonClick(letter) {
    // https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-change-or-input-event-in-react-js-from-jquery-or
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, "value").set;
    nativeInputValueSetter.call(document.activeElement, letter);
    document.activeElement.dispatchEvent(
      new Event('input', { bubbles: true }));
  }

  return <div
      id="ActiveExerciseFunnyKeysKeyboard">
        {
          funnyLetters.map((letter) => {
            return <button
              className="VirtualKeyboardKeyButton"
              key={letter}
              onMouseDown={
                e => {
                  // This is needed to prevent the
                  // button from taking focus.
                  e.preventDefault();
                }
              }
              onClick={
                e => {
                  e.preventDefault();
                  onButtonClick(letter);
                }
              }
            >
              <span className="VirtualKeyboardKeyButtonText">
                {letter}
              </span>
            </button>;
          })
        }
    </div>
}

export default Keyboard;