import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await request.json();
    const { id } = await params;

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    await dbConnect();

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Order Status Update Error:", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
