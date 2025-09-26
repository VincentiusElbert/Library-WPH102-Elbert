import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Camera, Facebook, Instagram, Linkedin } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../api/api';
import dayjs from 'dayjs';

// Mock data for profile
const mockUserProfile = {
  id: '1',
  name: 'Johndoe',
  email: 'johndoe@email.com',
  phone: '081234567890',
  avatar: '/placeholder-avatar.png',
  joined_date: '2024-01-01',
  total_borrowed: 15,
  current_borrowed: 3,
  reviews_count: 8,
};

const mockBorrowedBooks = [
  {
    id: '1',
    book: {
      id: '1',
      title: '21 Resep Bakso Pak Bowo',
      author: 'Tufik',
      cover_image: '/placeholder-book.png',
    },
    borrowed_at: '2024-01-15',
    due_date: '2024-02-15',
    status: 'BORROWED',
  },
  {
    id: '2',
    book: {
      id: '2',
      title: 'Irresistible',
      author: 'Lisa Kleypas',
      cover_image: '/placeholder-book.png',
    },
    borrowed_at: '2024-01-01',
    due_date: '2024-02-01',
    returned_at: '2024-01-28',
    status: 'RETURNED',
  },
];

const mockUserReviews = [
  {
    id: '1',
    book: {
      id: '1',
      title: '21 Resep Bakso Pak Bowo',
      cover_image: '/placeholder-book.png',
    },
    rating: 5,
    comment: 'Excellent cookbook! The recipes are easy to follow and delicious.',
    created_at: '2024-01-20',
  },
  {
    id: '2',
    book: {
      id: '3',
      title: 'Oliver Twist',
      cover_image: '/placeholder-book.png',
    },
    rating: 4,
    comment: 'Great classic novel, really enjoyed reading it.',
    created_at: '2024-01-15',
  },
];

export const ProfilePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Johndoe',
    email: user?.email || 'johndoe@email.com',
    phone: '081234567890',
  });

  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: profile = mockUserProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/profile');
        return response.data.data || mockUserProfile;
      } catch (error) {
        return mockUserProfile;
      }
    },
    enabled: isAuthenticated,
  });

  // Fetch borrowed books
  const { data: borrowedBooksData = mockBorrowedBooks } = useQuery({
    queryKey: ['user-borrowed-books'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/loans/my');
        const data = response.data.data || response.data || mockBorrowedBooks;
        return Array.isArray(data) ? data : mockBorrowedBooks;
      } catch (error) {
        return mockBorrowedBooks;
      }
    },
    enabled: isAuthenticated,
  });

  // Ensure borrowedBooks is always an array
  const borrowedBooks = Array.isArray(borrowedBooksData) ? borrowedBooksData : mockBorrowedBooks;

  // Fetch user reviews
  const { data: userReviews = mockUserReviews } = useQuery({
    queryKey: ['user-reviews'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/reviews/my');
        return response.data.data || mockUserReviews;
      } catch (error) {
        return mockUserReviews;
      }
    },
    enabled: isAuthenticated,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.put('/api/profile', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleUpdateProfile = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="borrowed">Borrowed List</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Profile</h1>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col items-center space-y-6">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile.avatar} alt={profile.name} />
                      <AvatarFallback className="text-2xl">
                        {profile.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Profile Information */}
                  <div className="w-full max-w-md space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Name</Label>
                        {isEditing ? (
                          <Input
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="font-medium text-right md:text-left">{profile.name}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        {isEditing ? (
                          <Input
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="font-medium text-right md:text-left">{profile.email}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <Label className="text-muted-foreground">Nomor Handphone</Label>
                        {isEditing ? (
                          <Input
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="font-medium text-right md:text-left">{profile.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      {isEditing ? (
                        <div className="flex space-x-2">
                          <Button 
                            onClick={handleUpdateProfile}
                            disabled={updateProfileMutation.isPending}
                            className="flex-1"
                          >
                            {updateProfileMutation.isPending ? 'Updating...' : 'Save Changes'}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsEditing(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => setIsEditing(true)}
                          className="w-full"
                        >
                          Update Profile
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Borrowed List Tab */}
          <TabsContent value="borrowed" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Borrowed Books</h2>
              <p className="text-muted-foreground">Your current and past borrowed books</p>
            </div>

            <div className="space-y-4">
              {borrowedBooks.map((loan) => (
                <Card key={loan.id}>
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      <img
                        src={loan.book.cover_image || '/placeholder-book.png'}
                        alt={loan.book.title}
                        className="w-16 h-20 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-book.png';
                        }}
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{loan.book.title}</h3>
                            <p className="text-muted-foreground text-sm">
                              {typeof loan.book.author === 'string' ? loan.book.author : loan.book.author?.name || 'Unknown Author'}
                            </p>
                          </div>
                          <Badge variant={loan.status === 'BORROWED' ? 'default' : 'secondary'}>
                            {loan.status}
                          </Badge>
                        </div>
                        
                        <div className="mt-2 text-xs text-muted-foreground">
                          <p>Borrowed: {dayjs(loan.borrowed_at).format('MMM DD, YYYY')}</p>
                          <p>Due: {dayjs(loan.due_date).format('MMM DD, YYYY')}</p>
                          {loan.returned_at && (
                            <p>Returned: {dayjs(loan.returned_at).format('MMM DD, YYYY')}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">My Reviews</h2>
              <p className="text-muted-foreground">Books you've reviewed</p>
            </div>

            <div className="space-y-4">
              {userReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      <img
                        src={review.book.cover_image || '/placeholder-book.png'}
                        alt={review.book.title}
                        className="w-16 h-20 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-book.png';
                        }}
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{review.book.title}</h3>
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-muted-foreground'
                                  }`}
                                >
                                  ⭐
                                </div>
                              ))}
                              <span className="text-sm text-muted-foreground ml-1">
                                {review.rating}/5
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {dayjs(review.created_at).format('MMM DD, YYYY')}
                          </span>
                        </div>
                        
                        <p className="mt-2 text-sm">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer in Profile */}
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
              <Button variant="outline" size="icon" className="rounded-full">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <span className="text-sm font-bold">T</span>
              </Button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};