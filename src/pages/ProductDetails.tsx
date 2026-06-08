import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useCartStore } from '../store';
import { ShoppingCart, Star, Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore(state => state.addToCart);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => setProduct(data))
      .catch(() => navigate('/shop')); // Handle not found
  }, [id, navigate]);

  if (!product) {
     return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const handleAddToCart = () => {
    // Add multiple quantities
    for(let i=0; i<quantity; i++){
      addToCart(product);
    }
    alert("Added to cart!");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 mb-8 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full md:w-1/2"
        >
          <div className="rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 aspect-square">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-1/2 flex flex-col justify-center"
        >
          <div className="mb-2 text-sm font-bold text-emerald-600 uppercase tracking-widest">{product.category}</div>
          <h1 className="text-4xl font-black text-gray-900 leading-tight mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
              <span className="font-bold text-orange-700">{product.rating}</span>
            </div>
            <span className="text-gray-500">{product.reviews} reviews</span>
            <span className="text-gray-300">|</span>
            <span className="text-emerald-600 font-medium">In Stock ({product.stock})</span>
          </div>

          <div className="text-4xl font-bold mb-8 text-gray-900 tracking-tight">৳{product.price.toFixed(2)}</div>
          
          <p className="text-gray-600 leading-relaxed mb-8 text-lg">{product.description}</p>
          
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100 flex-wrap">
            <div className="flex items-center border-2 border-gray-200 rounded-full bg-white h-14">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 h-full text-gray-500 font-bold hover:text-emerald-600">-</button>
              <span className="w-10 text-center font-bold text-lg text-gray-900">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-5 h-full text-gray-500 font-bold hover:text-emerald-600">+</button>
            </div>
            <button 
              onClick={() => {
                for(let i=0; i<quantity; i++) addToCart(product);
                navigate('/checkout');
              }}
              className="px-8 h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              Order Now
            </button>
            <button 
              onClick={handleAddToCart}
              className="flex-1 min-w-[150px] h-14 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-full transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-500 font-medium bg-gray-50 rounded-xl p-4 border border-gray-100">
            <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0" /> Focus on Quality. 100% money back guarantee if products are not fresh.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
