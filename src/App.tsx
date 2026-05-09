/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { ShoppingBag, Utensils, Clock, MapPin, ChevronRight, Menu as MenuIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MENU_ITEMS } from './data';
import { MenuItem, CartItem } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Popular');

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const totalItems = useMemo(() => cart.reduce((acc, i) => acc + i.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((acc, i) => acc + (i.price * i.quantity), 0), [cart]);
  const deliveryFee = 30;
  const total = subtotal + deliveryFee;

  const categories = ['Popular', 'Idli', 'Dosa', 'Vada', 'Drinks', 'Sides'];

  const filteredItems = useMemo(() => 
    MENU_ITEMS.filter(item => item.category === selectedCategory),
    [selectedCategory]
  );

  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'PhonePe' | 'Card' | 'COD'>('PhonePe');

  const handleCheckout = () => {
    if (paymentMethod === 'PhonePe') {
      // Generate UPI Deep Link
      const upiUrl = `upi://pay?pa=9483715866@ybl&pn=Rameshwaram%20Caffe&am=${total}&cu=INR&tn=Order%20from%20Rameshwaram%20Caffe`;
      window.location.href = upiUrl;
      
      // Since we can't track the UPI app response easily in a simple web app, 
      // we show a confirmation dialog or success after a short delay/manual step
      setIsOrderSuccess(true);
      setCart([]);
      setIsCartOpen(false);
    } else {
      setIsOrderSuccess(true);
      setCart([]);
      setIsCartOpen(false);
    }
    setTimeout(() => setIsOrderSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen relative">
      {/* Toast Notification for Order Success */}
      <AnimatePresence>
        {isOrderSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-12 right-12 md:left-auto md:right-12 md:w-96 bg-green-600 text-white p-6 rounded-2xl shadow-2xl z-[60] flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <Utensils className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Order Placed!</h4>
              <p className="text-white/80 text-sm">Your delicious meal is being prepared. Enjoy!</p>
            </div>
            <button onClick={() => setIsOrderSuccess(false)} className="ml-auto opacity-60 hover:opacity-100">
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center text-white">
              <Utensils size={20} />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-brand-dark italic">
              Rameshwaram <span className="text-brand-orange">Caffe</span>
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="text-brand-orange">Home</a>
            <a href="#" className="hover:text-brand-orange transition-colors">Menu</a>
            <a href="#" className="hover:text-brand-orange transition-colors">Locations</a>
            <a href="#" className="hover:text-brand-orange transition-colors">Contact</a>
          </div>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 hover:bg-slate-50 rounded-full transition-colors group"
          >
            <ShoppingBag className="text-slate-700 group-hover:text-brand-orange transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-brand-dark mb-12 min-h-[400px] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=1200" 
            alt="South Indian Food"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 px-8 md:px-16 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-brand-orange text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                Authentic Taste
              </span>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-[1.1]">
                Bringing tradition to your <span className="text-brand-yellow italic">Doorstep.</span>
              </h2>
              <p className="text-slate-300 text-lg mb-8 max-w-lg">
                Experience the rich heritage of South Indian flavors with our premium ghee-laden delicacies.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => {
                    const el = document.getElementById('menu-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-brand-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-orange/90 transition-all active:scale-95"
                >
                  Order Now
                </button>
                <div className="flex items-center gap-4 text-white/80 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-brand-yellow" />
                    <span className="text-sm">25-30 mins</span>
                  </div>
                  <div className="w-px h-4 bg-white/20" />
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-brand-yellow" />
                    <span className="text-sm">Nearby</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Menu Section */}
        <section id="menu-section" className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h3 className="text-3xl font-display font-bold text-slate-900 mb-2 italic underline decoration-brand-orange/30 underline-offset-8">Our Menu</h3>
              <p className="text-slate-500">Explore our signature dishes from the heart of Rameshwaram.</p>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-6 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border-2",
                    selectedCategory === cat 
                      ? "bg-brand-dark text-white border-brand-dark" 
                      : "bg-white text-slate-600 border-slate-100 hover:border-brand-orange/30"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-100">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {item.veg && (
                      <div className="absolute top-3 left-3 w-5 h-5 bg-white rounded border border-green-600 flex items-center justify-center p-0.5">
                        <div className="w-full h-full bg-green-600 rounded-full" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 mb-1">{item.name}</h4>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2 min-h-[40px] leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold font-mono text-brand-dark">₹{item.price}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="bg-brand-cream text-brand-orange px-4 py-2 rounded-xl font-bold hover:bg-brand-orange hover:text-white transition-all active:scale-90"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 px-4"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={24} className="text-brand-orange" />
                  <h3 className="text-xl font-bold text-slate-900">Your Order</h3>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag size={32} className="text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">Your cart is empty.</p>
                    <p className="text-slate-400 text-sm">Add some delicious food to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-bold text-slate-900">{item.name}</h4>
                            <span className="font-bold">₹{item.price * item.quantity}</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-3 line-clamp-1">{item.description}</p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="px-2 py-1 hover:text-brand-orange transition-colors"
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="px-2 py-1 hover:text-brand-orange transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-xs text-red-500 hover:underline font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Method</p>
                    <div className="grid grid-cols-1 gap-2">
                      <button 
                        onClick={() => setPaymentMethod('PhonePe')}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl border-2 transition-all",
                          paymentMethod === 'PhonePe' ? "border-brand-orange bg-brand-cream/30" : "border-slate-100"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-brand-orange/10 text-brand-orange rounded-lg flex items-center justify-center">
                            <span className="font-bold text-[10px]">UPI</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-brand-dark">PhonePe / UPI</p>
                            <p className="text-[10px] text-slate-500">9483715866@ybl</p>
                          </div>
                        </div>
                        {paymentMethod === 'PhonePe' && <div className="w-2 h-2 bg-brand-orange rounded-full" />}
                      </button>
                      
                      <button 
                        onClick={() => setPaymentMethod('COD')}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl border-2 transition-all opacity-50",
                          paymentMethod === 'COD' ? "border-brand-orange bg-brand-cream/30" : "border-slate-100"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-[10px]">COD</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-brand-dark">Cash on Delivery</p>
                            <p className="text-[10px] text-slate-500">Pay when you receive</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-600 text-sm">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-sm">
                      <span>Delivery Fee</span>
                      <span>₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-bold text-lg pt-2 border-t border-slate-200">
                      <span>Total Amount</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-brand-orange text-white py-4 rounded-xl font-bold shadow-lg shadow-brand-orange/20 hover:bg-brand-orange/90 transition-all flex items-center justify-center gap-2 group"
                  >
                    Proceed to Checkout
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Cart Bar */}
      {cart.length > 0 && !isCartOpen && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-6 right-6 z-40 md:hidden"
        >
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-brand-dark text-white p-4 rounded-2xl flex items-center justify-between shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="bg-brand-orange p-2 rounded-lg">
                <ShoppingBag size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Your Order</p>
                <p className="text-sm font-bold">{totalItems} Items • ₹{total}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 font-bold text-sm">
              View Cart <ChevronRight size={16} />
            </div>
          </button>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="bg-slate-50 py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h4 className="font-display text-4xl font-bold text-brand-dark italic mb-8">
              Rameshwaram <span className="text-brand-orange">Caffe</span>
            </h4>
            <div className="flex flex-wrap justify-center gap-8 mb-8 text-slate-500 font-medium">
              <a href="#" className="hover:text-brand-orange transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand-orange transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-brand-orange transition-colors">Safety Guide</a>
            </div>
            <p className="text-slate-400 text-sm">© 2026 Rameshwaram Caffe. Built for food lovers.</p>
        </div>
      </footer>
    </div>
  );
}

