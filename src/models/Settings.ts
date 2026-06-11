import mongoose, { Schema, Document } from "mongoose";

// A single global settings document (key: "global") holds site-wide config
// such as the live-chat widget.
export interface ISettings extends Document {
  key: string;
  // Live chat — embedded in a toggleable panel (we own the open/close button).
  liveChatEnabled: boolean;
  liveChatUrl: string;
  liveChatTitle: string;
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "global" },

    liveChatEnabled: { type: Boolean, default: false },
    liveChatUrl: {
      type: String,
      default: "https://symai.aetherbd.com/widget/be221dedb00cc7879ef4d6f2",
    },
    liveChatTitle: { type: String, default: "লাইভ চ্যাট" },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
