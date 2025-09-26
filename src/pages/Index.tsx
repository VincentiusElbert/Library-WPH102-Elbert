import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { CartSidebar } from '../components/CartSidebar';
import { HeroSection } from '../components/HeroSection';
import { CategoryGrid } from '../components/CategoryGrid';
import { BookCard } from '../components/BookCard';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useBooks, useRecommendedBooks } from '../hooks/useBooks';
import { generateDummyBooks, generateDummyAuthors } from '../api/api';
import { useState } from 'react';

// Mock data for development
const mockBooks = [
  {
    id: '1',
    title: '21 Resep Bakso Pak Bowo',
    author: 'Tufik',
    category: 'Cooking',
    cover_image: '/placeholder-book.png',
    rating: 4.9,
    stock: 5,
  },
  {
    id: '2',
    title: 'Irresistible',
    author: 'Lisa Kleypas',
    category: 'Romance',
    cover_image: '/placeholder-book.png',
    rating: 4.9,
    stock: 3,
  },
  {
    id: '3',
    title: 'Oliver Twist',
    author: 'Charles Dickens',
    category: 'Classic',
    cover_image: '/placeholder-book.png',
    rating: 4.9,
    stock: 7,
  },
  {
    id: '4',
    title: 'White Fang',
    author: 'Jack London',
    category: 'Adventure',
    cover_image: '/placeholder-book.png',
    rating: 4.9,
    stock: 2,
  },
  {
    id: '5',
    title: 'The Scarred Woman',
    author: 'Jussi Adler-Olsen',
    category: 'Thriller',
    cover_image: '/placeholder-book.png',
    rating: 4.9,
    stock: 4,
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [loadedBooks, setLoadedBooks] = useState(10);
  const [allBooks, setAllBooks] = useState(() => generateDummyBooks(50));
  const [authors] = useState(() => generateDummyAuthors(8));

  // Fetch books and recommendations from API
  const { data: booksResponse, isLoading: booksLoading } = useBooks({ page: 1, limit: loadedBooks });
  const { data: recommendedResponse, isLoading: recommendedLoading } = useRecommendedBooks('rating');

  // Fallback to dummy data if API fails
  const books = booksResponse?.success ? booksResponse.data.books : allBooks.slice(0, loadedBooks);
  const isLoading = booksLoading || recommendedLoading;

  const handleLoadMore = () => {
    const newCount = loadedBooks + 10;
    setLoadedBooks(newCount);
    
    // Generate more dummy data if needed
    if (newCount > allBooks.length) {
      const additionalBooks = generateDummyBooks(20, allBooks.length);
      setAllBooks(prev => [...prev, ...additionalBooks]);
    }
  };

  // Extra safety check to ensure books is always an array and handle load more
  const booksArray = Array.isArray(books) ? books : allBooks.slice(0, loadedBooks);
  
  // Generate more dummy data if needed for load more
  if (loadedBooks > allBooks.length) {
    const newBooks = generateDummyBooks(loadedBooks - allBooks.length, allBooks.length);
    const updatedBooks = [...allBooks, ...newBooks];
    setAllBooks(updatedBooks);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />
      
      <main>
        <HeroSection />
        <CategoryGrid />

        {/* Recommendations Section */}
        <section className="px-4 md:px-8 mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recommendation</h2>
            <Button 
              variant="ghost" 
              onClick={handleLoadMore}
              className="text-primary hover:text-primary/80"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted rounded-lg mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-1"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-5 gap-4"
            >
              {booksArray.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <BookCard book={book} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Popular Authors Section */}
        <section className="px-4 md:px-8 mt-12 mb-16">
          <h2 className="text-2xl font-bold mb-6">Popular Authors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {authors.map((author, index) => (
              <motion.div
                key={author.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center space-x-3 p-4 rounded-lg bg-card border hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {author.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{author.name}</p>
                  <p className="text-sm text-muted-foreground">📚 {author.books} books</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-primary text-primary-foreground py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary-foreground text-primary flex items-center justify-center">
                <span className="font-bold text-sm">B</span>
              </div>
              <span className="font-bold text-xl">Booky</span>
            </div>
            <p className="text-sm opacity-90 mb-4 max-w-md mx-auto">
              Discover inspiring stories & timeless knowledge, ready to borrow anytime. 
              Explore online or visit our nearest library branch.
            </p>
            
            <p className="text-sm font-medium mb-4">Follow on Social Media</p>
            
            <div className="flex justify-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => window.open('https://facebook.com', '_blank')}
                >
                  <Facebook className="h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => window.open('https://instagram.com', '_blank')}
                >
                  <Instagram className="h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => window.open('https://linkedin.com', '_blank')}
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => window.open('https://tiktok.com', '_blank')}
                >
                  <span className="text-sm font-bold">T</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
