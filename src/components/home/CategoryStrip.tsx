"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useCategories } from "@/hooks/use-product";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CategoryStrip = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data, isLoading } = useCategories();
  const categories = data?.results || [];

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  if (isLoading) {
    return (
      <section className="py-8 bg-card border-y border-border">
        <div className="container-luxury flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-card border-y border-border">
      <div className="container-luxury">
        <div className="relative">
          {/* Scroll Buttons */}
          {canScrollLeft && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card shadow-soft"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          {canScrollRight && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-card shadow-soft"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}

          {/* Categories */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto hide-scrollbar px-8"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="flex flex-col items-center gap-2 px-6 py-4 bg-secondary rounded-2xl min-w-[100px] hover:bg-accent transition-all duration-300 group"
                >
                  {category.image ? (
                    <div className="w-8 h-8 relative">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      📦
                    </span>
                  )}
                  <span className="text-sm font-medium whitespace-nowrap">
                    {category.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
