import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <div className="page-container">
        <header className="navbar">
          <h1>
            <span role="img" aria-label="notebook emoji">📓</span> My Diary App
          </h1>
          <nav className="nav-links">
            <button onClick={() => navigate("/login")}>Sign In</button>
            <button onClick={() => navigate("/register")}>Sign Up</button>
          </nav>
        </header>
        <section className="about">
          <h2>About</h2>
          <p>
            Keep track of your thoughts and memories with our simple diary app.
            Secure, private, and always accessible.
          </p>
        </section>
        <footer>
          <p>© 2025 My Diary App | Built with ❤️</p>
        </footer>
      </div>
    </div>
  );
}