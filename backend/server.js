import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import diaryRoutes from "./routes/diaryRoutes.js";


dotenv.config();
const app = express();
//import diaryRoutes from "./routes/diaryRoutes.js";
app.use("/api/diaries", diaryRoutes);

// after app.use("/api/auth", authRoutes);


app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// DB & Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.log(err));
