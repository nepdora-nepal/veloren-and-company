"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const price = parseFloat(product.price);
  const marketPrice = product.market_price ? parseFloat(product.market_price) : null;
  const discount = marketPrice && marketPrice > price
    ? Math.round(((marketPrice - price) / marketPrice) * 100)
    : null;

  const productUrl = `/product/${product.slug || product.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="space-y-3">
        {/* Image Container */}
        <Link href={productUrl} className="block">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
            {product.thumbnail_image ? (
              <motion.div
                className="w-full h-full relative"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Image
                  src={product.thumbnail_image}
                  alt={product.thumbnail_alt_description || product.name}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image
              </div>
            )}

            {/* Discount Badge */}
            {discount && (
              <span className="absolute top-3 left-3 px-2 py-1 bg-foreground text-background text-xs font-medium rounded-lg">
                -{discount}%
              </span>
            )}

            {/* Popular/Featured Badges */}
            {product.is_popular && (
              <span className="absolute top-3 left-3 px-2 py-1 bg-rose text-rose-foreground text-xs font-medium rounded-lg">
                Popular
              </span>
            )}

            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isWishlisted 
                  ? "bg-foreground text-background" 
                  : "bg-card/80 backdrop-blur-sm text-foreground hover:bg-card"
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
            </button>

            {/* Add to Cart Button */}
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                // TODO: Implement cart functionality for backend products
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-3 right-3 w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center shadow-elevated hover:scale-110 transition-transform"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
        </Link>

        {/* Content */}
        <Link href={productUrl} className="block space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {product.category?.name || "Uncategorized"}
          </p>
          <h3 className="font-medium text-foreground leading-snug line-clamp-2 group-hover:text-muted-foreground transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 pt-1">
            <span className="font-semibold">${price.toFixed(2)}</span>
            {marketPrice && marketPrice > price && (
              <span className="text-sm text-muted-foreground line-through">
                ${marketPrice.toFixed(2)}
              </span>
            )}
          </div>
        </Link>
      </div>
    </motion.div>
  );
};
