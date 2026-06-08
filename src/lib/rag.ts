import { getSettings } from "./settings";
import type { IProduct } from "@/models/Product";

type RagEvent = "upsert" | "delete" | "bulk";

// Convert a product (mongoose doc or lean object) into a plain JSON payload
// suitable for sending to an external RAG / vector store.
export function serializeProduct(p: Partial<IProduct> & { _id?: unknown }) {
  return {
    id: p._id ? String(p._id) : undefined,
    name: p.name,
    description: p.description,
    category: p.category,
    price: p.price,
    originalPrice: p.originalPrice,
    stock: p.stock,
    inStock: (p.stock ?? 0) > 0,
    badge: p.badge,
    image: p.image,
    icon: p.icon,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    isBestSelling: p.isBestSelling,
  };
}

// Best-effort push to the configured RAG webhook. Never throws — a failed
// notification must not break the underlying product mutation.
export async function notifyRag(event: RagEvent, payload: unknown): Promise<void> {
  try {
    const s = await getSettings();
    if (!s.ragEnabled || !s.ragWebhookUrl) return;

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (s.ragApiKey) headers["Authorization"] = `Bearer ${s.ragApiKey}`;

    await fetch(s.ragWebhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ event, payload, source: "matir-poshara", at: new Date().toISOString() }),
    });
  } catch (error) {
    console.error("RAG notify failed:", error);
  }
}
