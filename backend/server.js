import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ ALLOW ALL ORIGINS (PRESENTATION MODE)
app.use(cors({ origin: "*", credentials: false }));
app.use(express.json());

// ✅ ROUTES
import authRoutes from "./routes/auth.js";
import adsRoutes from "./routes/ads.js";
import chatRoutes from "./routes/chat.js";
import requestRoutes from "./routes/requests.js";
import mandiRoutes from "./routes/mandi.js";

app.use("/api/auth", authRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/mandi", mandiRoutes);

app.get("/", (req, res) => res.send("✅ Backend Running"));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log("✅ Server running on port", PORT));
  })
  .catch((err) => console.log("❌ MongoDB error:", err.message));
