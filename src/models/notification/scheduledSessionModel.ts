// models/scheduledSession.model.ts
import mongoose from "mongoose";

const scheduledSessionSchema = new mongoose.Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  //I think we need to add studentId also here
  date: String,
  time: String,
  duration: Number,
}, { timestamps: true });

export default mongoose.model("ScheduledSession", scheduledSessionSchema);
