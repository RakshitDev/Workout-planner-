import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getExerciseById } from "../apis/serverwrapper";
import "./ExerciseDetailScreen.css";

// wger's description is HTML ("<p>Lie on your back…</p>"): keep only the text.
// Safer than dangerouslySetInnerHTML, which would run any HTML the API sends.
const htmlToText = (html) =>
  new DOMParser().parseFromString(html ?? "", "text/html").body.textContent;

// "Glutes, Hamstrings" from an array of muscles
const muscleNames = (muscles) =>
  muscles.map((m) => m.name_en || m.name).join(", ");

// workouts + onAddExercise come from App, like on the list page
const ExerciseDetailScreen = ({ workouts, onAddExercise }) => {
  const { id } = useParams(); // "/exercise/9" → id = "9"
  const [exercise, setExercise] = useState(null); // null = not loaded yet
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExercise = async () => {
      try {
        const data = await getExerciseById(id);
        setExercise(data); // one object, not { results: [...] }
      } catch (error) {
        console.log("failed to load exercise", error);
        setError("Could not load this exercise.");
      } finally {
        setLoading(false);
      }
    };
    loadExercise();
  }, [id]); // run again if the id in the URL changes

  const backLink = (
    <Link to="/" className="details-back-link">
      <span aria-hidden="true">←</span>
      Back to exercises
    </Link>
  );

  // early returns: the code below only runs once exercise exists
  if (loading) {
    return (
      <div className="details-container">
        {backLink}
        <p className="details-status">Loading exercise…</p>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="details-container">
        {backLink}
        <p className="details-status">{error ?? "Exercise not found."}</p>
      </div>
    );
  }

  const english = exercise.translations.find((t) => t.language === 2);
  const title = english?.name ?? "Unnamed exercise";
  const description = htmlToText(english?.description);
  const imageUrl = exercise.images[0]?.image; // often empty
  const primary = muscleNames(exercise.muscles);
  const secondary = muscleNames(exercise.muscles_secondary);
  const equipment = exercise.equipment.map((e) => e.name).join(", ");
  const isAdded = workouts.some((w) => w.id === exercise.id);

  return (
    <div className="details-container">
      {backLink}

      {/* image on the left, info on the right */}
      <div className="main-grid-container">
        <div className="image-grid">
          {imageUrl ? (
            <img src={imageUrl} alt={title} />
          ) : (
            <span>No image available</span>
          )}
        </div>

        <div className="exercise-detail-grid">
          <h1 className="details-title">{title}</h1>

          {/* muscle / equipment tags: only shown when there is data */}
          <div className="details-tags">
            {primary && (
              <span className="details-tag details-tag-primary">
                Primary: {primary}
              </span>
            )}
            {secondary && (
              <span className="details-tag">Secondary: {secondary}</span>
            )}
            <span className="details-tag">
              Equipment: {equipment || "None"}
            </span>
          </div>

          <div className="details-section">
            <h2 className="details-subtitle">How to do it</h2>
            <p className="details-description">
              {description || "No description available."}
            </p>
          </div>

          {isAdded ? (
            <button className="details-add-btn btn-added" disabled>
              Added to my workout
            </button>
          ) : (
            <button
              className="details-add-btn btn-primary"
              onClick={() => onAddExercise(exercise)}
            >
              + Add to my workout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailScreen;
