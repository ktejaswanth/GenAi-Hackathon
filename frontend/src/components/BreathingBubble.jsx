import React, { useEffect, useState } from "react";
import "../css/BreathingBubble.css";

export default function BreathingBubble({ onGameEnd }) {
  const [phase, setPhase] = useState("breathe in...");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("breathe out...");
    }, 4000); // Change to exhale after 4 seconds

    const redirectTimer = setTimeout(() => {
      onGameEnd(); // Call the function to get AI suggestion and redirect
    }, 10000); // Game ends after 10 seconds

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, [onGameEnd]);

  return (
    <div className="breathing-bubble-container">
      <div className={`breathing-bubble ${phase === "breathe in..." ? "grow" : "shrink"}`}>
        <p className="bubble-text">{phase}</p>
      </div>
    </div>
  );
}