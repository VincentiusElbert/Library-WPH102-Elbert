import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { booksAPI } from '../api/api';
import { toast } from '../hooks/use-toast';

export const useBooks = (params?: { 
  page?: number; 
  limit?: number; 
  category?: string; 
  author?: string; 
  search?: string; 
}) => {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => booksAPI.getBooks(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBook = (id: string) => {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => booksAPI.getBookById(id),
    enabled: !!id,
  });
};

export const useRecommendedBooks = (type: 'rating' | 'popular' = 'rating') => {
  return useQuery({
    queryKey: ['recommended-books', type],
    queryFn: () => booksAPI.getRecommendedBooks(type),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: booksAPI.createBook,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: "Book Created",
        description: "Book has been created successfully.",
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create book';
      toast({
        title: "Creation Failed",
        description: message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      booksAPI.updateBook(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', variables.id] });
      toast({
        title: "Book Updated",
        description: "Book has been updated successfully.",
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update book';
      toast({
        title: "Update Failed",
        description: message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: booksAPI.deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: "Book Deleted",
        description: "Book has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete book';
      toast({
        title: "Deletion Failed",
        description: message,
        variant: "destructive",
      });
    },
  });
};