"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/* ------------------------------- API Imports ------------------------------ */
import { productApi, ProductFilterParams } from "@/services/product";

/* -------------------------------------------------------------------------- */
/*                          PRODUCT FILTERS FROM URL                          */
/* -------------------------------------------------------------------------- */
export const useProductFilters = (): ProductFilterParams => {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const filters: ProductFilterParams = {};

    // Pagination params
    const page = searchParams.get("page");
    const pageSize = searchParams.get("page_size");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");

    // Filter params
    const category = searchParams.get("category");
    const subCategory = searchParams.get("sub_category");
    const categoryId = searchParams.get("category_id");
    const subCategoryId = searchParams.get("sub_category_id");
    const isFeatured = searchParams.get("is_featured");
    const isPopular = searchParams.get("is_popular");
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    const inStock = searchParams.get("in_stock");

    if (page) filters.page = parseInt(page);
    if (pageSize) filters.page_size = parseInt(pageSize);
    if (search) filters.search = search;
    if (sortBy) filters.sortBy = sortBy;
    if (sortOrder === "asc" || sortOrder === "desc") filters.sortOrder = sortOrder;
    if (category) filters.category = category;
    if (subCategory) filters.sub_category = subCategory;
    if (categoryId) filters.category_id = parseInt(categoryId);
    if (subCategoryId) filters.sub_category_id = parseInt(subCategoryId);
    if (isFeatured) filters.is_featured = isFeatured === "true";
    if (isPopular) filters.is_popular = isPopular === "true";
    if (minPrice) filters.min_price = parseFloat(minPrice);
    if (maxPrice) filters.max_price = parseFloat(maxPrice);
    if (inStock) filters.in_stock = inStock === "true";

    return filters;
  }, [searchParams]);
};

/* -------------------------------------------------------------------------- */
/*                              PRODUCT GET HOOKS                             */
/* -------------------------------------------------------------------------- */

// Get products (auto reads filters from URL)
export const useProducts = (extraParams: ProductFilterParams = {}) => {
  const urlFilters = useProductFilters();
  const params = { ...urlFilters, ...extraParams };

  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productApi.getProducts(params),
  });
};

// Get products with custom params (ignores URL filters)
export const useProductsWithParams = (params: ProductFilterParams = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productApi.getProducts(params),
    select: (data) => {
      // Redundantly filter products client-side in case backend filtering is incomplete or unsupported
      let filteredResults = data.results;
      
      if (params.is_popular !== undefined) {
        filteredResults = filteredResults.filter(p => p.is_popular === params.is_popular);
      }
      
      if (params.is_featured !== undefined) {
        filteredResults = filteredResults.filter(p => p.is_featured === params.is_featured);
      }
      
      return {
        ...data,
        results: filteredResults,
        count: filteredResults.length,
      };
    },
  });
};

// Get single product
export const useProduct = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => (slug ? productApi.getProduct(slug) : Promise.resolve(null)),
    enabled: !!slug,
  });
};

/* -------------------------------------------------------------------------- */
/*                            CATEGORY GET HOOKS                              */
/* -------------------------------------------------------------------------- */

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => productApi.getCategories(),
  });
};

/* -------------------------------------------------------------------------- */
/*                          SUBCATEGORY GET HOOKS                             */
/* -------------------------------------------------------------------------- */

export const useSubCategories = () => {
  return useQuery({
    queryKey: ["subcategories"],
    queryFn: () => productApi.getSubCategories(),
  });
};

/* -------------------------------------------------------------------------- */
/*                           URL FILTER UPDATE HOOK                           */
/* -------------------------------------------------------------------------- */
export const useUpdateFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = (filters: Partial<ProductFilterParams>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") params.delete(key);
      else params.set(key, String(value));
    });

    if (!filters.page) params.set("page", "1");

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    router.push(window.location.pathname, { scroll: false });
  };

  return { updateFilters, clearFilters };
};
