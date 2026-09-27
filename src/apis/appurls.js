export const API_BASE_URL = "https://wger.de/api/v2/";

class AppUrls {
  constructor() {
    this.initUrls();
  }
  initUrls() {
    // get all exercises (language=2 is English)
    this.GET_ALL_EXERCISES = API_BASE_URL + "exerciseinfo/?language=2&limit=50";

    // get one exercise by ExerciseId
    this.GET_EXERCISE_BY_ID = (exerciseId) =>
      API_BASE_URL + `exerciseinfo/${exerciseId}/`;

    // get all muscles (for the muscle filter)
    this.GET_ALL_MUSCLES = API_BASE_URL + "muscle/";
  }
}

export default new AppUrls();
