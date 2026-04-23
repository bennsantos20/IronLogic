import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  const [currentView, setCurrentView] = useState("login");
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("ironlogicCurrentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (currentUser) {
      setCurrentView("dashboard");
    }
  }, [currentUser]);

  const handleSignup = (name, email, password, setErrorMessage) => {
    const storedUsers = localStorage.getItem("ironlogicUsers");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      setErrorMessage("An account with that email already exists.");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem("ironlogicUsers", JSON.stringify(updatedUsers));
    localStorage.setItem("ironlogicCurrentUser", JSON.stringify(newUser));

    setCurrentUser(newUser);
    setCurrentView("dashboard");
  };

  const handleLogin = (email, password, setErrorMessage) => {
    const storedUsers = localStorage.getItem("ironlogicUsers");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const matchedUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!matchedUser) {
      setErrorMessage("Invalid email or password.");
      return;
    }

    localStorage.setItem("ironlogicCurrentUser", JSON.stringify(matchedUser));
    setCurrentUser(matchedUser);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("ironlogicCurrentUser");
    setCurrentUser(null);
    setCurrentView("login");
  };

  if (currentView === "signup") {
    return (
      <Signup
        onSignup={handleSignup}
        onSwitchToLogin={() => setCurrentView("login")}
      />
    );
  }

  if (currentView === "login" && !currentUser) {
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToSignup={() => setCurrentView("signup")}
      />
    );
  }

  return <Dashboard currentUser={currentUser} onLogout={handleLogout} />;
}

export default App;