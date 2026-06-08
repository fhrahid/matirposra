import mongoose, { Schema, Document } from "mongoose";

// A single global settings document (key: "global") holds site-wide config
// such as the live-chat widget and the RAG integration endpoint.
export interface ISettings extends Document {
  key: string;
  // Live chat
  liveChatEnabled: boolean;
  liveChatUrl: string;
  liveChatTitle: string;
  // RAG integration
  ragEnabled: boolean;
  ragWebhookUrl: string;
  ragApiKey: string;
  ragLastSyncAt?: Date;
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "global" },

    liveChatEnabled: { type: Boolean, default: false },
    liveChatUrl: { type: String, default: "" },
    liveChatTitle: { type: String, default: "লাইভ চ্যাট" },

    ragEnabled: { type: Boolean, default: false },
    ragWebhookUrl: { type: String, default: "" },
    ragApiKey: { type: String, default: "" },
    ragLastSyncAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
