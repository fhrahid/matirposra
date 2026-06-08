// Mapping helpers between CSV rows and Product documents, shared by the
// import and export routes so the column contract stays in one place.

import { PLACEHOLDER_IMAGE } from "./csv";

export const PRODUCT_CSV_COLUMNS = [
  "name",
  "description",
  "category",
  "price",
  "originalPrice",
  "discount",
  "stock",
  "image",
  "icon",
  "badge",
  "rating",
  "reviewsCount",
  "isBestSelling",
];

type ParsedProduct = {
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  icon: string;
  badge?: "new" | "sale" | "hot";
  rating: number;
  reviewsCount: number;
  isBestSelling: boolean;
};

function num(value: string | undefined, fallback = 0): number {
  if (value === undefined || value === "") return fallback;
  const n = Number(value.replace(/[,৳\s]/g, ""));
  return Number.isFinite(n) ? n : fallback;
}

function bool(value: string | undefined): boolean {
  if (!value) return false;
  return ["true", "1", "yes", "y", "হ্যাঁ"].includes(value.toLowerCase());
}

// Convert a single parsed CSV record (lowercased headers) into product fields.
// Returns null when the row lacks the minimum required data (name + price).
export function rowToProduct(row: Record<string, string>): ParsedProduct | null {
  const name = (row.name || "").trim();
  const price = num(row.price, NaN);

  if (!name || !Number.isFinite(price)) return null;

  // Discount handling: prefer an explicit originalPrice, otherwise derive it
  // from a discount percentage if one is supplied.
  let originalPrice = num(row.originalprice, 0);
  const discount = num(row.discount, 0);
  if ((!originalPrice || originalPrice <= price) && discount > 0 && discount < 100) {
    originalPrice = Math.round(price / (1 - discount / 100));
  }

  const rawBadge = (row.badge || "").trim().toLowerCase();
  let badge: "new" | "sale" | "hot" | undefined;
  if (rawBadge === "new" || rawBadge === "sale" || rawBadge === "hot") {
    badge = rawBadge;
  } else if (originalPrice && originalPrice > price) {
    badge = "sale";
  }

  return {
    name,
    description: (row.description || "").trim(),
    category: (row.category || "অন্যান্য").trim() || "অন্যান্য",
    price,
    originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
    stock: Math.max(0, num(row.stock ?? row.inventory, 0)),
    image: (row.image || "").trim() || PLACEHOLDER_IMAGE,
    icon: (row.icon || "").trim() || "🏺",
    badge,
    rating: Math.min(5, Math.max(0, num(row.rating, 5))),
    reviewsCount: Math.max(0, num(row.reviewscount, 0)),
    isBestSelling: bool(row.isbestselling),
  };
}
