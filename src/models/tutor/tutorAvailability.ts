

import mongoose, { Document, Types } from "mongoose";

export interface ITutorAvailability extends Document {
  tutorId: Types.ObjectId;
  day: string; // e.g. "Monday"
  startTime: string; // e.g. "18:00"
  endTime: string;   // e.g. "20:00"
}

const availabilitySchema = new mongoose.Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TutorProfile",
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  }
});

const TutorAvailability = mongoose.model("TutorAvailability", availabilitySchema);

export default TutorAvailability;
