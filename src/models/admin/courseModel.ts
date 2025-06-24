import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  description: { type: String, required: true },
  // movie: { type: String, required: true },
  // instrument: { type: String, required: true },
  // language: { type: String },
  // videoUrl: { type: String, required: true },
  // tutorId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);