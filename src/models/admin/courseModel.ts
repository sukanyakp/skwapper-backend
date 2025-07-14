import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);