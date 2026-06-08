import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCartStore, useWishlistStore, useAuthStore } from '../store';
import { toggleWishlistAPI } from '../lib/api';
import { motion } from 'motion/react';

export default function ProductCard({ product }: { product: Product; key?: React.Key }) {
  const addToCart = useCartStore(state => state.addToCart);
  const { wishlist, toggleFavorite } = useWishlistStore();
  const user = useAuthStore(state => state.user);

  const isWished = wishlist.includes(product.id.toString());

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(product.id.toString());
    if (user) {
      await toggleWishlistAPI(user.id.toString(), product.id.toString(), !isWished);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-emerald-50/50 flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <button 
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors z-10 
            ${isWished ? 'bg-white text-rose-500 opacity-100' : 'bg-white/80 backdrop-blur text-gray-400 hover:text-rose-500 hover:bg-white opacity-0 group-hover:opacity-100'}
          `}
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-rose-500' : ''}`} />
        </button>
        {product.stock < 50 && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Fast Selling
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-semibold text-emerald-600 truncate">{product.category}</p>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
            <span className="text-xs font-medium text-gray-600">{product.rating}</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`} className="block group-hover:text-emerald-700 transition-colors">
          <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
        </Link>
        
        <p className="text-xs text-gray-500 mb-4">{product.brand}</p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Price</span>
            <span className="text-lg font-bold text-gray-900">৳{product.price.toFixed(2)}</span>
          </div>
          <button 
            onClick={() => addToCart(product)}
            className="flex items-center justify-center p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-full transition-colors"
            title="Add to Cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
