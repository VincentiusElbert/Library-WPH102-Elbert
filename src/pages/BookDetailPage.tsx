import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Star, ShoppingCart, Heart, Share, ChevronRight, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Navbar } from '../components/Navbar';
import { CartSidebar } from '../components/CartSidebar';
import { BookCard } from '../components/BookCard';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useAuth } from '../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/features/cartSlice';
import { toast } from 'sonner';
import api from '../api/api';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
// Import book images
import book21Bakso from '../assets/book-21-bakso.jpg';
import bookIrresistible from '../assets/book-irresistible.jpg';
import bookOliverTwist from '../assets/book-oliver-twist.jpg';
import bookWhiteFang from '../assets/book-white-fang.jpg';
import bookScarredWoman from '../assets/book-scarred-woman.jpg';
import bookPsychologyMoney from '../assets/book-psychology-money.jpg';

// Mock book data
const mockBook = {
  id: '1',
  title: 'The Psychology of Money',
  author: 'Morgan Housel',
  category: 'Business & Economics',
  cover_image: bookPsychologyMoney,
  rating: 4.9,
  stock: 5,
  description: 'The Psychology of Money explores how emotions, biases, and human behavior shape the way we think about money, investing, and financial decisions. Morgan Housel shares timeless lessons on wealth, greed, and happiness, showing that financial success is not about knowledge, but about behavior.',
  pages: 320,
  rating_count: 212,
  reviews_count: 179,
  language: 'English',
  publisher: 'Harriman House',
  published_date: '2020-09-08',
  isbn: '978-0-85719-996-8',
};

// Related books data
const relatedBooks = [
  {
    id: '2',
    title: '21 Resep Bakso Pak Bowo',
    author: 'Tufik',
    category: 'Cooking',
    cover_image: book21Bakso,
    rating: 4.9,
    stock: 3,
  },
  {
    id: '3',
    title: 'Irresistible',
    author: 'Lisa Kleypas',
    category: 'Romance',
    cover_image: bookIrresistible,
    rating: 4.9,
    stock: 7,
  },
  {
    id: '4',
    title: 'Oliver Twist',
    author: 'Charles Dickens',
    category: 'Fiction',
    cover_image: bookOliverTwist,
    rating: 4.9,
    stock: 2,
  },
  {
    id: '5',
    title: 'White Fang',
    author: 'Jack London',
    category: 'Fiction',
    cover_image: bookWhiteFang,
    rating: 4.9,
    stock: 4,
  },
  {
    id: '6',
    title: 'The Scarred Woman',
    author: 'Jussi Adler-Olsen',
    category: 'Thriller',
    cover_image: bookScarredWoman,
    rating: 4.9,
    stock: 6,
  },
];

const mockReviews = [
  {
    id: '1',
    user_name: 'John Doe',
    user_avatar: '/placeholder-avatar.png',
    rating: 5,
    comment: 'Lorem ipsum dolor sit amet consectetur. Pulvinar porttitor aliquam viverra nunc sed facilisis. Integer tristique nullam morbi mauris ante.',
    created_at: '2024-08-25T13:38:00Z',
  },
  {
    id: '2',
    user_name: 'John Doe',
    user_avatar: '/placeholder-avatar.png',
    rating: 5,
    comment: 'Lorem ipsum dolor sit amet consectetur. Pulvinar porttitor aliquam viverra nunc sed facilisis. Integer tristique nullam morbi mauris ante.',
    created_at: '2024-08-25T13:38:00Z',
  },
  {
    id: '3',
    user_name: 'John Doe',
    user_avatar: '/placeholder-avatar.png',
    rating: 5,
    comment: 'Lorem ipsum dolor sit amet consectetur. Pulvinar porttitor aliquam viverra nunc sed facilisis. Integer tristique nullam morbi mauris ante.',
    created_at: '2024-08-25T13:38:00Z',
  },
  {
    id: '4',
    user_name: 'John Doe',
    user_avatar: '/placeholder-avatar.png',
    rating: 5,
    comment: 'Lorem ipsum dolor sit amet consectetur. Pulvinar porttitor aliquam viverra nunc sed facilisis. Integer tristique nullam morbi mauris ante.',
    created_at: '2024-08-25T13:38:00Z',
  },
  {
    id: '5',
    user_name: 'John Doe',
    user_avatar: '/placeholder-avatar.png',
    rating: 5,
    comment: 'Lorem ipsum dolor sit amet consectetur. Pulvinar porttitor aliquam viverra nunc sed facilisis. Integer tristique nullam morbi mauris ante.',
    created_at: '2024-08-25T13:38:00Z',
  },
  {
    id: '6',
    user_name: 'John Doe',
    user_avatar: '/placeholder-avatar.png',
    rating: 5,
    comment: 'Lorem ipsum dolor sit amet consectetur. Pulvinar porttitor aliquam viverra nunc sed facilisis. Integer tristique nullam morbi mauris ante.',
    created_at: '2024-08-25T13:38:00Z',
  },
];

