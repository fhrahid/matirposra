import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/auth";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  icon?: string;
}

// Create Order (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, items, totalPrice } = body as {
      customer: unknown;
      items: OrderItem[];
      totalPrice: number;
    };

    if (!customer || !items || items.length === 0) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    // Orders require a logged-in customer — no guest checkout.
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "অর্ডার করতে অনুগ্রহ করে লগইন করুন।" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Validate stock for every line item before committing the order so we
    // never oversell. Only consider items whose productId is a valid ObjectId
    // (the catalogue is keyed by Mongo _id).
    const stockable = items.filter((it) =>
      mongoose.isValidObjectId(it.productId)
    );
    const products = await Product.find({
      _id: { $in: stockable.map((it) => it.productId) },
    }).select("name stock");

    const stockById = new Map(
      products.map((p) => [String(p._id), p.stock as number])
    );

    for (const it of stockable) {
      const available = stockById.get(String(it.productId));
      if (available === undefined) {
        return NextResponse.json(
          { error: `পণ্য পাওয়া যায়নি: ${it.name}` },
          { status: 400 }
        );
      }
      if (it.qty > available) {
        return NextResponse.json(
          {
            error: `"${it.name}" এর পর্যাপ্ত স্টক নেই (বাকি আছে ${available}টি)।`,
          },
          { status: 409 }
        );
      }
    }

    // Generate a unique order number (MP-YYYYMMDD-Random)
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MP-${datePart}-${randomPart}`;

    const newOrder = await Order.create({
      orderNumber,
      userId: String((user as { _id: unknown })._id),
      customer,
      items,
      totalPrice,
      status: "pending",
    });

    // Decrement inventory for each ordered product. The filter guards against a
    // race where stock dropped below qty between the check above and this write.
    if (stockable.length > 0) {
      await Product.bulkWrite(
        stockable.map((it) => ({
          updateOne: {
            filter: {
              _id: it.productId,
              stock: { $gte: it.qty },
            },
            update: { $inc: { stock: -it.qty } },
          },
        }))
      );
    }

    return NextResponse.json({
      success: true,
      orderNumber: newOrder.orderNumber,
      orderId: newOrder._id
    }, { status: 201 });
  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// Track Order (GET)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");

    if (!orderNumber) {
      return NextResponse.json({ error: "Order number is required" }, { status: 400 });
    }

    await dbConnect();

    const order = await Order.findOne({ orderNumber }).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order Tracking Error:", error);
    return NextResponse.json({ error: "Failed to fetch order status" }, { status: 500 });
  }
}
