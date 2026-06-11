import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

interface LeanOrder {
  _id: unknown;
  userId?: string;
  orderNumber: string;
  customer: { name: string; phone: string; address: string };
  items: { productId: string; name: string; price: number; qty: number; icon?: string }[];
  totalPrice: number;
  status: string;
  createdAt: Date;
}

interface LeanUser {
  _id: unknown;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: Date;
}

// Admin: list every registered customer along with their full order history,
// order count, and lifetime spend. Customers who have ordered are listed first.
export async function GET() {
  try {
    await dbConnect();

    const [users, orders] = await Promise.all([
      User.find({}).select("-passwordHash").sort({ createdAt: -1 }).lean<LeanUser[]>(),
      Order.find({}).sort({ createdAt: -1 }).lean<LeanOrder[]>(),
    ]);

    const ordersByUser = new Map<string, LeanOrder[]>();
    for (const o of orders) {
      if (!o.userId) continue;
      const key = String(o.userId);
      const list = ordersByUser.get(key) ?? [];
      list.push(o);
      ordersByUser.set(key, list);
    }

    const customers = users.map((u) => {
      const userOrders = ordersByUser.get(String(u._id)) ?? [];
      const totalSpent = userOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone || "",
        address: u.address || "",
        joinedAt: u.createdAt,
        orderCount: userOrders.length,
        totalSpent,
        orders: userOrders,
      };
    });

    // Most active customers (by order count) first.
    customers.sort((a, b) => b.orderCount - a.orderCount);

    return NextResponse.json({ customers });
  } catch (error) {
    console.error("Admin Customers Error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
