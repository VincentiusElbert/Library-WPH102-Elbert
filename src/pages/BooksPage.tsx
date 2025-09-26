import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Filter, Menu } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { CartSidebar } from '../components/CartSidebar';
import { BookCard } from '../components/BookCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setSearchQuery, setSelectedCategory } from '../store/features/uiSlice';
import api, { generateDummyBooks } from '../api/api';
// Import book images
import book21Bakso from '../assets/book-21-bakso.jpg';
import bookIrresistible from '../assets/book-irresistible.jpg';
import bookOliverTwist from '../assets/book-oliver-twist.jpg';
import bookWhiteFang from '../assets/book-white-fang.jpg';
import bookScarredWoman from '../assets/book-scarred-woman.jpg';

// Extended mock data for books page with proper images
const mockBooks = [
  {
    id: '1',
    title: '21 Resep Bakso Pak Bowo',
    author: 'Tufik',
    category: 'Fiction',
    cover_image: book21Bakso,
    rating: 4.9,
    stock: 5,
  },
  {
    id: '2',
    title: 'Irresistible',
    author: 'Lisa Kleypas',
    category: 'Fiction',
    cover_image: bookIrresistible,
    rating: 4.9,
    stock: 3,
  },
  {
    id: '3',
    title: 'Oliver Twist',
    author: 'Charles Dickens',
    category: 'Fiction',
    cover_image: bookOliverTwist,
    rating: 4.9,
    stock: 7,
  },
  {
    id: '4',
    title: 'White Fang',
    author: 'Jack London',
    category: 'Fiction',
    cover_image: bookWhiteFang,
    rating: 4.9,
    stock: 2,
  },
  {
    id: '5',
    title: 'The Scarred Woman',
    author: 'Jussi Adler-Olsen',
    category: 'Fiction',
    cover_image: bookScarredWoman,
    rating: 4.9,
    stock: 4,
  },
  {
    id: '6',
    title: 'The Plague',
    author: 'Albert Camus',
    category: 'Fiction',
    cover_image: '/placeholder-book.png',
    rating: 4.9,
    stock: 6,
  },
  {
    id: '7',
    title: 'Kapan Pindah Rumah',
    author: 'Author name',
    category: 'Fiction',
    cover_image: '/placeholder-book.png',
    rating: 4.9,
    stock: 8,
  },
  {
    id: '8',
    title: 'Yeti Dan Terik Yang Abadi',
    author: 'Author name',
    category: 'Fiction',
    cover_image: '/placeholder-book.png',
    rating: 4.9,
    stock: 3,
  },
  {
    id: '9',
    title: 'Rumah Yang Menelan Penghuninya',
    author: 'Kenken Layla',
    category: 'Fiction',
    cover_image: '/placeholder-book.png',
    rating: 4.9,
    stock: 5,
  },
];

const categories = [
  'Fiction',
  'Non-fiction',
  'Self-Improve',
  'Finance',
  'Science',
  'Education',
];

const ratings = [5, 4, 3, 2, 1];

export const BooksPage = () => {
  const dispatch = useDispatch();
  const { searchQuery, selectedCategory } = useSelector((state: RootState) => state.ui);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [page, setPage] = useState(1);
  const [allBooks, setAllBooks] = useState(() => generateDummyBooks(100));
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Fiction']);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  const { data: books, isLoading } = useQuery({
    queryKey: ['books', searchQuery, selectedCategory, page],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedCategory && selectedCategory !== 'All Categories') {
          params.append('category', selectedCategory);
        }
        params.append('page', page.toString());
        params.append('limit', '20');
        
        const response = await api.get(`/api/books?${params.toString()}`);
        const apiData = response.data?.data;
        if (Array.isArray(apiData) && apiData.length > 0) {
          return apiData;
        }
        
        // Fallback to filtered dummy data
        return allBooks.filter(book => {
          const matchesSearch = !searchQuery || 
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesCategory = !selectedCategory || 
            selectedCategory === 'All Categories' ||
            book.category === selectedCategory;
            
          return matchesSearch && matchesCategory;
        });
      } catch (error) {
        // Generate more dummy data if needed
        if (allBooks.length < page * 20) {
          const newBooks = generateDummyBooks(50, allBooks.length);
          setAllBooks(prev => [...prev, ...newBooks]);
        }
        
        // Fallback to filtered dummy data
        return allBooks.filter(book => {
          const matchesSearch = !searchQuery || 
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesCategory = !selectedCategory || 
            selectedCategory === 'All Categories' ||
            book.category === selectedCategory;
            
          return matchesSearch && matchesCategory;
        });
      }
    },
  });

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearch));
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleRatingToggle = (rating: number) => {
    setSelectedRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const FilterSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Category</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              />
              <Label htmlFor={category} className="text-sm cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Rating</h3>
        <div className="space-y-3">
          {ratings.map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox 
                id={`rating-${rating}`}
                checked={selectedRatings.includes(rating)}
                onCheckedChange={() => handleRatingToggle(rating)}
              />
              <Label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center space-x-1">
                <span>⭐</span>
                <span>{rating}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book List</h1>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-6">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="h-5 w-5" />
                <h2 className="font-semibold text-lg">FILTER</h2>
              </div>
              <FilterSection />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Menu className="mr-2 h-4 w-4" />
                    FILTER
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-2">
                      <Filter className="h-5 w-5" />
                      <span>FILTER</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSection />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Books Grid */}
            {isLoading && page === 1 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="animate-pulse"
                  >
                    <div className="aspect-[3/4] bg-muted rounded-lg mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-1"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </motion.div>
                ))}
              </div>
            ) : books && books.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                  {books.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <BookCard book={book} />
                    </motion.div>
                  ))}
                </motion.div>
                
                {/* Load More Button */}
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="min-w-32"
                  >
                    {isLoading ? 'Loading...' : 'Load More Books'}
                  </Button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground text-lg">No books found</p>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </motion.div>
            )}
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