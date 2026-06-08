import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { parseCSV } from "@/lib/csv";
import { rowToProduct } from "@/lib/productCsv";
import { notifyRag, serializeProduct } from "@/lib/rag";

// Bulk-import products from CSV text. Accepts JSON { csv: "..." } or raw CSV body.
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let csvText = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      csvText = body.csv || "";
    } else {
      csvText = await request.text();
    }

    if (!csvText.trim()) {
      return NextResponse.json({ error: "CSV ফাইল খালি।" }, { status: 400 });
    }

    const rows = parseCSV(csvText);
    if (rows.length === 0) {
      return NextResponse.json({ error: "CSV-তে কোনো ডেটা পাওয়া যায়নি।" }, { status: 400 });
    }

    const products = [];
    let skipped = 0;
    for (const row of rows) {
      const product = rowToProduct(row);
      if (product) products.push(product);
      else skipped++;
    }

    if (products.length === 0) {
      return NextResponse.json(
        { error: "বৈধ কোনো পণ্য পাওয়া যায়নি। 'name' ও 'price' কলাম নিশ্চিত করুন।" },
        { status: 400 }
      );
    }

    await dbConnect();
    const inserted = await Product.insertMany(products);

    await notifyRag("bulk", inserted.map(serializeProduct));

    return NextResponse.json({
      success: true,
      imported: inserted.length,
      skipped,
    });
  } catch (error) {
    console.error("Product Import Error:", error);
    return NextResponse.json({ error: "ইমপোর্ট ব্যর্থ হয়েছে।" }, { status: 500 });
  }
}
