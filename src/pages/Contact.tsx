import { Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight"
          >
            Contact <span className="text-orange-500">Us</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            We would love to hear from you. Please fill out the form below or reach us through our contact details.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-6 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Thanks for your message. We'll get back to you soon!"); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="How can we help you?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea required rows={5} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Write your message here..."></textarea>
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors">
                Send Message
              </button>
            </form>
          </div>

          <div className="flex flex-col justify-center space-y-8 bg-gray-50 p-8 rounded-2xl border border-gray-100">
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h4>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Address</h4>
                    <p className="text-gray-600 text-sm">123 Biscuit Lane, Sweet District, Dhaka, Bangladesh</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Phone</h4>
                    <p className="text-gray-600 text-sm">+880 1234-567890</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Email</h4>
                    <p className="text-gray-600 text-sm">hello@biscuitbazar.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
               <h4 className="font-bold text-gray-900 mb-4">Business Hours</h4>
               <ul className="space-y-2 text-sm text-gray-600">
                 <li className="flex justify-between"><span>Sunday - Thursday:</span> <span className="font-medium text-gray-900">9:00 AM - 8:00 PM</span></li>
                 <li className="flex justify-between"><span>Friday - Saturday:</span> <span className="font-medium text-gray-900">10:00 AM - 5:00 PM</span></li>
               </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
