"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea"; // Added Textarea for additional notes
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = useCart(); // Access cart data

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    additionalNotes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  
    const orderData = {
      ...formData,
      cartItems: cart,
      totalAmount,
    };
  
    try {
      const response = await fetch("https://ritesh-print-studio-server.vercel.app/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
  
      const data = await response.json();
  
      if (!data.razorpayOrderId) {
        throw new Error("Razorpay order ID missing in response");
      }
  
      const options = {
        key: "rzp_test_ACwzTcmjQbeIzd", // Replace with your Razorpay key ID
        amount: data.razorpayAmount,
        currency: "INR",
        name: "Print Studio",
        description: "Order Payment",
        order_id: data.razorpayOrderId,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        handler: async function (response: any) {
          // Verify payment on backend
          const verifyRes = await fetch("https://ritesh-print-studio-server.vercel.app/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
  
          const verifyData = await verifyRes.json();
  
          if (verifyData.success) {
            alert("Payment Successful!");
            router.push("/order/success/");
          } else {
            alert("Payment verification failed.");
            router.push("/order/failed");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong during checkout.");
      router.push("/order/failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mt-4">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mt-4">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="additionalNotes">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="additionalNotes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </form>
    </div>
  );
}
