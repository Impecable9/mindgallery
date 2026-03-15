import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import axios from "axios";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// --- Prodigi API ---
const PRODIGI_API_URL = "https://api.prodigi.com/v4.0";
const PRODIGI_API_KEY = process.env.PRODIGI_API_KEY!;

// --- Stripe ---
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-11-preview",
});

// --- Debug endpoint ---
app.get("/api/debug", (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    env: {
      HAS_STRIPE: !!process.env.STRIPE_SECRET_KEY,
      HAS_PRODIGI: !!process.env.PRODIGI_API_KEY,
      HAS_GROQ: !!process.env.GROQ_API_KEY,
      APP_URL: process.env.APP_URL,
    },
  });
});

// --- Prodigi: Get product catalog by category ---
// GET /api/products?category=hoodies&page=1
app.get("/api/products", async (req, res) => {
  const { category, page = "1", limit = "20" } = req.query;
  try {
    const params: Record<string, string> = {
      page: page as string,
      pageSize: limit as string,
    };
    if (category) params.category = category as string;

    const response = await axios.get(`${PRODIGI_API_URL}/products`, {
      headers: {
        "X-API-Key": PRODIGI_API_KEY,
        "Content-Type": "application/json",
      },
      params,
    });

    res.json(response.data);
  } catch (error: any) {
    console.error("Prodigi Products Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch Prodigi products" });
  }
});

// --- Prodigi: Get single product details by SKU ---
// GET /api/products/:sku
app.get("/api/products/:sku", async (req, res) => {
  const { sku } = req.params;
  try {
    const response = await axios.get(`${PRODIGI_API_URL}/products/${sku}`, {
      headers: {
        "X-API-Key": PRODIGI_API_KEY,
        "Content-Type": "application/json",
      },
    });
    res.json(response.data);
  } catch (error: any) {
    console.error("Prodigi Product Detail Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch product details" });
  }
});

// --- Prodigi: Generate Mockup for a product + artwork image ---
// POST /api/mockup
// Body: { sku: string, imageUrl: string, text?: string }
app.post("/api/mockup", async (req, res) => {
  const { sku, imageUrl } = req.body;

  if (!sku || !imageUrl) {
    return res.status(400).json({ error: "sku and imageUrl are required" });
  }

  try {
    // Prodigi Mockup API endpoint (v4)
    const response = await axios.post(
      `${PRODIGI_API_URL}/mockups`,
      {
        sku,
        assets: [
          {
            printArea: "default",
            url: imageUrl,
          },
        ],
      },
      {
        headers: {
          "X-API-Key": PRODIGI_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error("Prodigi Mockup Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate mockup" });
  }
});

// --- Prodigi: Shipping quote ---
// POST /api/shipping/quote
app.post("/api/shipping/quote", async (req, res) => {
  const { countryCode, sku } = req.body;
  try {
    const response = await axios.post(
      `${PRODIGI_API_URL}/quotes`,
      {
        destinationCountryCode: countryCode,
        items: [{ sku, quantity: 1 }],
      },
      {
        headers: {
          "X-API-Key": PRODIGI_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error: any) {
    console.error("Prodigi Quote Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch shipping quote" });
  }
});

// --- Stripe: Create checkout session ---
// POST /api/checkout/create-session
app.post("/api/checkout/create-session", async (req, res) => {
  const { thoughtId, sku, productName, price, shippingPrice, countryCode, imageUrl } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${productName} — Mind Gallery`,
              description: `"${thoughtId}" — Exclusive print`,
              images: [imageUrl].filter(Boolean),
            },
            unit_amount: Math.round((price + (shippingPrice || 0)) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["ES", "DE", "FR", "IT", "GB", "US", "NL", "BE", "PT", "AT", "CH"],
      },
      success_url: `${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/cancel`,
      metadata: {
        thoughtId,
        sku,
        countryCode,
        imageUrl,
      },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error.message);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// --- Stripe Webhook: Automatically create Prodigi order after payment ---
app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { sku, countryCode, imageUrl } = session.metadata!;
    const shipping = session.shipping_details;
    const customer = session.customer_details;

    try {
      await axios.post(
        `${PRODIGI_API_URL}/orders`,
        {
          shippingMethod: "Standard",
          idempotencyKey: session.id,
          recipient: {
            address: {
              line1: shipping?.address?.line1 || "",
              line2: shipping?.address?.line2 || "",
              postalCode: shipping?.address?.postal_code || "",
              countryCode: countryCode || shipping?.address?.country || "ES",
              townOrCity: shipping?.address?.city || "",
              stateOrCounty: shipping?.address?.state || "",
            },
            name: shipping?.name || customer?.name || "Customer",
            email: customer?.email || "",
          },
          items: [
            {
              sku,
              copies: 1,
              assets: [
                {
                  printArea: "default",
                  url: imageUrl,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "X-API-Key": PRODIGI_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ Prodigi order created for session:", session.id);
    } catch (error: any) {
      console.error("❌ Prodigi Order Error:", error.response?.data || error.message);
    }
  }

  res.json({ received: true });
});

// --- Groq Oracle Chat ---
app.post("/api/chat", async (req, res) => {
  const { messages, language, thoughtContext } = req.body;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are the Oracle of MindGallery, a wise and compassionate guide. 
            Your purpose is to help users transform limiting beliefs into expansive thoughts. 
            Respond in ${language === "es" ? "Spanish" : language === "de" ? "German" : "English"}.
            Keep responses concise, poetic, and encouraging. 
            
            AVAILABLE THOUGHTS IN GALLERY:
            ${JSON.stringify(thoughtContext)}

            If you find a thought in the list that matches the user's situation, include its ID at the very end of your response in the format: [RECOMMEND: id]. 
            Only recommend if it's a very strong match.`,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const fullText = response.data.choices[0].message.content;
    res.json({ text: fullText });
  } catch (error: any) {
    console.error("Groq Chat Error:", error.response?.data || error.message);
    res.status(500).json({ error: "The Oracle is momentarily disconnected." });
  }
});

// --- Vite Dev / Static Serve ---
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  (async () => {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })();
} else if (!process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;
