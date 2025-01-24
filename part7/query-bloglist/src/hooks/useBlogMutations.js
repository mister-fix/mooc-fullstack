import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlog, removeBlog, updateBlog } from "../services/blogs";

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

export const useLikeBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedBlog }) => updateBlog(id, updatedBlog),
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(["blogs"], (oldBlogs) =>
        oldBlogs.map((blog) =>
          blog.id === updatedBlog.id ? updatedBlog : blog,
        ),
      );
    },
    onError: (error) => {
      console.error("Error liking blog:", error);
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeBlog,
    onSuccess: (_, id) => {
      // Use underscore instead of data since it will go unused
      queryClient.setQueryData(["blogs"], (oldBlogs) => {
        oldBlogs.filter((blog) => blog.id !== id);
      });
    },
    onError: (error) => {
      console.error("Error deleting blog:", error);
    },
  });
};
