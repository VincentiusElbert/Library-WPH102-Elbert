import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import { setCredentials, logout, setLoading } from '../store/features/authSlice';
import { RootState } from '../store/store';
import { authAPI } from '../api/api';
import { toast } from '../hooks/use-toast';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const { token, user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      if (data.success) {
        dispatch(setCredentials({
          token: data.data.token,
          user: data.data.user
        }));
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.data.user.name}!`,
        });
      } else {
        throw new Error(data.message || 'Login failed');
      }
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
      const message = error?.response?.data?.message || error.message || 'Login failed';
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      if (data.success) {
        dispatch(setCredentials({
          token: data.data.token,
          user: data.data.user
        }));
        toast({
          title: "Registration Successful",
          description: `Welcome, ${data.data.user.name}!`,
        });
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    },
    onError: (error: any) => {
      console.error('Registration failed:', error);
      const message = error?.response?.data?.message || error.message || 'Registration failed';
      toast({
        title: "Registration Failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    token,
    user,
    isAuthenticated,
    loading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutUser,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};