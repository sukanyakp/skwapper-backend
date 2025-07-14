
import mongoose from "mongoose";
import { Document, Types } from "mongoose";

export interface ITutorProfile extends Document {
  _id : mongoose.Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  bio?: string;
  skills: string[];
  experience: number;
  location?: string;
  hourlyRate?: number;
  availability?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

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
    required: true,
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
