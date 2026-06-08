import { useState } from 'react';
import { useCartStore } from '../store';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        clearCart();
        alert(`Order placed successfully! Order ID: ${data.orderId}`);
        navigate('/');
      }
    } catch (error) {
       alert("Error processing order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="bg-white border md:p-8 p-6 border-gray-100 rounded-3xl shadow-sm">
        <form onSubmit={handleCheckout} className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required type="text" className="w-full border-gray-200 border rounded-lg px-4 py-2 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input required type="tel" className="w-full border-gray-200 border rounded-lg px-4 py-2 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <textarea required rows={3} className="w-full border-gray-200 border rounded-lg px-4 py-2 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"></textarea>
              </div>
            </div>
          </div>

          <div>
             <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Payment Method</h2>
             <div className="space-y-3">
               <label className="flex items-center gap-3 p-4 border border-emerald-100 bg-emerald-50 rounded-xl cursor-pointer">
                 <input type="radio" name="payment" value="cod" defaultChecked className="text-emerald-600 focus:ring-emerald-500 h-4 w-4" />
                 <span className="font-medium text-emerald-900">Cash on Delivery</span>
               </label>
               <label className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl cursor-pointer hover:border-emerald-100 opacity-60">
                 <input disabled type="radio" name="payment" value="bkash" className="text-emerald-600 focus:ring-emerald-500 h-4 w-4" />
                 <span className="font-medium text-gray-900">bKash / Nagad (Coming Soon)</span>
               </label>
             </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-md transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Place Order (৳${(getCartTotal() + 80).toFixed(2)})`}
          </button>
        </form>
      </div>
    </div>
  );
}
