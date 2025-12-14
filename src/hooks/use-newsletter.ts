import { useMutation } from "@tanstack/react-query";
import {
  CreateNewsletterRequest,
  Newsletter,
  NormalizedError,
} from "@/types/newsletter";
import { toast } from "sonner";
import { createNewsletter } from "@/services/newsletter";

export const useNewsletter = () => {
  return useMutation<Newsletter, NormalizedError, string>({
    mutationFn: (email: string) => {
      const newsletterData: CreateNewsletterRequest = {
        email,
        is_subscribed: true,
      };
      return createNewsletter(newsletterData);
    },
    onSuccess: () => {
      toast.success("Subscribed to newsletter successfully");
    },
    onError: (error) => {
      console.error("Failed to subscribe:", error);

      // Show field-specific error if available (e.g., email validation)
      if (error.fieldErrors?.email) {
        toast.error(error.fieldErrors.email);
        return;
      }

      if (error.message) {
        toast.error(error.message);
        return;
      }

      // Otherwise show the general message
      toast.error("Something went wrong");
    },
  });
};
