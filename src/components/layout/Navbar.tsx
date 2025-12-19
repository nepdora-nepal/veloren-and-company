"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/use-auth";
import { useWishlist } from "@/hooks/use-wishlist";
import { useDebounce } from "@/hooks/use-debounce";
import { useProducts, useCategories } from "@/hooks/use-product";


export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const { openCart, totalItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { data: wishlist } = useWishlist();
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: categoriesData } = useCategories();
  const categories = useMemo(() => categoriesData?.results || [], [categoriesData]);

  const { data: searchResults, isLoading: isSearching } = useProducts({ 
    search: debouncedSearch,
    category: selectedCategory === "All" ? undefined : selectedCategory,
    page_size: 5 
  });

  // Only show dropdown when typing and focused
  const showDropdown = (isSearchFocused || isMobileSearchOpen) && searchQuery.length > 0;

  const handleProductClick = (slug: string) => {
    router.push(`/product/${slug}`);
    setIsMobileSearchOpen(false);
    setIsSearchFocused(false);
    setSearchQuery("");
  };

  const executeSearch = () => {
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set("search", searchQuery.trim());
      
      if (selectedCategory !== "All") {
        params.set("category", selectedCategory);
      }
      
      router.push(`/products?${params.toString()}`);
      setIsMobileSearchOpen(false);
      setIsSearchFocused(false);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeSearch();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync selected category with URL if on a category page
  useEffect(() => {
    if (slug && categories.length > 0) {
      const currentCat = categories.find(c => c.slug === slug);
      if (currentCat && currentCat.name !== selectedCategory) {
        const timer = setTimeout(() => setSelectedCategory(currentCat.name), 0);
        return () => clearTimeout(timer);
      }
    } else if (!slug && selectedCategory !== "All" && typeof window !== 'undefined' && !window.location.search.includes('category=')) {
      const timer = setTimeout(() => setSelectedCategory("All"), 0);
      return () => clearTimeout(timer);
    }
  }, [slug, categories, selectedCategory]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-xl shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container-luxury">
        <div className="flex items-center justify-between h-20 gap-4">
          {isMobileSearchOpen ? (
            // Mobile Search Active View
            <div className="flex items-center w-full gap-1 md:hidden animate-in fade-in slide-in-from-top-2 duration-200 relative">
              <div className="flex-1 relative flex items-center bg-secondary rounded-xl px-2">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search products..."
                  className="w-full pl-2 py-2 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 px-2 text-xs"
                onClick={() => setIsMobileSearchOpen(false)}
              >
                Cancel
              </Button>
              
              {/* Mobile Search Dropdown */}
              <AnimatePresence>
                {searchQuery.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-elevated border border-border overflow-hidden z-50 max-h-[calc(100vh-120px)] overflow-y-auto"
                  >
                        {isSearching ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
                        ) : searchResults?.results && searchResults.results.length > 0 ? (
                        <div className="py-2">
                            {searchResults.results.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => handleProductClick(product.slug || String(product.id))}
                                    className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3 border-b border-border/50 last:border-0"
                                >
                                    <div className="w-10 h-10 bg-secondary rounded-md overflow-hidden shrink-0 relative">
                                        {product.thumbnail_image && (
                                            <Image 
                                              src={product.thumbnail_image} 
                                              alt={product.name} 
                                              fill
                                              className="object-cover" 
                                            />
                                        )}
                                    </div> 
                                    <div>
                                        <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                                        <p className="text-xs text-muted-foreground">${parseFloat(product.price).toFixed(2)}</p>
                                    </div>
                                </button>
                            ))}
                            <button 
                                onClick={executeSearch}
                                className="w-full px-4 py-3 text-center text-sm text-primary font-medium hover:bg-secondary transition-colors sticky bottom-0 bg-card border-t border-border"
                            >
                                View all results
                            </button>
                        </div>
                        ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">No products found</div>
                        )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight">GLOW</span>
              </Link>

              {/* Search Bar - Center (Desktop) */}
              <div className="hidden md:flex flex-1 max-w-xl mx-8">
                <div
                  className={`relative w-full flex items-center rounded-2xl transition-all duration-300 ${
                    isSearchFocused
                      ? "bg-card shadow-medium ring-1 ring-border"
                      : "bg-secondary"
                  }`}
                >
                  {/* Category Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-r border-border"
                    >
                      {selectedCategory}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {isCategoryOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-card rounded-xl shadow-elevated border border-border overflow-hidden z-50"
                        >
                          <Link href="/products">
                          <button
                            onClick={() => {
                              setSelectedCategory("All");
                              setIsCategoryOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-secondary transition-colors"
                          >
                            All Categories
                          </button>
                          </Link>
                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/category/${cat.slug}`}
                              onClick={() => {
                                setSelectedCategory(cat.name);
                                setIsCategoryOpen(false);
                              }}
                              className="w-full px-4 py-3 text-left text-sm hover:bg-secondary transition-colors flex items-center gap-2"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Search Input */}
                  <div className="flex-1 flex items-center">
                    <Search className="w-5 h-5 text-muted-foreground ml-3" />
                    <input
                      type="text"
                      placeholder="Search for products, brands..."
                      className="w-full px-3 py-3 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // Delay to allow click
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearch}
                    />
                  </div>

                  {/* Desktop Search Dropdown */}
                  <AnimatePresence>
                    {showDropdown && isSearchFocused && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-elevated border border-border overflow-hidden z-50 max-h-[400px] overflow-y-auto"
                      >
                         {isSearching ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
                         ) : searchResults?.results && searchResults.results.length > 0 ? (
                            <div className="py-2">
                                {searchResults.results.map((product) => (
                                    <button
                                        key={product.id}
                                        onClick={() => handleProductClick(product.slug || String(product.id))}
                                        className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3 border-b border-border/50 last:border-0"
                                    >
                                        <div className="w-10 h-10 bg-secondary rounded-md overflow-hidden shrink-0 relative">
                                            {product.thumbnail_image && (
                                              <Image 
                                                src={product.thumbnail_image} 
                                                alt={product.name} 
                                                fill
                                                className="object-cover" 
                                              />
                                            )}
                                        </div> 
                                        <div>
                                            <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                                            <p className="text-xs text-muted-foreground">${parseFloat(product.price).toFixed(2)}</p>
                                        </div>
                                    </button>
                                ))}
                                <button 
                                    onClick={executeSearch}
                                    className="w-full px-4 py-3 text-center text-sm text-primary font-medium hover:bg-secondary transition-colors sticky bottom-0 bg-card border-t border-border"
                                >
                                    View all results
                                </button>
                            </div>
                         ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">No products found</div>
                         )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Icons */}
              <div className="flex items-center gap-1">
                {/* Mobile Search Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMobileSearchOpen(true)}
                >
                  <Search className="w-5 h-5" />
                </Button>

                <Link href={isAuthenticated ? "/profile" : "/auth"}>
                  {isAuthenticated && user ? (
                    <Avatar className="h-9 w-9 border-2 border-background shadow-sm hover:ring-2 hover:ring-primary/20 transition-all hidden md:block">
                      <AvatarImage src="" alt={user.first_name || "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                        {(user.first_name?.[0] || "U").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Button variant="ghost" size="icon" className="hidden md:flex">
                      <User className="w-5 h-5" />
                    </Button>
                  )}
                </Link>
                <Link href="/wishlist">
                  <Button variant="ghost" size="icon" className="hidden cursor-pointer md:flex relative">
                    <Heart className="w-5 h-5" />
                    {wishlist && wishlist.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background text-xs rounded-full flex items-center justify-center font-medium">
                        {wishlist.length}
                      </span>
                    )}
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="relative cursor-pointer" onClick={openCart}>
                  <ShoppingBag className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background text-xs rounded-full flex items-center justify-center font-medium">
                      {totalItems}
                    </span>
                  )}
                </Button>

                {/* Mobile Menu Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-t border-border"
          >
            <div className="container-luxury py-6 space-y-4">
              <Link
                href={isAuthenticated ? "/profile" : "/auth"}
                className="flex items-center gap-3 py-3 text-foreground hover:text-muted-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                Account
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-3 py-3 text-foreground hover:text-muted-foreground transition-colors justify-between"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5" />
                  Wishlist
                </div>
                {wishlist && wishlist.length > 0 && (
                  <span className="bg-foreground text-background text-xs rounded-full px-2 py-0.5 font-medium">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Categories
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="flex items-center gap-2 py-2 px-3 bg-secondary rounded-xl text-sm hover:bg-accent transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
