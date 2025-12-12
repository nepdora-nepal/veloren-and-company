import { z } from "zod";
import {
  ProductSchema,
  CategorySchema,
  SubCategorySchema,
  GetProductsResponseSchema,
  GetCategoriesResponseSchema,
  GetSubCategoriesResponseSchema,
} from "@/schemas/product";

export type Product = z.infer<typeof ProductSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type SubCategory = z.infer<typeof SubCategorySchema>;

export type GetProductsResponse = z.infer<typeof GetProductsResponseSchema>;
export type GetCategoriesResponse = z.infer<typeof GetCategoriesResponseSchema>;
export type GetSubCategoriesResponse = z.infer<typeof GetSubCategoriesResponseSchema>;

export interface PaginationParams {
  page?: number;
  page_size?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
