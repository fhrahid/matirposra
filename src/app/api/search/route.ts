import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product, { IProduct } from "@/models/Product";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ products: [] });
    }

    await dbConnect();

    // Fuzzy search using regex
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    }).limit(20).lean() as IProduct[];

    const formattedProducts = products.map((p) => ({
      ...p,
      id: p._id.toString(),
    }));

    return NextResponse.json({ products: formattedProducts });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
