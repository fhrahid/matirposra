import mongoose, { Schema, Document } from "mongoose";

export interface IArtisan extends Document {
  name: string;
  village: string;
  experience: string;
  story: string;
  image?: string;
}

const ArtisanSchema: Schema = new Schema({
  name: { type: String, required: true },
  village: { type: String, required: true },
  experience: { type: String, required: true },
  story: { type: String, required: true },
  image: { type: String },
});

export default mongoose.models.Artisan || mongoose.model<IArtisan>("Artisan", ArtisanSchema);
