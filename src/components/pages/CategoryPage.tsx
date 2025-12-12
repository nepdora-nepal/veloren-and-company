"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronDown, Grid3X3, LayoutGrid, X, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { useProductsWithParams, useCategories } from "@/hooks/use-product";
import { Checkbox } from "@/components/ui/checkbox";

const skinTypes = ["All Skin Types", "Oily", "Dry", "Combination", "Sensitive", "Normal"];
const priceRanges = ["Under $15", "$15 - $30", "$30 - $50", "Over $50"];

const CategoryPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [selectedFilters, setSelectedFilters] = useState<{
    skinTypes: string[];
    priceRanges: string[];
  }>({
    skinTypes: [],
    priceRanges: [],
  });

  // Fetch category data
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.results || [];
  const category = categories.find((c) => c.slug === slug);

  // Fetch products by category
  const { data: productsData, isLoading } = useProductsWithParams({
    category: slug,
    page_size: 50,
  });
  const filteredProducts = productsData?.results || [];

  const toggleFilter = (type: "skinTypes" | "priceRanges", value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value],
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({ skinTypes: [], priceRanges: [] });
  };

  const activeFilterCount =
    selectedFilters.skinTypes.length +
    selectedFilters.priceRanges.length;

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-28 pb-16">
        <div className="container-luxury">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {category ? category.name : "All Products"}
            </h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} products
            </p>
          </motion.div>

          <div className="flex gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-28 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Filters</h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Skin Type Filter */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Skin Type
                  </h4>
                  <div className="space-y-2">
                    {skinTypes.map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <Checkbox
                          checked={selectedFilters.skinTypes.includes(type)}
                          onCheckedChange={() => toggleFilter("skinTypes", type)}
                        />
                        <span className="text-sm group-hover:text-foreground transition-colors">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Price Range
                  </h4>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label
                        key={range}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <Checkbox
                          checked={selectedFilters.priceRanges.includes(range)}
                          onCheckedChange={() => toggleFilter("priceRanges", range)}
                        />
                        <span className="text-sm group-hover:text-foreground transition-colors">
                          {range}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories Filter */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Categories
                  </h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <a
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className={`block text-sm transition-colors ${
                          cat.slug === slug
                            ? "text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {cat.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-secondary px-4 py-2 pr-10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
                </div>

                {/* Grid Toggle */}
                <div className="hidden md:flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => setGridCols(3)}
                    className={`p-2 rounded-lg transition-colors ${
                      gridCols === 3 ? "bg-secondary" : "hover:bg-secondary"
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setGridCols(4)}
                    className={`p-2 rounded-lg transition-colors ${
                      gridCols === 4 ? "bg-secondary" : "hover:bg-secondary"
                    }`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mobile Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden mb-6 p-4 bg-card rounded-2xl border border-border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Filters</h3>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Mobile filter content - simplified */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {skinTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => toggleFilter("skinTypes", type)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            selectedFilters.skinTypes.includes(type)
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary hover:bg-accent"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Products Grid */}
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredProducts.length > 0 ? (
                <div
                  className={`grid gap-4 md:gap-6 ${
                    gridCols === 3
                      ? "grid-cols-2 md:grid-cols-3"
                      : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  }`}
                >
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">
                    No products found. Try adjusting your filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;
