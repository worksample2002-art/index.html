import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-emerald-900 text-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white tracking-tight">Biscuit</span>
              <span className="text-2xl font-bold text-orange-400 tracking-tight">Bazar</span>
            </div>
            <p className="text-emerald-100/80 text-sm leading-relaxed">
              Your premium destination for the finest local and international biscuits. Baking happiness since 2026.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-emerald-100 hover:text-orange-400 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-emerald-100 hover:text-orange-400 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-emerald-100 hover:text-orange-400 transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-white tracking-wide mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-emerald-100/80">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Our Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white tracking-wide mb-4">Policies</h3>
            <ul className="space-y-2 text-sm text-emerald-100/80">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white tracking-wide mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm text-emerald-100/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-orange-400 flex-shrink-0" />
                <span>123 Biscuit Lane, Sweet District, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>+880 1234-567890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>hello@biscuitbazar.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-emerald-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-emerald-100/60">
          <p>&copy; {new Date().getFullYear()} Biscuit Bazar. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Secured Checkout</span>
            {/* Payment icons mock */}
            <div className="flex gap-2">
              <span className="font-bold text-white bg-indigo-500 px-2 rounded">Stripe</span>
              <span className="font-bold text-white bg-blue-500 px-2 rounded">PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
