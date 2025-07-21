import crypto from "crypto";

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string, secret: string) {
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(orderId + "|" + paymentId)
    .digest("hex");

  return generatedSignature === signature;
}
