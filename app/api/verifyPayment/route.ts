import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { PrismaClient } from "@prisma/client";
import { verifyRazorpaySignature } from "@/lib/razorpay";

const prisma = new PrismaClient();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userEmail,
    } = await req.json();
    if (!userEmail || !razorpay_payment_id || !razorpay_signature || !razorpay_order_id) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
     const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET!
    );

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status === "captured") {
      await prisma.subscription.upsert({
        where: { userId: user.id },
        update: {
          plan: "Pro",
          status: "active", 
          paymentId: razorpay_payment_id,
          customerName: payment.email || userEmail,
        },
        create: {
          userId: user.id,
          plan: "Pro",
          status: "active",
          paymentId: razorpay_payment_id,
          customerName: payment.email || userEmail,
        },
      });

      return NextResponse.json({ success: true, status: "active" });
    } else {
      return NextResponse.json({
        success: false,
        status: payment.status,
      });
    }
  } catch (err) {
    console.error("Verification failed:", err);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
