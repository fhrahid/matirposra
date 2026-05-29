import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Artisan from "@/models/Artisan";

// Fetch all artisans for admin
export async function GET() {
  try {
    await dbConnect();
    const artisans = await Artisan.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ artisans });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch artisans" }, { status: 500 });
  }
}

// Add new artisan
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    const artisan = await Artisan.create(body);
    return NextResponse.json({ success: true, artisan });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create artisan" }, { status: 500 });
  }
}
