import { useEffect, useState } from "react";
import exerciseData from "./exerciseData";

function App() {
  const [days, setDays] = useState("");
  const [duration, setDuration] = useState("");
  const [goal, setGoal] = useState("");
  const [equipment, setEquipment] = useState("");
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [workoutTitle, setWorkoutTitle] = useState("");
  
  const [savedWorkouts, setSavedWorkouts] = useState(() => {
    try {
    const storedWorkouts = localStorage.getItem("savedWorkouts");
    return storedWorkouts ? JSON.parse(storedWorkouts) : [];
  } catch (error) {
    return [];
  }
});

 

 

  const filteredExercises = exerciseData.filter(
  (exercise) => exercise.equipment === equipment
  );

const getSetsAndReps = () => {
  if (goal === "strength") {
    return "4 sets x 4-6 reps";
  }

  if (goal === "hypertrophy") {
    return "3 sets x 8-12 reps";
  }

  if (goal === "endurance") {
    return "2-3 sets x 15-20 reps";
  }

  return "3 sets x 8-10 reps";
};

const getExercisesPerDay = () => {
  if (duration === "30") {
    return 3;
  }

  if (duration === "45") {
    return 4;
  }

  if (duration === "60") {
    return 5;
  }

  return 4;
};

const groupExercisesByMuscle = () => {
  return {
    chest: filteredExercises.filter((exercise) => exercise.muscleGroup === "chest"),
    back: filteredExercises.filter((exercise) => exercise.muscleGroup === "back"),
    legs: filteredExercises.filter((exercise) => exercise.muscleGroup === "legs"),
    shoulders: filteredExercises.filter((exercise) => exercise.muscleGroup === "shoulders"),
    arms: filteredExercises.filter((exercise) => exercise.muscleGroup === "arms"),
    core: filteredExercises.filter((exercise) => exercise.muscleGroup === "core"),
  };
};

const getDayTemplates = () => {
  const numberOfDays = Number(days);

  if (numberOfDays === 2) {
    return [
      ["chest", "back", "shoulders", "arms"],
      ["legs", "core"],
    ];
  }

  if (numberOfDays === 3) {
    return [
      ["chest", "shoulders", "arms"],
      ["back", "arms", "core"],
      ["legs", "core"],
    ];
  }

  if (numberOfDays === 4) {
    return [
      ["chest", "shoulders", "arms"],
      ["back", "arms", "core"],
      ["legs", "core"],
      ["chest", "back", "shoulders", "arms"],
    ];
  }

  if (numberOfDays === 5) {
    return [
      ["chest"],
      ["back"],
      ["legs"],
      ["shoulders", "arms"],
      ["core", "chest", "back"],
    ];
  }

  return [ 
    ["chest", "back"],
    ["legs", "core"],
    ["shoulders", "arms"],
  ];
};

const getNextExercise = (muscleExercises, usedExerciseNames) => {
  const unusedExercises = muscleExercises.filter(
    (exercise) => !usedExerciseNames.includes(exercise.name)
  );

  if (unusedExercises.length > 0) {
    return unusedExercises[0];
  }

  return null;
};

const generateWorkoutPlan = () => {
  const numberOfDays = Number(days);
  const exercisesPerDay = getExercisesPerDay();
  const groupedExercises = groupExercisesByMuscle();
  const dayTemplates = getDayTemplates();

  if (!numberOfDays || filteredExercises.length === 0) {
    return [];
  }

  const plan = [];

  for (let i = 0; i < numberOfDays; i++) {
    plan.push({
      day: `Day ${i + 1}`,
      exercises: [],
    });
  }

  for (let dayIndex = 0; dayIndex < numberOfDays; dayIndex++) {
    const template = dayTemplates[dayIndex] || [];
    const usedExerciseNames = [];
    let safetyCounter = 0;

    while (
      plan[dayIndex].exercises.length < exercisesPerDay &&
      safetyCounter < 50
    ) {
      let addedExercise = false;

      for (let i = 0; i < template.length; i++) {
        const muscleGroup = template[i];
        const muscleExercises = groupedExercises[muscleGroup] || [];

        const chosenExercise = getNextExercise(
          muscleExercises,
          usedExerciseNames
        );

        if (chosenExercise) {
          plan[dayIndex].exercises.push({
            ...chosenExercise,
            prescription: getSetsAndReps(),
          });

          usedExerciseNames.push(chosenExercise.name);
          addedExercise = true;

          if (plan[dayIndex].exercises.length >= exercisesPerDay) {
            break;
          }
        }
      }

      if (!addedExercise) {
        break;
      }

      safetyCounter++;
    }

    while (plan[dayIndex].exercises.length < exercisesPerDay) {
      const fallbackExercise =
        filteredExercises[
          plan[dayIndex].exercises.length % filteredExercises.length
        ];

      plan[dayIndex].exercises.push({
        ...fallbackExercise,
        name: `${fallbackExercise.name} (Repeat)`,
        prescription: getSetsAndReps(),
      });
    }
  }

  return plan;
};

const handleSaveWorkout = () => {
  if (workoutPlan.length === 0) {
    return;
  }

  const newSavedWorkout = {
    id: Date.now().toString(),
    title: workoutTitle.trim()
      ? workoutTitle
      : `${days}-Day ${goal} Plan (${equipment})`,
    plan: workoutPlan,
  };

  const updatedWorkouts = [...savedWorkouts, newSavedWorkout];

  setSavedWorkouts(updatedWorkouts);
  localStorage.setItem("savedWorkouts", JSON.stringify(updatedWorkouts));
};

const handleDeleteWorkout = (id) => {
  console.log("Deleting workout with id:", id);

  const updatedWorkouts = savedWorkouts.filter((workout) => workout.id !== id);

  console.log("Updated workouts:", updatedWorkouts);

  setSavedWorkouts(updatedWorkouts);
  localStorage.setItem("savedWorkouts", JSON.stringify(updatedWorkouts));
};

const handleLoadWorkout = (savedWorkout) => {
  setWorkoutPlan(savedWorkout.plan);
  setErrorMessage("");
};

const handleReset = () => {
  setDays("");
  setDuration("");
  setGoal("");
  setEquipment("");
  setWorkoutPlan([]);
  setErrorMessage("");
  setWorkoutTitle("");
};

  const handleSubmit = (event) => {
  event.preventDefault();

  if (!days || !duration || !goal || !equipment) {
    setErrorMessage("Please complete all fields before generating a workout plan.");
    setWorkoutPlan([]);
    return;
  }

  setErrorMessage("");

  const generatedPlan = generateWorkoutPlan();

  console.log({
    days,
    duration,
    goal,
    equipment,
  });

  console.log(generatedPlan);

  setWorkoutPlan(generatedPlan);
};

  return (
    <div className="app">
      <h1>Workout Plan Generator</h1>
      <p>Enter your workout preferences below.</p>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form className="workout-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="days">Training Days Per Week</label>
          <select
            id="days"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          >
            <option value="">Select days</option>
            <option value="2">2 days</option>
            <option value="3">3 days</option>
            <option value="4">4 days</option>
            <option value="5">5 days</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="duration">Workout Duration</label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="">Select duration</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="goal">Goal</label>
          <select
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            <option value="">Select goal</option>
            <option value="strength">Strength</option>
            <option value="hypertrophy">Muscle Growth</option>
            <option value="endurance">Endurance</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="equipment">Equipment</label>
          <select
            id="equipment"
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
          >
            <option value="">Select equipment</option>
            <option value="full-gym">Full Gym</option>
            <option value="dumbbells">Dumbbells Only</option>
            <option value="bodyweight">Bodyweight Only</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="workoutTitle">Workout Title</label>
          <input
            id="workoutTitle"
            type="text"
            value={workoutTitle}
            onChange={(e) => setWorkoutTitle(e.target.value)}
            placeholder="Enter a name for this workout"
          />
        </div>

        <button type="submit">Generate Plan</button>
        <button type="button" onClick={handleSaveWorkout}>
          Save Workout
        </button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
        
      </form>

            {workoutPlan.length > 0 && (
        <div className="results">
          <h2>Your Workout Plan</h2>

          {workoutPlan.map((dayPlan) => (
            <div key={dayPlan.day} className="day-card">
              <h3>{dayPlan.day}</h3>
              <ul>
                {dayPlan.exercises.map((exercise) => (
                  <li key={exercise.name}>
                    {exercise.name} - {exercise.prescription}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {savedWorkouts.length > 0 && (
  <div className="results">
    <h2>Saved Workouts</h2>

    {savedWorkouts.map((savedWorkout) => (
      <div key={savedWorkout.id} className="day-card">
        <h3>{savedWorkout.title}</h3>

        <button type="button" onClick={() => handleLoadWorkout(savedWorkout)}>
          Load Workout
        </button>

        <button
          type="button"
          onClick={() => handleDeleteWorkout(savedWorkout.id)}
        >
          Delete Saved Workout
        </button>

        {savedWorkout.plan.map((dayPlan) => (
          <div key={dayPlan.day}>
            <h4>{dayPlan.day}</h4>
            <ul>
              {dayPlan.exercises.map((exercise, index) => (
                <li key={index}>
                  {exercise.name} - {exercise.prescription}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ))}
  </div>
)}

    </div>

    
  );
}

export default App;