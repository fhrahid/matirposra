import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  category: string;
  badge?: "new" | "sale" | "hot";
  image?: string;
  images: string[];
  icon?: string;
  isBestSelling: boolean;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  rating: { type: Number, default: 5 },
  reviewsCount: { type: Number, default: 0 },
  category: { type: String, required: true },
  badge: { type: String, enum: ["new", "sale", "hot", null] },
  image: { type: String },
  images: { type: [String], default: [] },
  icon: { type: String },
  isBestSelling: { type: Boolean, default: false },
});

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
