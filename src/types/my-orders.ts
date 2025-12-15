export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  market_price: string;
  thumbnail_image: string;
  thumbnail_alt_description: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product: Product;
  quantity: number;
  price: string;
  color?: string;
  size?: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  shipping_address: string;
  total_amount: string;
  status: string;
  order_items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrdersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}

export interface OrderFilters {
  status?: string;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface StatusCounts {
  all: number;
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface CreateOrderItem {
  product_id: number;
  quantity: number;
  price: number; // or string if your backend expects string
}

export interface CreateOrderPayload {
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  shipping_address: string; // Often same as customer_address or separate
  city: string;
  zip_code: string;
  shipping_method: string;
  total_amount: number;
  items: CreateOrderItem[];
}
