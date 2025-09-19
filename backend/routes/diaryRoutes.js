import express from "express";
import { createDiary, getDiaries, updateDiary, deleteDiary } from "../controllers/diaryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createDiary);
router.get("/", protect, getDiaries);
router.put("/:id", protect, updateDiary);
router.delete("/:id", protect, deleteDiary);

export default router;
