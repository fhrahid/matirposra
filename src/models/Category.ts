import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  productCount: number;
  image?: string;
  icon?: string;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  productCount: { type: Number, default: 0 },
  image: { type: String },
  icon: { type: String },
});

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
