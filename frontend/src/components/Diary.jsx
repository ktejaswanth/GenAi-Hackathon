import React, { useState, useEffect } from "react";
import API from "../services/api";

export default function Diary() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Fetch diary entries
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await API.get("/diary");
        setEntries(res.data);
      } catch (error) {
        console.error("Error fetching diary:", error);
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
      setEntries([...entries, res.data]);
      setNewEntry("");
    } catch (error) {
      console.error("Error adding diary entry:", error);
    }
  };

  // Delete entry
  const handleDelete = async (id) => {
    try {
      await API.delete(`/diary/${id}`);
      setEntries(entries.filter((entry) => entry._id !== id));
    } catch (error) {
      console.error("Error deleting entry:", error);
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
      setEntries(entries.map((entry) => (entry._id === id ? res.data : entry)));
      setEditingId(null);
      setEditText("");
    } catch (error) {
      console.error("Error updating entry:", error);
    }
  };

  return (
    <div>
      <h2>My Diary</h2>

      {/* New entry form */}
      <form onSubmit={handleAddEntry}>
        <textarea
          placeholder="Write your thoughts..."
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
        />
        <br />
        <button type="submit">Add Entry</button>
      </form>

      {/* List entries */}
      <ul>
        {entries.map((entry) => (
          <li key={entry._id}>
            {editingId === entry._id ? (
              <>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <br />
                <button onClick={() => handleUpdate(entry._id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p>{entry.text}</p>
                <small>{new Date(entry.createdAt).toLocaleString()}</small>
                <br />
                <button onClick={() => handleEdit(entry._id, entry.text)}>Edit</button>
                <button onClick={() => handleDelete(entry._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
