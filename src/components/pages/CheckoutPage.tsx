"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronRight,
  CreditCard,
  Truck,
  Shield,
  Check,
  ChevronLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/use-auth";
import { useCreateOrder } from "@/hooks/my-order";
import { CreateOrderPayload } from "@/types/my-orders";
import { toast } from "sonner";
import Image from "next/image";

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { mutateAsync: createOrderMutation, isPending: isCreatingOrder } = useCreateOrder();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
    shippingMethod: "standard",
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Please log in to checkout");
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      router.push("/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-28 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading checkout...</p>
        </div>
      </div>
    );
  }

  const subtotal = totalPrice;
  const shipping = formData.shippingMethod === "express" ? 9.99 : subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        const payload: CreateOrderPayload = {
            customer_email: formData.email,
            customer_name: `${formData.firstName} ${formData.lastName}`,
            customer_phone: formData.phone,
            customer_address: formData.address,
            shipping_address: formData.address,
            city: formData.city,
            zip_code: formData.zipCode,
            shipping_method: formData.shippingMethod,
            total_amount: total,
            items: cartItems.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity,
                price: parseFloat(item.product.price)
            }))
        };

        await createOrderMutation(payload);

        toast.success("Order placed successfully!", {
            description: "Check your email for confirmation.",
        });
        clearCart();
        router.push("/");
      } catch (error) {
        toast.error("Failed to place order. Please try again.");
        console.error("Order creation failed:", error);
      }
    }
  };

  const steps = [
    { number: 1, label: "Information" },
    { number: 2, label: "Shipping" },
    { number: 3, label: "Payment" },
  ];

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">

        <main className="pt-28 pb-16">
          <div className="container-luxury text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Add some products to checkout.</p>
            <Link href="/products">
              <Button size="lg">Browse Products</Button>
            </Link>
          </div>
        </main>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      <main className="pt-28 pb-16">
        <div className="container-luxury">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 ${
                    step >= s.number ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      step > s.number
                        ? "bg-primary text-primary-foreground"
                        : step === s.number
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    {step > s.number ? <Check className="w-4 h-4" /> : s.number}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-12 h-px bg-border" />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form Section */}
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                      <input
                        type="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-4 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="px-4 py-4 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="px-4 py-4 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                          required
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full mt-4 px-4 py-4 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      />
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <input
                          type="text"
                          placeholder="City"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="px-4 py-4 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                          required
                        />
                        <input
                          type="text"
                          placeholder="ZIP code"
                          value={formData.zipCode}
                          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                          className="px-4 py-4 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                          required
                        />
                      </div>
                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full mt-4 px-4 py-4 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold">Shipping Method</h2>
                    <div className="space-y-3">
                      {[
                        { id: "standard", label: "Standard Shipping", price: subtotal >= 50 ? "Free" : "$5.99", time: "5-7 business days" },
                        { id: "express", label: "Express Shipping", price: "$9.99", time: "2-3 business days" },
                      ].map((option) => (
                        <label
                          key={option.id}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            formData.shippingMethod === option.id
                              ? "border-primary bg-secondary"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              value={option.id}
                              checked={formData.shippingMethod === option.id}
                              onChange={(e) => setFormData({ ...formData, shippingMethod: e.target.value })}
                              className="sr-only"
                            />
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                formData.shippingMethod === option.id ? "border-primary" : "border-border"
                              }`}
                            >
                              {formData.shippingMethod === option.id && (
                                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{option.label}</p>
                              <p className="text-sm text-muted-foreground">{option.time}</p>
                            </div>
                          </div>
                          <span className="font-medium">{option.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold">Payment</h2>
                    <div className="p-6 bg-card border border-border rounded-2xl">
                      <div className="flex items-center gap-3 mb-6">
                        <CreditCard className="w-6 h-6" />
                        <span className="font-medium">Credit Card</span>
                      </div>
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Card number"
                          className="w-full px-4 py-4 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="px-4 py-4 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                          <input
                            type="text"
                            placeholder="CVC"
                            className="px-4 py-4 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Name on card"
                          className="w-full px-4 py-4 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-6 pt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="w-5 h-5" />
                        <span>Secure checkout</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Truck className="w-5 h-5" />
                        <span>Fast shipping</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="gap-2">
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </Button>
                  ) : (
                    <Link href="/cart">
                      <Button variant="outline" className="gap-2">
                        <ChevronLeft className="w-4 h-4" />
                        Return to cart
                      </Button>
                    </Link>
                  )}

                  <Button type="submit" className="gap-2" disabled={isCreatingOrder}>
                    {step === 3 ? (isCreatingOrder ? "Processing..." : "Place Order") : "Continue"}
                    {!isCreatingOrder && <ChevronRight className="w-4 h-4" />}
                  </Button>
                </div>
              </form>
            </motion.div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-28 bg-card rounded-3xl border border-border p-6">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-secondary rounded-xl overflow-hidden shrink-0">
                        <Image src={product.thumbnail_image || "/placeholder.jpg"} alt={product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                          {quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{product.name}</p>

                      </div>
                      <p className="font-medium">${(parseFloat(product.price) * quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-3 border-t border-border">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default CheckoutPage;
