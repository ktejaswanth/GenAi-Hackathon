import React, { useState } from "react";
import API from "../services/api";
import "../css/BreathingBubble.css";
import BreathingBubble from "./BreathingBubble.jsx"; // Import the new game

export default function FocusMonitor() {
  const [view, setView] = useState("menu");
  const [studyPlan, setStudyPlan] = useState("");
  const [relaxationText, setRelaxationText] = useState("");
  const [gameSuggestion, setGameSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState(25);

  const handleGenerateStudyPlan = async () => {
    setLoading(true);
    try {
      const res = await API.post("/genai/study-plan", { topic, duration });
      setStudyPlan(res.data.plan);
      setView("study");
    } catch (error) {
      alert("Failed to generate study plan.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRelaxationText = async () => {
    setLoading(true);
    try {
      const res = await API.get("/genai/relaxation-text");
      setRelaxationText(res.data.exercise);
      setView("relax");
    } catch (error) {
      alert("Failed to generate relaxation exercise.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // This function is called by the game component when it ends
  const handleGameEnd = async () => {
    setLoading(true);
    try {
      const res = await API.get("/genai/game-suggestion");
      setGameSuggestion(res.data.suggestion);
      setView("suggestion");
    } catch (error) {
      alert("Failed to get AI suggestion.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderView = () => {
    if (loading) {
      return <p>Generating content...</p>;
    }

    switch (view) {
      case "menu":
        return (
          <div className="menu-container">
            <h2>Focus & Relax</h2>
            <p>Choose an AI-guided tool to help you focus or take a break.</p>
            <button onClick={() => setView("study-input")}>Study Plan</button>
            <button onClick={handleGenerateRelaxationText}>Relaxation Exercise</button>
            <button onClick={() => setView("game")}>Play a Mini-Game</button>
          </div>
        );
      case "study-input":
        return (
          <div className="input-container">
            <h2>Study Plan</h2>
            <input
              type="text"
              placeholder="Enter topic (e.g., React hooks)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <button onClick={handleGenerateStudyPlan}>Generate Plan</button>
            <button onClick={() => setView("menu")}>Back</button>
          </div>
        );
      case "study":
        return (
          <div className="content-card">
            <h2>Your Study Plan</h2>
            <p className="ai-text">{studyPlan}</p>
            <button onClick={() => setView("menu")}>Back to Menu</button>
          </div>
        );
      case "relax":
        return (
          <div className="content-card">
            <h2>Relaxation Exercise</h2>
            <p className="ai-text">{relaxationText}</p>
            <button onClick={() => setView("menu")}>Back to Menu</button>
          </div>
        );
      case "game":
        // Render the new game component here
        return <BreathingBubble onGameEnd={handleGameEnd} />;
      case "suggestion":
        return (
          <div className="content-card">
            <h2>AI Suggestion</h2>
            <p className="ai-text">{gameSuggestion}</p>
            <button onClick={() => setView("menu")}>Back to Menu</button>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="focus-monitor">{renderView()}</div>;
}