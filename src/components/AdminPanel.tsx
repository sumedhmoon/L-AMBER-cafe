import React, { useState } from "react";
import { 
  Plus, Edit, Trash2, Check, X, Tag, DollarSign, Package, Layers,
  ShoppingBag, ClipboardList, TrendingUp, Users, Activity, Phone, Calendar
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, Cell, PieChart, Pie 
} from "recharts";
import { Product, Order, OrderStatus } from "../types";

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Omit<Product, "id">) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  addToast: (msg: string, type: "success" | "error" | "info" | "promo") => void;
}

// Analytics Dummy Data
const REVENUE_DATA = [
  { day: "Mon", revenue: 8400 },
  { day: "Tue", revenue: 12500 },
  { day: "Wed", revenue: 9900 },
  { day: "Thu", revenue: 15400 },
  { day: "Fri", revenue: 19800 },
  { day: "Sat", revenue: 24200 },
  { day: "Sun", revenue: 21500 }
];

const CATEGORY_DISTRIBUTION = [
  { name: "Coffee", value: 45 },
  { name: "Specialty", value: 30 },
  { name: "Pastry", value: 15 },
  { name: "Dessert", value: 10 }
];

const CHANNEL_DATA = [
  { name: "Website View", value: 420 },
  { name: "Mobile App Simulator", value: 580 }
];

const PIE_COLORS = ["#d4af37", "#c5a880", "#8e7453", "#4f2612"];

