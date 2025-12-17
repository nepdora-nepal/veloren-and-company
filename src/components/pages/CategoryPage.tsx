"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronDown, Grid3X3, LayoutGrid, X, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { useProductsWithParams, useCategories } from "@/hooks/use-product";
import { Checkbox } from "@/components/ui/checkbox";

const priceRanges = ["Under $1000", "$1000 - $2000", "$2000 - $5000", "Over $5000"];

interface CategoryPageProps {
  type?: "category" | "featured" | "popular";
}

const CategoryPage = ({ type = "category" }: CategoryPageProps) => {
  const params = useParams();
  const slug = params?.slug as string;
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [selectedFilters, setSelectedFilters] = useState<{
    categories: string[];
    priceRanges: string[];
  }>({
    categories: [],
    priceRanges: [],
  });

  // Fetch category data (only if type is "category")
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.results || [];
  const category = type === "category" ? categories.find((c) => c.slug === slug) : null;

  // Price range mapping
  const priceRangeMap: Record<string, { min: number; max: number | undefined }> = {
    "Under $1000": { min: 0, max: 1000 },
    "$1000 - $2000": { min: 1000, max: 2000 },
    "$2000 - $5000": { min: 2000, max: 5000 },
    "Over $5000": { min: 5000, max: undefined },
  };

  // Calculate min and max price from selected ranges
  let minPrice: number | undefined;
  let maxPrice: number | undefined;

  if (selectedFilters.priceRanges.length > 0) {
    const selectedRanges = selectedFilters.priceRanges.map(range => priceRangeMap[range]);
    const mins = selectedRanges.map(r => r.min);
    const maxs = selectedRanges.map(r => r.max);

    minPrice = Math.min(...mins);
    // If any selected range has undefined max (e.g. "Over $50"), maxPrice should be undefined (no upper limit)
    const hasOpenUpper = maxs.includes(undefined);
    if (!hasOpenUpper) {
        maxPrice = Math.max(...(maxs as number[]));
    }
  }

  // Determine query params based on type
  
  let sortField = "is_popular";
  let sortOrder: "asc" | "desc" = "desc";

  switch (sortBy) {
    case "popular":
      sortField = "is_popular";
      sortOrder = "desc";
      break;
    case "newest":
      sortField = "created_at";
      sortOrder = "desc";
      break;
    case "price-low":
      sortField = "price";
      sortOrder = "asc";
      break;
    case "price-high":
      sortField = "price";
      sortOrder = "desc";
      break;
    case "rating":
      sortField = "average_rating";
      sortOrder = "desc";
      break;
      default:
        sortField = "is_popular";
        sortOrder = "desc";
  }

  const queryParams = {
    page_size: 50,
    sortBy: sortField,
    sortOrder: sortOrder,
    ...(type === "category" ? { category: Array.from(new Set([slug, ...selectedFilters.categories].filter(Boolean))) } : 
       (selectedFilters.categories.length > 0 ? { category: selectedFilters.categories } : {})),
    ...(type === "featured" ? { is_featured: true } : {}),
    ...(type === "popular" ? { is_popular: true } : {}),
    ...(minPrice !== undefined ? { min_price: minPrice } : {}),
    ...(maxPrice !== undefined ? { max_price: maxPrice } : {}),
  };

  // Fetch products
  const { data: productsData, isLoading } = useProductsWithParams(queryParams);
  const filteredProducts = productsData?.results || [];

  const toggleFilter = (filterType: "categories" | "priceRanges", value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? []
        : [value],
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({ categories: [], priceRanges: [] });
  };

  const activeFilterCount =
    selectedFilters.categories.length +
    selectedFilters.priceRanges.length;

  // Determine Page Title
  const getPageTitle = () => {
      if (type === "featured") return "Featured Products";
      if (type === "popular") return "Popular Products";
      return category ? category.name : "All Products";
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-28 pb-16">
        <div className="container-luxury">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {getPageTitle()}
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

                {/* Categories Filter */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Categories
                  </h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <Checkbox
                          checked={selectedFilters.categories.includes(cat.slug) || (type === "category" && cat.slug === slug)}
                          onCheckedChange={() => toggleFilter("categories", cat.slug)}
                          disabled={type === "category" && cat.slug === slug} // Disable current category if in valid view
                        />
                        <span className={`text-sm transition-colors ${
                             (type === "category" && cat.slug === slug) ? "text-foreground font-medium" : "group-hover:text-foreground"
                          }`}>
                          {cat.name}
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
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => toggleFilter("categories", cat.slug)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            selectedFilters.categories.includes(cat.slug) || (type === "category" && cat.slug === slug)
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary hover:bg-accent"
                          }`}
                          disabled={type === "category" && cat.slug === slug}
                        >
                          {cat.name}
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
