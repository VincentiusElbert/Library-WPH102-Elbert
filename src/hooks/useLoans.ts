import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loansAPI } from '../api/api';
import { toast } from '../hooks/use-toast';

export const useMyLoans = () => {
  return useQuery({
    queryKey: ['my-loans'],
    queryFn: loansAPI.getMyLoans,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useBorrowBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: loansAPI.borrowBook,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-loans'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: "Book Borrowed",
        description: "Book has been borrowed successfully.",
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to borrow book';
      toast({
        title: "Borrowing Failed",
        description: message,
        variant: "destructive",
      });
    },
  });
};

export const useReturnBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: loansAPI.returnBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-loans'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: "Book Returned",
        description: "Book has been returned successfully.",
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to return book';
      toast({
        title: "Return Failed",
        description: message,
        variant: "destructive",
      });
    },
  });
};