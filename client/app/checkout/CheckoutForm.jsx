"use client";

import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";


export default function CheckoutForm({ totalAmount }) {
  const { items, clearCart } = useCartStore();
  const { user, token } = useAuthStore();
  const router = useRouter();
  
  // Function to load the Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // 1. Create a Razorpay Order on our server
    const orderResponse = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // <-- Add Authorization header
      },
      body: JSON.stringify({ amount: totalAmount }),
    });

    if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        toast.error(errorData.message || "Failed to create payment order.");
        return;
    }

    const orderData = await orderResponse.json();

    // 2. Configure and open the Razorpay Checkout Modal
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Faqeera",
      description: "Fashion Store Transaction",
      order_id: orderData.id,
      handler: async function (response) {
        // 3. This function is called after a successful payment
        const verificationResponse = await fetch(
          "/api/payment/verify-payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // <-- Add Authorization header
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              cartItems: items, // <-- SEND THE CART ITEMS
              totalAmount: totalAmount, // <-- SEND THE TOTAL
            }),
          }
        );

        const verificationData = await verificationResponse.json();

        if (verificationData.status === "success") {
    toast.success("Payment successful!");
    clearCart();

    const params = new URLSearchParams({
      // Use the exact keys from our backend response
      order_number: verificationData.orderNumber, 
      payment_id: verificationData.paymentId,     
    });
    
    router.push(`/order-success?${params.toString()}`);
} else {
          toast.error("Payment verification failed. Please contact support.");
        }
      },
       prefill: {
        name: user?.name || "Faqeera Customer",
        email: user?.email || "",
      },
      theme: {
        color: "#E6F5C6", // Let's use a nice green color
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div>
      <Button
        onClick={handlePayment}
        disabled={items.length === 0}
        className="w-full"
        size="lg"
      >
        Pay Now
      </Button>
    </div>
  );
}