export default function AdminPanel({
  products,
  orders,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  addToast
}: AdminPanelProps) {
  // Current tab: 'overview', 'catalog', 'orders'
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "catalog" | "orders">("overview");

  // Catalog modification states
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState<number>(300);
  const [formCategory, setFormCategory] = useState<"coffee" | "specialty" | "pastry" | "dessert">("coffee");
  const [formDesc, setFormDesc] = useState("");
  const [formImage, setFormImage] = useState("");

  const resetForm = () => {
    setFormName("");
    setFormPrice(300);
    setFormCategory("coffee");
    setFormDesc("");
    setFormImage("");
  };

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDesc.trim() || !formImage.trim()) {
      addToast("Please complete all fields.", "error");
      return;
    }

    onAddProduct({
      name: formName,
      price: Number(formPrice),
      category: formCategory,
      description: formDesc,
      image: formImage,
      available: true
    });

    addToast(`Successfully introduced ${formName} to menu!`, "success");
    setIsAddingNew(false);
    resetForm();
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    onEditProduct({
      ...editingProduct,
      name: formName,
      price: Number(formPrice),
      category: formCategory,
      description: formDesc,
      image: formImage
    });

    addToast(`Successfully updated ${formName}!`, "success");
    setEditingProduct(null);
    resetForm();
  };

  const triggerEditMode = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormPrice(p.price);
    setFormCategory(p.category);
    setFormDesc(p.description);
    setFormImage(p.image);
    setIsAddingNew(false);
  };

  // Metrics calculating
  const totalRevenue = orders.reduce((acc, o) => acc + o.subtotal, 111300); // base + actuals
  const conversionRate = 74.3; // high-converting indicator

  return (
    <div id="admin-panel-root" className="bg-transparent text-neutral-100 p-6 space-y-8 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">Café L'Ambre Analytics</span>
          <h1 className="font-serif text-3xl font-light text-white">Atelier Business Dashboard</h1>
        </div>

        {/* Admin Navigation */}
        <div className="flex bg-[#0A0A0B] border border-white/10 p-1 rounded-xl">
          {[
            { id: "overview", label: "Business Metrics" },
            { id: "catalog", label: "Menu Editor" },
            { id: "orders", label: `Orders Tracker (${orders.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                activeSubTab === tab.id 
                  ? "bg-[#d4af37] text-black shadow-md" 
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW: OVERVIEW */}
      {activeSubTab === "overview" && (
        <div id="admin-overview-section" className="space-y-8">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-b from-white/5 to-transparent p-5 rounded-2xl border border-white/10 space-y-2 hover:border-[#d4af37]/30 transition-all duration-350">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Total Revenue Gross</span>
                <DollarSign className="w-4 h-4 text-[#d4af37]" />
              </div>
              <p className="font-serif text-3xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +18.4% since last week
              </span>
            </div>

            <div className="bg-gradient-to-b from-white/5 to-transparent p-5 rounded-2xl border border-white/10 space-y-2 hover:border-[#d4af37]/30 transition-all duration-350">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Visitor Registrations</span>
                <Users className="w-4 h-4 text-[#d4af37]" />
              </div>
              <p className="font-serif text-3xl font-bold text-white">1,024</p>
              <span className="text-[10px] text-neutral-500 font-mono">Synced from website map</span>
            </div>

            <div className="bg-gradient-to-b from-white/5 to-transparent p-5 rounded-2xl border border-white/10 space-y-2 hover:border-[#d4af37]/30 transition-all duration-350">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Inbound Orders</span>
                <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
              </div>
              <p className="font-serif text-3xl font-bold text-white">{orders.length + 38}</p>
              <span className="text-[10px] text-[#d4af37] font-mono">Website + App channels active</span>
            </div>

            <div className="bg-gradient-to-b from-white/5 to-transparent p-5 rounded-2xl border border-white/10 space-y-2 hover:border-[#d4af37]/30 transition-all duration-350">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">WhatsApp Redir. Funnel</span>
                <Activity className="w-4 h-4 text-[#d4af37]" />
              </div>
              <p className="font-serif text-3xl font-bold text-white">{conversionRate}%</p>
              <span className="text-[10px] text-emerald-400 font-mono">High-converting luxury rating</span>
            </div>
          </div>

          {/* Visual Recharts Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Stream Over Time */}
            <div className="lg:col-span-2 bg-gradient-to-b from-white/5 to-transparent p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="font-serif text-sm uppercase tracking-widest text-[#d4af37]">Sovereign Revenue Stream Flow</h3>
                <span className="text-[10px] font-mono text-neutral-500">Live 7-Day Cycle (₹)</span>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#525252" fontSize={10} fontFamily="monospace" />
                    <YAxis stroke="#525252" fontSize={10} fontFamily="monospace" />
                    <Tooltip contentStyle={{ backgroundColor: "#171717", borderColor: "#8e7453", borderRadius: 12 }} />
                    <Area type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distributions & Channels Breakdown */}
            <div className="bg-gradient-to-b from-white/5 to-transparent p-6 rounded-2xl border border-white/10 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h3 className="font-serif text-sm uppercase tracking-widest text-[#d4af37]">Recipe Sales Distribution</h3>
                  <span className="text-[10px] font-mono text-neutral-500">Popularity Index (%)</span>
                </div>

                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CATEGORY_DISTRIBUTION} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                      <XAxis type="number" stroke="#525252" fontSize={10} hide />
                      <YAxis type="category" dataKey="name" stroke="#525252" fontSize={10} fontFamily="serif" />
                      <Tooltip contentStyle={{ backgroundColor: "#0A0A0B", borderColor: "#8e7453" }} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {CATEGORY_DISTRIBUTION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Conversion ratios ratio */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-mono text-neutral-500 block">Lead Source Sync Channels</span>
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]" /> Desktop Web View</span>
                  <span className="font-mono text-neutral-400">42%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#c5a880]" /> Mobile App Simulator</span>
                  <span className="font-mono text-neutral-400">58%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: CATALOG EDITOR */}
      {activeSubTab === "catalog" && (
        <div id="admin-catalog-section" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg text-white">Menu Item Catalog Registry</h3>
            <button
              onClick={() => {
                resetForm();
                setEditingProduct(null);
                setIsAddingNew(true);
              }}
              className="bg-[#d4af37] hover:bg-[#c5a880] text-black text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Cafe Recipe
            </button>
          </div>

          {/* Form Overlay for Add / Edit */}
          {(isAddingNew || editingProduct) && (
            <form 
              onSubmit={editingProduct ? handleSaveEditProduct : handleCreateProductSubmit}
              className="bg-[#0A0A0B] p-6 border border-[#d4af37]/30 rounded-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h4 className="font-serif text-sm uppercase tracking-widest text-[#d4af37]">
                  {editingProduct ? `Modify Recipe Profile: ${editingProduct.name}` : "Create Premium Cafe Beverage / Pastry"}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingProduct(null);
                  }}
                  className="text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-neutral-400 uppercase">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., Saffron Honey Cold Drip"
                    className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-neutral-400 uppercase">Atelier Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    placeholder="350"
                    className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-neutral-400 uppercase">Recipe Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="coffee">Traditional Coffee</option>
                    <option value="specialty">House Specialty Brew</option>
                    <option value="pastry">Baked Pastry (72h fermentation)</option>
                    <option value="dessert">Fine Patisserie Dessert</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-neutral-400 uppercase">Image URL (Unsplash or CDN)</label>
                  <input
                    type="text"
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-neutral-400 uppercase">Gourmet Description</label>
                  <input
                    type="text"
                    required
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Describe sensory elements, origin beans, texture notes..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingProduct(null);
                  }}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#d4af37] hover:bg-[#c5a880] text-black text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-xl cursor-pointer"
                >
                  {editingProduct ? "Apply Modifications" : "Introduce Recipe"}
                </button>
              </div>
            </form>
          )}

          {/* Product Items Table grid */}
          <div className="border border-neutral-900 rounded-2xl overflow-hidden bg-neutral-900/10">
            <div className="grid grid-cols-1 divide-y divide-neutral-900">
              {products.map((p) => (
                <div key={p.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover" 
                    />
                    <div>
                      <h4 className="text-sm font-serif text-white">{p.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-neutral-500 font-mono">
                        <span className="uppercase">{p.category}</span>
                        <span>•</span>
                        <span>₹{p.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerEditMode(p)}
                      className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-850 p-2 text-neutral-400 hover:text-[#d4af37] rounded-xl cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you certain you want to remove ${p.name} from the Atelier menu?`)) {
                          onDeleteProduct(p.id);
                          addToast(`Deleted ${p.name}`, "info");
                        }
                      }}
                      className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-850 p-2 text-neutral-400 hover:text-rose-400 rounded-xl cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: ORDERS TRACKER */}
      {activeSubTab === "orders" && (
        <div id="admin-orders-section" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg text-white">Interactive Inquiries & Orders Log</h3>
            <span className="text-xs font-mono text-neutral-400">{orders.length} Active leads captured</span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-neutral-900 rounded-2xl">
              <ClipboardList className="w-12 h-12 text-neutral-800 mx-auto" />
              <p className="text-neutral-500 text-xs font-sans mt-3">No leads recorded. Make purchases in the Mobile App simulator or Website checkout to sync orders live.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  id={`admin-order-${order.id}`}
                  className="bg-neutral-900/40 p-5 rounded-2xl border border-neutral-900 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-neutral-900 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white">ID: {order.id}</span>
                        <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded ${
                          order.source === "mobile" 
                            ? "bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30" 
                            : "bg-blue-950 text-blue-400 border border-blue-900/40"
                        }`}>
                          {order.source === "mobile" ? "Mobile Sim App" : "Desktop Website"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-neutral-500 font-mono">
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-neutral-600" /> {order.customerPhone}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-neutral-600" /> {order.timestamp}</span>
                      </div>
                    </div>

                    {/* Status selection update */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase font-mono text-neutral-500">Preparation State:</span>
                      <select
                        value={order.status}
                        onChange={(e) => {
                          onUpdateOrderStatus(order.id, e.target.value as OrderStatus);
                          addToast(`Order ${order.id} status modified to ${e.target.value}.`, "info");
                        }}
                        className="bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#d4af37] text-white"
                      >
                        <option value="pending">Pending Preparation</option>
                        <option value="preparing">Active Brewing</option>
                        <option value="ready">Out For Delivery</option>
                        <option value="delivered">Fulfillment Handed</option>
                      </select>
                    </div>
                  </div>

                  {/* List items */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Products Secured</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {order.items.map((item, i) => (
                          <span key={i} className="text-xs bg-neutral-950 px-2.5 py-1.5 border border-neutral-850 rounded-lg text-neutral-200">
                            {item.name} <span className="text-[#d4af37] font-mono font-bold">x{item.quantity}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase block">Total Amount Paid</span>
                      <span className="font-serif font-bold text-[#d4af37] text-lg block">₹{order.subtotal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
