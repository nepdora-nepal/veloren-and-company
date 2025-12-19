"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { useProductsWithParams } from "@/hooks/use-product";
import { useRef } from "react";
import Link from "next/link";

export const FeaturedBrand = () => {
  const { data, isLoading } = useProductsWithParams({
    is_featured: true,
    page_size: 50,
  });

  const featuredProducts = data?.results.slice(0, 6) || [];
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-linear-to-b from-background to-secondary/30">
      <div className="container-luxury">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-rose rounded-full">
              <span className="text-sm font-medium">Featured Collection</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Staff Picks</h2>
            <p className="text-muted-foreground max-w-md">
              Handpicked selections from our beauty experts. These products are loved by our team.
            </p>
          </div>
          <Link href="/products?is_featured=true">
            <Button variant="outline" className="group">
              Explore All
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Product Slider */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-card shadow-soft hidden md:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-card shadow-soft hidden md:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto hide-scrollbar pb-4"
            >
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="min-w-[280px] md:min-w-[300px]">
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              No featured products available.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
