import express from "express";
import cookieParser from "cookie-parser";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import axios from "axios";
import * as admin from "firebase-admin";
import Parser from "rss-parser";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: "mind-gallery-app-2026",
    storageBucket: "mind-gallery-app-2026.appspot.com" // Update bucket as per standard firebase, though we use the UI for now
  });
} catch (e) {
  console.log("Firebase default init failed. Ensure GOOGLE_APPLICATION_CREDENTIALS is set, or running in a deployed environment.");
}

const db = admin.firestore();

const app = express();
const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  // In-memory sessions
  const sessions: Record<string, any> = {};

  app.get("/api/auth/google/url", (req, res) => {
    const redirectUri = `${process.env.APP_URL}/api/auth/google/callback`;
    const url = client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"],
      redirect_uri: redirectUri,
    });
    res.json({ url });
  });

  app.get("/api/auth/google/callback", async (req, res) => {
    const { code } = req.query;
    const redirectUri = `${process.env.APP_URL}/api/auth/google/callback`;
    
    try {
      const { tokens } = await client.getToken({
        code: code as string,
        redirect_uri: redirectUri,
      });
      
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      if (!payload) throw new Error("No payload");

      const sessionId = Math.random().toString(36).substring(7);
      sessions[sessionId] = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      };

      res.cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Auth error:", error);
      res.status(500).send("Authentication failed");
    }
  });

  app.get("/api/auth/me", (req, res) => {
    const sessionId = req.cookies.sessionId;
    const user = sessions[sessionId];
    if (user) {
      const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());
      const isAdmin = adminEmails.includes(user.email);
      res.json({ user: { ...user, isAdmin } });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    const sessionId = req.cookies.sessionId;
    delete sessions[sessionId];
    res.clearCookie("sessionId");
    res.json({ success: true });
  });

  // --- Prodigi & Stripe Integration ---

  const PRODIGI_API_URL = "https://api.prodigi.com/v1.0";
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-11-preview",
  });

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
            "X-API-Key": process.env.PRODIGI_API_KEY,
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

  app.post("/api/checkout/create-session", async (req, res) => {
    const { thoughtId, sku, price, shippingPrice, countryCode, imageUrl } = req.body;
    
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: `Mind Gallery Print - ${thoughtId}`,
                images: [imageUrl],
              },
              unit_amount: Math.round((price + shippingPrice) * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
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

      // Create order in Prodigi
      try {
        await axios.post(
          `${PRODIGI_API_URL}/orders`,
          {
            shippingMethod: "Standard",
            recipient: {
              address: {
                line1: session.shipping_details?.address?.line1,
                line2: session.shipping_details?.address?.line2,
                postalCode: session.shipping_details?.address?.postal_code,
                countryCode: countryCode,
                townOrCity: session.shipping_details?.address?.city,
                stateOrCounty: session.shipping_details?.address?.state,
              },
              name: session.shipping_details?.name,
              email: session.customer_details?.email,
            },
            items: [
              {
                sku: sku,
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
              "X-API-Key": process.env.PRODIGI_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error: any) {
        console.error("Prodigi Order Error:", error.response?.data || error.message);
      }
    }

    res.json({ received: true });
  });

  app.get("/api/thoughts/user", async (req, res) => {
    const sessionId = req.cookies.sessionId;
    const user = sessions[sessionId];
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const snapshot = await db.collection("thoughts").where("authorId", "==", user.id).get();
      const thoughts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ thoughts });
    } catch (error) {
      console.error("Firestore error:", error);
      res.status(500).json({ error: "Failed to fetch thoughts" });
    }
  });

  app.post("/api/thoughts", async (req, res) => {
    const sessionId = req.cookies.sessionId;
    const user = sessions[sessionId];
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    
    const newThought = {
      ...req.body,
      authorId: user.id,
      author: user.name,
      isUserAdded: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    try {
      const docRef = await db.collection("thoughts").add(newThought);
      res.json({ thought: { ...newThought, id: docRef.id } });
    } catch (error) {
      console.error("Firestore error:", error);
      res.status(500).json({ error: "Failed to add thought" });
    }
  });

  // --- Dashboard APIS (Blogs, Photos, Settings, Substack) ---

  app.get("/api/blogs", async (req, res) => {
    const sessionId = req.cookies.sessionId;
    const user = sessions[sessionId];
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const snapshot = await db.collection("blogs")
        .where("authorId", "==", user.id)
        .orderBy("createdAt", "desc")
        .get();
      const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ blogs });
    } catch (error) {
      // If index is missing, firestore throws an error with a link to create it.
      // For now, fallback to unordered if orderBy fails.
      try {
        const fallBackSnap = await db.collection("blogs").where("authorId", "==", user.id).get();
        const blogs = fallBackSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ blogs });
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch blogs" });
      }
    }
  });

  app.post("/api/blogs", async (req, res) => {
    const sessionId = req.cookies.sessionId;
    const user = sessions[sessionId];
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());
    if (!adminEmails.includes(user.email)) return res.status(403).json({ error: "Forbidden: Admin access only" });
    
    const newBlog = {
      ...req.body,
      authorId: user.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    try {
      const docRef = await db.collection("blogs").add(newBlog);
      res.json({ blog: { ...newBlog, id: docRef.id } });
    } catch (error) {
      res.status(500).json({ error: "Failed to add blog" });
    }
  });

  app.delete("/api/blogs/:id", async (req, res) => {
    const sessionId = req.cookies.sessionId;
    const user = sessions[sessionId];
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());
    if (!adminEmails.includes(user.email)) return res.status(403).json({ error: "Forbidden: Admin access only" });
    
    try {
      await db.collection("blogs").doc(req.params.id).delete();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete blog" });
    }
  });

  app.get("/api/photos", async (req, res) => {
    const sessionId = req.cookies.sessionId;
    const user = sessions[sessionId];
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const snapshot = await db.collection("photos").where("authorId", "==", user.id).get();
      const photos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ photos });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch photos" });
    }
  });

  app.post("/api/photos", async (req, res) => {
    const sessionId = req.cookies.sessionId;
    const user = sessions[sessionId];
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());
    if (!adminEmails.includes(user.email)) return res.status(403).json({ error: "Forbidden: Admin access only" });
    
    const newPhoto = {
      ...req.body,
      authorId: user.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    try {
      const docRef = await db.collection("photos").add(newPhoto);
      res.json({ photo: { ...newPhoto, id: docRef.id } });
    } catch (error) {
      res.status(500).json({ error: "Failed to add photo" });
    }
  });

  app.delete("/api/photos/:id", async (req, res) => {
    const sessionId = req.cookies.sessionId;
    const user = sessions[sessionId];
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());
    if (!adminEmails.includes(user.email)) return res.status(403).json({ error: "Forbidden: Admin access only" });
    
    try {
      await db.collection("photos").doc(req.params.id).delete();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete photo" });
    }
  });

  app.get("/api/settings", async (req, res) => {
    const sessionId = req.cookies.sessionId;
    const user = sessions[sessionId];
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());
    if (!adminEmails.includes(user.email)) return res.status(403).json({ error: "Forbidden: Admin access only" });
    
    try {
      const doc = await db.collection("settings").doc(user.id).get();
      res.json({ settings: doc.exists ? doc.data() : {} });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    const sessionId = req.cookies.sessionId;
    const user = sessions[sessionId];
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());
    if (!adminEmails.includes(user.email)) return res.status(403).json({ error: "Forbidden: Admin access only" });
    
    try {
      await db.collection("settings").doc(user.id).set(req.body, { merge: true });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save settings" });
    }
  });

  const parser = new Parser();
  app.get("/api/substack", async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== 'string') return res.status(400).json({ error: "URL is required" });
    
    try {
      const rssUrl = url.endsWith('/feed') ? url : `${url.replace(/\/$/, '')}/feed`;
      const feed = await parser.parseURL(rssUrl);
      res.json({ feed });
    } catch (error: any) {
      console.error("Substack RSS Error:", error.message);
      res.status(500).json({ error: "Failed to fetch Substack feed. Please ensure the URL is correct." });
    }
  });

  // --- Global Site Configuration ---
  app.get("/api/config/global", async (req, res) => {
    try {
      // Fetch the global config document
      const doc = await db.collection("public_config").doc("global").get();
      res.json({ config: doc.exists ? doc.data() : {} });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch global config" });
    }
  });

  app.post("/api/config/global", async (req, res) => {
    const sessionId = req.cookies.sessionId;
    const user = sessions[sessionId];
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());
    if (!adminEmails.includes(user.email)) return res.status(403).json({ error: "Forbidden: Admin access only" });
    
    try {
      await db.collection("public_config").doc("global").set(req.body, { merge: true });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save global config" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    (async () => {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })();
  } else if (!process.env.VERCEL) {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

export default app;
