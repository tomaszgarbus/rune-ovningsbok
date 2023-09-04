import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

function useSolvedExercises(): [
  /* isExerciseSolved */(exerciseId: string) => boolean,
  /* setExerciseSolved */(exerciseId: string) => void,
] {
  type SolvedExercisesSetType = Array<string>;
  const [solvedExercises, setSolvedExercises] = useState<SolvedExercisesSetType>([]);
  loadSolvedExercisesFromLocalStorage().then((value: string) => {
    if (value != solvedExercises.join(";")) {
      setSolvedExercises(value.split(";"));
    }
  });

  function isExerciseSolved(exerciseId: string): boolean {
    return solvedExercises.find(e => e === exerciseId) !== undefined;
  }

  async function updateLocalStorage(): Promise<void> {
    if (solvedExercises.length === 0) {
      return;
    }
    try {
      await AsyncStorage.setItem(
        "SolvedExercises",
        solvedExercises.join(';'));
    } catch (e) {
      // TODO: handle error
      console.log(e);
    }
  }

  async function loadSolvedExercisesFromLocalStorage(): Promise<string> {
    try {
      const stored_value = await AsyncStorage.getItem("SolvedExercises");
      return stored_value || "";
    } catch (e) {
      // TODO: handle error
      console.log(e);
      return "";
    }
  }

  function setExerciseSolved(exerciseId: string) {
    if (!isExerciseSolved(exerciseId)) {
      setSolvedExercises(solvedExercises.concat(exerciseId));
    }
  }

  useEffect(() => {
    try {
      updateLocalStorage();
    } catch (e) {
      // saving error
      console.log(e);
    }
  }, [solvedExercises])

  return [isExerciseSolved, setExerciseSolved];
}

export { useSolvedExercises };