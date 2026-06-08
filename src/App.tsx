/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Brands from './pages/Brands';
import TrackOrder from './pages/TrackOrder';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StaticPage from './pages/StaticPage';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Wishlist from './pages/Wishlist';
import { useAuthStore, useWishlistStore } from './store';
import { getWishlist } from './lib/api';

export default function App() {
  const user = useAuthStore(state => state.user);
  const setWishlist = useWishlistStore(state => state.setWishlist);

  useEffect(() => {
    if (user) {
      getWishlist(user.id.toString()).then(ids => {
        setWishlist(ids);
      });
    } else {
      setWishlist([]); // clear wishlist on logout
    }
  }, [user, setWishlist]);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<StaticPage slug="faq" />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/privacy" element={<StaticPage slug="privacy" />} />
            <Route path="/terms" element={<StaticPage slug="terms" />} />
            <Route path="/refund" element={<StaticPage slug="refund" />} />
            <Route path="/shipping" element={<StaticPage slug="shipping" />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/wishlist" element={<Wishlist />} />
            {/* Fallback route */}
            <Route path="*" element={<div className="p-20 text-center font-bold text-2xl text-emerald-800">Coming Soon</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

