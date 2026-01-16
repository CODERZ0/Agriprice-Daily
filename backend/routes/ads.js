import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Ad from "../models/Ad.js";

const router = express.Router();

/**
 * ✅ CREATE AD (Protected)
 * POST /api/ads
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, price, quantity, category, state, district, description, images, phone } = req.body;

    if (!title || !price || !state || !district) {
      return res.status(400).json({ message: "Title, price, state, district required" });
    }

    const ad = await Ad.create({
      title,
      price,
      quantity: quantity || "",
      category: category || "General",
      state,
      district,
      description: description || "",
      images: images || [],
      phone: phone || "",
      userId: req.user.id,
      sellerName: req.user.username,
    });

    res.status(201).json({ message: "Ad posted successfully", ad });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Ad post failed", error: err.message });
  }
});

/**
 * ✅ GET ALL ADS (Public)
 * GET /api/ads
 */
router.get("/", async (req, res) => {
  try {
    const { q, state, district } = req.query;

    const filter = {};

    if (state) filter.state = state;
    if (district) filter.district = district;

    // search query
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    const ads = await Ad.find(filter).sort({ createdAt: -1 });
    res.json({ count: ads.length, ads });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ads", error: err.message });
  }
});

/**
 * ✅ GET SINGLE AD
 * GET /api/ads/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    res.json(ad);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ad", error: err.message });
  }
});

/**
 * ✅ DELETE AD (Protected - only owner)
 * DELETE /api/ads/:id
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    if (String(ad.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await ad.deleteOne();
    res.json({ message: "Ad deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete ad", error: err.message });
  }
});

export default router;
