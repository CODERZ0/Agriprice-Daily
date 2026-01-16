import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// ✅ LOAD ENV ONLY ONCE
dotenv.config();

const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ ROUTES IMPORTS
import authRoutes from "./routes/auth.js";
import adsRoutes from "./routes/ads.js";
import chatRoutes from "./routes/chat.js";
import requestRoutes from "./routes/requests.js";
import mandiRoutes from "./routes/mandi.js";

// ✅ USE ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/mandi", mandiRoutes);

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("✅ Backend Running");
});

// ✅ ENV
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.log("❌ ERROR: MONGO_URI missing in .env file");
  process.exit(1);
}

// ✅ CONNECT DB + START SERVER
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log("✅ Server running on port", PORT));
  })
  .catch((err) => console.log("❌ MongoDB error:", err.message));
