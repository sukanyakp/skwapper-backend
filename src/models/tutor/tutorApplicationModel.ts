import mongoose from "mongoose";

const tutorApplicationSchema = new mongoose.Schema({
  documents: [String],
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

export const TutorApplication = mongoose.model("TutorApplication", tutorApplicationSchema);
