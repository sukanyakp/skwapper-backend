import mongoose, { Document, Schema } from "mongoose";

export interface ITutorial extends Document {
  title: string;
  category: string;
  description: string;
  price: number;
  language: string;
  songName: string;
  movieOrAlbum: string;
  thumbnail: string;
  tutorId: mongoose.Types.ObjectId;
}

const tutorialSchema = new Schema<ITutorial>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    language: { type: String },
    songName: { type: String },
    movieOrAlbum: { type: String },
    thumbnail: { type: String },
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITutorial>("Tutorial", tutorialSchema);
