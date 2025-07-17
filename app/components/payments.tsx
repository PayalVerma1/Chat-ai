'use client';
import React, { useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentPage = () => {
  const Amount = 50; 
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const payment = await fetch('/api/payment', {
        method: 'POST',
      });

      const data = await payment.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: Amount * 100, 
        currency: "INR",
        name: "Chat-AI",
        description: "Test Transaction",
        order_id: data.orderId,
        handler: function (response: any) {
          alert("Payment Successful");
          console.log("Payment success response:", response);
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@gmail.com",
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
        disabled={isProcessing}
        className={`px-6 py-2 text-white text-bold rounded ${
          isProcessing ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isProcessing ? "Processing..." : "Upgrade to Pro"}
      </button>
    </div>
  );
};

export default PaymentPage;
