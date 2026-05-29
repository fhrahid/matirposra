import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  reviewerName: string;
  location: string;
  stars: number;
  text: string;
  avatar?: string;
}

const ReviewSchema: Schema = new Schema({
  reviewerName: { type: String, required: true },
  location: { type: String, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  avatar: { type: String },
});

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
