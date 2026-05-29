import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

// Create Order (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, items, totalPrice } = body;

    if (!customer || !items || items.length === 0) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    await dbConnect();

    // Generate a unique order number (MP-YYYYMMDD-Random)
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MP-${datePart}-${randomPart}`;

    const newOrder = await Order.create({
      orderNumber,
      customer,
      items,
      totalPrice,
      status: "pending",
    });

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
