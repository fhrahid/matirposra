import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const phone = (body.phone || "").trim();
    const address = (body.address || "").trim();
    const password = body.password || "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "নাম, ইমেইল ও পাসওয়ার্ড আবশ্যক।" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে।" },
        { status: 409 }
      );
    }

    const user = await User.create({
      name,
      email,
      phone,
      address,
      passwordHash: hashPassword(password),
    });

    await setSessionCookie(user._id.toString());

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "রেজিস্ট্রেশন ব্যর্থ হয়েছে।" }, { status: 500 });
  }
}
