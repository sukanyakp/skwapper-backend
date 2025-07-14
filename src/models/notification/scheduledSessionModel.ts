// models/scheduledSession.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IScheduledSession extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  tutorId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  date: string;              // "2025-06-25"
  time: string;              // "15:00"
  duration: number;          // in minutes
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const scheduledSessionSchema = new Schema<IScheduledSession>(
  {
    tutorId: {
      type: Schema.Types.ObjectId,
      ref: "User", //TutorProfile
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      // required: true,
    },
    time: {
      type: String,
      // required: true,
    },
    duration: {
      type: Number,
      // required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IScheduledSession>(
  "ScheduledSession",
  scheduledSessionSchema
);
