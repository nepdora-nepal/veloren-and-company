"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCard";
import { useProductsWithParams } from "@/hooks/use-product";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export const BestSellers = () => {
  const { data, isLoading } = useProductsWithParams({
    is_popular: true,
    page_size: 8,
  });

  const bestSellers = data?.results || [];

  return (
    <section className="py-16 md:py-24">
      <div className="container-luxury">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-4 mb-12"
        >
          <span className="inline-block px-4 py-2 bg-rose rounded-full text-sm font-medium">
            ⭐ Customer Favorites
          </span>
          <h2 className="text-3xl md:text-4xl font-bold">Best Sellers</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Our most-loved products, chosen by thousands of happy customers
          </p>
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : bestSellers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            {bestSellers.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            No best sellers available at the moment.
          </p>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <Link href="/products?is_popular=true">
            <Button variant="outline" size="lg" className="group">
              View All Best Sellers
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
