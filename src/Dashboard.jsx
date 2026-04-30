import { useState } from "react";
import exerciseData from "./exerciseData";
import "./App.css";



function Dashboard({ currentUser, onLogout }) {
  const [days, setDays] = useState("");
  const [duration, setDuration] = useState("");
  const [goal, setGoal] = useState("");
  const [equipment, setEquipment] = useState("");
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [workoutTitle, setWorkoutTitle] = useState("");
  const [focus, setFocus] = useState("");
  const [swapSelections, setSwapSelections] = useState({});
  const [swapOptions, setSwapOptions] = useState({});
  const [expandedSavedWorkouts, setExpandedSavedWorkouts] = useState({});

  const workoutStorageKey = currentUser
  ? `ironlogicWorkouts_${currentUser.email}`
  : "ironlogicWorkouts_guest";
  
  const [savedWorkouts, setSavedWorkouts] = useState(() => {
    try {
    const storedWorkouts = localStorage.getItem(workoutStorageKey);
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

const getProgressionGuidance = () => {
  if (goal === "strength") {
    return "If you complete all sets and reps with solid form, increase the weight slightly next week while keeping the same rep range.";
  }

  if (goal === "hypertrophy") {
    return "Try to add 1 to 2 reps to each exercise before increasing the weight. Once you reach the top of the rep range, raise the load slightly.";
  }

  if (goal === "endurance") {
    return "Focus on completing all reps with control. First add reps or reduce rest time, then increase resistance only when the current workload feels manageable.";
  }

  return "Use gradual overload over time by improving reps, control, or resistance while maintaining good technique.";
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

const getFocusMuscleGroups = () => {
  if (focus === "upper-body") {
    return ["chest", "back", "shoulders", "arms"];
  }

  if (focus === "lower-body") {
    return ["legs", "core"];
  }

  if (focus === "push") {
    return ["chest", "shoulders", "arms"];
  }

  if (focus === "pull") {
    return ["back", "arms"];
  }

  if (focus === "legs") {
    return ["legs", "core"];
  }

  return ["chest", "back", "legs", "shoulders", "arms", "core"];
};

const groupExercisesByMuscle = () => {
  const allowedMuscleGroups = getFocusMuscleGroups();

  return {
    chest: filteredExercises.filter(
      (exercise) =>
        exercise.muscleGroup === "chest" &&
        allowedMuscleGroups.includes("chest")
    ),
    back: filteredExercises.filter(
      (exercise) =>
        exercise.muscleGroup === "back" &&
        allowedMuscleGroups.includes("back")
    ),
    legs: filteredExercises.filter(
      (exercise) =>
        exercise.muscleGroup === "legs" &&
        allowedMuscleGroups.includes("legs")
    ),
    shoulders: filteredExercises.filter(
      (exercise) =>
        exercise.muscleGroup === "shoulders" &&
        allowedMuscleGroups.includes("shoulders")
    ),
    arms: filteredExercises.filter(
      (exercise) =>
        exercise.muscleGroup === "arms" &&
        allowedMuscleGroups.includes("arms")
    ),
    core: filteredExercises.filter(
      (exercise) =>
        exercise.muscleGroup === "core" &&
        allowedMuscleGroups.includes("core")
    ),
  };
};

const handleToggleSavedWorkout = (id) => {
  setExpandedSavedWorkouts((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
};

const getDayTemplates = () => {
  const numberOfDays = Number(days);

  if (focus === "upper-body") {
    if (numberOfDays === 2) {
      return [
        ["chest", "back", "shoulders"],
        ["arms", "chest", "back"],
      ];
    }

    return Array.from({ length: numberOfDays }, (_, index) =>
      index % 2 === 0
        ? ["chest", "back", "shoulders"]
        : ["arms", "chest", "back"]
    );
  }

  if (focus === "lower-body") {
    return Array.from({ length: numberOfDays }, (_, index) =>
      index % 2 === 0 ? ["legs", "core"] : ["legs", "core"]
    );
  }

  if (focus === "push") {
    return Array.from({ length: numberOfDays }, () => [
      "chest",
      "shoulders",
      "arms",
    ]);
  }

  if (focus === "pull") {
    return Array.from({ length: numberOfDays }, () => [
      "back",
      "arms",
      "core",
    ]);
  }

  if (focus === "legs") {
    return Array.from({ length: numberOfDays }, () => [
      "legs",
      "core",
    ]);
  }

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

const getPreferredExerciseOrder = (muscleExercises, currentDayExercises) => {
  const currentCompoundCount = currentDayExercises.filter(
    (exercise) => exercise.type === "compound"
  ).length;

  const currentIsolationCount = currentDayExercises.filter(
    (exercise) => exercise.type === "isolation"
  ).length;

  if (duration === "30") {
    const compounds = muscleExercises.filter(
      (exercise) => exercise.type === "compound"
    );
    const isolations = muscleExercises.filter(
      (exercise) => exercise.type === "isolation"
    );

    return [...compounds, ...isolations];
  }

  if (duration === "45") {
    if (currentCompoundCount < 2) {
      const compounds = muscleExercises.filter(
        (exercise) => exercise.type === "compound"
      );
      const isolations = muscleExercises.filter(
        (exercise) => exercise.type === "isolation"
      );

      return [...compounds, ...isolations];
    }

    return muscleExercises;
  }

  if (duration === "60") {
    if (currentCompoundCount <= currentIsolationCount) {
      const compounds = muscleExercises.filter(
        (exercise) => exercise.type === "compound"
      );
      const isolations = muscleExercises.filter(
        (exercise) => exercise.type === "isolation"
      );

      return [...compounds, ...isolations];
    }

    const isolations = muscleExercises.filter(
      (exercise) => exercise.type === "isolation"
    );
    const compounds = muscleExercises.filter(
      (exercise) => exercise.type === "compound"
    );

    return [...isolations, ...compounds];
  }

  return muscleExercises;
};

const getNextExercise = (
  muscleExercises,
  usedExerciseNames,
  currentDayExercises
) => {
  const orderedExercises = getPreferredExerciseOrder(
    muscleExercises,
    currentDayExercises
  );

  const unusedExercises = orderedExercises.filter(
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
          usedExerciseNames,
          plan[dayIndex].exercises
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

const generateSingleDayPlan = (dayIndex) => {
  const exercisesPerDay = getExercisesPerDay();
  const groupedExercises = groupExercisesByMuscle();
  const dayTemplates = getDayTemplates();
  const template = dayTemplates[dayIndex] || [];
  const dayExercises = [];
  const usedExerciseNames = [];
  let safetyCounter = 0;

  while (dayExercises.length < exercisesPerDay && safetyCounter < 50) {
    let addedExercise = false;

    for (let i = 0; i < template.length; i++) {
      const muscleGroup = template[i];
      const muscleExercises = groupedExercises[muscleGroup] || [];

      const orderedExercises = getPreferredExerciseOrder(
        muscleExercises,
        dayExercises
      );

      const availableExercises = orderedExercises.filter(
        (exercise) => !usedExerciseNames.includes(exercise.name)
      );

      if (availableExercises.length > 0) {
  const randomIndex = Math.floor(Math.random() * availableExercises.length);
  const chosenExercise = availableExercises[randomIndex];

        dayExercises.push({
          ...chosenExercise,
          prescription: getSetsAndReps(),
        });

        usedExerciseNames.push(chosenExercise.name);
        addedExercise = true;

        if (dayExercises.length >= exercisesPerDay) {
          break;
        }
      }
    }

    if (!addedExercise) {
      break;
    }

    safetyCounter++;
  }

  while (dayExercises.length < exercisesPerDay) {
    const fallbackExercise =
      filteredExercises[Math.floor(Math.random() * filteredExercises.length)];

    dayExercises.push({
      ...fallbackExercise,
      name: `${fallbackExercise.name} (Repeat)`,
      prescription: getSetsAndReps(),
    });
  }

  return {
    day: `Day ${dayIndex + 1}`,
    exercises: dayExercises,
  };
};

const normalizeExerciseName = (name) => {
  return name.replace(" (Repeat)", "");
};

const getSwapKey = (dayIndex, exerciseIndex) => {
  return `${dayIndex}-${exerciseIndex}`;
};

const getAvailableSwapExercises = (dayIndex, exerciseIndex) => {
  const currentExercise = workoutPlan[dayIndex]?.exercises[exerciseIndex];

  if (!currentExercise) {
    return [];
  }

  const currentExerciseName = normalizeExerciseName(currentExercise.name);

  const usedExerciseNames = workoutPlan[dayIndex].exercises.map((exercise) =>
    normalizeExerciseName(exercise.name)
  );

  const matchingExercises = exerciseData.filter((exercise) => {
    return (
      exercise.equipment === currentExercise.equipment &&
      exercise.muscleGroup === currentExercise.muscleGroup &&
      exercise.name !== currentExerciseName
    );
  });

  const uniqueOptions = matchingExercises.filter((exercise) => {
    return !usedExerciseNames.includes(exercise.name);
  });

  if (uniqueOptions.length > 0) {
    return uniqueOptions;
  }

  return matchingExercises;
};

const handleOpenSwap = (dayIndex, exerciseIndex) => {
  const key = getSwapKey(dayIndex, exerciseIndex);
  const availableOptions = getAvailableSwapExercises(dayIndex, exerciseIndex);

  setSwapOptions((prev) => ({
    ...prev,
    [key]: availableOptions,
  }));

  setSwapSelections((prev) => ({
    ...prev,
    [key]: "",
  }));
};

const handleSwapSelectionChange = (dayIndex, exerciseIndex, selectedName) => {
  const key = getSwapKey(dayIndex, exerciseIndex);

  setSwapSelections((prev) => ({
    ...prev,
    [key]: selectedName,
  }));
};

const handleConfirmSwap = (dayIndex, exerciseIndex) => {
  const key = getSwapKey(dayIndex, exerciseIndex);
  const selectedExerciseName = swapSelections[key];

  if (!selectedExerciseName) {
    return;
  }

  const selectedExercise = swapOptions[key]?.find(
    (exercise) => exercise.name === selectedExerciseName
  );

  if (!selectedExercise) {
    return;
  }

  const updatedWorkoutPlan = [...workoutPlan];
  const currentExercise = updatedWorkoutPlan[dayIndex].exercises[exerciseIndex];

  updatedWorkoutPlan[dayIndex].exercises[exerciseIndex] = {
    ...selectedExercise,
    prescription: currentExercise.prescription,
  };

  setWorkoutPlan(updatedWorkoutPlan);

  setSwapOptions((prev) => {
    const updated = { ...prev };
    delete updated[key];
    return updated;
  });

  setSwapSelections((prev) => {
    const updated = { ...prev };
    delete updated[key];
    return updated;
  });
};

const handleCancelSwap = (dayIndex, exerciseIndex) => {
  const key = getSwapKey(dayIndex, exerciseIndex);

  setSwapOptions((prev) => {
    const updated = { ...prev };
    delete updated[key];
    return updated;
  });

  setSwapSelections((prev) => {
    const updated = { ...prev };
    delete updated[key];
    return updated;
  });
};

const handleSaveWorkout = () => {
  if (workoutPlan.length === 0) {
    return;
  }

  const newSavedWorkout = {
    id: Date.now().toString(),
    title: workoutTitle.trim()
      ? workoutTitle
      : `${days}-Day ${goal} Plan (${equipment}, ${focus})`,
    plan: workoutPlan,
    focus,
  };

  const updatedWorkouts = [...savedWorkouts, newSavedWorkout];

  setSavedWorkouts(updatedWorkouts);
  localStorage.setItem(workoutStorageKey, JSON.stringify(updatedWorkouts));
};

const handleRegenerateDay = (dayIndex) => {
  const updatedWorkoutPlan = [...workoutPlan];
  updatedWorkoutPlan[dayIndex] = generateSingleDayPlan(dayIndex);

  setWorkoutPlan(updatedWorkoutPlan);

  setSwapSelections((prev) => {
    const updated = { ...prev };

    Object.keys(updated).forEach((key) => {
      if (key.startsWith(`${dayIndex}-`)) {
        delete updated[key];
      }
    });

    return updated;
  });

  setSwapOptions((prev) => {
    const updated = { ...prev };

    Object.keys(updated).forEach((key) => {
      if (key.startsWith(`${dayIndex}-`)) {
        delete updated[key];
      }
    });

    return updated;
  });
};

const handleDeleteWorkout = (id) => {
  console.log("Deleting workout with id:", id);

  const updatedWorkouts = savedWorkouts.filter((workout) => workout.id !== id);

  console.log("Updated workouts:", updatedWorkouts);

  setSavedWorkouts(updatedWorkouts);
  localStorage.setItem(workoutStorageKey, JSON.stringify(updatedWorkouts));
};

const handleLoadWorkout = (savedWorkout) => {
  setWorkoutPlan(savedWorkout.plan);
  setFocus(savedWorkout.focus || "");
  setErrorMessage("");
  setSwapSelections({});
  setSwapOptions({});
};

const handlePrintWorkout = () => {
  window.print();
};

const handleReset = () => {
  setDays("");
  setDuration("");
  setGoal("");
  setEquipment("");
  setWorkoutPlan([]);
  setErrorMessage("");
  setWorkoutTitle("");
  setFocus("");
  setSwapSelections({});
  setSwapOptions({});
};

const handleSubmit = (event) => {
  event.preventDefault();

  if (!days || !duration || !goal || !equipment || !focus) {
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
  setSwapSelections({});
  setSwapOptions({});
};

  return (
    <div className="app">
      <div className="hero">
      <div className="hero-copy">
      <div className="hero-badge">IronLogic</div>
      <h1>Build Smarter Training Plans</h1>
      <p>
        Build your weekly workouts using IronLogic, a rule based generator that creates
        weekly plans based on your training days, duration, equipment, goal, and workout
        focus.
      </p>
    </div>

<div className="hero-stats">
  <div className="stat-card">
    <span>Features</span>
    <strong>Smart Generation</strong>
  </div>
  <div className="stat-card">
    <span>Editing</span>
    <strong>Swap + Regenerate</strong>
  </div>
  <div className="stat-card">
    <span>User</span>
    <strong>{currentUser?.name || "Athlete"}</strong>
  </div>
  <div className="stat-card">
    <span>Account</span>
    <button type="button" onClick={onLogout}>
      Logout
    </button>
  </div>
</div>
</div>

    <div className="main-grid">


      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="panel form-panel">
        <div className="panel-header">
        <h2>Plan Builder</h2>
        <p>
          Select your training preferences and generate a workout plan that fits
          your available time, equipment, and training focus.
        </p>
      </div>

      <form className="workout-form" onSubmit={handleSubmit}>
        <div className="form-grid">

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
          <label htmlFor="focus">Workout Focus</label>
          <select
            id="focus"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
          >
            <option value="">Select focus</option>
            <option value="full-body">Full Body</option>
            <option value="upper-body">Upper Body</option>
            <option value="lower-body">Lower Body</option>
            <option value="push">Push</option>
            <option value="pull">Pull</option>
            <option value="legs">Legs</option>
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

        </div>

       <div className="button-row">
        <button type="submit">Generate Plan</button>
        <button type="button" onClick={handleSaveWorkout}>
          Save Workout
        </button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </div>
        
      </form>
      </div>
      <div className="content-column">

      {workoutPlan.length === 0 && (
  <div className="panel results">
    <h2 className="section-title">Generated Workout</h2>
    <div className="empty-state">
      Your generated workout will appear here after you choose your preferences
      and click <strong>Generate Plan</strong>.
    </div>
  </div>
)}

{workoutPlan.length > 0 && (
  <div className="results">
    <div className="day-card-header">
      <h2 className="section-title">Your Workout Plan</h2>
      <button type="button" onClick={handlePrintWorkout}>
       Print Workout
      </button>
    </div>

    {workoutPlan.map((dayPlan, dayIndex) => (
      <div key={dayPlan.day} className="day-card">
        <div className="day-card-header">
          <h3>{dayPlan.day}</h3>
          <button
            type="button"
            onClick={() => handleRegenerateDay(dayIndex)}
          >
            Regenerate Day
          </button>
        </div>

        <ul>
          {dayPlan.exercises.map((exercise, exerciseIndex) => {
            const swapKey = getSwapKey(dayIndex, exerciseIndex);
            const currentSwapOptions = swapOptions[swapKey] || [];

            return (
              <li key={`${exercise.name}-${exerciseIndex}`}>
                <div className="exercise-row">
                  <div className="exercise-main">
                    <div className="exercise-name">
                      {exercise.name} — {exercise.prescription}
                    </div>

                    <div className="exercise-meta">
                      <span className="exercise-tag">{exercise.muscleGroup}</span>
                      <span className="exercise-tag">{exercise.type}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenSwap(dayIndex, exerciseIndex)}
                  >
                    Swap
                  </button>
              </div>

                {swapOptions[swapKey] && (
                  <div className="swap-controls">
                    <select
                      value={swapSelections[swapKey] || ""}
                      onChange={(e) =>
                        handleSwapSelectionChange(
                          dayIndex,
                          exerciseIndex,
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select replacement</option>
                      {currentSwapOptions.map((option) => (
                        <option key={option.name} value={option.name}>
                          {option.name}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleConfirmSwap(dayIndex, exerciseIndex)}
                    >
                      Confirm
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCancelSwap(dayIndex, exerciseIndex)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    ))}

    <div className="saved-workout-day">
      <h4>Progression Guidance</h4>
      <p>{getProgressionGuidance()}</p>
    </div>
    
  </div>
)}

      {savedWorkouts.length > 0 && (
        <div className="panel results">
          <h2 className="section-title">Saved Workouts</h2>

          {savedWorkouts.map((savedWorkout) => (
            <div key={savedWorkout.id} className="day-card">
             <div className="saved-workout-title-row">
              <h3>{savedWorkout.title}</h3>
              <span className="saved-workout-badge">Saved Plan</span>
            </div>

            <button
              type="button"
              onClick={() => handleToggleSavedWorkout(savedWorkout.id)}
            >
              {expandedSavedWorkouts[savedWorkout.id] ? "Hide Details" : "Show Details"}
            </button>

              <div className="saved-workout-actions">
                  <button
              type="button"
              onClick={() => handleToggleSavedWorkout(savedWorkout.id)}
            >
              {expandedSavedWorkouts[savedWorkout.id] ? "Hide Details" : "Show Details"}
            </button>
                <button
                  type="button"
                  onClick={() => handleLoadWorkout(savedWorkout)}
                >
                  Load Workout
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteWorkout(savedWorkout.id)}
                >
                  Delete Saved Workout
                </button>
              </div>
            
              {expandedSavedWorkouts[savedWorkout.id] &&
                savedWorkout.plan.map((dayPlan) => (
                  <div key={dayPlan.day} className="saved-workout-day">
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
  </div>
</div>
  );
}

export default Dashboard;