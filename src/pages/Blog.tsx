import { motion } from 'motion/react';
import { useContentStore } from '../store/contentStore';
import { Calendar } from 'lucide-react';

export default function Blog() {
  const blogs = useContentStore(state => state.blogs);

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight"
          >
            Our <span className="text-orange-500">Blog</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            Read the latest news, tips, and stories about your favorite biscuits.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <motion.div 
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group hover:shadow-xl transition-all"
            >
              <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 font-medium">
                  <Calendar className="w-4 h-4" />
                  {new Date(blog.date).toLocaleDateString()}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {blog.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                  <button className="text-emerald-600 font-bold text-sm tracking-wide hover:text-emerald-700 transition-colors">Read More &rarr;</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
