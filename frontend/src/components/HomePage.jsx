import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (

      <div className="page-container">
        {/* Navbar */}
        <header className="navbar">
          <h1>📓 My Diary App</h1>
          <nav className="nav-links">
            <button onClick={() => navigate("/")}>Home</button>
            <button onClick={() => navigate("/login")}>Sign In</button>
            <button onClick={() => navigate("/register")}>Sign Up</button>
          </nav>
        </header>

        {/* About Section */}
        <section className="about">
          <h2>About</h2>
          <p>
            Keep track of your thoughts and memories with our simple diary app.
            Secure, private, and always accessible.
          </p>
        </section>

        {/* Footer */}
        <footer>
          <p>© 2025 My Diary App | Built with ❤️</p>
        </footer>
      </div>
  );
}
