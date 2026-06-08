import dbConnect from "@/lib/mongodb";
import Product, { IProduct } from "@/models/Product";
import { buildCSV } from "@/lib/csv";
import { PRODUCT_CSV_COLUMNS } from "@/lib/productCsv";

// Export all products as a downloadable CSV file.
export async function GET() {
  try {
    await dbConnect();
    const products = (await Product.find({}).sort({ createdAt: -1 }).lean()) as unknown as IProduct[];

    const records = products.map((p) => ({
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice ?? "",
      discount:
        p.originalPrice && p.originalPrice > p.price
          ? Math.round((1 - p.price / p.originalPrice) * 100)
          : "",
      stock: p.stock ?? 0,
      image: p.image ?? "",
      icon: p.icon ?? "",
      badge: p.badge ?? "",
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      isBestSelling: p.isBestSelling ? "true" : "false",
    }));

    const csv = buildCSV(PRODUCT_CSV_COLUMNS, records);
    // Prepend a BOM so Excel opens Bengali text in UTF-8 correctly.
    const body = "﻿" + csv;

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="products-${new Date()
          .toISOString()
          .slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error("Product Export Error:", error);
    return new Response("Failed to export products", { status: 500 });
  }
}
