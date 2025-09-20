import React, { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Diary from "./components/Diary";

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <div>
      {!user ? (
        <>
          <Register />
          <Login onLogin={setUser} />
        </>
      ) : (
        <>
          <h2>Welcome, {user.name}</h2>
          <button onClick={handleLogout}>Logout</button>
          <Diary />
        </>
      )}
    </div>
  );
}

export default App;
