import dbConnect from "./mongodb";
import Settings, { ISettings } from "@/models/Settings";

// Fetch (and lazily create) the singleton global settings document.
export async function getSettings(): Promise<ISettings> {
  await dbConnect();
  let doc = await Settings.findOne({ key: "global" });
  if (!doc) {
    doc = await Settings.create({ key: "global" });
  }
  return doc as ISettings;
}
