import mongoose, { Schema, Document } from "mongoose";

// A single global settings document (key: "global") holds site-wide config
// such as the live-chat widget.
export interface ISettings extends Document {
  key: string;
  // Live chat — injected as a third-party <script> widget that self-mounts.
  liveChatEnabled: boolean;
  liveChatScriptUrl: string;
  liveChatTenantId: string;
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "global" },

    liveChatEnabled: { type: Boolean, default: false },
    liveChatScriptUrl: {
      type: String,
      default: "https://symai.aetherbd.com/static/widget.js",
    },
    liveChatTenantId: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
