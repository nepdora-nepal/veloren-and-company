"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
  Loader2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { useProduct, useProductsWithParams, useCategories } from "@/hooks/use-product";
import { ProductCard } from "@/components/products/ProductCard";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/hooks/use-wishlist";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/contexts/CartContext";
import { useReviews, useCreateReview } from "@/hooks/use-review";
import { format } from "date-fns";

const ProductPage = () => {
  const params = useParams();
  const slug = (params?.slug as string) || (params?.id as string);

  const { data: product, isLoading, error } = useProduct(slug);
  const { data: reviewsData } = useReviews(slug);
  console.log("ProductPage Render:", { slug, reviewsData });
  const { mutate: createReview, isPending: isSubmittingReview } = useCreateReview();



  const { data: relatedData } = useProductsWithParams({
    category_id: product?.category?.id,
    page_size: 4,
  });

  const { data: categoriesData } = useCategories();
  const categorySlug = product?.category?.slug || 
    categoriesData?.results?.find((c) => c.id === product?.category?.id)?.slug || 
    null;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(4);
  
  const router = useRouter();

  const { isAuthenticated, tokens, logout } = useAuth();
  const { data: wishlist } = useWishlist();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { addToCart } = useCart();

  const wishlistItem = useMemo(() => 
    wishlist?.find((item) => item.product.id === product?.id), 
    [wishlist, product?.id]
  );

  const isWishlisted = !!wishlistItem;

  const handleWishlistClick = () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      toast.error("Please login to use wishlist");
      router.push("/auth");
      return;
    }

    if (isWishlisted) {
      if (wishlistItem) {
        removeFromWishlist(wishlistItem.id);
      }
    } else {
      addToWishlist(product.id);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success("Added to bag", {
      description: `${quantity}x ${product.name} added to your bag.`,
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !tokens?.access) return;
    
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    createReview(
      { 
        data: { 
          product_id: product.id, 
          rating, 
          comment 
        }, 
        token: tokens.access,
        slug: slug
      },
      {
        onSuccess: () => {
          toast.success("Review submitted successfully");
          setComment("");
          setRating(5);
        },
        onError: (error) => {
          const msg = error.message;
          if (msg.includes("User not found") || msg.includes("401") || msg.includes("Session expired")) {
             toast.error("Your session has expired. Please log in again.");
             logout(); 
             return;
          }
          toast.error(msg || "Failed to submit review");
        }
      }
    );
  };

  // Build images array from product data
  const images: string[] = product
    ? [
        product.thumbnail_image,
        ...(product.images?.map((img) => img.image) || []),
      ].filter((img): img is string => Boolean(img))
    : [];

  // Filter out current product from related products
  const relatedProducts =
    relatedData?.results?.filter((p) => p.id !== product?.id) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Product not found</p>
        <Button asChild>
          <Link href="/products">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  const price = parseFloat(product.price);
  const marketPrice = product.market_price
    ? parseFloat(product.market_price)
    : null;
  const discount = marketPrice ? marketPrice - price : 0;

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-28 pb-16">
        <div className="container-luxury">
          {/* Breadcrumb */}
          <nav className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <Link
              href="/products"
              className="hover:text-foreground transition-colors"
            >
              Shop
            </Link>
            {product.category && (
              <>
                <ChevronRight className="w-4 h-4 shrink-0" />
                <Link
                  href={categorySlug ? `/category/${categorySlug}` : `/products?category_id=${product.category.id}`}
                  className="hover:text-foreground transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-4 h-4 shrink-0" />
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-20">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="aspect-square bg-secondary rounded-3xl overflow-hidden relative">
                {images[selectedImage] ? (
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full relative"
                  >
                    <Image
                      src={images[selectedImage]}
                      alt={product.thumbnail_alt_description || product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image available
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-xl overflow-hidden transition-all relative shrink-0 ${
                        selectedImage === index
                          ? "ring-2 ring-primary ring-offset-2"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Category & Badges & Rating */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center flex-wrap gap-3">
                  {product.category && (
                    <Link 
                      href={categorySlug ? `/category/${categorySlug}` : `/products?category_id=${product.category.id}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {product.category.name}
                    </Link>
                  )}
                  {product.is_popular && (
                    <span className="px-3 py-1 bg-rose text-rose-foreground text-xs font-medium rounded-full">
                      POPULAR
                    </span>
                  )}
                  {product.is_featured && (
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      FEATURED
                    </span>
                  )}
                </div>

                {/* Rating Summary */}
                {product.average_rating ? (
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < Math.round(product.average_rating!) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                                />
                            ))}
                        </div>
                        <span className="text-sm font-medium">{product.average_rating}</span>
                        {product.reviews_count ? (
                            <span className="text-sm text-muted-foreground">({product.reviews_count} reviews)</span>
                        ) : null}
                    </div>
                ) : null}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold">
                  Rs.{price}
                </span>
                {marketPrice && marketPrice > price && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      Rs.{marketPrice}
                    </span>
                    <span className="px-2 py-1 bg-peach text-peach-foreground text-sm font-medium rounded-lg">
                      Save Rs.{discount}
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              {product.track_stock && (
                <div className="flex items-center gap-2">
                  {product.stock && product.stock > 0 ? (
                    <span className="text-sm text-green-600">
                      ✓ In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="text-sm text-red-600">Out of Stock</span>
                  )}
                </div>
              )}

              {/* Subcategory */}
              {product.sub_category && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Category
                  </p>
                  <span className="px-3 py-1.5 bg-secondary rounded-full text-sm">
                    {product.sub_category.name}
                  </span>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center gap-3 bg-secondary rounded-xl p-1 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-3 flex-1">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 gap-2"
                    size="lg"
                    disabled={product.track_stock && (!product.stock || product.stock < 1)}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Bag
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleWishlistClick}
                    className="h-12 w-12 sm:h-11 sm:w-11"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isWishlisted ? "fill-rose-foreground text-rose-foreground" : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
                {product.fast_shipping && (
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="w-5 h-5 text-muted-foreground" />
                    <span>Fast Shipping</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <RotateCcw className="w-5 h-5 text-muted-foreground" />
                  <span>Easy returns</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <span>100% authentic</span>
                </div>
              </div>

              {/* Accordion */}
              <Accordion type="single" collapsible className="pt-4">
                <AccordionItem value="description">
                  <AccordionTrigger>Description</AccordionTrigger>
                  <AccordionContent>
                    {product.description ? (
                      <div
                        className="text-muted-foreground prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    ) : (
                      <p className="text-muted-foreground">
                        No description available.
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
                
                {/* Reviews Accordion Item */}
                <AccordionItem value="reviews">
                    <AccordionTrigger>Reviews ({reviewsData?.count ?? product.reviews_count ?? 0})</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-8">
                            {/* Write Review Section */}
                            {isAuthenticated ? (
                                <form onSubmit={handleSubmitReview} className="bg-secondary/30 p-6 rounded-2xl space-y-4">
                                    <h3 className="font-semibold">Write a Review</h3>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm text-muted-foreground">Rating</label>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className="focus:outline-none transition-transform active:scale-95"
                                                >
                                                    <Star 
                                                        className={`w-6 h-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-muted-foreground">Comment</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Share your thoughts about this product..."
                                            className="w-full min-h-[100px] p-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
                                            required
                                        />
                                    </div>

                                    <Button 
                                        type="submit" 
                                        disabled={isSubmittingReview || !comment.trim()}
                                    >
                                        {isSubmittingReview ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit Review"
                                        )}
                                    </Button>
                                </form>
                            ) : (
                                <div className="bg-secondary/30 p-6 rounded-2xl text-center space-y-2">
                                    <p className="font-medium">Want to write a review?</p>
                                    <p className="text-sm text-muted-foreground mb-4">You need to be logged in to leave a review.</p>
                                    <Button variant="outline" asChild>
                                        <Link href="/auth">Log in</Link>
                                    </Button>
                                </div>
                            )}

                            {/* Reviews List */}
                            <div className="space-y-6">
                                {reviewsData?.results && reviewsData.results.length > 0 ? (
                                    <>
                                        {reviewsData.results.slice(0, visibleReviewsCount).map((review) => (
                                            <div key={review.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium">{`${review.user.first_name} ${review.user.last_name}`}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {format(new Date(review.created_at), "MMM d, yyyy")}
                                                    </span>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{review.comment}</p>
                                            </div>
                                        ))}

                                        {reviewsData.results.length > visibleReviewsCount && (
                                            <Button
                                                variant="outline"
                                                onClick={() => setVisibleReviewsCount((prev) => prev + 4)}
                                                className="w-full mt-4"
                                            >
                                                View More Reviews
                                            </Button>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-muted-foreground text-sm">No reviews yet.</p>
                                )}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {product.warranty && (
                  <AccordionItem value="warranty">
                    <AccordionTrigger>Warranty</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{product.warranty}</p>
                    </AccordionContent>
                  </AccordionItem>
                )}
                <AccordionItem value="shipping">
                  <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-muted-foreground">
                      <p>Free standard shipping on orders over $50</p>
                      <p>Express shipping available at checkout</p>
                      <p>30-day easy returns on unopened products</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.slice(0, 4).map((relatedProduct, index) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                    index={index}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
