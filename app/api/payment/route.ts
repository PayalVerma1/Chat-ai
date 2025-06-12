import {NextRequest, NextResponse} from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ,
  key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET ,
});
export async function POST(request: NextRequest) {
  try {
    const order=await razorpay.orders.create({
        amount:100*100,
        currency:"INR",
        receipt:"receipt_"+Math.random().toString(36).substring(2, 15),
    });
    return NextResponse.json({orderId: order.id}, {status: 200});
  } catch (error) {
    console.log('Error creating Razorpay order:', error);
    return NextResponse.json({error: 'Failed to create order'}, {status: 500});
  }
}
 