import TransliterationExercise from './TransliterationExercise';
import './App.css';

function App() {
  const runeMapping = {
    "ᛞ": "d",
    "ᚱ": "r",
    "ᛁ": "i",
    "ᚠ": "f"
  }

  return (
    <div className="App">
      <TransliterationExercise
        runes={["ᛞ", "ᚱ", "ᛁ", "ᚠ"]}
        runeMapping={runeMapping} />
    </div>
  );
}

export default App;
