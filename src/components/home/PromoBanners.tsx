"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gift, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const PromoBanners = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container-luxury">
        <div className="grid md:grid-cols-2 gap-6">
          {/* New Arrivals Banner */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-linear-to-br from-peach to-rose p-8 md:p-12"
          >
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wider">
                  New Arrivals
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold">
                  Spring Collection
                  <br />
                  Just Dropped
                </h3>
                <p className="text-muted-foreground max-w-xs">
                  Fresh formulas for your spring skincare refresh. Limited edition
                  sets available.
                </p>
              </div>
              <Link href="/products">
              <Button variant="hero" className="group cursor-pointer transition-opacity">
                Shop Collection
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              </Link>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-card/30 rounded-full blur-2xl" />
            <div className="absolute right-8 top-8 w-24 h-32 bg-card rounded-2xl shadow-elevated rotate-6 overflow-hidden hidden md:block">
              <Image
                src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=200&h=300&fit=crop"
                alt="Product"
                width={200}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Rewards Banner */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-linear-to-br from-beige to-accent p-8 md:p-12"
          >
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wider">
                  Glow Rewards
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold">
                  Earn Points,
                  <br />
                  Get Free Products
                </h3>
                <p className="text-muted-foreground max-w-xs">
                  Join our loyalty program and earn 1 point for every $1 spent.
                  Redeem for exclusive rewards.
                </p>
              </div>
              <Button variant="hero" className="group">
                Join Now — It&apos;s Free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-rose/30 rounded-full blur-2xl" />
            <div className="absolute right-8 bottom-8 flex gap-2 md:flex">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 bg-card rounded-full shadow-soft flex items-center justify-center text-xl"
                  style={{ transform: `translateY(${i * -4}px)` }}
                >
                  {["💎", "🎁", "✨"][i - 1]}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
