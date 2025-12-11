"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { toast } from "sonner";

const WishlistPage = () => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(["1", "3", "5", "8"]);

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const removeFromWishlist = (productId: string) => {
    setWishlistIds((ids) => ids.filter((id) => id !== productId));
    toast("Removed from wishlist", {
      description: "Product has been removed from your wishlist.",
    });
  };

  const addToBag = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    toast.success("Added to bag", {
      description: `${product?.name} added to your bag.`,
    });
  };

  if (wishlistProducts.length === 0) {
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
                <Heart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
              <p className="text-muted-foreground mb-8">
                Save your favorite products here for later.
              </p>
              <Link href="/products">
                <Button size="lg">Browse Products</Button>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">My Wishlist</h1>
              <p className="text-muted-foreground mt-1">
                {wishlistProducts.length} saved items
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card rounded-3xl overflow-hidden border border-border hover:shadow-medium transition-all"
              >
                {/* Image */}
                <Link href={`/product/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-secondary">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isBestSeller && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-rose text-rose-foreground text-xs font-medium rounded-full">
                        BEST SELLER
                      </span>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-medium line-clamp-2 hover:text-muted-foreground transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => addToBag(product.id)}
                      className="flex-1 gap-2"
                      size="sm"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Bag
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromWishlist(product.id)}
                      className="h-9 w-9"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WishlistPage;
