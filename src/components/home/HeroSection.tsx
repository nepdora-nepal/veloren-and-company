"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative py-20 lg:py-0 lg:min-h-[90vh] flex items-center overflow-hidden bg-linear-to-br from-rose via-accent to-beige">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-peach/60 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-rose/40 rounded-full blur-3xl" />
      </div>

      <div className="container-luxury relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 xl:gap-32 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 text-center lg:text-left"
          >
            <div className="space-y-4">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-block px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full text-sm font-medium"
              >
                ✨ New Collection 2024
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
              >
                Unlock Your
                <br />
                <span className="text-muted-foreground">Natural Glow</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0"
              >
                Discover premium Korean skincare formulated with time-tested
                ingredients for radiant, healthy skin.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4"
            >
              <Link href="/products">
                <Button variant="hero" size="xl" className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-elevated">
                  Shop Now
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="xl" className="bg-card/50 cursor-pointer backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-card/80 hover:shadow-medium">
                  About Us
                </Button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex flex-wrap justify-center lg:justify-start items-center gap-6 md:gap-8 pt-4"
            >
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold">50K+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div className="hidden md:block w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold">4.9★</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
              <div className="hidden md:block w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold">100%</p>
                <p className="text-sm text-muted-foreground">Authentic</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square">
              {/* Main Image */}
              <div className="absolute inset-0 rounded-[3rem] overflow-hidden shadow-elevated">
                <Image
                  src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=900&h=900&fit=crop"
                  alt="Beautiful woman with glowing skin"
                  width={900}
                  height={900}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Product */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 top-1/4 w-32 h-40 bg-card rounded-3xl shadow-elevated p-3"
              >
                <Image
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=250&fit=crop"
                  alt="Featured serum"
                  width={200}
                  height={300}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute -left-4 bottom-1/4 bg-card rounded-2xl shadow-elevated p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-peach rounded-xl flex items-center justify-center text-2xl">
                    🌸
                  </div>
                  <div>
                    <p className="font-medium text-sm">Best Seller</p>
                    <p className="text-xs text-muted-foreground">5000+ sold</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
