
import { siteConfig } from "@/config/siteConfig";
import { Review, CreateReviewRequest } from "@/types/product";

export interface GetReviewsResponse {
  results: Review[];
  count: number;
}

export const reviewApi = {
  getReviews: async (slug: string): Promise<GetReviewsResponse> => {
    const API_BASE_URL = siteConfig.backendUrl;
    const response = await fetch(`${API_BASE_URL}/api/product-review/?slug=${slug}`, {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
       }
    });

    if (!response.ok) {
        console.warn("Failed to fetch reviews");
        return { results: [], count: 0 };
    }

    return response.json();
  },

  createReview: async (data: CreateReviewRequest, token: string): Promise<Review> => {
    const API_BASE_URL = siteConfig.backendUrl;
    const response = await fetch(`${API_BASE_URL}/api/product-review/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
         "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
       const errorData = await response.json();
       // Extract deep error details if available
       const detail = errorData.error?.params?.field_errors?.detail || errorData.error?.detail || errorData.detail;
       const mainMessage = errorData.error?.message || errorData.message;
       const errorMessage = detail ? `${mainMessage}: ${detail}` : mainMessage || JSON.stringify(errorData);
       
       throw new Error(errorMessage || "Failed to submit review");
    }

    return response.json();
  }
};
