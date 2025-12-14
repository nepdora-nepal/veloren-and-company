"use client";

import  Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, Tag, Truck, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

const CartPage = () => {
  const { cartItems: items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const subtotal = totalPrice;
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const discount = appliedCoupon ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "glow10") {
      setAppliedCoupon(couponCode);
      toast.success("Coupon applied!", {
        description: "You got 10% off your order.",
      });
    } else {
      toast.error("Invalid coupon", {
        description: "Please check your coupon code and try again.",
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">

        <main className="pt-28 pb-16">
          <div className="container-luxury">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Your bag is empty</h1>
              <p className="text-muted-foreground mb-8">
                Looks like you haven&apos;t added anything to your bag yet.
              </p>
              <Link href="/products">
                <Button size="lg">Start Shopping</Button>
              </Link>
            </motion.div>
          </div>
        </main>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      <main className="pt-28 pb-16">
        <div className="container-luxury">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-8"
          >
            Shopping Bag
          </motion.h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-4 bg-card rounded-2xl border border-border"
                >
                  <Link href={`/product/${item.product.id}`} className="shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-secondary">
                      <Image
                        src={item.product.thumbnail_image || "/placeholder.png"}
                        alt={item.product.name}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                       <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {(item.product as any).brand?.name || "Brand"}
                        </p>
                        <Link href={`/product/${item.product.id}`}>
                          <h3 className="font-medium hover:text-muted-foreground transition-colors line-clamp-2">
                            {item.product.name}
                          </h3>
                        </Link>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      <div className="flex items-center gap-2 bg-secondary rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold">
                          ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-muted-foreground">
                            ${parseFloat(item.product.price).toFixed(2)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-28 bg-card rounded-3xl border border-border p-6 space-y-6">
                <h2 className="text-xl font-bold">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <Button variant="outline" onClick={applyCoupon}>
                      Apply
                    </Button>
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                      <span>GLOW10 applied</span>
                      <button
                        onClick={() => setAppliedCoupon(null)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Try &quot;GLOW10&quot; for 10% off
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount (10%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping > 0 && subtotal < 50 && (
                    <p className="text-xs text-muted-foreground">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                </div>

                <div className="flex justify-between pt-4 border-t border-border">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg">${total.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                  <Truck className="w-5 h-5 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">Estimated delivery</p>
                    <p className="text-muted-foreground">3-5 business days</p>
                  </div>
                </div>

                <Link href="/checkout" className="block">
                  <Button className="w-full gap-2" size="lg">
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

                <Link
                  href="/products"
                  className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default CartPage;
