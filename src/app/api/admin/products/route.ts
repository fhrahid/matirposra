import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { notifyRag, serializeProduct } from "@/lib/rag";

// Fetch all products for admin
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// Add new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    const product = await Product.create(body);
    await notifyRag("upsert", serializeProduct(product));
    return NextResponse.json({ success: true, product });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
