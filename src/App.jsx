import { useState } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import ExercisePage from "./pages/ExercisePage";
import ExerciseDetailScreen from "./pages/ExerciseDetailScreen";
import "./App.css"; // global styles, loaded once here

const App = () => {
  const [workouts, setWorkouts] = useState([]);

  const handleAddExerciseBtn = (exercise) => {
    setWorkouts([...workouts, exercise]);
  };

  return (
    <main className="container">
      <div className="header-container">
        <h2 className="header-title">Workout Planner</h2>
        <nav className="nav-section">
          <ul>
            <li>
              <NavLink to="/" end className="nav-btn">
                Exercises
              </NavLink>
            </li>
            <li>
              <NavLink to="/workout" className="nav-btn">
                {workouts.length > 0
                  ? `My Workout (${workouts.length})`
                  : "My Workout"}
              </NavLink>
            </li>
            <li>
              <NavLink to="/timer" className="nav-btn">
                Timer
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* only this part changes when the URL changes; the header above stays */}
      <Routes>
        <Route
          path="/"
          element={
            <ExercisePage
              workouts={workouts}
              onAddExercise={handleAddExerciseBtn}
            />
          }
        />
        <Route
          path="/exercise/:id"
          element={
            <ExerciseDetailScreen
              workouts={workouts}
              onAddExercise={handleAddExerciseBtn}
            />
          }
        />
      </Routes>
    </main>
  );
};

export default App;
