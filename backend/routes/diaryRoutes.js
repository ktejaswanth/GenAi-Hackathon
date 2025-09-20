import express from "express";
import { analyzeAndSave, getEntries, updateEntry, deleteEntry } from "../controllers/diaryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, analyzeAndSave);
router.get("/", protect, getEntries);
router.put("/:id", protect, updateEntry);
router.delete("/:id", protect, deleteEntry);

export default router;