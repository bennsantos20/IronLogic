import { useState } from "react";
import exerciseData from "./exerciseData";

function App() {
  const [days, setDays] = useState("");
  const [duration, setDuration] = useState("");
  const [goal, setGoal] = useState("");
  const [equipment, setEquipment] = useState("");

  const filteredExercises = exerciseData.filter(
  (exercise) => exercise.equipment === equipment
);

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log({
      days,
      duration,
      goal,
      equipment,
    });

    console.log(filteredExercises);

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
    </div>
  );
}

export default App;