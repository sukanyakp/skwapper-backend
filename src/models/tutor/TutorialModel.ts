import mongoose, { Document, Schema } from "mongoose";

export interface ITutorial extends Document {
  title: string;
  category: string;
  description: string;
  price: number;
  language: string;
  level: "basic" | "intermediate" | "advanced";
  songName?: string;
  movieOrAlbum?: string;
  thumbnail: string;
  tutorId: mongoose.Types.ObjectId;
  basicContent?: string;
  intermediateContent?: string;
  advancedContent?: string;
}

const tutorialSchema = new Schema<ITutorial>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    language: { type: String, required: true },

    level: {
      type: String,
      enum: ["basic", "intermediate", "advanced"],
      required: true,
    },

    songName: { type: String },
    movieOrAlbum: { type: String },
    thumbnail: { type: String },

    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    basicContent: { type: String },
    intermediateContent: { type: String },
    advancedContent: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ITutorial>("Tutorial", tutorialSchema);
