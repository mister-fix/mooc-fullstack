import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlog } from "../services/blogs";

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlog,
    onSuccess: (newBlog) => {
      // Optimistically update the cache
      queryClient.setQueryData(["blogs"], (oldBlogs) => [...oldBlogs, newBlog]);
    },
    onError: (error) => {
      console.error("Error creating blog:", error);
    },
  });
};
