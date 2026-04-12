function App() {
  return (
    <div className="app">
      <h1>Workout Plan Generator</h1>
      <p>Enter your workout preferences below.</p>

      <form className="workout-form">
        <div className="form-group">
          <label htmlFor="days">Training Days Per Week</label>
          <select id="days">
            <option value="">Select days</option>
            <option value="2">2 days</option>
            <option value="3">3 days</option>
            <option value="4">4 days</option>
            <option value="5">5 days</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="duration">Workout Duration</label>
          <select id="duration">
            <option value="">Select duration</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="goal">Goal</label>
          <select id="goal">
            <option value="">Select goal</option>
            <option value="strength">Strength</option>
            <option value="hypertrophy">Muscle Growth</option>
            <option value="endurance">Endurance</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="equipment">Equipment</label>
          <select id="equipment">
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