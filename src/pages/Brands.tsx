import React, { useEffect, useState } from 'react';
import { getBrands } from '../lib/api';
import { BrandInfo } from '../types';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Brands() {
  const [brands, setBrands] = useState<BrandInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBrands().then(data => {
      setBrands(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight uppercase"
          >
            Our Partner <span className="text-orange-500">Brands</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed font-medium"
          >
            Discover the amazing brands that craft the perfect biscuits for you.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {brands.map((brand, index) => (
              <motion.div 
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center group hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="w-32 h-32 rounded-full border-4 border-gray-50 mb-6 overflow-hidden bg-white flex items-center justify-center p-2 group-hover:border-emerald-100 transition-colors">
                  <img src={brand.image} alt={brand.name} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{brand.name}</h3>
                <Link to={`/shop?brand=${encodeURIComponent(brand.name)}`} className="text-emerald-600 font-medium text-sm hover:underline mt-auto pt-4">
                  View Products &rarr;
                </Link>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
