// import mongoose, { Document, Schema } from "mongoose";

// // Interface for Tutor
// export interface ITutor extends Document {
//     user : mongoose.Types.ObjectId;
//     isApproved : Boolean
//     status : 'pending' | 'approved' | 'rejected'
//     title ?: string
//     bio ?: string
//     subjects ?: string[]
// }

// // Schema
// const tutorSchema = new Schema <ITutor>({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   isApproved: { type: Boolean, default: false },
//   status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
//   title: { type : String},
//   bio: { type : String},
//   subjects: [{ type : String}], 
// });


// // Export Model
// export default mongoose.model<ITutor> ('Tutor' , tutorSchema)