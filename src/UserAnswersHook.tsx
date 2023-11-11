import { useState, useCallback, useEffect } from "react";

type ExerciseState = {
  inputs: Array<string>,
  solved: boolean,
};

function useUserAnswers(exerciseId: string, defaultState: ExerciseState) {
  // Creates the session storage key.
  const createKey: (() => string) = useCallback(() => {
    return "UserAnswer:" + exerciseId;
  }, [exerciseId]);

  const maybeLoadUserAnswerFromSessionStorage: (() => (ExerciseState | null))
    = useCallback(() => {
    let loadedUserAnswer = window.sessionStorage.getItem(createKey());
    if (!loadedUserAnswer) {
      return null;
    }
    let parsedUserAnswer = JSON.parse(loadedUserAnswer);
    return parsedUserAnswer;
  }, [createKey, exerciseId]);

  const [userAnswer, setUserAnswer] = useState<ExerciseState>(
    maybeLoadUserAnswerFromSessionStorage() || defaultState);

  useEffect(() => {
    let loadedAnswer = maybeLoadUserAnswerFromSessionStorage();
    if (loadedAnswer) {
      setUserAnswer(loadedAnswer);
    }
  }, [maybeLoadUserAnswerFromSessionStorage]);

  const updateSessionStorage: (() => void) = useCallback(() => {
    window.sessionStorage.setItem(createKey(), JSON.stringify(userAnswer));
  }, [userAnswer, createKey]);

  useEffect(() => {
    updateSessionStorage();
  }, [userAnswer, updateSessionStorage]);

  function resetUserAnswer(): void {
    setUserAnswer(defaultState);
  }

  return [userAnswer, setUserAnswer, resetUserAnswer];
}

export type { ExerciseState };
export { useUserAnswers };