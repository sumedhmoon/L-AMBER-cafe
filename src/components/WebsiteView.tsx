import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Coffee, ShoppingBag, ArrowRight, Compass, Info, Phone, MapPin, Clock, 
  Instagram, Sparkles, Heart, Plus, Minus, Trash2, Box, Eye, X
} from "lucide-react";
import { Product, CartItem } from "../types";

interface WebsiteViewProps {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToast: (msg: string, type: "success" | "error" | "info" | "promo") => void;
  onCreateOrder: (name: string, phone: string, source: "website" | "mobile") => void;
}

export default function WebsiteView({
  products,
  cart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  addToast,
  onCreateOrder
}: WebsiteViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductForAR, setSelectedProductForAR] = useState<Product | null>(null);
  const [arScale, setArScale] = useState(1);
  const [arRotation, setArRotation] = useState(0);

  // Filter products by category
  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) {
      addToast("Your cart is empty.", "error");
      return;
    }

    const customerName = prompt("May we have your name for the order record?", "Sumedh Moon");
    if (!customerName) return;

    // Simulate placing the order in our dashboard tracker
    onCreateOrder(customerName, "+91 98765 43210", "website");

    // Build the WhatsApp URL
    const storeNumber = "919876543210"; // Sample store number
    let message = `Hi Café L'Ambre! I would like to place an order from your Luxury Website:\n\n`;
    message += `👤 *Customer:* ${customerName}\n`;
    message += `📅 *Date:* ${new Date().toLocaleDateString()}\n\n`;
    message += `🛒 *Order Items:*\n`;
    
    cart.forEach(item => {
      message += `• ${item.product.name} [x${item.quantity}] - ₹${item.product.price * item.quantity}\n`;
    });
    
    message += `\n💰 *Total Amount:* ₹${cartSubtotal}\n\n`;
    message += `Please confirm preparation and estimated time. Thank you! ✨`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${storeNumber}?text=${encodedMessage}`;

    // Show redirection feedback
    addToast("Generating your luxury WhatsApp receipt...", "success");
    
    setTimeout(() => {
      window.open(waUrl, "_blank");
      clearCart();
      setIsCartOpen(false);
    }, 1200);
  };

  const handleDirectWhatsAppOrder = (product: Product) => {
    const storeNumber = "919876543210";
    const message = `Hi Café L'Ambre! I want to order your exceptional *${product.name}* (₹${product.price}) from the collection. Please advise on estimated brew time! ☕`;
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${storeNumber}?text=${encodedMessage}`;
    
    onCreateOrder("Direct Buyer", "+91 99999 88888", "website");
    addToast(`Redirecting to order ${product.name}...`, "success");
    
    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 800);
  };

  return (
    <div id="website-view-root" className="bg-transparent text-neutral-100 min-h-screen font-sans relative overflow-x-hidden selection:bg-[#d4af37] selection:text-black">
      
      {/* High-End Architectural Grid Overlay */}
      <div className="absolute inset-0 grid-bg-overlay pointer-events-none z-0" />
      
      {/* Premium Navigation */}
      <nav id="website-nav" className="sticky top-0 z-35 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Immersive Rotating Diamond Logo */}
          <div className="w-6 h-6 bg-gradient-to-tr from-[#d4af37] to-[#F9E79F] rounded-sm rotate-45 flex items-center justify-center shrink-0">
            <div className="w-3 h-3 bg-[#0A0A0B] rotate-45"></div>
          </div>
          <span className="font-serif font-black text-xl tracking-widest text-white uppercase ml-1.5 flex items-center gap-1">
            L'Ambre <span className="text-xs text-[#d4af37] tracking-normal font-sans italic font-normal">Café</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-xs tracking-wider uppercase font-medium text-neutral-400">
          <a href="#hero" className="hover:text-white hover:border-b hover:border-[#d4af37] pb-1 transition-colors">Home</a>
          <a href="#menu" className="hover:text-white hover:border-b hover:border-[#d4af37] pb-1 transition-colors">Artisanal Menu</a>
          <a href="#instagram" className="hover:text-white hover:border-b hover:border-[#d4af37] pb-1 transition-colors">Social Feed</a>
          <a href="#about" className="hover:text-white hover:border-b hover:border-[#d4af37] pb-1 transition-colors">Story</a>
          <a href="#contact" className="hover:text-white hover:border-b hover:border-[#d4af37] pb-1 transition-colors">Reserve</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            id="web-cart-toggle"
            onClick={() => setIsCartOpen(true)}
            className="relative bg-white/5 border border-white/10 hover:border-[#d4af37] px-4 py-2 rounded-xl text-white hover:text-[#d4af37] flex items-center gap-2 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
            <span className="text-xs font-mono font-bold">{cart.length}</span>
            <span className="hidden sm:inline text-xs uppercase tracking-wider font-semibold">Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="hero" className="relative min-h-[85vh] flex items-center justify-center px-6 overflow-hidden">
        {/* Background Ambient Lights */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-neutral-800/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Visual Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        <div className="max-w-4xl text-center z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-neutral-900 border border-[#d4af37]/30 px-4 py-2 rounded-full text-[#d4af37] text-xs uppercase tracking-widest font-mono"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            High-Concept Sensory Brews
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-white leading-[1.1]"
          >
            Luxury Brews For <br />
            <span className="font-normal italic text-[#d4af37] bg-gradient-to-r from-[#d4af37] via-[#f5e3a8] to-[#d4af37] bg-clip-text text-transparent">Modern Minds</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-neutral-400 max-w-xl mx-auto text-sm sm:text-base font-light leading-relaxed font-sans"
          >
            At Café L'Ambre, coffee isn't merely a drink. It is a meticulous art form, brewed with micro-selected origin beans and paired with exquisite, gold-crafted pastries.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <a 
              href="#menu" 
              className="bg-[#d4af37] hover:bg-[#c5a880] text-black font-semibold uppercase text-xs tracking-widest px-8 py-4 rounded-xl flex items-center gap-2 shadow-xl hover:shadow-[#d4af37]/10 transition-all w-full sm:w-auto justify-center cursor-pointer"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </a>
            <button 
              onClick={() => {
                const waUrl = "https://wa.me/919876543210?text=Hi%20Caf%C3%A9%20L'Ambre%2C%20I%20want%20to%20view%20and%20order%20the%20gourmet%20collection%20today!%20%E2%98%95";
                window.open(waUrl, "_blank");
              }}
              className="bg-transparent hover:bg-neutral-900 border border-neutral-800 hover:border-[#d4af37]/50 text-white font-semibold uppercase text-xs tracking-widest px-8 py-4 rounded-xl transition-all w-full sm:w-auto text-center cursor-pointer"
            >
              Order on WhatsApp
            </button>
          </motion.div>
        </div>
      </header>

      {/* Key Metrics / Highlights Section */}
      <section id="highlights" className="py-12 border-y border-white/10 bg-[#0A0A0B]/40 backdrop-blur-md px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center space-y-1">
            <h4 className="text-[#d4af37] font-serif text-3xl font-bold">100%</h4>
            <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">Arabica Specialty Beans</p>
          </div>
          <div className="text-center space-y-1">
            <h4 className="text-[#d4af37] font-serif text-3xl font-bold">72h</h4>
            <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">Slow Butter Fermentation</p>
          </div>
          <div className="text-center space-y-1">
            <h4 className="text-[#d4af37] font-serif text-3xl font-bold">24K</h4>
            <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">Edible Gold Dusting</p>
          </div>
          <div className="text-center space-y-1">
            <h4 className="text-[#d4af37] font-serif text-3xl font-bold">&lt;15m</h4>
            <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">Aesthetic Prepared Express</p>
          </div>
        </div>
      </section>

      {/* Products / Menu Section */}
      <section id="menu" className="py-24 max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest font-mono text-[#d4af37]">Crafted Masterpieces</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-white">The Artisanal Cafe Menu</h2>
          <div className="w-16 h-[1px] bg-[#d4af37] mx-auto mt-4" />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-[#0A0A0B]/60 backdrop-blur-md border border-white/10 p-1.5 rounded-2xl max-w-2xl mx-auto">
          {["all", "coffee", "specialty", "pastry", "dessert"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all cursor-pointer ${
                activeCategory === category
                  ? "bg-[#d4af37] text-black shadow-lg"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {category === "all" ? "Full Collection" : category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                id={`web-product-${product.id}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-[#d4af37]/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between transition-all duration-300"
              >
                {/* Image Container with Hover Action */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0A0A0B]">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  
                  {/* Category badge */}
                  <span className="absolute top-4 left-4 bg-black/75 border border-[#d4af37]/30 text-[#d4af37] text-[9px] uppercase tracking-widest font-mono px-2.5 py-1 rounded-full">
                    {product.category}
                  </span>

                  {/* Quick AR view badge */}
                  <button
                    onClick={() => {
                      setSelectedProductForAR(product);
                      setArScale(1);
                      setArRotation(0);
                    }}
                    title="Activate interactive AR preview"
                    className="absolute top-4 right-4 bg-black/60 hover:bg-black border border-white/10 hover:border-[#d4af37] text-[#d4af37] p-2 rounded-xl transition-all cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-serif text-lg text-white group-hover:text-[#d4af37] transition-colors leading-tight">
                        {product.name}
                      </h3>
                      <span className="font-serif font-bold text-[#d4af37] text-lg pl-2">
                        ₹{product.price}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-xs font-light leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        addToCart(product);
                        addToast(`Added ${product.name} to your luxury cart.`, "success");
                      }}
                      className="flex-1 bg-white/5 border border-white/10 group-hover:border-[#d4af37]/50 text-white hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#d4af37]" />
                      Add to Cart
                    </button>
                    
                    <button
                      onClick={() => handleDirectWhatsAppOrder(product)}
                      className="bg-[#d4af37] text-black hover:bg-[#c5a880] text-[10px] font-bold uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Instant single order on WhatsApp"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Simulated Instagram Product Sync Feed */}
      <section id="instagram" className="py-20 bg-[#0A0A0B]/40 backdrop-blur-md border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest font-mono text-[#d4af37] flex items-center gap-1.5">
                <Instagram className="w-4 h-4" /> Instagram Sync Shop
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-white">Shop the Editorial Feed</h3>
            </div>
            <p className="text-neutral-400 text-xs sm:max-w-xs font-light leading-relaxed">
              Click on any look below from our digital lifestyle gallery to buy or reserve the featured recipe item instantly.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: "prod_1", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=300", tag: "Gold Espresso" },
              { id: "prod_3", img: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=300", tag: "Saffron Latte" },
              { id: "prod_5", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=300", tag: "Pistachio Croissant" },
              { id: "prod_6", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300", tag: "Noir Truffle Tart" },
            ].map((feed, i) => (
              <div 
                key={i} 
                onClick={() => {
                  const p = products.find(prod => prod.id === feed.id);
                  if (p) {
                    addToCart(p);
                    addToast(`Instagram Item Added: ${p.name}`, "success");
                  }
                }}
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 hover:border-[#d4af37]/40 cursor-pointer"
              >
                <img 
                  src={feed.img} 
                  alt="Insta feed" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 opacity-80 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 transition-opacity duration-300">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-[#d4af37] mb-1">Buy Look</span>
                  <p className="text-white text-xs font-semibold">{feed.tag}</p>
                  <span className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1">Add to Cart <Plus className="w-3 h-3" /></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story / About Section */}
      <section id="about" className="py-24 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0B] shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600" 
            alt="Artisanal Brewing setup" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 p-6 bg-[#0A0A0B]/80 backdrop-blur-md border border-white/10 rounded-xl space-y-1">
            <span className="text-[9px] uppercase tracking-wider font-mono text-[#d4af37]">Head Roastery</span>
            <p className="text-white text-sm font-serif">Kaffa Forest Specialty, Ethiopia</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest font-mono text-[#d4af37]">The Roaster's Manifesto</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-white leading-tight">Meticulously Sourced, Decadently Steeped.</h2>
            <div className="w-12 h-[1px] bg-[#d4af37] mt-3" />
          </div>

          <p className="text-neutral-400 text-sm leading-relaxed font-light">
            Café L'Ambre was founded under a singular premise: premium coffee should satisfy both the palate and the aesthetic eye. We acquire micro-lots of single-origin Arabica berries, treating them to light-medium roasts to unleash elegant floral notes.
          </p>

          <p className="text-neutral-400 text-sm leading-relaxed font-light">
            Every cup tells our complete journey—from high-elevation volcanic soil directly to our gold-dusted copper extraction machinery. This is where modern high-conversion cafe business matches absolute product craft.
          </p>

          <div className="flex gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <span className="text-xs font-serif text-white">Elite Roasts</span>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Sourced Under Direct Trade</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <span className="text-xs font-serif text-white">Gold Bakeries</span>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest">72h Slow Ferment Pastries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Map Section */}
      <section id="contact" className="py-24 bg-[#0A0A0B]/50 backdrop-blur-md border-t border-white/10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest font-mono text-[#d4af37]">Reserve Your Brew</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-white">Visit Our Atelier</h2>
              <div className="w-12 h-[1px] bg-[#d4af37] mt-2" />
            </div>

            <div className="space-y-4 text-sm font-light text-neutral-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#d4af37] mt-0.5 shrink-0" />
                <div>
                  <p className="text-white font-medium">L'Ambre Atelier Downtown</p>
                  <p className="text-xs text-neutral-500">Block 2A, Imperial Arcade, Luxury Row, Mumbai 400001</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#d4af37] mt-0.5 shrink-0" />
                <div>
                  <p className="text-white font-medium">Atelier Hours</p>
                  <p className="text-xs text-neutral-500">Everyday: 07:00 AM — 11:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#d4af37] mt-0.5 shrink-0" />
                <div>
                  <p className="text-white font-medium">Concierge Line</p>
                  <p className="text-xs text-neutral-500">+91 98765 43210 (Direct WhatsApp Reservation)</p>
                </div>
              </div>
            </div>

            {/* Custom Contact Form for lead capturing */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                addToast("Luxury Reservation Inquiry Logged. Directing to WhatsApp...", "success");
                onCreateOrder("Atelier Guest", "+91 98333 44444", "website");
                setTimeout(() => {
                  window.open("https://wa.me/919876543210?text=Hi%20Caf%C3%A9%20L'Ambre%2C%20I%20would%20like%20to%20reserve%20an%20artisanal%20tasting%20session%20today!", "_blank");
                }, 1000);
              }}
              className="space-y-3 bg-[#0A0A0B] p-6 rounded-2xl border border-white/10"
            >
              <h4 className="text-white font-serif text-sm uppercase tracking-widest mb-2 text-[#d4af37]">Priority Experience Reservation</h4>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required
                  className="bg-[#0A0A0B] border border-white/10 text-xs text-white placeholder-neutral-500 rounded-xl p-3 focus:outline-none focus:border-[#d4af37]"
                />
                <input 
                  type="tel" 
                  placeholder="WhatsApp Number" 
                  required
                  className="bg-[#0A0A0B] border border-white/10 text-xs text-white placeholder-neutral-500 rounded-xl p-3 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-[#d4af37] hover:bg-[#c5a880] text-black text-[10px] font-bold uppercase tracking-widest py-3.5 rounded-xl cursor-pointer"
              >
                Book Private Tasting Session
              </button>
            </form>
          </div>

          {/* Interactive SVG Dark Map */}
          <div className="relative border border-white/10 rounded-2xl overflow-hidden aspect-video bg-[#0A0A0B] flex flex-col items-center justify-center p-4">
            <svg 
              id="luxury-interactive-map"
              viewBox="0 0 400 200" 
              className="w-full h-full text-neutral-800 opacity-90"
            >
              <rect width="100%" height="100%" fill="#0a0a0b" />
              {/* Grid map lines */}
              <line x1="0" y1="50" x2="400" y2="50" stroke="#161616" strokeWidth="1" />
              <line x1="0" y1="100" x2="400" y2="100" stroke="#161616" strokeWidth="1" />
              <line x1="0" y1="150" x2="400" y2="150" stroke="#161616" strokeWidth="1" />
              <line x1="100" y1="0" x2="100" y2="200" stroke="#161616" strokeWidth="1" />
              <line x1="200" y1="0" x2="200" y2="200" stroke="#161616" strokeWidth="1" />
              <line x1="300" y1="0" x2="300" y2="200" stroke="#161616" strokeWidth="1" />
              
              {/* Rivers/Lakes or Luxury Zone layouts */}
              <path d="M 0,180 Q 150,150 250,200 L 400,200 L 400,180 Q 250,140 0,160 Z" fill="#141414" />
              
              {/* Streets */}
              <path d="M 50,0 L 50,200" stroke="#262626" strokeWidth="4" fill="none" />
              <path d="M 280,0 L 280,200" stroke="#262626" strokeWidth="6" fill="none" />
              <path d="M 0,80 L 400,80" stroke="#262626" strokeWidth="5" fill="none" />
              <path d="M 0,130 L 400,130" stroke="#2d1d0b" strokeWidth="4" fill="none" /> {/* Luxury Boulevard */}

              {/* Park */}
              <rect x="120" y="10" width="80" height="60" rx="4" fill="#112211" opacity="0.3" />
              <text x="160" y="45" fill="#446644" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="1">CENTRAL SQUARE</text>

              {/* Shopping Arcade */}
              <rect x="220" y="95" width="50" height="30" rx="3" fill="#2d1d0b" opacity="0.2" />
              <text x="245" y="112" fill="#8e7453" fontSize="6" fontFamily="monospace" textAnchor="middle">IMPERIAL ARCADE</text>

              {/* Café L'Ambre Marker */}
              <circle cx="245" cy="130" r="10" fill="#d4af37" opacity="0.2" className="animate-ping" />
              <circle cx="245" cy="130" r="4" fill="#d4af37" />
              
              <text x="245" y="150" fill="#ffffff" fontSize="8" fontFamily="serif" fontWeight="bold" textAnchor="middle" letterSpacing="1">CAFÉ L'AMBRE</text>
            </svg>
            <div className="absolute bottom-4 left-4 right-4 bg-black/90 p-3.5 rounded-xl border border-[#d4af37]/30 flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-sans">Aesthetic Downtown Luxury Quarter</span>
              <button 
                onClick={() => addToast("Routing on Google Maps...", "info")}
                className="text-[#d4af37] font-bold font-mono tracking-wide uppercase hover:underline"
              >
                OPEN MAP
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="website-footer" className="bg-neutral-950 border-t border-neutral-900 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-[#d4af37]" />
            <span className="font-serif font-black tracking-widest text-sm text-white">CAFÉ L'AMBRE</span>
          </div>
          <p className="text-[10px] text-neutral-500 font-mono text-center">
            © 2026 CAFÉ L'AMBRE ATELIER. ALL RIGHTS RESERVED. DELIVERIES PROXIED BY DEDICATED CONCIERGE.
          </p>
          <div className="flex items-center gap-4 text-neutral-400">
            <Instagram className="w-4 h-4 hover:text-[#d4af37] transition-colors cursor-pointer" />
            <span className="text-xs font-serif font-bold italic">Noir & Or</span>
          </div>
        </div>
      </footer>

      {/* Slide-out Cart Panel */}
      <AnimatePresence>
        {isCartOpen && (
          <div id="cart-drawer-backdrop" className="fixed inset-0 bg-black/75 z-40 flex justify-end">
            <motion.div
              id="cart-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="w-full max-w-md bg-[#0A0A0B] border-l border-white/10 h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="font-serif text-lg text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
                    Your Atelier Cart
                  </h3>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-neutral-400 hover:text-white font-mono text-xs cursor-pointer"
                  >
                    CLOSE ✕
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-20 space-y-4">
                    <Coffee className="w-12 h-12 text-neutral-800 mx-auto" />
                    <p className="text-neutral-500 text-xs font-sans">No luxury items in your cart. Choose from our hand-selected products to begin.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div 
                        key={item.product.id} 
                        className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10 justify-between"
                      >
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-xs truncate font-medium">{item.product.name}</h4>
                          <span className="text-[10px] text-neutral-500 font-serif">₹{item.product.price} each</span>
                        </div>
                        <div className="flex items-center gap-2 border border-white/10 rounded-lg p-1.5 bg-[#0A0A0B]">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="text-neutral-400 hover:text-white cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-mono font-bold text-white px-1">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="text-neutral-400 hover:text-white cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-rose-400 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-white/10 pt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400 font-light">Atelier Subtotal</span>
                    <span className="font-serif font-bold text-[#d4af37] text-lg">₹{cartSubtotal}</span>
                  </div>
                  
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-[10px] text-neutral-400 font-mono leading-relaxed">
                    📝 Preparing gourmet items triggers custom WhatsApp coordination with our head roaster to guarantee sensory satisfaction.
                  </div>

                  <button
                    onClick={handleWhatsAppCheckout}
                    className="w-full bg-[#d4af37] hover:bg-[#c5a880] text-black font-bold uppercase text-xs tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg animate-pulse"
                  >
                    Checkout & Order on WhatsApp
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AR Preview Overlay Modal */}
      <AnimatePresence>
        {selectedProductForAR && (
          <div id="ar-modal-backdrop" className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 backdrop-blur-md">
            <motion.div
              id="ar-modal-window"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-[#0A0A0B] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* AR Header */}
              <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Box className="w-5 h-5 text-[#d4af37] animate-pulse" />
                  <span className="text-xs uppercase tracking-widest font-mono text-[#d4af37]">Interactive Tabletop AR Preview</span>
                </div>
                <button 
                  onClick={() => setSelectedProductForAR(null)}
                  className="text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Simulated AR Camera View of Table */}
              <div className="relative flex-1 aspect-video bg-[#0A0A0B] overflow-hidden flex items-center justify-center">
                {/* Simulated table background (wood or marble texture Unsplash) */}
                <img 
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000" 
                  alt="Marble/wood luxury table" 
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
                />

                {/* Depth guides */}
                <div className="absolute inset-x-0 bottom-4 text-center z-10">
                  <span className="bg-black/80 border border-white/10 text-[9px] text-neutral-400 font-mono tracking-widest px-3 py-1.5 rounded-full uppercase">
                    Drag to move • Scale: {arScale.toFixed(1)}x • Rotated: {arRotation}°
                  </span>
                </div>

                {/* Floating Product Image render with drag, scale and shadow effects */}
                <motion.div
                  drag
                  dragElastic={0.1}
                  dragConstraints={{ left: -150, right: 150, top: -100, bottom: 100 }}
                  style={{ scale: arScale, rotate: arRotation }}
                  className="relative cursor-grab active:cursor-grabbing group"
                >
                  {/* Glowing halo behind item */}
                  <div className="absolute -inset-4 bg-[#d4af37]/10 rounded-full blur-xl group-hover:bg-[#d4af37]/20 transition-all pointer-events-none" />
                  
                  {/* Floating product silhouette shadow below */}
                  <div className="absolute -bottom-2 inset-x-4 h-4 bg-black/60 rounded-full blur-md transform translate-y-3 scale-90" />

                  <img 
                    src={selectedProductForAR.image} 
                    alt={selectedProductForAR.name}
                    referrerPolicy="no-referrer"
                    className="w-44 h-44 rounded-full object-cover border-4 border-[#d4af37]/80 shadow-2xl pointer-events-none" 
                  />
                </motion.div>
              </div>

              {/* AR Controls */}
              <div className="p-6 bg-[#0A0A0B] border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-white text-sm font-serif">{selectedProductForAR.name}</h4>
                    <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">Scale & perspective adjusting calibrators</p>
                  </div>
                  <span className="font-serif font-bold text-[#d4af37] text-lg">₹{selectedProductForAR.price}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest font-mono text-neutral-400 block">Sizing Adjuster ({arScale.toFixed(1)}x)</label>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="1.8" 
                      step="0.1" 
                      value={arScale} 
                      onChange={(e) => setArScale(parseFloat(e.target.value))}
                      className="w-full accent-[#d4af37] bg-neutral-800 h-1 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest font-mono text-neutral-400 block">Angled Rotation ({arRotation}°)</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="360" 
                      step="15" 
                      value={arRotation} 
                      onChange={(e) => setArRotation(parseInt(e.target.value))}
                      className="w-full accent-[#d4af37] bg-neutral-800 h-1 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      addToCart(selectedProductForAR);
                      setSelectedProductForAR(null);
                      addToast(`${selectedProductForAR.name} added to cart.`, "success");
                    }}
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl cursor-pointer"
                  >
                    Add to Cart & Reserve
                  </button>
                  <button
                    onClick={() => {
                      const waUrl = `https://wa.me/919876543210?text=Hi%20Caf%C3%A9%20L'Ambre%21%20I%20have%20previewed%20the%20*${selectedProductForAR.name}*%20via%20AR%20and%20want%20to%20place%20an%20order!%20%E2%98%95`;
                      window.open(waUrl, "_blank");
                    }}
                    className="bg-[#d4af37] hover:bg-[#c5a880] text-black text-xs font-bold uppercase tracking-widest py-3.5 px-6 rounded-xl cursor-pointer"
                  >
                    Order on WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
