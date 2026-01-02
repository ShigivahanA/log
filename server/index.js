import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import activityRoutes from "./routes/activityRoutes.js";

const app = express();

/* -----------------------------
   Middleware
------------------------------*/
app.use(cors());
app.use(express.json());

/* -----------------------------
   Routes
------------------------------*/
app.get("/", (req, res) => {
  res.json({ status: "Backend is running" });
});

app.use("/api/activities", activityRoutes);

/* -----------------------------
   DB Connection
------------------------------*/
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

/* -----------------------------
   EXPORT FOR VERCEL
------------------------------*/
export default app;
