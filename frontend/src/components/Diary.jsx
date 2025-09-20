import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ import for navigation
import API from "../services/api";
import "../css/Diary.css";

export default function Diary() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // ⬅️ hook for redirect

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // clear auth token
    navigate("/"); // redirect to HomePage
  };

  // Fetch diary entries
  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      try {
        const res = await API.get("/diary");
        // Sort newest first
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
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

  // Add new entry
  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    try {
      const res = await API.post("/diary", { text: newEntry });
      setEntries([res.data, ...entries]); // add on top
      setNewEntry("");
    } catch (err) {
      setError("Error adding diary entry.");
      console.error("Error adding diary entry:", err);
    }
  };

  // Delete entry
  const handleDelete = async (id) => {
    try {
      await API.delete(`/diary/${id}`);
      setEntries(entries.filter((entry) => entry._id !== id));
    } catch (err) {
      setError("Error deleting entry.");
      console.error("Error deleting entry:", err);
    }
  };

  // Start editing
  const handleEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  // Save edited entry
  const handleUpdate = async (id) => {
    try {
      const res = await API.put(`/diary/${id}`, { text: editText });
      setEntries(
        entries.map((entry) => (entry._id === id ? res.data : entry))
      );
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
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* New entry form */}
      <form onSubmit={handleAddEntry} className="new-entry-form">
        <textarea
          placeholder="Write your thoughts..."
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
        />
        <button type="submit">Add Entry</button>
      </form>

      {/* Feedback */}
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* Entries */}
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
                <small>{new Date(entry.createdAt).toLocaleString()}</small>
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
