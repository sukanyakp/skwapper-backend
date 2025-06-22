import { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

export interface ITutorApplication extends Document {
  user: { type: mongoose.Schema.Types.ObjectId; ref: "User" };
  documents: string[]; // Cloudinary URLs
  title: string;
  bio: string;
  skills: string;       // You can change this to string[] if you prefer an array of skills
  experience: number;   // Years of experience as a number
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  reviewedBy?: string; // Admin user ID
  appliedAt: Date;
  reviewedAt?: Date;
  isBlocked : boolean
}




const tutorApplicationSchema = new Schema<ITutorApplication>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // One application per user at a time
  },
  documents: {
    type: [String],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  skills: {
    type: String,  // or [String] if you want array of skills
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  rejectionReason: {
    type: String,
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  reviewedAt: {
    type: Date,
  },
  isBlocked : {
    type : Boolean
  }
});
  

export default mongoose.model<ITutorApplication>(
  "TutorApplication",
  tutorApplicationSchema
);
