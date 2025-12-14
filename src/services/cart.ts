import { siteConfig } from "@/config/siteConfig";
import { getAccessToken } from "@/hooks/use-auth";
import { CartItem } from "@/types/cart";

// Types for API responses/requests
interface AddToCartRequest {
  product_id: number;
  quantity: number;
  variant_id?: number;
}


export const cartApi = {
  getCart: async (): Promise<CartItem[]> => {
    const API_BASE_URL = siteConfig.backendUrl;
    const token = getAccessToken();

    if (!token) return [];

    const response = await fetch(`${API_BASE_URL}/api/cart/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
        if(response.status === 404) return [];
        throw new Error("Failed to fetch cart");
    }

    const data = await response.json();
    // Assuming backend returns { items: [...] } or list of items directly.
    // Adjusting based on typical DRF patterns: likely returns valid JSON list or object with items.
    // Let's assume it returns the list of items directly based on `CartItem[]` return type.
    // If it returns a Cart object wrapper, we need to extract items.
    // For now assuming list of items or we need to map.
    return Array.isArray(data) ? data : data.items || [];
  },

  addToCart: async (data: AddToCartRequest): Promise<CartItem> => {
    const API_BASE_URL = siteConfig.backendUrl;
    const token = getAccessToken();

    if (!token) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}/api/cart/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to add to cart");
    }

    return response.json();
  },

  removeFromCart: async (cartItemId: number): Promise<void> => {
    const API_BASE_URL = siteConfig.backendUrl;
    const token = getAccessToken();

    if (!token) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}/api/cart/${cartItemId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to remove from cart");
    }
  },

  updateCartItem: async (cartItemId: number, quantity: number): Promise<CartItem> => {
    const API_BASE_URL = siteConfig.backendUrl;
    const token = getAccessToken();

    if (!token) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}/api/cart/${cartItemId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      throw new Error("Failed to update cart item");
    }

    return response.json();
  },
};
