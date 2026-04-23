import { useState } from "react";
import "./App.css";

function Signup({ onSignup, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name || !email || !password) {
      setErrorMessage("Please complete all fields.");
      return;
    }

    onSignup(name, email, password, setErrorMessage);
  };

  return (
    <div className="app">
      <div className="hero">
        <div className="hero-copy">
          <div className="hero-badge">IronLogic</div>
          <h1>Create Your Account</h1>
          <p>
            Sign up to save your workouts, return to your plans later, and build
            a more personalized training experience.
          </p>
        </div>
      </div>

      <div className="main-grid">
        <div className="panel form-panel">
          <div className="panel-header">
            <h2>Sign Up</h2>
            <p>Create an account to start using IronLogic.</p>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <form className="workout-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="signupName">Name</label>
              <input
                id="signupName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="signupEmail">Email</label>
              <input
                id="signupEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="signupPassword">Password</label>
              <input
                id="signupPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
            </div>

            <div className="button-row">
              <button type="submit">Sign Up</button>
              <button type="button" onClick={onSwitchToLogin}>
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;