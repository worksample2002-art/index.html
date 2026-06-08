import { Link } from 'react-router-dom';
import { useCartStore } from '../store';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
          <Trash2 className="w-10 h-10 text-emerald-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm text-center">Looks like you haven't added any sweet treats to your cart yet.</p>
        <Link to="/shop" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-lg transition-all flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-6">
          {items.map(item => (
            <motion.div 
              layout
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex gap-6 p-4 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-semibold text-emerald-600 block mb-1">{item.category}</span>
                    <Link to={`/product/${item.id}`} className="font-bold text-gray-900 text-lg hover:text-emerald-600 transition-colors">
                      {item.name}
                    </Link>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="text-gray-500 text-sm mb-4">{item.brand}</div>
                
                <div className="mt-auto flex justify-between items-end">
                  <div className="flex items-center border border-gray-200 rounded-full bg-gray-50 p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-sm text-gray-500 block">Total</span>
                    <span className="text-xl font-bold text-gray-900">৳{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="w-full lg:w-96 border border-gray-100 bg-gray-50/50 p-6 md:p-8 rounded-3xl h-fit sticky top-24">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
          
          <div className="space-y-4 text-gray-600 border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">৳{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Estimate</span>
              <span className="font-medium text-gray-900">৳80.00</span>
            </div>
          </div>
          
          <div className="flex justify-between items-end mb-8">
            <span className="font-bold text-gray-900">Total</span>
            <span className="text-3xl font-black text-orange-500 tracking-tight">৳{(getCartTotal() + 80).toFixed(2)}</span>
          </div>

          <Link to="/checkout" className="block w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-center font-bold rounded-full shadow-lg shadow-emerald-500/20 transition-all">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
