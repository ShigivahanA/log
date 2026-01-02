import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import activityRoutes from "./routes/activityRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/api/activities", activityRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
