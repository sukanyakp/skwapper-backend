// models/studentProfile.model.ts
import mongoose from "mongoose";

import { Document, Types } from "mongoose";

export interface IStudentProfile extends Document {
  _id :mongoose.Types.ObjectId; 
  userId: Types.ObjectId;
  name: string;
  bio?: string;
  instrument: string;
  location?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const studentProfileSchema = new mongoose.Schema({
  // _id : mongoose.Schema.Types.ObjectId,
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
  instrument: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: "",
  },
  profileImage : {
    type : String,
    default : ""
  }
}, {
  timestamps: true
});

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);

export default StudentProfile;
