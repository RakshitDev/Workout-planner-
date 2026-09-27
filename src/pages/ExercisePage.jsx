import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllExercises, getAllMuscles } from "../apis/serverwrapper";

// workouts + onAddExercise come from App (props), because the nav count in App needs the same list
const ExercisePage = ({ workouts, onAddExercise }) => {
  const [allExercises, setAllExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [muscleId, setMuscleId] = useState("");
  const [muscles, setMuscles] = useState([]);

  // loads all exercise
  useEffect(() => {
    const loadAllExercises = async () => {
      try {
        const data = await getAllExercises();
        const { results } = data;
        setAllExercises(results);
      } catch (error) {
        console.log("failed to get all the exercise--> ", error);
      } finally {
        setLoading(false);
      }
    };
    loadAllExercises();
  }, []);

  // loads all muscles (for the dropdown)
  useEffect(() => {
    const loadAllMuscles = async () => {
      try {
        const data = await getAllMuscles();
        const { results } = data;
        setMuscles(results);
      } catch (error) {
        console.log("error in loading the muscles ", error);
      }
    };
    loadAllMuscles();
  }, []);

  // filter the exercises based on the name and muscle
  const filteredExercises = allExercises.filter((exercise) => {
    const name =
      exercise.translations.find((t) => t.language === 2)?.name ?? "";

    const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle =
      muscleId === "" ||
      exercise.muscles.some((m) => m.id === Number(muscleId));

    return matchesSearch && matchesMuscle;
  });

  return (
    <>
      {loading && <p className="status-text">Loading exercises…</p>}
      {/* Search, muscle container */}
      <div className="search-section">
        {/* search container */}
        <div className="search-container">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="search"
            placeholder="Search exercises…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* muscle drop down selector  */}
        <div className="muscle-container">
          <label htmlFor="muscle">Muscle</label>
          <select
            id="muscle"
            value={muscleId}
            onChange={(e) => setMuscleId(e.target.value)}
          >
            <option value="">All muscles</option>
            {muscles.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name_en || m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* exercise cards */}
      <div className="exercise-list">
        {filteredExercises.map((exercise) => {
          // name lives in translations; language 2 = English
          const title =
            exercise.translations.find((t) => t.language === 2)?.name ??
            "Unnamed exercise";
          // ?. so an empty muscles/equipment array doesn't crash
          const muscle = exercise.muscles[0];
          const muscleName = muscle?.name_en || muscle?.name || "—";
          const equipment = exercise.equipment[0]?.name ?? "No equipment";

          const isAdded = workouts.some((w) => w.id === exercise.id);

          return (
            <article className="exercise-card" key={exercise.id}>
              <h3 className="exercise-title">{title}</h3>
              <p className="exercise-target-muscle">
                {muscleName} · {equipment}
              </p>
              <div className="exercise-card-actions">
                <Link className="btn-outline" to={`/exercise/${exercise.id}`}>
                  Details
                </Link>
                {isAdded ? (
                  <button className="btn-added" disabled>
                    Added
                  </button>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={() => onAddExercise(exercise)}
                  >
                    + Add
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
};

export default ExercisePage;
