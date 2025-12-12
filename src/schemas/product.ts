import { z } from "zod";

/* ----------------------------- IMAGE SCHEMA ----------------------------- */

export const ProductImageSchema = z.object({
  id: z.number(),
  image: z.string(),
});

/* ----------------------------- CATEGORY ----------------------------- */

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

/* --------------------------- SUB CATEGORY --------------------------- */

export const SubCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  category: CategorySchema.nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

/* ----------------------------- PRODUCT ----------------------------- */

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string().nullable(),
  description: z.string().nullable(),
  price: z.string(),
  market_price: z.string().nullable().optional(),
  stock: z.number().nullable().optional(),
  track_stock: z.boolean().optional(),
  weight: z.string().nullable().optional(),
  thumbnail_image: z.string().nullable(),
  images: z.array(ProductImageSchema).optional(),
  thumbnail_alt_description: z.string().nullable().optional(),
  category: CategorySchema.nullable(),
  sub_category: SubCategorySchema.nullable(),
  is_popular: z.boolean().optional(),
  is_featured: z.boolean().optional(),

  // Extra fields
  fast_shipping: z.boolean().optional(),
  warranty: z.string().nullable().optional(),
  status: z.enum(["active", "draft", "archived"]).default("active"),
  meta_title: z.string().nullable().optional(),
  meta_description: z.string().nullable().optional(),

  created_at: z.string(),
  updated_at: z.string(),
});

/* ----------------------------- PAGINATION ----------------------------- */

export const PaginationInfoSchema = z.object({
  page: z.number(),
  page_size: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

/* ----------------------------- LIST RESPONSES ----------------------------- */

export const GetProductsResponseSchema = z.object({
  results: z.array(ProductSchema),
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  pagination: PaginationInfoSchema,
});

export const GetCategoriesResponseSchema = z.object({
  results: z.array(CategorySchema),
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  pagination: PaginationInfoSchema,
});

export const GetSubCategoriesResponseSchema = z.object({
  results: z.array(SubCategorySchema),
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  pagination: PaginationInfoSchema,
});
