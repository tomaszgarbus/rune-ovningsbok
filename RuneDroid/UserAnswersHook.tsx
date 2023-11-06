import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExerciseState } from "./Types";

function useUserAnswers(exerciseId: string, defaultState: ExerciseState): [
  /* userAnswer */ExerciseState,
  /* setUserAnswer */(answer: ExerciseState) => void,
  /* resetUserAnswer */() => void
] {
  const [userAnswer, setUserAnswer] = useState<ExerciseState>(defaultState);
  useEffect(() => {
    retrieveUserAnswerFromLocalStorage().then((value: ExerciseState | null) => {
      if (value !== null && value.index !== userAnswer.index) {
        setUserAnswer(value);
      }
    });
  }, []);

  useEffect(() => {
    updateLocalStorage(userAnswer);
  }, [userAnswer]);

  function createKey(exerciseId: string) {
    return "ExerciseState:" + exerciseId;
  } 

  async function updateLocalStorage(
    state: ExerciseState): Promise<void> {
    try {
      await AsyncStorage.setItem(
        createKey(exerciseId),
        JSON.stringify(state)
      )
    } catch (e) {
      // TODO: handle error
      console.log(e);
    }
  }

  async function retrieveUserAnswerFromLocalStorage(): Promise<ExerciseState | null> {
    try {
      const storedValue = await AsyncStorage.getItem(
        createKey(exerciseId));
      if (storedValue) {
        return JSON.parse(storedValue);
      } else {
        return null;
      }
    } catch (e) {
      // TODO: handle error
      console.log(e);
      return null;
    }
  }

  function resetUserAnswer(): void {
    setUserAnswer(defaultState);
  }

  return [userAnswer, setUserAnswer, resetUserAnswer];
}

export { useUserAnswers };