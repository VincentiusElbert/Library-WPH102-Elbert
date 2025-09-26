import { 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  DollarSign, 
  Atom, 
  Users 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { useDispatch } from 'react-redux';
import { setSelectedCategory } from '../store/features/uiSlice';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    name: 'Fiction',
    icon: BookOpen,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    name: 'Non-Fiction',
    icon: GraduationCap,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    name: 'Self-Improvement',
    icon: TrendingUp,
    color: 'bg-green-100 text-green-600',
  },
  {
    name: 'Finance',
    icon: DollarSign,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    name: 'Science',
    icon: Atom,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    name: 'Education',
    icon: Users,
    color: 'bg-indigo-100 text-indigo-600',
  },
];

export const CategoryGrid = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    dispatch(setSelectedCategory(categoryName));
    navigate('/books');
  };

  return (
    <section className="px-4 md:px-8 mt-8">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className="cursor-pointer transition-all duration-200 hover:shadow-lg"
                onClick={() => handleCategoryClick(category.name)}
              >
                <CardContent className="p-4 text-center">
                  <motion.div 
                    className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mx-auto mb-2`}
                    whileHover={{ rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <IconComponent className="h-6 w-6" />
                  </motion.div>
                  <p className="text-sm font-medium text-center leading-tight">
                    {category.name}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};