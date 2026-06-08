import { useEffect, useState } from 'react';
import { useWishlistStore, useAuthStore } from '../store';
import { getProducts } from '../lib/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { HeartCrack } from 'lucide-react';
import { motion } from 'motion/react';

export default function Wishlist() {
  const wishlist = useWishlistStore(state => state.wishlist);
  const user = useAuthStore(state => state.user);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const favoriteProducts = products.filter(p => wishlist.includes(p.id.toString()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Wishlist</h1>
        <p className="text-gray-500 mt-2">
          {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'items'} saved for later
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-emerald-50/50 p-16 text-center"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-rose-50 mb-6">
            <HeartCrack className="w-12 h-12 text-rose-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            You haven't saved any items yet. Start exploring our collections and find something you love!
          </p>
          <Link 
            to="/shop" 
            className="inline-block px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5"
          >
            Explore Biscuits
          </Link>
        </motion.div>
      )}
    </div>
  );
}
