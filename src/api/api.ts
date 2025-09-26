import axios from 'axios';

const API_BASE_URL = 'https://belibraryformentee-production.up.railway.app';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Auth API endpoints
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },
  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
};

// Books API endpoints
export const booksAPI = {
  getBooks: async (params?: { 
    page?: number; 
    limit?: number; 
    category?: string; 
    author?: string; 
    search?: string; 
  }) => {
    const response = await api.get('/api/books', { params });
    return response.data;
  },
  getBookById: async (id: string) => {
    const response = await api.get(`/api/books/${id}`);
    return response.data;
  },
  getRecommendedBooks: async (type: 'rating' | 'popular' = 'rating') => {
    const response = await api.get('/api/books/recommend', { params: { type } });
    return response.data;
  },
  createBook: async (bookData: any) => {
    const response = await api.post('/api/books', bookData);
    return response.data;
  },
  updateBook: async (id: string, bookData: any) => {
    const response = await api.put(`/api/books/${id}`, bookData);
    return response.data;
  },
  deleteBook: async (id: string) => {
    const response = await api.delete(`/api/books/${id}`);
    return response.data;
  },
};

// Authors API endpoints
export const authorsAPI = {
  getAuthors: async () => {
    const response = await api.get('/api/authors');
    return response.data;
  },
  getAuthorBooks: async (id: string) => {
    const response = await api.get(`/api/authors/${id}/books`);
    return response.data;
  },
  createAuthor: async (authorData: any) => {
    const response = await api.post('/api/authors', authorData);
    return response.data;
  },
  updateAuthor: async (id: string, authorData: any) => {
    const response = await api.put(`/api/authors/${id}`, authorData);
    return response.data;
  },
  deleteAuthor: async (id: string) => {
    const response = await api.delete(`/api/authors/${id}`);
    return response.data;
  },
};

// Categories API endpoints
export const categoriesAPI = {
  getCategories: async () => {
    const response = await api.get('/api/categories');
    return response.data;
  },
  createCategory: async (categoryData: any) => {
    const response = await api.post('/api/categories', categoryData);
    return response.data;
  },
  updateCategory: async (id: string, categoryData: any) => {
    const response = await api.put(`/api/categories/${id}`, categoryData);
    return response.data;
  },
  deleteCategory: async (id: string) => {
    const response = await api.delete(`/api/categories/${id}`);
    return response.data;
  },
};

// Loans API endpoints
export const loansAPI = {
  borrowBook: async (bookId: string) => {
    const response = await api.post('/api/loans', { bookId });
    return response.data;
  },
  returnBook: async (loanId: string) => {
    const response = await api.patch(`/api/loans/${loanId}/return`);
    return response.data;
  },
  getMyLoans: async () => {
    const response = await api.get('/api/loans/my');
    return response.data;
  },
};

// Admin API endpoints
export const adminAPI = {
  createLoan: async (loanData: any) => {
    const response = await api.post('/api/admin/loans', loanData);
    return response.data;
  },
  updateLoan: async (id: string, loanData: any) => {
    const response = await api.patch(`/api/admin/loans/${id}`, loanData);
    return response.data;
  },
  getOverdueLoans: async () => {
    const response = await api.get('/api/admin/loans/overdue');
    return response.data;
  },
  getOverview: async () => {
    const response = await api.get('/api/admin/overview');
    return response.data;
  },
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dummy data generator for unlimited books
export const generateDummyBooks = (count: number, startIndex: number = 0) => {
  const titles = [
    '21 Resep Bakso Pak Bowo', 'Irresistible', 'Oliver Twist', 'White Fang', 'The Scarred Woman',
    'Kapan Pindah Luwaw', 'Yeti Dan Kurcaci Yang Abadi', 'Rumah Yang Menelan Penghuninya',
    'Other Half of Me', 'The Great Gatsby', 'To Kill a Mockingbird', 'Pride and Prejudice',
    'The Catcher in the Rye', '1984', 'Lord of the Flies', 'The Hobbit', 'Harry Potter',
    'The Lord of the Rings', 'Dune', 'Foundation', 'Brave New World', 'Fahrenheit 451',
    'The Chronicles of Narnia', 'The Da Vinci Code', 'Angels and Demons', 'The Alchemist',
    'Life of Pi', 'The Kite Runner', 'The Book Thief', 'The Fault in Our Stars'
  ];

  const authors = [
    'Tufik', 'Lisa Kleypas', 'Charles Dickens', 'Jack London', 'Jussi Adler-Olsen',
    'Kenken Layla', 'Elsa Puspita', 'F. Scott Fitzgerald', 'Harper Lee', 'Jane Austen',
    'J.D. Salinger', 'George Orwell', 'William Golding', 'J.R.R. Tolkien', 'J.K. Rowling',
    'Frank Herbert', 'Isaac Asimov', 'Aldous Huxley', 'Ray Bradbury', 'C.S. Lewis',
    'Dan Brown', 'Paulo Coelho', 'Yann Martel', 'Khaled Hosseini', 'Markus Zusak'
  ];

  const categories = [
    'Fiction', 'Non-Fiction', 'Self-Improvement', 'Finance', 'Science', 'Education',
    'Romance', 'Thriller', 'Fantasy', 'Horror', 'Cooking', 'Biography', 'History',
    'Philosophy', 'Psychology', 'Technology', 'Art', 'Music', 'Travel', 'Health'
  ];

  const books = [];
  for (let i = 0; i < count; i++) {
    const index = (startIndex + i) % titles.length;
    books.push({
      id: `dummy-${startIndex + i + 1}`,
      title: titles[index] + (startIndex + i > titles.length - 1 ? ` Vol. ${Math.floor((startIndex + i) / titles.length) + 1}` : ''),
      author: authors[index % authors.length],
      category: categories[(startIndex + i) % categories.length],
      cover_image: '/placeholder-book.png',
      rating: 4.0 + Math.random() * 1,
      stock: Math.floor(Math.random() * 10) + 1,
      description: `A captivating story that will keep you engaged from start to finish. This book explores themes of ${categories[(startIndex + i) % categories.length].toLowerCase()} in an engaging and thought-provoking way.`,
      isbn: `978-${Math.floor(Math.random() * 10000000000)}`,
      published_year: 2020 + Math.floor(Math.random() * 4),
      pages: 200 + Math.floor(Math.random() * 300),
      language: 'English',
      publisher: `Publisher ${Math.floor(Math.random() * 20) + 1}`
    });
  }
  return books;
};

// Generate dummy authors
export const generateDummyAuthors = (count: number = 20) => {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'William', 'Amanda'];
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas'];
  
  const authors = [];
  for (let i = 0; i < count; i++) {
    authors.push({
      id: `author-${i + 1}`,
      name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
      books: Math.floor(Math.random() * 15) + 1,
      avatar: '/placeholder-avatar.png',
      bio: `A renowned author with years of experience in writing compelling stories.`,
      nationality: 'International'
    });
  }
  return authors;
};

export default api;