"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/use-wishlist";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/product";

const WishlistPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: wishlistItems, isLoading } = useWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { addToCart } = useCart();

  // Redirect if not authenticated
  if (!isAuthenticated && typeof window !== "undefined") {
    router.push("/auth");
    return null;
  }

  const handleRemove = (wishlistItemId: number) => {
    removeFromWishlist(wishlistItemId);
  };

  const addToBag = (product: Product) => {
    addToCart(product, 1);
    toast.success("Added to bag", {
      description: `${product.name} added to your bag.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
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
                {wishlistItems.length} saved items
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card rounded-3xl overflow-hidden border border-border hover:shadow-medium transition-all"
              >
                {/* Image */}
                <Link href={`/product/${item.product.slug || item.product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-secondary">
                    {item.product.thumbnail_image ? (
                        <Image
                          src={item.product.thumbnail_image}
                          alt={item.product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                    )}
                    {item.product.is_popular && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-rose text-rose-foreground text-xs font-medium rounded-full">
                        POPULAR
                      </span>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{item.product.category?.name}</p>
                    <Link href={`/product/${item.product.slug || item.product.id}`}>
                      <h3 className="font-medium line-clamp-2 hover:text-muted-foreground transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold">
                      ${parseFloat(item.product.price).toFixed(2)}
                    </span>
                    {item.product.market_price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${parseFloat(item.product.market_price).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => addToBag(item.product)}
                      className="flex-1 gap-2"
                      size="sm"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Bag
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemove(item.id)}
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
