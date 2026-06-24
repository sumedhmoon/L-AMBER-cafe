import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Laptop, Tablet, LayoutDashboard, Coffee, Sparkles, Star } from "lucide-react";
import { Product, CartItem, Order, OrderStatus } from "./types";
import { DEFAULT_PRODUCTS } from "./data/defaultProducts";
import WebsiteView from "./components/WebsiteView";
import MobileAppView from "./components/MobileAppView";
import AdminPanel from "./components/AdminPanel";
import AIChatbar from "./components/AIChatbar";
import NotificationToast, { Toast } from "./components/NotificationToast";
import { GlitterEffect } from "./components/GlitterEffect";

export default function App() {
  // Master mode switcher: 'website' | 'mobile' | 'admin'
  const [activeMode, setActiveMode] = useState<"website" | "mobile" | "admin">("website");

  // State Management
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Initialize from LocalStorage or Defaults
  useEffect(() => {
    const savedProducts = localStorage.getItem("ambre_products");
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        // Merge parsed products with DEFAULT_PRODUCTS to ensure latest image URLs/properties are reflected
        const merged = DEFAULT_PRODUCTS.map((dp) => {
          const existing = parsed.find((p: any) => p.id === dp.id);
          if (existing) {
            // Keep default product's updated fields (like latest image), but merge with other edits if needed
            return { ...existing, ...dp };
          }
          return dp;
        });
        
        // Include any custom products that are not part of default products
        const customProducts = parsed.filter((p: any) => !DEFAULT_PRODUCTS.some((dp) => dp.id === p.id));
        const finalProducts = [...merged, ...customProducts];

        setProducts(finalProducts);
        localStorage.setItem("ambre_products", JSON.stringify(finalProducts));
      } catch (e) {
        setProducts(DEFAULT_PRODUCTS);
      }
    } else {
      setProducts(DEFAULT_PRODUCTS);
      localStorage.setItem("ambre_products", JSON.stringify(DEFAULT_PRODUCTS));
    }

    const savedOrders = localStorage.getItem("ambre_orders");
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        setOrders([]);
      }
    }
  }, []);

  // Sync products to local storage on change
  const saveProductsToStorage = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem("ambre_products", JSON.stringify(updatedProducts));
  };

  // Sync orders to local storage on change
  const saveOrdersToStorage = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem("ambre_orders", JSON.stringify(updatedOrders));
  };

  // Toast Helpers
  const addToast = (message: string, type: "success" | "error" | "info" | "promo" = "success") => {
    const newToast: Toast = {
      id: Math.random().toString(),
      message,
      type
    };
    setToasts((prev) => [...prev, newToast]);

    // Autoclose after 4s
    setTimeout(() => {
      removeToast(newToast.id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Product Catalog Modifiers
  const handleAddProduct = (newProductData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...newProductData,
      id: "prod_" + (products.length + 1)
    };
    const updated = [...products, newProduct];
    saveProductsToStorage(updated);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    const updated = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    saveProductsToStorage(updated);
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    saveProductsToStorage(updated);
  };

  // Order modifiers
  const handleCreateOrder = (name: string, phone: string, source: "website" | "mobile") => {
    const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) || 350; // default to 350 if direct buy

    const newOrder: Order = {
      id: "AMB-" + Math.floor(Math.random() * 90000 + 10000),
      customerName: name,
      customerPhone: phone,
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      })),
      subtotal,
      status: "pending",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " Today",
      source
    };

    const updated = [newOrder, ...orders];
    saveOrdersToStorage(updated);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    saveOrdersToStorage(updated);
  };

  // Shared Cart State Helpers
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="bg-[#0A0A0B] min-h-screen text-neutral-100 flex flex-col justify-between selection:bg-[#d4af37] selection:text-black relative overflow-x-hidden">
      
      {/* Global Dark Glitter Particle System */}
      <GlitterEffect />

      {/* Premium Multi-Layered Dynamic Background with Cafe Theme Image */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src="/src/assets/images/cafe_background_1782276253641.jpg" 
          alt="Boutique Cafe Interior Background" 
          className="w-full h-full object-cover opacity-[0.65] filter brightness-[0.75] contrast-110 saturate-[1.05]"
          referrerPolicy="no-referrer"
        />
        {/* Soft dark vignette and gradient overlay to ensure text readability while maintaining image details */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#0A0A0B_90%)] opacity-[0.85]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B]/30 via-transparent to-[#0A0A0B]" />
        <div className="absolute inset-0 grid-bg-overlay opacity-[0.7]" />
      </div>
      
      {/* Drifting Ambient Gold and Coffee Glow Spheres */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#d4af37]/10 rounded-full pointer-events-none blur-[130px] animate-pulse-slow z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-amber-900/10 rounded-full pointer-events-none blur-[150px] animate-float-slow z-0" />
      <div className="absolute top-[35%] left-[20%] w-[45vw] h-[45vw] bg-[#c5a880]/5 rounded-full pointer-events-none blur-[120px] animate-float-delayed z-0" />
      
      {/* Global Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-[9999]" />
      
      {/* Top Workspace Switching Hub */}
      <div className="bg-[#0A0A0B]/90 border-b border-white/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sticky top-0 z-50 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          {/* Immersive Rotating Diamond Logo */}
          <div className="w-6 h-6 bg-gradient-to-tr from-[#d4af37] to-[#F9E79F] rounded-sm rotate-45 flex items-center justify-center shrink-0">
            <div className="w-3 h-3 bg-[#0A0A0B] rotate-45"></div>
          </div>
          <span className="font-serif font-black tracking-widest text-sm text-white uppercase ml-1 flex items-center gap-1">
            L'Ambre <span className="text-[9px] text-[#d4af37] font-sans tracking-normal italic font-normal">Workspace Hub</span>
          </span>
          <span className="h-4 w-[1px] bg-white/10 mx-2" />
          <span className="text-[10px] bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3 animate-pulse" /> Gold & Black Immersive Active
          </span>
        </div>

        {/* Workspace switches */}
        <div className="flex bg-[#0A0A0B] border border-white/10 p-1 rounded-xl shadow-inner max-w-lg w-full sm:w-auto">
          {[
            { id: "website", label: "Desktop Website", icon: Laptop },
            { id: "mobile", label: "Mobile App Sim", icon: Tablet },
            { id: "admin", label: "Atelier Dashboard", icon: LayoutDashboard }
          ].map((mode) => {
            const IconComp = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setActiveMode(mode.id as any);
                  addToast(`Shifted view to: ${mode.label}`, "info");
                }}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all ${
                  activeMode === mode.id
                    ? "bg-[#d4af37] text-black shadow-md font-extrabold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Rendering View Frame */}
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full"
          >
            {activeMode === "website" && (
              <WebsiteView
                products={products}
                cart={cart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
                clearCart={clearCart}
                addToast={addToast}
                onCreateOrder={handleCreateOrder}
              />
            )}

            {activeMode === "mobile" && (
              <div className="py-12 flex justify-center items-center bg-neutral-950">
                <MobileAppView
                  products={products}
                  cart={cart}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                  clearCart={clearCart}
                  addToast={addToast}
                  onCreateOrder={handleCreateOrder}
                  orders={orders}
                />
              </div>
            )}

            {activeMode === "admin" && (
              <AdminPanel
                products={products}
                orders={orders}
                onAddProduct={handleAddProduct}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                addToast={addToast}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating AI Barista Assistant Chatbot overlay */}
      <AIChatbar products={products} addToast={addToast} />

      {/* Common notifications overlay system */}
      <NotificationToast toasts={toasts} removeToast={removeToast} />

    </div>
  );
}
