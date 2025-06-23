// models/tutorProfile.model.ts
import mongoose from "mongoose";

const tutorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  skills: {
    type: [String], // allow multiple instruments
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    default: "",
  },
  hourlyRate: {
    type: Number,
    default: 0,
  },
  availability: {
    type: String, // or even a custom object with days/times
    default: "",
  },
  profileImage: {
    type: String,
    default: "",
  }
}, {
  timestamps: true
});

const TutorProfile = mongoose.model("TutorProfile", tutorProfileSchema);

export default TutorProfile;
