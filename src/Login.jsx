import { useState } from "react";
import "./App.css";

function Login({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    onLogin(email, password, setErrorMessage);
  };

  return (
    <div className="app">
      <div className="hero">
        <div className="hero-copy">
          <div className="hero-badge">IronLogic</div>
          <h1>Welcome Back</h1>
          <p>
            Log in to access your personalized workout planner and saved training
            plans.
          </p>
        </div>
      </div>

      <div className="main-grid">
        <div className="panel form-panel">
          <div className="panel-header">
            <h2>Login</h2>
            <p>Enter your account details to continue.</p>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <form className="workout-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="loginEmail">Email</label>
              <input
                id="loginEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <input
                id="loginPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <div className="button-row">
              <button type="submit">Login</button>
              <button type="button" onClick={onSwitchToSignup}>
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;