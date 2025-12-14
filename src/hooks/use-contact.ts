import { useMutation, useQuery } from "@tanstack/react-query";
import { contactAPI } from "@/services/contact";
import {
  ContactFormData,
  PaginatedContacts,
  ContactFilters,
} from "@/types/contact";

export const useGetContacts = (filters: ContactFilters = {}) => {
  return useQuery<PaginatedContacts>({
    queryKey: ["contacts", filters],
    queryFn: () => contactAPI.getContacts(filters),
  });
};

export const useSubmitContactForm = () => {
  return useMutation({
    mutationFn: (data: ContactFormData) => {
      const contactData: ContactFormData = {
        name: data.name,
        email: data.email || undefined,
        phone_number: data.phone_number || undefined,
        message: data.message,
      };

      return contactAPI.createContact(contactData);
    },
  });
};
