"use client";

import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CheckoutForm({ totalAmount }) {
  const { items, clearCart } = useCartStore();
  const { data: session } = useSession();
  const user = session?.user || null;
  const token = session?.user?.accessToken || null;
  const router = useRouter();

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
    if (!user || !token) {
      toast.warning("Please log in to proceed with checkout.");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const orderResponse = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: totalAmount }),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      toast.error(errorData.message || "Failed to create payment order.");
      return;
    }

    const orderData = await orderResponse.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Faqeera",
      description: "Fashion Store Transaction",
      order_id: orderData.id,
      handler: async function (response) {
        const verificationResponse = await fetch("/api/payment/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            cartItems: items,
            totalAmount,
          }),
        });

        const verificationData = await verificationResponse.json();

        if (verificationData.status === "success") {
          toast.success("Payment successful!");
          clearCart();
          const params = new URLSearchParams({
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
        color: "#E6F5C6",
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
