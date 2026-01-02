import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    task: {
      type: String,
      required: true,
      trim: true,
    },
    hours: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", ActivitySchema);
