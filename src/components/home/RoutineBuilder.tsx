"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCategories } from "@/hooks/use-product";
import Image from "next/image";

const categoryIconMap: Record<string, string> = {
  "Cleanser": "🧴",
  "Toner": "✨",
  "Serum": "💎",
  "Moisturizer": "💧",
  "Sunscreen": "☀️",
  "Face Wash": "🧼",
  "Mask": "🎭",
  "Eye Care": "👁️",
  "Lip Care": "�",
};

export const RoutineBuilder = () => {
  const { data, isLoading } = useCategories();
  
  const categories = data?.results || [];
  
  // Take first 5 categories as routine steps if available
  const steps = categories.slice(0, 5).map((cat, index) => ({
    step: index + 1,
    name: cat.name,
    icon: categoryIconMap[cat.name] || "✨",
    image: cat.image,
    description: cat.description || "Personalized care",
    slug: cat.slug
  }));

  return (
    <section className="py-16 md:py-24 bg-linear-to-b from-rose/30 via-accent/20 to-background">
      <div className="container-luxury">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4  py-2 bg-card rounded-full shadow-soft">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Personalized Routine</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Build Your Perfect
                <br />
                Skincare Routine
              </h2>
              <p className="text-muted-foreground max-w-md">
                Answer a few questions about your skin type and concerns, and we&apos;ll create a personalized routine just for you.
              </p>
            </div>

            <Link href="/routine-builder">
              <Button variant="hero" size="lg" className="group">
                Start Your Routine
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            {/* Stats */}
            <div className="flex items-center py-8 gap-8">
              <div>
                <p className="text-2xl font-bold">10K+</p>
                <p className="text-sm text-muted-foreground">Routines Created</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <p className="text-2xl font-bold">96%</p>
                <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
              </div>
            </div>
          </motion.div>

          {/* Right - Steps Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : steps.length > 0 ? (
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <Link href={`/category/${step.slug}`} key={step.step}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-card rounded-2xl shadow-soft hover:shadow-medium transition-all group cursor-pointer mb-4 last:mb-0"
                    >
                      <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform overflow-hidden">
                        {step.image ? (
                          <Image 
                            src={step.image} 
                            alt={step.name} 
                            width={56} 
                            height={56} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          step.icon
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Step {step.step}
                          </span>
                        </div>
                        <p className="font-medium">{step.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {step.description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-20">
                No categories available to build a routine.
              </p>
            )}

            {/* Decorative */}
            <div className="absolute -z-10 -right-8 -top-8 w-32 h-32 bg-peach/50 rounded-full blur-2xl" />
            <div className="absolute -z-10 -left-8 -bottom-8 w-32 h-32 bg-rose/50 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
