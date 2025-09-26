import { Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/features/cartSlice';
import { toast } from 'sonner';

interface Book {
  id: string;
  title: string;
  author: string | { id: string; name: string; bio?: string; createdAt?: string; updatedAt?: string };
  category: string | { id: string; name: string; createdAt?: string; updatedAt?: string };
  cover_image: string;
  rating?: number;
  stock: number;
  description?: string;
}

interface BookCardProps {
  book: Book;
  showAddToCart?: boolean;
}

export const BookCard = ({ book, showAddToCart = true }: BookCardProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (book.stock > 0) {
      // Normalize book data for cart
      const normalizedBook = {
        ...book,
        author: typeof book.author === 'string' ? book.author : book.author?.name || 'Unknown Author',
        category: typeof book.category === 'string' ? book.category : book.category?.name || 'Unknown Category'
      };
      dispatch(addToCart(normalizedBook));
      toast.success(`"${book.title}" added to cart`);
    } else {
      toast.error('Book is out of stock');
    }
  };

  const handleCardClick = () => {
    navigate(`/books/${book.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card 
        className="group cursor-pointer transition-all duration-300 hover:shadow-xl"
        onClick={handleCardClick}
      >
        <CardContent className="p-0">
          <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
            <motion.img
              src={book.cover_image || '/placeholder-book.png'}
              alt={book.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onError={(e) => {
                e.currentTarget.src = '/placeholder-book.png';
              }}
            />
            {book.stock === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
              >
                <Badge variant="destructive">Out of Stock</Badge>
              </motion.div>
            )}
            {showAddToCart && book.stock > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="absolute top-2 right-2"
              >
                <Button
                  size="icon"
                  onClick={handleAddToCart}
                  className="bg-primary/90 hover:bg-primary"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">
              {book.title}
            </h3>
            <p className="text-muted-foreground text-xs mb-2">
              {typeof book.author === 'string' ? book.author : book.author?.name || 'Unknown Author'}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">
                  {book.rating?.toFixed(1) || '4.5'}
                </span>
              </div>
              
              <Badge variant="secondary" className="text-xs">
                {typeof book.category === 'string' ? book.category : book.category?.name || 'Unknown Category'}
              </Badge>
            </div>
            
            {book.stock > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Stock: {book.stock}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};