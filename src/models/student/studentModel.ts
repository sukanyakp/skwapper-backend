// models/studentProfile.model.ts
import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming you have a User model
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
