const express = require("express");
const router = express.Router();
const Diary = require("../models/Diary");

// ➝ Create diary entry
router.post("/", async (req, res) => {
  try {
    const { content } = req.body;
    const newEntry = new Diary({ content });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➝ Get all diary entries
router.get("/", async (req, res) => {
  try {
    const entries = await Diary.find().sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
