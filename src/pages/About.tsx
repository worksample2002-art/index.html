import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Award, Users, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight"
          >
            Baking Memories <br />
            <span className="text-orange-500">Since 2026</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            Welcome to Biscuit Bazar, your premium destination for the finest local and international biscuits. 
            We believe that every perfect cup of tea deserves the perfect companion.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
            <p className="text-gray-600">We source only the highest quality biscuits from renowned bakers globally.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center"
          >
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Freshness Guaranteed</h3>
            <p className="text-gray-600">Every package is carefully handled to ensure maximum crispness and taste.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Happy Customers</h3>
            <p className="text-gray-600">Over 50,000+ satisfied customers trust us for their daily snacking needs.</p>
          </motion.div>
        </div>

        {/* Contact info grid */}
        <div className="bg-emerald-900 rounded-3xl p-8 md:p-12 text-white shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-12 justify-between">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold mb-6 text-orange-400">Get in Touch</h2>
              <p className="text-emerald-100 mb-8 leading-relaxed">
                Have questions about our products or need help with a bulk order? Our team is always ready to assist you.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-bold">Our Location</h4>
                    <p className="text-emerald-100/80">123 Biscuit Lane, Sweet District, Dhaka, Bangladesh</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-bold">Phone Number</h4>
                    <p className="text-emerald-100/80">+880 1234-567890</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-bold">Email Address</h4>
                    <p className="text-emerald-100/80">hello@biscuitbazar.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 bg-white p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"></textarea>
                </div>
                <button type="button" onClick={() => alert('Message Sent!')} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
