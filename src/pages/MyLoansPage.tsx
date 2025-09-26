import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useMyLoans, useReturnBook } from '../hooks/useLoans';
import { useAuth } from '../hooks/useAuth';
import dayjs from 'dayjs';

export const MyLoansPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: loansResponse, isLoading } = useMyLoans();
  const { mutate: returnBook } = useReturnBook();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const loans = loansResponse?.success ? loansResponse.data : [];

  const filteredLoans = loans.filter((loan: any) => {
    const matchesSearch = loan.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.book.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    
    const isOverdue = dayjs().isAfter(dayjs(loan.dueAt));
    const isActive = loan.status === 'active';
    const isReturned = loan.status === 'returned';

    if (statusFilter === 'active') return matchesSearch && isActive && !isOverdue;
    if (statusFilter === 'returned') return matchesSearch && isReturned;
    if (statusFilter === 'overdue') return matchesSearch && isActive && isOverdue;
    
    return matchesSearch;
  });

  const getStatusBadge = (loan: any) => {
    const isOverdue = dayjs().isAfter(dayjs(loan.dueAt));
    const isActive = loan.status === 'active';

    if (loan.status === 'returned') {
      return <Badge variant="secondary" className="text-green-600 bg-green-50">Returned</Badge>;
    } else if (isOverdue && isActive) {
      return <Badge variant="destructive">Overdue</Badge>;
    } else if (isActive) {
      return <Badge variant="default" className="bg-blue-500">Active</Badge>;
    }
    return <Badge variant="outline">{loan.status}</Badge>;
  };

  const handleReturnBook = (loanId: string) => {
    returnBook(loanId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-12 bg-muted rounded"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Borrowed Books</h1>
          <div className="text-sm text-muted-foreground">
            Total: {loans.length} books
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by book title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="returned">Returned</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Loans List */}
        <div className="space-y-4">
          {filteredLoans.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-2">No borrowed books found</div>
              <Button onClick={() => navigate('/books')}>Browse Books</Button>
            </div>
          ) : (
            filteredLoans.map((loan: any) => (
              <div key={loan.id} className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex gap-4">
                    <img
                      src={loan.book.coverImage || '/placeholder-book.png'}
                      alt={loan.book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-foreground mb-1 truncate">
                        {loan.book.title}
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        by {loan.book.author.name}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Borrowed: {dayjs(loan.borrowedAt).format('MMM DD, YYYY')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Due: {dayjs(loan.dueAt).format('MMM DD, YYYY')}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {getStatusBadge(loan)}
                    {loan.status === 'active' && (
                      <Button
                        onClick={() => handleReturnBook(loan.id)}
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        Return Book
                      </Button>
                    )}
                    {loan.status === 'returned' && loan.canReview && (
                      <Button
                        onClick={() => navigate(`/books/${loan.book.id}#reviews`)}
                        variant="default"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        Give Review
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredLoans.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => {}}>
              Load More
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold">Booky</span>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Discover inspiring stories & timeless knowledge, ready to borrow anytime. 
            Explore online or visit our nearest library branch.
          </p>
          <div className="space-y-2">
            <p className="font-medium text-foreground">Follow on Social Media</p>
            <div className="flex justify-center gap-4">
              <a href="https://facebook.com" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://instagram.com" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348c0-1.297 1.051-2.348 2.348-2.348c1.297 0 2.348 1.051 2.348 2.348c0 1.297-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348c0-1.297 1.051-2.348 2.348-2.348c1.297 0 2.348 1.051 2.348 2.348c0 1.297-1.051 2.348-2.348 2.348z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://linkedin.com" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://tiktok.com" className="text-muted-foreground hover:text-primary transition-colors">
                <div className="w-6 h-6 bg-current rounded-sm flex items-center justify-center text-xs font-bold">
                  T
                </div>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};