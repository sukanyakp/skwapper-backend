import mongoose, { Document, Schema } from "mongoose";

// Interface for Student
export interface IStudent extends Document {
  user: mongoose.Types.ObjectId;                
  enrolledCourses: mongoose.Types.ObjectId[];   
//   preferences?: Record<string, any>;            // Optional preferences object
}

// Schema
const studentSchema = new Schema<IStudent>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
//   preferences: { type: Schema.Types.Mixed }, // or Schema.Types.Map if you prefer maps
}, {
  timestamps: true
});

// Export Model
export default mongoose.model<IStudent>('Student', studentSchema);
