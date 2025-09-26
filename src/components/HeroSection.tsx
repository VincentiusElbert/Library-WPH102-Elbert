import { motion } from 'framer-motion';
import heroImage from '../assets/hero-image.jpg';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 md:mx-8 mt-6">
      <div 
        className="relative h-64 md:h-80 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-blue-600/20" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Welcome to<br />Booky
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-md mx-auto">
            Discover inspiring stories & timeless knowledge, ready to borrow anytime.
          </p>
        </motion.div>

        {/* Carousel indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-white/50"></div>
          <div className="w-2 h-2 rounded-full bg-white/50"></div>
        </div>
      </div>
    </section>
  );
};