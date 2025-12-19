"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "@/services/wishlist";
import { WishlistItem } from "@/types/wishlist";

export const useWishlist = () => {
  const {  isAuthenticated } = useAuth();

  return useQuery<WishlistItem[], Error>({
    queryKey: ["wishlist"],
    queryFn: () => getWishlist(),
    enabled: isAuthenticated,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error.message.includes('session has expired') || error.message.includes('log in')) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => addToWishlist({ productId }),
    onSuccess: newItem => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Added to Wishlist", {
        description: `${newItem.product.name} has been added to your wishlist.`,
      });
    },
    onError: (error: Error) => {
      // Show specific error message if available
      const message = error.message.includes('log in') 
        ? error.message 
        : "Could not add item to wishlist. Please try again.";
      
      toast.error("Error", {
        description: message,
      });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wishlistItemId: number) =>
      removeFromWishlist({ wishlistItemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Removed from Wishlist", {
        description: "The item has been removed from your wishlist.",
      });
    },
    onError: (error: Error) => {
      // Show specific error message if available
      const message = error.message.includes('log in') 
        ? error.message 
        : "Could not remove item from wishlist. Please try again.";
      
      toast.error("Error", {
        description: message,
      });
    },
  });
};
