"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Star,
  Minus,
  Plus,
  Check,
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { products } from "@/data/products";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

const ProductPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const product = products.find((p) => p.id === id) || products[0];
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const images = [
    product.image,
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
  ];

  const handleAddToCart = () => {
    toast.success("Added to bag", {
      description: `${quantity}x ${product.name} added to your bag.`,
    });
  };

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
              href={`/category/${product.category.toLowerCase()}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category}
            </Link>
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
              <div className="aspect-square bg-secondary rounded-3xl overflow-hidden">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden transition-all ${
                      selectedImage === index
                        ? "ring-2 ring-primary ring-offset-2"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Brand & Badges */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {product.brand}
                </span>
                {product.isBestSeller && (
                  <span className="px-3 py-1 bg-rose text-rose-foreground text-xs font-medium rounded-full">
                    BEST SELLER
                  </span>
                )}
                {product.isNew && (
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    NEW
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-foreground text-foreground"
                          : "text-border"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">
                  ({product.reviews.toLocaleString()} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="px-2 py-1 bg-peach text-peach-foreground text-sm font-medium rounded-lg">
                      Save $
                      {(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Skin Type Tags */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Suitable for
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.skinTypes.map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1.5 bg-secondary rounded-full text-sm"
                    >
                      {type} Skin
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Benefits */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Key Benefits
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-accent rounded-full text-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

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
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="w-5 h-5 text-muted-foreground" />
                  <span>Free shipping $50+</span>
                </div>
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
                    <p className="text-muted-foreground">
                      A lightweight, fast-absorbing serum that delivers intense
                      hydration while brightening and evening out skin tone. Formulated
                      with traditional Korean ingredients for a natural, radiant glow.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="how-to-use">
                  <AccordionTrigger>How to Use</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                      <li>After cleansing and toning, dispense 2-3 drops</li>
                      <li>Gently pat onto face and neck</li>
                      <li>Follow with moisturizer</li>
                      <li>Use morning and evening for best results</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="ingredients">
                  <AccordionTrigger>Key Ingredients</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>
                        <strong>Rice Bran Water:</strong> Brightens and nourishes
                      </li>
                      <li>
                        <strong>Alpha Arbutin:</strong> Fades dark spots
                      </li>
                      <li>
                        <strong>Niacinamide:</strong> Evens skin tone
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
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
              <h2 className="text-2xl font-bold mb-8">Pairs Well With</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
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
