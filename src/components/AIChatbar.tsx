import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, Sparkles, X, Coffee, ShieldAlert } from "lucide-react";
import { ChatMessage, Product } from "../types";

interface AIChatbarProps {
  products: Product[];
  addToast: (msg: string, type: "success" | "error" | "info" | "promo") => void;
}

const PRESET_PROMPTS = [
  "What is the Gold-Dusted Espresso?",
  "Recommend a sweet, velvety specialty brew",
  "Are there gluten-free or nut pastries?",
  "How can I order on WhatsApp?"
];

export default function AIChatbar({ products, addToast }: AIChatbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Welcome to Café L'Ambre. I am your AI Master Barista. May I assist you in exploring our exceptional single-origin beans, house-crafted infusions, or artisanal pastries today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Call our server endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          menu: products.map(p => ({ name: p.name, price: p.price, desc: p.description, cat: p.category }))
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg: ChatMessage = {
          id: Math.random().toString(),
          sender: "bot",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, botMsg]);
        setUsingFallback(false);
      } else {
        // Fallback to local offline smart matching if key missing or server error
        throw new Error("Server response failed");
      }
    } catch (err) {
      setUsingFallback(true);
      // Run smart offline barista logic
      setTimeout(() => {
        let reply = "I apologize, our full server-grade sensory models are currently calibrating. ";
        const query = textToSend.toLowerCase();

        // Specific local responses matching keywords
        if (query.includes("gold") || query.includes("espresso") || query.includes("royal")) {
          const prod = products.find(p => p.id === "prod_1");
          reply = `Let me introduce you to our **${prod?.name || "Gold-Dusted Royal Espresso"}**. It features a robust double shot of single-origin Ethiopian Arabica beans extracted beautifully under precise bar pressure. The signature touch is a delicate finish of 24K edible gold dust. A true royal treat for ₹${prod?.price || 320}. Would you like me to guide you to checkout?`;
        } else if (query.includes("sweet") || query.includes("velvet") || query.includes("cold") || query.includes("brew")) {
          const prod = products.find(p => p.id === "prod_2");
          reply = `I highly recommend our **${prod?.name || "Ambre Velvet Cold Brew"}** (₹${prod?.price || 380}). It is slow-steeped for 18 hours in alpine spring water, infusing organic bourbon vanilla bean, and served over a slow-melting crystal ice sphere. Perfectly sweet and deeply refreshing!`;
        } else if (query.includes("gluten") || query.includes("pastry") || query.includes("nut") || query.includes("allergy") || query.includes("pistachio") || query.includes("croissant")) {
          reply = "Indeed! Our kitchen exercises maximum care. While our French butter-rolled pastries (like the **Smoked Pistachio Croissant**) contain nuts and wheat flour, our **Valrhona Noir Truffle Tart** (₹340) can be ordered in gluten-reduced artisanal versions. Please specify on your WhatsApp order instructions and our chefs will custom cater your pastry!";
        } else if (query.includes("order") || query.includes("whatsapp") || query.includes("buy") || query.includes("how to")) {
          reply = "Ordering is designed to be seamless. Browse our collection on the website or mobile app screen, add your selection to the cart, and select **'Order on WhatsApp'**. This generates a fully structured recipe receipt which opens instantly in your WhatsApp chat so you can coordinate instant delivery or elite reservation with our shop concierge.";
        } else if (query.includes("saffron") || query.includes("latte") || query.includes("macadamia")) {
          const prod = products.find(p => p.id === "prod_3");
          reply = `Ah, our **${prod?.name || "Saffron Macadamia Latte"}** (₹${prod?.price || 420}) is a masterpiece. We brew rich espresso with custom-made macadamia milk, infusing genuine threads of Kashmiri Saffron and orange blossom honey. It's warm, aromatic, and represents pure gold luxury in a cup.`;
        } else {
          reply = "I understand. At Café L'Ambre, we specialize in high-concept drinks. May I recommend trying the **Gold-Dusted Royal Espresso** for a bold kick, or our signature **Saffron Macadamia Latte** for a smooth, exotic escape? Both pair exquisitely with our **Smoked Pistachio Croissant**.";
        }

        const botMsg: ChatMessage = {
          id: Math.random().toString(),
          sender: "bot",
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 800);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div id="ai-chat-bubble-container" className="fixed bottom-6 right-6 z-40">
        <motion.button
          id="ai-chat-toggle-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#0A0A0B] border border-white/10 text-white p-4 rounded-full shadow-2xl flex items-center justify-center relative group backdrop-blur-md cursor-pointer"
        >
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#d4af37]"></span>
          </span>
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageSquare className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
          )}
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-chat-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 w-[400px] h-[550px] bg-[#0A0A0B] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="bg-white/5 p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#d4af37]/10 p-2 rounded-xl border border-[#d4af37]/30">
                  <Coffee className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold tracking-wider text-white flex items-center gap-1.5">
                    L'Ambre Barista AI
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
                  </h3>
                  <p className="text-[10px] font-mono text-neutral-400">Head Master Barista Connoisseur</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Offline notification badge if fallback active */}
            {usingFallback && (
              <div className="bg-amber-950/40 border-b border-amber-900/30 px-3 py-1.5 flex items-center gap-2 text-[10px] text-amber-300 font-mono">
                <ShieldAlert className="w-3 h-3 text-[#d4af37]" />
                <span>Running in elite offline fallback mode.</span>
              </div>
            )}

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  id={`chat-msg-${msg.id}`}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#d4af37]/10 border border-[#d4af37]/30 text-white rounded-tr-none"
                        : "bg-white/5 border border-white/10 text-neutral-100 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className="text-[9px] font-mono text-neutral-500 mt-1.5 block text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-3.5 text-sm flex items-center gap-1.5 text-[#d4af37]">
                    <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-1">
                <p className="text-[10px] font-mono text-neutral-500 mb-1.5 tracking-wider uppercase">Quick Consults:</p>
                <div className="flex flex-col gap-1.5">
                  {PRESET_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(prompt)}
                      className="text-left text-xs bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#d4af37]/30 text-neutral-300 p-2.5 rounded-xl transition-all hover:translate-x-1 cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-4 border-t border-white/10 bg-[#0A0A0B] flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask our AI Barista anything..."
                className="flex-1 bg-white/5 border border-white/10 focus:border-[#d4af37]/50 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white font-sans placeholder-neutral-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-[#d4af37] hover:bg-[#c5a880] disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed text-black p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
