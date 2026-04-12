import { useState } from "react";
import exerciseData from "./exerciseData";

function App() {
  const [days, setDays] = useState("");
  const [duration, setDuration] = useState("");
  const [goal, setGoal] = useState("");
  const [equipment, setEquipment] = useState("");
  const [workoutPlan, setWorkoutPlan] = useState([]);

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
    let exerciseCount = 0;
    let templatePosition = 0;

    while (exerciseCount < exercisesPerDay && template.length > 0) {
      const muscleGroup = template[templatePosition % template.length];
      const muscleExercises = groupedExercises[muscleGroup] || [];

      if (muscleExercises.length > 0) {
        const chosenExercise =
          muscleExercises[exerciseCount % muscleExercises.length];

        plan[dayIndex].exercises.push({
          ...chosenExercise,
          name:
            plan[dayIndex].exercises.some(
              (exercise) => exercise.name === chosenExercise.name
            )
              ? `${chosenExercise.name} (Repeat)`
              : chosenExercise.name,
          prescription: getSetsAndReps(),
        });

        exerciseCount++;
      }

      templatePosition++;
    }
  }

  return plan;
};

  const handleSubmit = (event) => {
  event.preventDefault();

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

        <button type="submit">Generate Plan</button>
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


    </div>

    
  );
}

export default App;