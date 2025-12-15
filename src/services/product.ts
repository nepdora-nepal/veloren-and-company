
import { siteConfig } from "@/config/siteConfig";
import {
  GetProductsResponse,
  GetCategoriesResponse,
  GetSubCategoriesResponse,
  Product,
  PaginationParams,
} from "@/types/product";

// Filtering (optional)
export interface ProductFilterParams extends PaginationParams {
  category?: string | string[];
  sub_category?: string | string[];
  category_id?: number | number[];
  sub_category_id?: number | number[];
  is_featured?: boolean;
  is_popular?: boolean;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
}

export const productApi = {
  /* -------------------------------------------------------------------------- */
  /*                                GET PRODUCTS                                */
  /* -------------------------------------------------------------------------- */
  getProducts: async (
    params: ProductFilterParams = {}
  ): Promise<GetProductsResponse> => {
    const {
      page = 1,
      page_size = 10,
      search,
      sortBy,
      sortOrder = "asc",
      category,
      sub_category,
      category_id,
      sub_category_id,
      is_featured,
      is_popular,
      min_price,
      max_price,
      in_stock,
    } = params;

    const API_BASE_URL = siteConfig.backendUrl;
    
    if (!API_BASE_URL) {
      console.error("NEXT_PUBLIC_BACKEND_URL is not set");
      throw new Error("Backend URL is not configured");
    }

    const query = new URLSearchParams({
      page: String(page),
      page_size: String(page_size),
    });

    if (search) query.append("search", search);
    if (sortBy) {
      query.append("sort_by", sortBy);
      query.append("sort_order", sortOrder);
    }
    
    // Handle potential arrays for filters
    if (category) {
        if (Array.isArray(category)) {
            category.forEach(c => query.append("category", c));
        } else {
            query.append("category", category);
        }
    }
    
    if (sub_category) {
        if (Array.isArray(sub_category)) {
            sub_category.forEach(sc => query.append("sub_category", sc));
        } else {
             query.append("sub_category", sub_category);
        }
    }
    
    if (category_id) {
        if (Array.isArray(category_id)) {
            category_id.forEach(id => query.append("category_id", String(id)));
        } else {
             query.append("category_id", String(category_id));
        }
    }

    if (sub_category_id) {
        if (Array.isArray(sub_category_id)) {
            sub_category_id.forEach(id => query.append("sub_category_id", String(id)));
        } else {
            query.append("sub_category_id", String(sub_category_id));
        }
    }

    if (is_featured !== undefined)
      query.append("is_featured", String(is_featured));
    if (is_popular !== undefined)
      query.append("is_popular", String(is_popular));
    if (min_price !== undefined) query.append("min_price", String(min_price));
    if (max_price !== undefined) query.append("max_price", String(max_price));
    if (in_stock !== undefined) query.append("in_stock", String(in_stock));

    const url = `${API_BASE_URL}/api/product/?${query.toString()}`;
    console.log("Fetching products from:", url);

    const response = await fetch(url);

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Products response:", data);
    
    const results = data.results || [];
    const count = data.count || 0;
    const totalPages = Math.ceil(count / page_size);

    return {
      results,
      count,
      next: data.next,
      previous: data.previous,
      pagination: {
        page,
        page_size,
        total: count,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  },

  /* -------------------------------------------------------------------------- */
  /*                            GET SINGLE PRODUCT                              */
  /* -------------------------------------------------------------------------- */
  getProduct: async (slug: string): Promise<Product> => {
    const API_BASE_URL = siteConfig.backendUrl;
    const response = await fetch(`${API_BASE_URL}/api/product/${slug}/`, {
    });

    return response.json();
  },

  /* -------------------------------------------------------------------------- */
  /*                             GET CATEGORIES                                 */
  /* -------------------------------------------------------------------------- */
  getCategories: async (): Promise<GetCategoriesResponse> => {
    const API_BASE_URL = siteConfig.backendUrl;
    const response = await fetch(`${API_BASE_URL}/api/category/`, {
    });
    return response.json();
  },

  /* -------------------------------------------------------------------------- */
  /*                          GET SUBCATEGORIES                                 */
  /* -------------------------------------------------------------------------- */
  getSubCategories: async (): Promise<GetSubCategoriesResponse> => {
    const API_BASE_URL = siteConfig.backendUrl;
    const response = await fetch(`${API_BASE_URL}/api/sub-category/`, {
    });
    return response.json();
  },
};
