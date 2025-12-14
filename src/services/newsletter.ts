import {
  CreateNewsletterRequest,
  Newsletter,
  ApiErrorResponse,
  NormalizedError,
} from "@/types/newsletter";
import { siteConfig } from "@/config/siteConfig";

const API_BASE_URL = siteConfig.backendUrl;

export const createNewsletter = async (
  newsletterData: CreateNewsletterRequest
): Promise<Newsletter> => {
  const response = await fetch(`${API_BASE_URL}/api/newsletter/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newsletterData),
  });

  if (!response.ok) {
    let errorData: ApiErrorResponse | null = null;
    try {
      errorData = await response.json();
    } catch {
      // Ignore JSON parse error
    }

    const fieldErrors: Record<string, string> = {};
    let message = "Something went wrong";

    if (errorData) {
      if (errorData.error?.params) {
        Object.assign(fieldErrors, errorData.error.params);
      }

      Object.keys(errorData).forEach((key) => {
        if (key !== "error" && key !== "message") {
          const value = errorData![key];
          if (typeof value === "string") {
            fieldErrors[key] = value;
          } else if (Array.isArray(value) && value.length > 0) {
            fieldErrors[key] = value[0] as string;
          }
        }
      });

      if (errorData.error?.message) {
        message = errorData.error.message;
      } else if (errorData.message) {
        message = errorData.message;
      } else if (Object.keys(fieldErrors).length > 0) {
        message = Object.values(fieldErrors)[0];
      }
    }

    const normalizedError: NormalizedError = {
      message,
      status: response.status,
      fieldErrors:
        Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
    };

    throw normalizedError;
  }

  return response.json();
};
