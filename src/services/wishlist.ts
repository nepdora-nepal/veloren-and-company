import { WishlistItem } from "@/types/wishlist";
import { siteConfig } from "@/config/siteConfig";
import { getAccessToken } from "@/hooks/use-auth";

export const getWishlist = async (): Promise<WishlistItem[]> => {
  try {
    const API_BASE_URL = siteConfig.backendUrl;
    const token = getAccessToken();

    if (!token) {
      console.warn('No auth token available for wishlist');
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/api/wishlist/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      console.error('Unauthorized access to wishlist - invalid or expired token');
      // Clear invalid token
      localStorage.removeItem('glow-authTokens');
      return [];
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch wishlist: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while fetching wishlist.");
  }
};

export const addToWishlist = async ({
  productId,
}: {
  productId: number;
}): Promise<WishlistItem> => {
  try {
    // Add validation to ensure productId is provided and is a number
    if (!productId || typeof productId !== "number") {
      throw new Error("Product ID is required and must be a number");
    }

    const API_BASE_URL = siteConfig.backendUrl;
    const token = getAccessToken();

    if (!token) {
      throw new Error("Please log in to add items to your wishlist");
    }

    const response = await fetch(`${API_BASE_URL}/api/wishlist/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId }),
    });

    if (response.status === 401) {
      // Clear invalid token
      localStorage.removeItem('glow-authTokens');
      throw new Error("Your session has expired. Please log in again.");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add to wishlist");
    }

    return response.json();
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while adding to wishlist.");
  }
};

export const removeFromWishlist = async ({
  wishlistItemId,
}: {
  wishlistItemId: number;
}): Promise<void> => {
  try {
    const API_BASE_URL = siteConfig.backendUrl;
    const token = getAccessToken();

    if (!token) {
      throw new Error("Please log in to manage your wishlist");
    }

    const response = await fetch(
      `${API_BASE_URL}/api/wishlist/${wishlistItemId}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      // Clear invalid token
      localStorage.removeItem('glow-authTokens');
      throw new Error("Your session has expired. Please log in again.");
    }

    // Check for 204 No Content response
    if (response.status !== 204 && !response.ok) {
      throw new Error("Failed to remove from wishlist");
    }
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "An unexpected error occurred while removing from wishlist."
    );
  }
};
