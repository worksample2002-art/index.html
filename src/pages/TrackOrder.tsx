import React, { useState } from 'react';
import { getOrderById } from '../lib/api';
import { motion } from 'motion/react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setLoading(true);
    setError('');
    setOrder(null);
    
    try {
      const found = await getOrderById(orderId.trim().toUpperCase());
      if (found) {
        setOrder(found);
      } else {
        setError('Order not found. Please check your order number.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'processing': return <Clock className="w-12 h-12 text-blue-500" />;
      case 'shipped': return <Package className="w-12 h-12 text-orange-500" />;
      case 'delivered': return <CheckCircle className="w-12 h-12 text-emerald-500" />;
      default: return <Package className="w-12 h-12 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-gray-900 mb-4"
        >
          Track Your Order
        </motion.h1>
        <p className="text-gray-500 text-lg">Enter your order number to see the current status</p>
      </div>

      <div className="max-w-xl mx-auto mb-16">
        <form onSubmit={handleTrack} className="flex relative">
          <input 
            type="text" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. ORD-100501"
            className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl px-6 py-4 pr-32 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center transition-colors disabled:opacity-50"
          >
            {loading ? 'Tracking...' : <><Search className="w-5 h-5 mr-2" /> Track</>}
          </button>
        </form>
        {error && <p className="text-rose-500 mt-4 text-center">{error}</p>}
      </div>

      {order && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-emerald-50/50 p-8 md:p-12"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center shadow-inner mb-6">
              {getStatusIcon(order.status)}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order {order.id}</h2>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-bold uppercase tracking-wider text-sm">
              Status: {order.status}
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-8 grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Date Placed</p>
              <p className="font-bold text-gray-900">{order.date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Amount</p>
              <p className="font-bold text-gray-900">${order.total}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500 mb-1">Customer</p>
              <p className="font-bold text-gray-900">{order.customer}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
