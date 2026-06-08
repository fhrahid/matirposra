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
  stock: number;
  isBestSelling: boolean;
}

const ProductSchema: Schema = new Schema(
  {
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
    // Inventory count. Admin sees the exact number; customers only see
    // whether it is in stock (stock > 0) or out of stock (stock === 0).
    stock: { type: Number, default: 0, min: 0 },
    isBestSelling: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
