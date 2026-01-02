import express from "express";
import Activity from "../models/Activity.js";

const router = express.Router();

// Get all activities
router.get("/", async (req, res) => {
  const data = await Activity.find().sort({ date: -1 });
  res.json(data);
});

// Add activity
router.post("/", async (req, res) => {
  const activity = await Activity.create(req.body);
  res.status(201).json(activity);
});

export default router;
