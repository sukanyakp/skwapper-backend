import mongoose, { Document, Schema } from "mongoose";

// Interface for Admin
export interface IAdmin extends Document {
  user: mongoose.Types.ObjectId;
  permissions: string[]; 
}

// Schema
const adminSchema = new Schema<IAdmin>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  permissions: [{ type: String }] 
}, {
  timestamps: true
});

// Export Model
export default mongoose.model<IAdmin>('Admin', adminSchema); 
