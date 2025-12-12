"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCard";
import { useProductsWithParams } from "@/hooks/use-product";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export const TrendingProducts = () => {
  const { data, isLoading } = useProductsWithParams({
    is_popular: true,
    page_size: 4,
  });

  const trendingProducts = data?.results || [];

  return (
    <section className="py-16 md:py-24">
      <div className="container-luxury">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Trending Now</h2>
            <p className="text-muted-foreground max-w-md">
              Discover what everyone&apos;s loving right now. These fan-favorites are
              flying off our shelves.
            </p>
          </div>
          <Link href="/shop">
            <Button variant="outline" className="group">
              View All
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : trendingProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {trendingProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            No trending products available at the moment.
          </p>
        )}
      </div>
    </section>
  );
};
