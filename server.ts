import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Securely initialize Gemini SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper function to call generateContent with automatic exponential backoff retry for transient 503 or 429/UNAVAILABLE errors
async function generateContentWithRetry(params: any, retries = 3, delay = 1000): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      const errStr = String(err.message || err);
      const isTransient = 
        errStr.includes("503") || 
        errStr.includes("UNAVAILABLE") || 
        errStr.includes("high demand") || 
        errStr.includes("429") || 
        errStr.includes("RESOURCE_EXHAUSTED") ||
        err.status === 503 || 
        err.status === 429 ||
        err.code === 503 ||
        err.code === 429;

      if (isTransient && i < retries - 1) {
        console.warn(`[Gemini API] Transient error (503/429/UNAVAILABLE), retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
        continue;
      }
      throw err;
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for AI Barista Chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, menu } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message query is required" });
      }

      const systemInstruction = `
        You are the Master Barista AI at Café L'Ambre, a premium, high-end, dark-luxury artisan coffee shop and patisserie.
        Your demeanor is exceptionally sophisticated, refined, welcoming, and slightly poetic. You take pride in coffee extraction, bean selection, and exquisite pastry pairings.
        Use luxurious and professional sensory words (e.g., sensory notes, double-aged, rich-bodied, Kashmiri saffron, 72-layer croissant, single-origin).

        The following menu is currently available at the Atelier Cafe:
        ${JSON.stringify(menu)}

        Rules of Engagement:
        - Introduce yourself gracefully.
        - Recommend specific gourmet beverages or pastries from our live menu depending on their desires (e.g., recommend Saffron Macadamia Latte for warm and smooth, Gold-Dusted Royal Espresso for bold/traditional, Ambre Velvet Cold Brew for sweet and silky).
        - Pair beverages with baked goods (e.g., pair the Gold Espresso with the Smoked Pistachio Croissant).
        - Quote correct pricing in rupees (₹).
        - Keep answers highly engaging but structured and concise (around 3 to 4 sentences).
        - Refuse to write programming code or answer off-topic queries, redirecting them back to the sensory coffee exploration.
      `;

      // Call Gemini 3.5 Flash Model with retry logic
      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ reply: response.text });
    } catch (err: any) {
      console.error("Gemini server error:", err);
      res.status(500).json({ 
        error: "Sensory model calibration stalled.", 
        details: err.message 
      });
    }
  });

  // Vite Integration & Middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Café L'Ambre Server successfully running on port ${PORT}`);
  });
}

startServer();
