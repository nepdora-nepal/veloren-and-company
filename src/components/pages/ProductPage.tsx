"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { useProduct, useProductsWithParams } from "@/hooks/use-product";
import { ProductCard } from "@/components/products/ProductCard";

const ProductPage = () => {
  const params = useParams();
  const slug = params?.slug as string;

  const { data: product, isLoading, error } = useProduct(slug);
  const { data: relatedData } = useProductsWithParams({
    category_id: product?.category?.id,
    page_size: 4,
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

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

  const handleAddToCart = () => {
    if (!product) return;
    toast.success("Added to bag", {
      description: `${quantity}x ${product.name} added to your bag.`,
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Product not found</p>
        <Button asChild>
          <Link href="/shop">Back to Shop</Link>
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
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/shop"
              className="hover:text-foreground transition-colors"
            >
              Shop
            </Link>
            {product.category && (
              <>
                <ChevronRight className="w-4 h-4" />
                <Link
                  href={`/category/${product.category.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 mb-20">
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
                <div className="flex gap-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-xl overflow-hidden transition-all relative ${
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
              className="space-y-6"
            >
              {/* Category & Badges */}
              <div className="flex items-center gap-3">
                {product.category && (
                  <span className="text-sm text-muted-foreground">
                    {product.category.name}
                  </span>
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

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">
                  ${price.toFixed(2)}
                </span>
                {marketPrice && marketPrice > price && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${marketPrice.toFixed(2)}
                    </span>
                    <span className="px-2 py-1 bg-peach text-peach-foreground text-sm font-medium rounded-lg">
                      Save ${discount.toFixed(2)}
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
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-3 bg-secondary rounded-xl p-1">
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
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="h-14 w-14"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isWishlisted ? "fill-rose-foreground text-rose-foreground" : ""
                    }`}
                  />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
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
