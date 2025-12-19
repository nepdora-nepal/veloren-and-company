import { LoginResponse, SignupResponse, UpdateProfileData, User, PasswordResetRequestData, PasswordResetConfirmData } from "@/types/auth";
import { siteConfig } from "@/config/siteConfig";

interface SignupData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  website_type: "ecommerce" | "service";
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
  token: string;
}

interface LoginData {
  email: string;
  password: string;
}

export async function signupUser(data: SignupData): Promise<SignupResponse> {
  const API_BASE_URL = siteConfig.backendUrl;

  const response = await fetch(`${API_BASE_URL}/api/customer/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Handle nested error structure
    const errorMessage = errorData.error?.message || errorData.message || errorData.error || "Signup failed";
    const error = new Error(errorMessage) as Error & { response?: { status: number; data: typeof errorData } };
    error.response = {
      status: response.status,
      data: errorData
    };
    throw error;
  }
  return response.json();
}

export async function loginUser(data: LoginData): Promise<LoginResponse> {
  const API_BASE_URL = siteConfig.backendUrl;

  const response = await fetch(`${API_BASE_URL}/api/customer/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Handle nested error structure
    const errorMessage = errorData.error?.message || errorData.message || errorData.error || "Login failed";
    const error = new Error(errorMessage) as Error & { response?: { status: number; data: typeof errorData } };
    error.response = {
      status: response.status,
      data: errorData
    };
    throw error;
  }
  return response.json();
}

export async function changePasswordUser(data: ChangePasswordData): Promise<{ message: string }> {
  const API_BASE_URL = siteConfig.backendUrl;

  const response = await fetch(`${API_BASE_URL}/api/customer/change-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${data.token}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to change password");
  }
  return response.json();
}



export async function updateUserDetails(data: UpdateProfileData): Promise<User> {
  const API_BASE_URL = siteConfig.backendUrl;

  const response = await fetch(`${API_BASE_URL}/api/customer/detail/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${data.token}`
    },
    body: JSON.stringify({
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      address: data.address,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update profile");
  }
  return response.json();
}

export async function getUserDetails(token: string): Promise<User> {
  const API_BASE_URL = siteConfig.backendUrl;

  const response = await fetch(`${API_BASE_URL}/api/customer/detail/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch user details");
  }
  return response.json();
}

export async function requestPasswordReset(data: PasswordResetRequestData): Promise<{ message: string }> {
  const API_BASE_URL = siteConfig.backendUrl;

  const response = await fetch(`${API_BASE_URL}/api/customer/password/reset/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      frontend_url: "https://luminous-skin.vercel.app"
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to request password reset");
  }
  return response.json();
}

export async function confirmPasswordReset(data: PasswordResetConfirmData): Promise<{ message: string }> {
  const API_BASE_URL = siteConfig.backendUrl;

  const response = await fetch(`${API_BASE_URL}/api/customer/password/reset/confirm/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to reset password");
  }
  return response.json();
}

export async function refreshAccessToken(refresh: string): Promise<{ access: string }> {
  const API_BASE_URL = siteConfig.backendUrl;

  const response = await fetch(`${API_BASE_URL}/api/customer/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    // If not found, try the standard simplejwt endpoint as a fallback
    if (response.status === 404) {
       const fallbackResponse = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh }),
      });
      
      if (!fallbackResponse.ok) {
         throw new Error("Failed to refresh token");
      }
      return fallbackResponse.json();
    }
    throw new Error("Failed to refresh token");
  }
  return response.json();
}
