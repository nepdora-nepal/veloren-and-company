"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { useProductsWithParams, useCategories } from "@/hooks/use-product";

const BrandPage = () => {
  const params = useParams();
  const slug = params?.id as string;
  
  // Fetch products (since there's no brand API, we show all products for now)
  const { data: productsData, isLoading } = useProductsWithParams({
    page_size: 20,
  });
  
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.results || [];
  const brandProducts = productsData?.results || [];

  // Placeholder brand info (can be replaced when brands API is available)
  const brand = {
    id: slug,
    name: slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ") : "Brand",
    description: "Discover our curated collection of premium skincare products, formulated with the finest ingredients for visible results.",
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20">
        {/* Hero Banner */}
        <section className="relative bg-linear-to-br from-rose via-accent to-beige py-20 md:py-32">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-peach/40 rounded-full blur-3xl" />
          </div>
          <div className="container-luxury relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <span className="inline-block px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                Featured Brand
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {brand.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                {brand.description}
              </p>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{brandProducts.length}</p>
                  <p className="text-sm text-muted-foreground">Products</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <p className="text-3xl font-bold">4.8★</p>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 md:py-24">
          <div className="container-luxury">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl md:text-3xl font-bold">
                All {brand.name} Products
              </h2>
              <select className="bg-secondary px-4 py-2 rounded-xl text-sm focus:outline-none">
                <option>Most Popular</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : brandProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {brandProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">
                  No products available for this brand yet.
                </p>
                <Link href="/shop">
                  <Button>Browse All Products</Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Why This Brand Section */}
        <section className="py-16 md:py-24 bg-secondary/50">
          <div className="container-luxury">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Why We Love {brand.name}
              </h2>
              <p className="text-muted-foreground mb-8">
                {brand.name} combines centuries-old Korean beauty wisdom with modern
                skincare science. Their products are formulated with traditional
                ingredients like rice, ginseng, and hanbang herbs, delivering
                effective results without harsh chemicals. Each product is crafted
                with care to bring you the best of K-beauty.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                {[
                  {
                    icon: "🌿",
                    title: "Natural Ingredients",
                    desc: "Hanbang-inspired formulas",
                  },
                  {
                    icon: "🧪",
                    title: "Science-Backed",
                    desc: "Clinically tested efficacy",
                  },
                  {
                    icon: "💚",
                    title: "Cruelty-Free",
                    desc: "Never tested on animals",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-card p-6 rounded-2xl shadow-soft"
                  >
                    <span className="text-3xl mb-4 block">{item.icon}</span>
                    <h3 className="font-medium mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Explore Categories */}
        <section className="py-16">
          <div className="container-luxury">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Explore Categories</h2>
              <Link href="/shop">
                <Button variant="outline" className="gap-2">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="p-6 bg-card rounded-2xl border border-border hover:shadow-medium transition-all text-center group"
                >
                  <h3 className="font-medium group-hover:text-muted-foreground transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    View products
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BrandPage;
