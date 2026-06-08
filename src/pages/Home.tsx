import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, Clock } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { getBanners, getProducts } from '../lib/api';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<{id: string, image: string, title: string, description?: string, link?: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

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

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Hero Slider Section */}
      <section className="relative bg-emerald-900 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-[60vh] min-h-[400px] w-full">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : banners.length > 0 ? (
          <div className="relative w-full overflow-hidden flex items-center h-[60vh] min-h-[400px]">
            <AnimatePresence>
              {banners.map((banner, idx) => (
                idx === activeSlide && (
                  <motion.div 
                    key={`${banner.id}-${idx}`} 
                    className="absolute inset-0 h-full w-[100vw] overflow-hidden group"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.8 }}
                  >
                    <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/40 to-transparent"></div>
                    
                    <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-12 lg:px-24">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="max-w-3xl space-y-6"
                      >
                        {banner.title && (
                          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight uppercase shadow-sm">
                            {banner.title}
                          </h2>
                        )}
                        {banner.description && (
                          <p className="text-xl md:text-2xl text-emerald-50 max-w-2xl leading-relaxed drop-shadow-md font-medium">
                            {banner.description}
                          </p>
                        )}
                        
                        {banner.link && (
                          <div className="pt-4">
                            <Link to={banner.link} className="inline-flex px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-lg transition-all items-center gap-2">
                              Explore Now <ArrowRight className="w-5 h-5" />
                            </Link>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
            
            {/* Slider Controls */}
            {banners.length > 1 && (
              <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
                {banners.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${idx === activeSlide ? 'bg-orange-500 scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center h-[60vh] min-h-[400px] w-full bg-emerald-900 px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
              Bite into <span className="text-orange-400">Happiness</span> Every Day.
            </h1>
          </div>
        )}
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
