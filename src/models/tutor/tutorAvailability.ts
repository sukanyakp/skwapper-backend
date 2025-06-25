import mongoose, { Document, Schema } from "mongoose";

export interface IAvailability extends Document {
  tutorId: mongoose.Types.ObjectId;
  availability: {
    [key: string]: {
      start: string;
      end: string;
    };
  };
}

const availabilitySchema = new mongoose.Schema<IAvailability>({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  availability: {
    type: Map,
    of: {
      start: { type: String },
      end: { type: String },
    },
    default: {},
  },
}, {
  timestamps: true
});

const Availability = mongoose.model<IAvailability>("Availability", availabilitySchema);

export default Availability;
