import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: "লগইন করুন।" }, { status: 401 });
    }

    const body = await request.json();
    await dbConnect();

    const user = await User.findById(current._id);
    if (!user) {
      return NextResponse.json({ error: "ব্যবহারকারী পাওয়া যায়নি।" }, { status: 404 });
    }

    if (typeof body.name === "string" && body.name.trim()) user.name = body.name.trim();
    if (typeof body.phone === "string") user.phone = body.phone.trim();
    if (typeof body.address === "string") user.address = body.address.trim();

    // Optional password change requires the current password.
    if (body.newPassword) {
      if (body.newPassword.length < 6) {
        return NextResponse.json(
          { error: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" },
          { status: 400 }
        );
      }
      if (!verifyPassword(body.currentPassword || "", user.passwordHash)) {
        return NextResponse.json({ error: "বর্তমান পাসওয়ার্ড ভুল।" }, { status: 400 });
      }
      user.passwordHash = hashPassword(body.newPassword);
    }

    await user.save();

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
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: "প্রোফাইল আপডেট ব্যর্থ হয়েছে।" }, { status: 500 });
  }
}
