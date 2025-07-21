"use client";
import React, { useState, useEffect } from "react";
import Script from "next/script";
import { useSession } from "next-auth/react";
declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentPage = () => {
  const { data: session } = useSession();
  const Amount = 2
  const [isProcessing, setIsProcessing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "active" | "inactive" | ""
  >("");
  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/subscriptionStatus?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "active") setSubscriptionStatus("active");
           console.log(data.status);
        });
    }
  }, [session]);
 
  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const payment = await fetch("/api/payment", {
        method: "POST",
      });

      const data = await payment.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Amount * 100,
        currency: "INR",
        name: "Chat-AI",
        description: "Test Transaction",
        order_id: data.orderId,
        handler: async function (response: any) {
          alert("Payment Successful");
          const verifyPay = await fetch("/api/verifyPayment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userEmail: session?.user?.email,
            }),
          });
          const result = await verifyPay.json();
          if (result.success && result.status === "active") {
            alert("Payment Verified! You are now a Pro member.");
            setSubscriptionStatus("active");
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: session?.user?.name || "User",
          email: session?.user?.email || "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col  justify-center ">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button
        onClick={handlePayment}
        disabled={isProcessing || subscriptionStatus === "active"}
        className={`px-6 py-2 text-white font-bold rounded ${
          subscriptionStatus === "active"
            ? "bg-green-600 cursor-not-allowed"
            : isProcessing
            ? "bg-gray-500"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {subscriptionStatus === "active"
          ? "✅ Subscribed (Pro)"
          : isProcessing
          ? "Processing..."
          : "Upgrade to Pro"}
      </button>
    </div>
  );
};

export default PaymentPage;
