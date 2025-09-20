import mongoose from "mongoose";

const DiarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      enum: ["positive", "negative", "neutral"],
      default: "neutral",
    },
  },
  { timestamps: true }
);

const Diary = mongoose.model("Diary", DiarySchema);
export default Diary;