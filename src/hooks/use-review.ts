"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@/services/review";
import { CreateReviewRequest } from "@/types/product";

export const useReviews = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["reviews", slug],
    queryFn: () => (slug ? reviewApi.getReviews(slug) : Promise.resolve({ results: [], count: 0 })),
    enabled: !!slug,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, token, slug }: { data: CreateReviewRequest; token: string, slug: string }) =>
      reviewApi.createReview(data, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.slug] });
      queryClient.invalidateQueries({ queryKey: ["product"] }); 
    },
  });
};
