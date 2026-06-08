import { useContentStore } from '../store/contentStore';
import { motion } from 'motion/react';

export default function StaticPage({ slug }: { slug: string }) {
  const pages = useContentStore(state => state.pages);
  const page = pages[slug];

  if (!page) {
    return <div className="p-20 text-center font-bold text-2xl text-emerald-800">Page not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 min-h-screen">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight"
      >
        {page.title}
      </motion.h1>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 whitespace-pre-wrap text-gray-700 leading-relaxed text-lg"
      >
        {page.content}
      </motion.div>
    </div>
  );
}
