import mongoose from "mongoose";

const diarySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true }, // ✅ simplified: store just text
  },
  { timestamps: true }
);

export default mongoose.model("Diary", diarySchema);
