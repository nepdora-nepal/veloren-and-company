export interface Newsletter {
  id: number;
  email: string;
  is_subscribed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateNewsletterRequest {
  email: string;
  is_subscribed?: boolean;
}

export interface ApiErrorResponse {
  error?: {
    message?: string;
    params?: Record<string, string>;
  };
  message?: string;
  [key: string]: unknown;
}

export interface NormalizedError {
  message: string;
  status?: number;
  fieldErrors?: Record<string, string>;
}
