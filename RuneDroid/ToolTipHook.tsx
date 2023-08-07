import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Arguments:
// * key -- used for saving state in local storage,
// * count -- number of tool tips.
// Returns:
// * a state variable of type number, representing the current
//   tooltip number,
// * a function which could adequately be named "nextTooltip".
// When the last tooltip is reached, nextTooltip closes the only
// visible tool tip.
function useToolTips(key: string, count: number): [
  /*currentToolTipNumber */number,
  /*nextTooltip: */() => void
] {
  const loadedToolTipNumber = await loadCurrentToolTipNumberFromLocalStorage();
  const [currentToolTipNumber, setCurrentToolTipNumber] = useState<number>(
    
  );

  async function updateLocalStorage(value: number) {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (e) {
      // TODO: handle error
    }
  }

  async function loadCurrentToolTipNumberFromLocalStorage(): Promise<number> {
    try {
      const stored_value = await AsyncStorage.getItem(key);
      return +(stored_value || "0")
    } catch (e) {
      // TODO: handle error
      return 0;
    }
  };

  useEffect(async () => {
    try {
      await AsyncStorage.setItem(key, currentToolTipNumber);
    } catch (e) {
      // saving error
    }
  }, [currentToolTipNumber]);

  return [
    currentToolTipNumber,
    () => {
      setCurrentToolTipNumber(currentToolTipNumber + 1)
    }
  ]
}

export { useToolTips };