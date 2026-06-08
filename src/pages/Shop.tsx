import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { Filter } from 'lucide-react';
import { getCategories, getProducts } from '../lib/api';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryQuery = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(data => setCategories(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts(categoryQuery || undefined)
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, [categoryQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8 h-fit hidden md:block border-r border-gray-100 pr-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-emerald-600" /> Categories
            </h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => setSearchParams({})}
                  className={`text-sm tracking-wide ${!categoryQuery ? 'text-emerald-600 font-bold' : 'text-gray-600 hover:text-emerald-600'}`}
                >
                  All Biscuits
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat}>
                  <button 
                    onClick={() => setSearchParams({ category: cat })}
                    className={`text-sm tracking-wide ${categoryQuery === cat ? 'text-emerald-600 font-bold' : 'text-gray-600 hover:text-emerald-600'}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {categoryQuery ? categoryQuery : 'All Biscuits'}
            </h1>
            <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">{products.length} Products</span>
          </div>

          {loading ? (
            <div className="flex justify-center p-20"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try selecting a different category.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