export const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [visibleReviews, setVisibleReviews] = useState(6);

  const { data: book = mockBook, isLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/books/${id}`);
        return response.data.data || mockBook;
      } catch (error) {
        return mockBook;
      }
    },
  });

  const { data: reviews = mockReviews } = useQuery({
    queryKey: ['book-reviews', id],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/books/${id}/reviews`);
        return response.data.data || mockReviews;
      } catch (error) {
        return mockReviews;
      }
    },
  });

  const borrowMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/loans', { book_id: id });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Book borrowed successfully!');
      queryClient.invalidateQueries({ queryKey: ['book', id] });
    },
    onError: () => {
      toast.error('Failed to borrow book. Please try again.');
    },
  });

  const handleAddToCart = () => {
    if (book.stock > 0) {
      dispatch(addToCart(book));
      toast.success(`"${book.title}" added to cart`);
    } else {
      toast.error('Book is out of stock');
    }
  };

  const handleBorrowNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to borrow books');
      navigate('/login');
      return;
    }
    borrowMutation.mutate();
  };

  if (isLoading) {
    return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-32 mb-6"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="aspect-[3/4] bg-muted rounded-lg"></div>
              <div className="md:col-span-2 space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <button 
            onClick={() => navigate('/')}
            className="text-primary hover:underline flex items-center"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </button>
          <ChevronRight className="h-4 w-4" />
          <button 
            onClick={() => navigate('/books')}
            className="text-primary hover:underline"
          >
            Category
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{book.title}</span>
        </nav>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Book Cover - Left Column */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="sticky top-6"
            >
              <div className="aspect-[3/4] relative overflow-hidden rounded-lg shadow-lg mb-6">
                <img
                  src={book.cover_image || '/placeholder-book.png'}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-book.png';
                  }}
                />
                {book.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive">Out of Stock</Badge>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Book Details - Right Column */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Badge variant="secondary" className="mb-2">
                {typeof book.category === 'string' ? book.category : book.category?.name || 'Unknown Category'}
              </Badge>
              <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">
                {typeof book.author === 'string' ? book.author : book.author?.name || 'Unknown Author'}
              </p>
              
              <div className="flex items-center space-x-1 mb-6">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-lg">{book.rating}</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold">{book.pages}</div>
                  <div className="text-muted-foreground text-sm">Page</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{book.rating_count || 212}</div>
                  <div className="text-muted-foreground text-sm">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{book.reviews_count || 179}</div>
                  <div className="text-muted-foreground text-sm">Reviews</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button 
                  variant="outline"
                  onClick={handleAddToCart}
                  disabled={book.stock === 0}
                  className="flex-1"
                >
                  Add to Cart
                </Button>
                <Button 
                  onClick={handleBorrowNow}
                  disabled={book.stock === 0 || borrowMutation.isPending}
                  className="flex-1"
                >
                  {borrowMutation.isPending ? 'Borrowing...' : 'Borrow Book'}
                </Button>
                <Button variant="ghost" size="icon">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Review</h3>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{book.rating}</span>
                  <span className="text-muted-foreground">({mockReviews.length} Ulasan)</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {mockReviews.slice(0, visibleReviews).map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3 mb-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={review.user_avatar} />
                            <AvatarFallback>{review.user_name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm truncate">{review.user_name}</p>
                              <time className="text-xs text-muted-foreground">
                                {dayjs(review.created_at).format('DD MMMM YYYY, HH:mm')}
                              </time>
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {visibleReviews < mockReviews.length && (
                <div className="text-center">
                  <Button 
                    variant="outline"
                    onClick={() => setVisibleReviews(prev => prev + 6)}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Related Books */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-6">Related Books</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {relatedBooks.map((relatedBook, index) => (
                  <motion.div
                    key={relatedBook.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <BookCard book={relatedBook} showAddToCart={false} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <span className="font-bold text-sm">B</span>
              </div>
              <span className="font-bold text-xl text-primary">Booky</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Discover inspiring stories & timeless knowledge, ready to borrow anytime. 
              Explore online or visit our nearest library branch.
            </p>
            
            <p className="text-sm font-medium mb-4">Follow on Social Media</p>
            
            <div className="flex justify-center space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="rounded-full">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </Button>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="rounded-full">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.73-3.016-1.8L7.583 14.1c.302.508.844.825 1.449.825 1.006 0 1.825-.819 1.825-1.825s-.819-1.825-1.825-1.825c-.605 0-1.147.317-1.449.825L5.433 10.112c.568-1.07 1.719-1.8 3.016-1.8 1.899 0 3.441 1.542 3.441 3.441S10.348 15.194 8.449 15.194z"/>
                  </svg>
                </Button>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="rounded-full">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </Button>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="rounded-full">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </Button>
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};