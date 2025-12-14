import { Product } from "./product";

export interface CartItem {
  id?: number; // Added optional ID for backend items
  product: Product;
  quantity: number;
  selectedVariant?: {
    id: number;
    price: string;
    option_values: Record<string, string>;
  } | null;
}

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: string;
}

export interface CreateOrderRequest {
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  customer_address: string;
  total_amount: string;
  items: OrderItem[];
}

export interface Order extends CreateOrderRequest {
  id: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  created_at: string;
  updated_at: string;
}
