import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Coffee, ShoppingBag, Home, User, Bell, ChevronRight, Play, CheckCircle2,
  Lock, ArrowLeft, Eye, Award, Heart, Plus, Minus, CreditCard, Sparkles, Send, MapPin, Truck
} from "lucide-react";
import { Product, CartItem, Order } from "../types";

interface MobileAppViewProps {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToast: (msg: string, type: "success" | "error" | "info" | "promo") => void;
  onCreateOrder: (name: string, phone: string, source: "website" | "mobile") => void;
  orders: Order[];
}

export default function MobileAppView({
  products,
  cart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  addToast,
  onCreateOrder,
  orders
}: MobileAppViewProps) {
  // Mobile app tabs: 'home', 'cart', 'tracker', 'profile'
  const [activeTab, setActiveTab] = useState<"home" | "cart" | "tracker" | "profile">("home");
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("Sumedh Moon");
  const [phone, setPhone] = useState("+91 98765 43210");
  
  // Selected product details sheet inside phone
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Razorpay simulation state
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"options" | "processing" | "success">("options");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("upi");
  
  // In-app Notification state
  const [phoneNotification, setPhoneNotification] = useState<string | null>(null);

  // Active tracking order state
  const [trackingStep, setTrackingStep] = useState<number>(0);

  const triggerPhoneNotification = (msg: string) => {
    setPhoneNotification(msg);
    setTimeout(() => {
      setPhoneNotification(null);
    }, 4000);
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleRazorpayCheckout = () => {
    if (cart.length === 0) {
      addToast("Your cart is empty", "error");
      return;
    }
    if (!isLoggedIn) {
      // Direct them to log in first
      setActiveTab("profile");
      addToast("Please register your premium profile to unlock Razorpay gateway", "info");
      return;
    }
    setPaymentStep("options");
    setShowRazorpay(true);
  };

  const handleProcessPayment = () => {
    setPaymentStep("processing");
    setTimeout(() => {
      setPaymentStep("success");
      // Add order to database
      onCreateOrder(username, phone, "mobile");
      triggerPhoneNotification("Payment of ₹" + cartSubtotal + " successful! Order logged.");
      addToast("Razorpay Payment Captured!", "success");
      
      // Advance tracking state
      setTrackingStep(1);
    }, 2000);
  };

  const handleWhatsAppRedirectFromPayment = () => {
    const storeNumber = "919876543210";
    let message = `Hi Café L'Ambre! I just made a premium *Razorpay Payment* (₹${cartSubtotal}) on your Mobile App!\n\n`;
    message += `👤 *Customer:* ${username}\n`;
    message += `📱 *Phone:* ${phone}\n`;
    message += `💳 *Razorpay Transaction:* MOCK_TXN_${Math.floor(Math.random() * 900000 + 100000)}\n\n`;
    message += `☕ *My Brew Order:*\n`;
    cart.forEach(item => {
      message += `• ${item.product.name} (x${item.quantity})\n`;
    });
    message += `\nCourier preparation is active. Kindly dispatch soon! 🛵✨`;

    const waUrl = `https://wa.me/${storeNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
    
    // Clear state
    setShowRazorpay(false);
    clearCart();
    setActiveTab("tracker");
  };

  return (
    <div id="mobile-app-simulator" className="flex items-center justify-center p-4 bg-gradient-to-b from-white/5 to-transparent rounded-3xl border border-white/10">
      
      {/* Android Device Outer Case Frame */}
      <div className="relative w-[375px] h-[780px] bg-black rounded-[48px] border-8 border-neutral-800 shadow-[0_0_50px_rgba(212,175,55,0.15)] overflow-hidden flex flex-col justify-between">
        
        {/* Device Top Bezel Notch Speaker */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-neutral-950 rounded-full z-40 flex items-center justify-center gap-1.5">
          <div className="w-12 h-1 bg-neutral-850 rounded-full" />
          <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
        </div>

        {/* Android Custom Status Bar */}
        <div className="h-10 bg-black px-6 pt-5 flex justify-between items-center text-white text-[10px] font-mono z-35 relative shrink-0">
          <span>09:41 <span className="text-[8px] text-[#d4af37]">5G</span></span>
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 px-1 rounded-sm uppercase">Atelier</span>
            <div className="w-3.5 h-2 border border-neutral-400 rounded-sm relative p-0.5 flex items-center">
              <div className="bg-emerald-400 h-full w-full rounded-sm" />
            </div>
          </div>
        </div>

        {/* Phone Simulated Internal Screen Wrapper */}
        <div className="flex-1 bg-[#0A0A0B] text-neutral-100 flex flex-col justify-between overflow-hidden relative">
          
          {/* Simulated In-App Push Notification Toast Banner */}
          <AnimatePresence>
            {phoneNotification && (
              <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 12, opacity: 1 }}
                exit={{ y: -60, opacity: 0 }}
                className="absolute top-4 inset-x-3 bg-neutral-900 border border-[#d4af37]/40 p-3 rounded-xl shadow-xl z-50 flex items-center gap-2.5 backdrop-blur-md"
              >
                <div className="p-1 bg-[#d4af37]/10 rounded-lg">
                  <Coffee className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div className="flex-1">
                  <h5 className="text-[10px] font-bold text-white uppercase tracking-wide">Café L'Ambre Dispatch</h5>
                  <p className="text-[10px] text-neutral-400 font-sans">{phoneNotification}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Core Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 scrollbar-none relative">
            
            {/* TAB: HOME */}
            {activeTab === "home" && (
              <div id="mobile-home-tab" className="space-y-6">
                
                {/* Brand Greetings Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#d4af37]">Atelier Mobile App</span>
                    <h2 className="text-xl font-serif text-white">Bonjour, <span className="text-[#d4af37] italic font-normal">{isLoggedIn ? username.split(" ")[0] : "Guest"}</span></h2>
                  </div>
                  <button 
                    onClick={() => triggerPhoneNotification("Exclusive 10% Loyalty discount activated for Saffron lattes!")}
                    className="p-2 bg-white/5 border border-white/10 rounded-xl hover:border-[#d4af37]/30 text-white cursor-pointer"
                  >
                    <Bell className="w-4 h-4 text-[#d4af37]" />
                  </button>
                </div>

                {/* Promotional Hero Banner inside App */}
                <div className="relative bg-gradient-to-r from-white/5 via-[#d4af37]/10 to-transparent border border-white/10 rounded-2xl p-5 overflow-hidden">
                  <div className="relative z-10 space-y-2">
                    <span className="bg-black/60 text-[#d4af37] text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border border-[#d4af37]/30">Gold Member Elite</span>
                    <h3 className="font-serif text-sm text-white leading-snug">Order the Royal Brews <br />& Earn Velvet Stamps</h3>
                    <p className="text-[9px] text-neutral-400 leading-normal">Simulate payment via custom Razorpay Gateway and track barista preparation live!</p>
                  </div>
                  <div className="absolute right-2 bottom-2 w-16 h-16 bg-[#d4af37]/5 rounded-full blur-xl pointer-events-none" />
                </div>

                {/* Category Quick Chips */}
                <div className="space-y-1.5">
                  <p className="text-[9px] uppercase tracking-widest font-mono text-neutral-500">Curated Sections</p>
                  <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                    {["All", "Coffee", "Specialty", "Pastries"].map((chip, i) => (
                      <span 
                        key={i} 
                        onClick={() => triggerPhoneNotification(`Filtered collection by: ${chip}`)}
                        className={`text-[9px] font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-xl border shrink-0 cursor-pointer ${
                          i === 0 
                            ? "bg-[#d4af37] text-black border-[#d4af37]" 
                            : "bg-white/5 text-neutral-400 border-white/10"
                        }`}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mobile Product List */}
                <div className="space-y-3">
                  <p className="text-[9px] uppercase tracking-widest font-mono text-neutral-500">Exceptional Brews ({products.length})</p>
                  <div className="grid grid-cols-2 gap-3">
                    {products.map((p) => (
                      <div 
                        key={p.id}
                        id={`mobile-product-${p.id}`}
                        onClick={() => setSelectedProduct(p)}
                        className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-[#d4af37]/40 rounded-xl p-2.5 space-y-2 flex flex-col justify-between cursor-pointer"
                      >
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-[#0A0A0B] shrink-0">
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover opacity-90"
                          />
                          <span className="absolute top-1 right-1 bg-black/75 border border-[#d4af37]/30 text-[8px] text-[#d4af37] px-1.5 py-0.5 rounded font-mono uppercase">
                            {p.category === "specialty" ? "Elite" : p.category}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="text-[11px] font-serif text-white font-bold leading-tight line-clamp-1">{p.name}</h4>
                          <span className="text-[10px] font-serif font-bold text-[#d4af37] block">₹{p.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CART */}
            {activeTab === "cart" && (
              <div id="mobile-cart-tab" className="space-y-6">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#d4af37]">Review Selection</span>
                  <h2 className="text-xl font-serif text-white">Atelier Cart ({cart.length})</h2>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-24 space-y-4">
                    <Coffee className="w-10 h-10 text-neutral-800 mx-auto" />
                    <p className="text-[11px] text-neutral-500 max-w-[200px] mx-auto leading-relaxed">No high-concept brews selected. Return to the home screen to secure your sensory drink.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div 
                        key={item.product.id}
                        className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/10 justify-between"
                      >
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[10px] text-white font-medium truncate">{item.product.name}</h4>
                          <span className="text-[9px] text-neutral-500 font-mono">₹{item.product.price}</span>
                        </div>
                        <div className="flex items-center gap-1.5 border border-white/10 rounded-lg p-1 bg-[#0A0A0B]">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="text-neutral-400 hover:text-white cursor-pointer"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-[10px] font-mono text-white px-0.5">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="text-neutral-400 hover:text-white cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-rose-400 hover:text-rose-500"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <div className="border-t border-neutral-900 pt-4 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-500">Beverages Total</span>
                        <span className="font-serif font-bold text-[#d4af37]">₹{cartSubtotal}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-500">Atelier Courier Tax</span>
                        <span className="font-serif font-bold text-[#d4af37]">₹0 (Comp)</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 flex justify-between items-center text-xs">
                        <span className="text-white font-medium">Grand Total</span>
                        <span className="font-serif font-bold text-[#d4af37] text-sm">₹{cartSubtotal}</span>
                      </div>
                      
                      <div className="pt-2 space-y-2">
                        <button
                          onClick={handleRazorpayCheckout}
                          className="w-full bg-[#d4af37] hover:bg-[#c5a880] text-black text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          Pay with Razorpay
                        </button>

                        <button
                          onClick={() => {
                            onCreateOrder(username, phone, "mobile");
                            const waUrl = `https://wa.me/919876543210?text=Hi%20Caf%C3%A9%20L'Ambre%20Atelier%21%20I%20want%20to%2520place%2520an%2520order%2520via%2520your%2520Mobile%2520App%2520Cart%2520for%2520%E2%82%B9${cartSubtotal}%20☕`;
                            window.open(waUrl, "_blank");
                            clearCart();
                            triggerPhoneNotification("Order forwarded to WhatsApp!");
                          }}
                          className="w-full bg-transparent border border-white/10 hover:border-[#d4af37]/40 text-neutral-300 text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl cursor-pointer"
                        >
                          Order Direct via WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: TRACKER */}
            {activeTab === "tracker" && (
              <div id="mobile-tracker-tab" className="space-y-6">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#d4af37]">Sensory Fulfillment</span>
                  <h2 className="text-xl font-serif text-white">Live Order Tracker</h2>
                </div>

                {trackingStep === 0 ? (
                  <div className="text-center py-20 space-y-4">
                    <Truck className="w-10 h-10 text-neutral-800 mx-auto animate-pulse" />
                    <p className="text-[11px] text-neutral-500 max-w-[200px] mx-auto leading-relaxed">No active prep in progress. Complete a Razorpay checkout or WhatsApp order to initialize live tracker.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Live Progress Bar Stepper */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-[9px] font-mono text-neutral-500 uppercase">
                        <span>Preparation</span>
                        <span>Estimated: 8 Mins</span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { label: "Received", active: trackingStep >= 1 },
                          { label: "Brewing", active: trackingStep >= 2 },
                          { label: "Rider Out", active: trackingStep >= 3 },
                          { label: "Delivered", active: trackingStep >= 4 }
                        ].map((step, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className={`h-1.5 rounded-full ${step.active ? "bg-[#d4af37]" : "bg-[#0A0A0B]"}`} />
                            <span className={`text-[8px] font-bold block text-center ${step.active ? "text-white" : "text-neutral-500"}`}>{step.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Micro tracker delivery map simulation */}
                    <div className="relative border border-white/10 rounded-xl overflow-hidden aspect-video bg-[#0A0A0B] flex flex-col justify-end p-2.5">
                      <div className="absolute inset-0 bg-[radial-gradient(#1c1c1c_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />
                      
                      {/* Animated rider icon moving across */}
                      <motion.div 
                        animate={{ x: trackingStep === 1 ? 0 : trackingStep === 2 ? 60 : trackingStep === 3 ? 120 : 180 }}
                        transition={{ type: "spring" }}
                        className="absolute bottom-1/3 left-10 p-1.5 bg-[#d4af37] text-black rounded-full shadow-lg z-10"
                      >
                        <Truck className="w-3.5 h-3.5" />
                      </motion.div>

                      <div className="absolute inset-0 p-4 pointer-events-none text-[8px] font-mono text-neutral-600">
                        <MapPin className="absolute top-4 right-10 text-rose-500 w-3 h-3" />
                        <span className="absolute top-8 right-8 text-[7px] text-white">Guest Mansion</span>
                        <div className="absolute bottom-4 left-6 border-b border-dashed border-[#d4af37]/30 w-44" />
                      </div>

                      <div className="bg-black/95 p-2 rounded-lg border border-[#d4af37]/20 z-10 flex items-center justify-between text-[9px]">
                        <span className="text-neutral-300 font-sans">Barista preparing Gold Espresso shot.</span>
                        <button 
                          onClick={() => {
                            if (trackingStep < 4) {
                              setTrackingStep(prev => prev + 1);
                              triggerPhoneNotification("Order tracking step updated!");
                            } else {
                              addToast("Sensory order successfully delivered!", "success");
                            }
                          }}
                          className="text-[#d4af37] text-[8px] uppercase tracking-wider font-mono hover:underline cursor-pointer"
                        >
                          Step Next ➔
                        </button>
                      </div>
                    </div>

                    <div className="bg-white/5 p-3.5 border border-white/10 rounded-xl space-y-1.5">
                      <span className="text-[9px] uppercase tracking-widest font-mono text-neutral-400 block">Fulfillment Details</span>
                      <p className="text-[10px] text-neutral-300 leading-normal">
                        Our private barista concierge was assigned to prep your single-origin Ethiopian roast. Secure contactless delivery remains active.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: PROFILE */}
            {activeTab === "profile" && (
              <div id="mobile-profile-tab" className="space-y-6">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#d4af37]">Atelier Membership</span>
                  <h2 className="text-xl font-serif text-white">Client Registry</h2>
                </div>

                {!isLoggedIn ? (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setIsLoggedIn(true);
                      triggerPhoneNotification("Membership successfully synced! Welcomed to Elite Gold Tier.");
                      addToast("Registered Profile Saved", "success");
                    }}
                    className="space-y-4 bg-[#0A0A0B] p-4 border border-white/10 rounded-2xl"
                  >
                    <div className="text-center space-y-1 py-2">
                      <Lock className="w-8 h-8 text-[#d4af37] mx-auto animate-pulse" />
                      <h4 className="text-xs uppercase tracking-widest font-mono text-white">Secure Elite Profile</h4>
                      <p className="text-[10px] text-neutral-400">Unlock mock Razorpay payment gateways and visual delivery trackers instantly.</p>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono text-neutral-400">Your Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Sumedh Moon"
                          className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono text-neutral-400">WhatsApp Phone Number</label>
                        <input 
                          type="tel" 
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#d4af37] hover:bg-[#c5a880] text-black text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl cursor-pointer"
                    >
                      Authenticate Member Profile
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {/* User Profile Tier Card */}
                    <div className="bg-gradient-to-br from-[#d4af37]/20 via-white/5 to-transparent border border-white/10 p-5 rounded-2xl space-y-3 relative overflow-hidden">
                      <div className="absolute top-4 right-4 text-[#d4af37]">
                        <Award className="w-8 h-8 opacity-80" />
                      </div>
                      
                      <div className="space-y-0.5">
                        <span className="text-[8px] bg-[#d4af37] text-black font-mono uppercase px-2 py-0.5 rounded font-bold">Gold Tier Client</span>
                        <h4 className="text-sm font-serif text-white pt-1">{username}</h4>
                        <p className="text-[9px] font-mono text-neutral-500">{phone}</p>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[9px] text-neutral-400 font-mono uppercase">
                        <span>Stamp Balance: 4 Stamps</span>
                        <span className="text-[#d4af37]">VIP Concierge Active</span>
                      </div>
                    </div>

                    {/* Order History inside app */}
                    <div className="space-y-2">
                      <p className="text-[9px] uppercase tracking-widest font-mono text-neutral-500">Order Record Logs</p>
                      <div className="space-y-2.5">
                        {orders.length === 0 ? (
                          <div className="text-center py-6 border border-white/10 border-dashed rounded-xl">
                            <span className="text-[10px] text-neutral-500">No registered orders yet.</span>
                          </div>
                        ) : (
                          orders.map((o) => (
                            <div key={o.id} className="bg-white/5 p-3 rounded-xl border border-white/10 flex justify-between items-center text-xs">
                              <div className="space-y-0.5">
                                <p className="text-white text-[10px] font-mono">ID: {o.id}</p>
                                <p className="text-[9px] text-neutral-500">{o.timestamp}</p>
                              </div>
                              <div className="text-right space-y-0.5">
                                <span className="font-serif font-bold text-[#d4af37] block">₹{o.subtotal}</span>
                                <span className="bg-emerald-950 text-emerald-400 text-[8px] font-mono uppercase px-1.5 py-0.5 rounded border border-emerald-900/40">
                                  {o.status}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setIsLoggedIn(false);
                        triggerPhoneNotification("Membership signed off. Safely logged out.");
                      }}
                      className="w-full bg-white/5 border border-white/10 hover:border-rose-900/40 text-neutral-400 hover:text-rose-400 text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl cursor-pointer transition-colors"
                    >
                      Sign Off Profile
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Android Interactive Bottom Navigation Rail */}
          <div className="h-14 bg-[#0A0A0B] border-t border-white/10 px-4 py-2 flex items-center justify-between shrink-0 z-30">
            {[
              { id: "home", label: "Home", icon: Home },
              { id: "cart", label: "Cart", icon: ShoppingBag, badge: cart.length > 0 ? cart.length : undefined },
              { id: "tracker", label: "Track", icon: Truck, badge: trackingStep > 0 ? "•" : undefined },
              { id: "profile", label: "Member", icon: User }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 relative cursor-pointer"
              >
                <div className={`relative ${activeTab === tab.id ? "text-[#d4af37]" : "text-neutral-500"}`}>
                  <tab.icon className="w-4 h-4" />
                  {tab.badge !== undefined && (
                    <span className="absolute -top-1 -right-1 bg-[#d4af37] text-black text-[7px] font-bold font-mono px-1 rounded-full flex items-center justify-center min-w-[10px] h-[10px]">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[8px] tracking-wider uppercase font-semibold ${activeTab === tab.id ? "text-[#d4af37]" : "text-neutral-500"}`}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

        </div>

        {/* Android Hardware Pill Navigation Bar below */}
        <div className="h-5 bg-black w-full flex items-center justify-center relative shrink-0">
          <div className="w-28 h-1 bg-neutral-600 rounded-full" />
        </div>

      </div>

      {/* Selected Product Detail Popup Sheet (Inside Android Container) */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="absolute inset-0 bg-black/80 z-45 flex items-end">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full bg-[#0A0A0B] border-t border-white/10 rounded-t-3xl p-5 space-y-4 max-h-[85%] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-[8px] font-mono text-[#d4af37] uppercase tracking-widest">Beverage Profile</span>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="text-neutral-500 hover:text-white text-xs font-mono"
                >
                  ✕
                </button>
              </div>

              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                referrerPolicy="no-referrer"
                className="w-full aspect-[16/10] rounded-xl object-cover border border-white/10" 
              />

              <div className="space-y-1.5">
                <div className="flex justify-between items-start">
                  <h3 className="font-serif text-sm text-white">{selectedProduct.name}</h3>
                  <span className="font-serif font-bold text-[#d4af37] text-sm pl-2">₹{selectedProduct.price}</span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-relaxed font-light">
                  {selectedProduct.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                    triggerPhoneNotification(`Added ${selectedProduct.name} to cart.`);
                    addToast(`Added ${selectedProduct.name} to app cart.`, "success");
                  }}
                  className="bg-white/5 border border-white/10 hover:border-[#d4af37]/50 text-white text-[9px] font-bold uppercase tracking-wider py-3 rounded-xl cursor-pointer"
                >
                  Add To Cart
                </button>
                <button
                  onClick={() => {
                    const storeNumber = "919876543210";
                    const waUrl = `https://wa.me/${storeNumber}?text=Hi%20Caf%C3%A9%20L'Ambre%20Atelier%21%20I%20want%20to%20order%20the%20*${selectedProduct.name}*%20right%20now!`;
                    window.open(waUrl, "_blank");
                    setSelectedProduct(null);
                    triggerPhoneNotification(`Redirection to WhatsApp active.`);
                  }}
                  className="bg-[#d4af37] text-black text-[9px] font-bold uppercase tracking-wider py-3 rounded-xl cursor-pointer"
                >
                  WhatsApp Buy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOCK RAZORPAY PAYMENT GATEWAY DIALOG (Simulated on top of phone layout) */}
      <AnimatePresence>
        {showRazorpay && (
          <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-3">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full bg-[#0A0A0B] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Razorpay Brand Header */}
              <div className="p-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#d4af37] text-black font-mono font-bold text-[8px] px-1.5 py-0.5 rounded uppercase">Razorpay</span>
                  <span className="text-[8px] text-neutral-400 font-mono tracking-wider">SECURE CHECKSUM GATEWAY</span>
                </div>
                <button 
                  onClick={() => setShowRazorpay(false)}
                  className="text-neutral-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Step 1: Options selection */}
              {paymentStep === "options" && (
                <div className="p-4 space-y-4">
                  <div className="text-center space-y-0.5 border-b border-white/10 pb-3">
                    <span className="text-[9px] text-neutral-500 uppercase tracking-wider">Beneficiary: Café L'Ambre</span>
                    <h4 className="text-white text-base font-serif font-bold">Total Payable: ₹{cartSubtotal}</h4>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[8px] uppercase tracking-wider font-mono text-neutral-500">Choose Payment Method</p>
                    {[
                      { id: "upi", name: "Simulated Instant UPI (GPay/PhonePe)", desc: "Quick verification" },
                      { id: "card", name: "Simulated Elite Metal Credit Card", desc: "Premium custom gateways" },
                      { id: "net", name: "Simulated Sovereign NetBanking", desc: "Private elite banks" }
                    ].map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          selectedPaymentMethod === method.id 
                            ? "bg-[#d4af37]/15 border-[#d4af37]" 
                            : "bg-white/5 border border-white/10 hover:border-neutral-700"
                        }`}
                      >
                        <div>
                          <p className="text-[10px] text-white font-medium">{method.name}</p>
                          <span className="text-[8px] text-neutral-500 font-mono">{method.desc}</span>
                        </div>
                        <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                          selectedPaymentMethod === method.id ? "border-[#d4af37] bg-[#d4af37]" : "border-neutral-700"
                        }`}>
                          {selectedPaymentMethod === method.id && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleProcessPayment}
                    className="w-full bg-[#d4af37] hover:bg-[#c5a880] text-black text-[9px] font-bold uppercase tracking-widest py-3 rounded-xl cursor-pointer"
                  >
                    Authorize Simulated Payment
                  </button>
                </div>
              )}

              {/* Step 2: Processing state */}
              {paymentStep === "processing" && (
                <div className="p-8 text-center space-y-4">
                  <div className="relative w-12 h-12 mx-auto">
                    <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                    <div className="absolute inset-0 rounded-full border-2 border-t-[#d4af37] animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-[10px] uppercase tracking-widest font-mono text-white animate-pulse">Capturing Security Tokens...</h5>
                    <p className="text-[9px] text-neutral-500">Broadcasting transaction to sovereign gateway. Please wait.</p>
                  </div>
                </div>
              )}

              {/* Step 3: Success state */}
              {paymentStep === "success" && (
                <div className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-950 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/40">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-white text-xs uppercase tracking-widest font-mono font-bold">Transaction Confirmed</h4>
                    <p className="text-[10px] text-[#d4af37] font-serif font-bold">₹{cartSubtotal} secured successfully</p>
                    <p className="text-[8px] text-neutral-500 font-mono">Reference: LAT-38910-RXPY</p>
                  </div>

                  <div className="bg-[#0A0A0B] p-2.5 rounded-xl border border-white/10 text-[8px] text-neutral-400 font-mono text-left leading-relaxed">
                    🌟 Order recorded in Admin Panel. Redirection to WhatsApp generates the live delivery preparation sequence for prompt dispatch.
                  </div>

                  <button
                    onClick={handleWhatsAppRedirectFromPayment}
                    className="w-full bg-[#d4af37] hover:bg-[#c5a880] text-black text-[9px] font-bold uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Open Tracker & Notify WhatsApp
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
