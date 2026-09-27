import AppUrls from "./appurls";
import { doGetRequest } from "./fetchcalls";

// get all exercises
export const getAllExercises = async () => {
  const url = AppUrls.GET_ALL_EXERCISES;
  return await doGetRequest(url);
};

// get one exercise by ExerciseId
export const getExerciseById = async (exerciseId) => {
  const url = AppUrls.GET_EXERCISE_BY_ID(exerciseId);
  return await doGetRequest(url);
};

// get all muscles (for the muscle filter)
export const getAllMuscles = async () => {
  const url = AppUrls.GET_ALL_MUSCLES;
  return await doGetRequest(url);
};
