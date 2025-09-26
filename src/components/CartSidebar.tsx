import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { RootState } from '../store/store';
import { removeFromCart, clearCart, setCartOpen } from '../store/features/cartSlice';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export const CartSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, isOpen } = useSelector((state: RootState) => state.cart);

  const borrowMultipleMutation = useMutation({
    mutationFn: async () => {
      const bookIds = items.map(item => item.id);
      const response = await api.post('/api/loans/multiple', { book_ids: bookIds });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Books borrowed successfully!');
      dispatch(clearCart());
      dispatch(setCartOpen(false));
      navigate('/loans');
    },
    onError: () => {
      toast.error('Failed to borrow books. Please try again.');
    },
  });

  const handleRemoveItem = (bookId: string) => {
    dispatch(removeFromCart(bookId));
    toast.success('Book removed from cart');
  };

  const handleBorrowAll = () => {
    if (!isAuthenticated) {
      toast.error('Please login to borrow books');
      navigate('/login');
      return;
    }
    
    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    borrowMultipleMutation.mutate();
  };

  const totalBooks = items.length;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => dispatch(setCartOpen(open))}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5" />
            <span>Shopping Cart</span>
            {totalBooks > 0 && (
              <Badge variant="secondary">{totalBooks}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full mt-6">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
                <Button 
                  className="mt-4" 
                  onClick={() => {
                    dispatch(setCartOpen(false));
                    navigate('/books');
                  }}
                >
                  Browse Books
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto space-y-3">
                {items.map((book) => (
                  <Card key={book.id}>
                    <CardContent className="p-3">
                      <div className="flex space-x-3">
                        <img
                          src={book.cover_image || '/placeholder-book.png'}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-book.png';
                          }}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">{book.title}</h4>
                          <p className="text-xs text-muted-foreground">{book.author}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Stock: {book.stock}
                          </p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveItem(book.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Cart Actions */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Total Books:</span>
                  <span className="font-bold">{totalBooks}</span>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    onClick={handleBorrowAll}
                    disabled={borrowMultipleMutation.isPending}
                  >
                    {borrowMultipleMutation.isPending ? 'Processing...' : 'Borrow All Books'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => dispatch(clearCart())}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};