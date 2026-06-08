import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, Clock } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { motion } from 'motion/react';
import { getBanners, getProducts } from '../lib/api';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<{id: number, image: string, title: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProducts(),
      getBanners()
    ]).then(([productData, bannerData]) => {
      setProducts(productData);
      setBanners(bannerData);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-emerald-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1920&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 md:py-32">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl space-y-8"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-orange-500/20 text-orange-400 text-sm font-bold tracking-wider uppercase border border-orange-500/50">
              Premium Quality
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
              Bite into <br/>
              <span className="text-orange-400">Happiness</span> <br/>
              Every Day.
            </h1>
            <p className="text-lg text-emerald-100 max-w-xl leading-relaxed">
              Discover the finest collection of local and international biscuits. Handpicked for your perfect tea-time and snacking moments.
            </p>
            <div className="flex gap-4 pt-4">
              <Link to="/shop" className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2">
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="flex flex-col items-center gap-3 pt-6 md:pt-0">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full"><Truck className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-gray-900">Fast Delivery</h4>
                <p className="text-sm text-gray-500">Nationwide shipping in 24-48 hours</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 pt-6 md:pt-0">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-full"><ShieldCheck className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-gray-900">Secure Payment</h4>
                <p className="text-sm text-gray-500">100% secure payment processing</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 pt-6 md:pt-0">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full"><Clock className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-gray-900">Fresh Guaranteed</h4>
                <p className="text-sm text-gray-500">Always fresh stock delivered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banners Slider */}
      <section className="py-12 bg-white overflow-hidden">
        <div className="flex justify-between items-end mb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Featured Collections</h2>
            <p className="text-gray-500">Discover our special selections</p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="relative w-full overflow-hidden flex">
            {/* We duplicate the banner list twice to create a seamless infinite scroll effect */}
            <div className="flex gap-6 px-4 w-[200%] animate-auto-scroll">
              {[...banners, ...banners].map((banner, idx) => (
                <div 
                  key={`${banner.id}-${idx}`} 
                  className="relative h-64 md:h-80 w-80 md:w-96 rounded-3xl overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm group"
                >
                  <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                  <h3 className="relative z-20 text-white font-bold text-xl md:text-2xl mt-auto pb-8 px-6 text-center w-full">{banner.title}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-emerald-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">Best Selling Biscuits</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Loved by thousands of our customers. Taste the difference in every bite.</p>
          </div>

          {loading ? (
            <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-white border-y border-gray-100">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Sweet Community</h2>
            <p className="text-gray-600 mb-8">Subscribe to receive updates on new arrivals, special offers and discount coupons.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-grow px-5 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm"
                required
              />
              <button 
                type="submit" 
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-md transition-all whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
         </div>
      </section>
    </div>
  );
}
