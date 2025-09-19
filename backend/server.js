const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const diaryRoutes = require("./routes/diaryRoutes");  // ✅ no () here

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Correct usage
app.use("/api/diary", diaryRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error(err));
