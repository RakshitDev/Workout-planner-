import { useState, useEffect } from "react";
import { getAllExercises, getAllMuscles } from "./apis/serverwrapper";
import "./App.css";

function App() {
  const [workouts, setWorkouts] = useState([]);
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
        console.log(results);
        setAllExercises(results);
      } catch (error) {
        console.log("failed to get all the exercise--> ", error);
      } finally {
        setLoading(false);
      }
    };
    loadAllExercises();
  }, []);

  // loads all muscle exercise
  useEffect(() => {
    const loadAllMuscles = async () => {
      try {
        const data = await getAllMuscles();
        const { results } = data;
        setMuscles(results);
      } catch (error) {
        console.log("error in loadinf the muscle Exercise ", error);
      }
    };
    loadAllMuscles();
  }, []);

  // fitler the exercise based on the name and musle
  const filteredExercises = allExercises.filter((exercise) => {
    const name =
      exercise.translations.find((t) => t.language === 2)?.name ?? "";

    const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle =
      muscleId === "" ||
      exercise.muscles.some((m) => m.id === Number(muscleId));

    return matchesSearch && matchesMuscle;
  });

  const handleAddExerciseBtn = (exercise) => {
    setWorkouts([...workouts, exercise]);
  };

  return (
    <main className="container">
      {/* header container */}
      <div className="header-container">
        <h2 className="header-title">Workout Planner</h2>
        <nav className="nav-section">
          <ul>
            <li className="nav-btn active">Exercises</li>
            <li className="nav-btn">
              {workouts.length > 0
                ? `My Workout (${workouts.length})`
                : "My Workout"}
            </li>
            <li className="nav-btn">Timer</li>
          </ul>
        </nav>
      </div>
      {loading && <p className="status-text">Loading exercises…</p>}
      {/* Search,muscle contianer */}
      <div className="search-section">
        {/* search container */}
        <div className="search-container">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="search"
            placeholder="Serach Exercises ...."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></input>
        </div>
        {/* muscle drop down selector  */}
        <div className="muscle-container">
          <label htmlFor="muscle">Muscle</label>
          <select
            id="muscle"
            value={muscleId}
            onChange={(e) => setMuscleId(e.target.value)}
          >
            {muscles.map((m) => (
              <option
                key={m.id}
                value={m.id}
                onChange={(e) => setMuscleId(e.target.value)}
              >
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
                <button className="btn-outline">Details</button>
                {isAdded ? (
                  <button className="btn-added" disabled>
                    Added
                  </button>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={() => handleAddExerciseBtn(exercise)}
                  >
                    + Add
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}

export default App;
