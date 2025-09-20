import Diary from "../models/Diary.js";

// Create Entry
export const createDiary = async (req, res) => {
  try {
    const { text } = req.body;
    const newDiary = new Diary({
      user: req.user.id,
      text,
    });
    await newDiary.save();
    res.status(201).json(newDiary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Entries (only for logged-in user)
export const getDiaries = async (req, res) => {
  try {
    const diaries = await Diary.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(diaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Entry
export const updateDiary = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Diary.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { text: req.body.text },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Diary not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Entry
export const deleteDiary = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Diary.findOneAndDelete({ _id: id, user: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Diary not found" });
    res.json({ message: "Diary deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
