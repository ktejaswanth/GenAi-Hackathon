import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chart from 'chart.js/auto'; 
import API from "../services/api";
import "../css/Diary.css";

export default function Diary() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showGraph, setShowGraph] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const navigate = useNavigate();

  const getMoodEmoji = (score) => {
    if (score >= 0.5) return '😊';
    if (score > 0.1) return '😀';
    if (score >= -0.1 && score <= 0.1) return '😐';
    if (score < -0.1 && score > -0.5) return '😟';
    return '😔';
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const renderGraph = (data) => {
    if (!chartRef.current || !data || data.length === 0) return;
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(entry => new Date(entry.date).toLocaleDateString()),
        datasets: [{
          label: 'Sentiment Score',
          data: data.map(entry => entry.sentiment.score),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.1,
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
            min: -1,
            max: 1,
            title: {
              display: true,
              text: 'Sentiment Score'
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  };

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      try {
        const res = await API.get("/diary");
        const sorted = res.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setEntries(sorted);
      } catch (err) {
        setError("Error fetching diary entries.");
        console.error("Error fetching diary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  useEffect(() => {
    if (showGraph && entries.length > 0) {
      renderGraph(entries);
    }
  }, [showGraph, entries]);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    try {
      const res = await API.post("/diary", { text: newEntry });
      const newEntriesList = [res.data.entry, ...entries];
      setEntries(newEntriesList);
      setNewEntry("");
    } catch (err) {
      setError("Error adding diary entry.");
      console.error("Error adding diary entry:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/diary/${id}`);
      const updatedEntries = entries.filter((entry) => entry._id !== id);
      setEntries(updatedEntries);
    } catch (err) {
      setError("Error deleting entry.");
      console.error("Error deleting entry:", err);
    }
  };

  const handleEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleUpdate = async (id) => {
    try {
      const res = await API.put(`/diary/${id}`, { text: editText });
      const updatedEntries = entries.map((entry) => (entry._id === id ? res.data.entry : entry));
      setEntries(updatedEntries);
      setEditingId(null);
      setEditText("");
    } catch (err) {
      setError("Error updating entry.");
      console.error("Error updating entry:", err);
    }
  };

  return (
    <div className="diary-container">
      <div className="diary-header">
        <h2>My Diary</h2>
        <div className="header-actions">
          {/* Add a button to navigate to the Focus & Relax page */}
          <button className="focus-btn" onClick={() => navigate("/focus")}>
            Focus & Relax
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <form onSubmit={handleAddEntry} className="new-entry-form">
        <textarea
          placeholder="Write your thoughts..."
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
        />
        <button type="submit">Add Entry</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      
      <div className="graph-container">
        <h3>Sentiment Analysis</h3>
        <button onClick={() => setShowGraph(!showGraph)}>
          {showGraph ? "Hide Graph" : "Show Graph"}
        </button>
        {showGraph && <canvas ref={chartRef} className="sentiment-graph"></canvas>}
      </div>

      <ul className="entries-list">
        {entries.map((entry) => (
          <li key={entry._id} className="entry">
            {editingId === entry._id ? (
              <div className="edit-box">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => handleUpdate(entry._id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <div className="entry-content">
                <p>{entry.text}</p>
                <div className="entry-meta">
                  <small>{new Date(entry.date).toLocaleString()}</small>
                  {entry.sentiment && (
                    <span className="sentiment-emoji">
                      {getMoodEmoji(entry.sentiment.score)}
                    </span>
                  )}
                </div>
                <div className="entry-actions">
                  <button onClick={() => handleEdit(entry._id, entry.text)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(entry._id)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}