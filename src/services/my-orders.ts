import { siteConfig } from "@/config/siteConfig";
import {
  OrderFilters,
  OrdersResponse,
  StatusCounts,
  CreateOrderPayload,
  Order,
} from "@/types/my-orders";
import { getAccessToken } from "@/hooks/use-auth";

const buildQueryParams = (filters: OrderFilters): string => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (key === "status" && value === "all") return;
      params.append(key, value.toString());
    }
  });
  return params.toString();
};

export const fetchMyOrders = async (
  filters: OrderFilters = {}
): Promise<OrdersResponse> => {
  try {
    const API_BASE_URL = siteConfig.backendUrl;
    const queryString = buildQueryParams(filters);
    const url = `${API_BASE_URL}/api/my-order/${queryString ? `?${queryString}` : ""}`;
    
    const token = getAccessToken();
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while fetching orders.");
  }
};

export const fetchOrderStatusCounts = async (): Promise<StatusCounts> => {
  try {
    const API_BASE_URL = siteConfig.backendUrl;
    
    const token = getAccessToken();
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/my-order-status/`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch order status counts: ${response.statusText}`);
    }

    const data = await response.json();

    const statusCounts: StatusCounts = {
      all:
        (data.pending || 0) +
        (data.confirmed || 0) +
        (data.processing || 0) +
        (data.shipped || 0) +
        (data.delivered || 0) +
        (data.cancelled || 0),
      pending: data.pending || 0,
      confirmed: data.confirmed || 0,
      processing: data.processing || 0,
      shipped: data.shipped || 0,
      delivered: data.delivered || 0,
      cancelled: data.cancelled || 0,
    };

    return statusCounts;
  } catch (error) {
    console.error("Error fetching order status counts:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "An unexpected error occurred while fetching order status counts."
    );
  }
};

export const createOrder = async (
  payload: CreateOrderPayload
): Promise<Order> => {
  try {
    const API_BASE_URL = siteConfig.backendUrl;
    
    const token = getAccessToken();
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/order/`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
        throw new Error(`Failed to create order: ${errorMessage}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error creating order:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while creating order.");
  }
};
