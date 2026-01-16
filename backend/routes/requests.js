import express from "express";
import Request from "../models/Request.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/** ✅ Create request */
router.post("/", auth, async (req, res) => {
  const { type, commodity, qty, price, location } = req.body;

  if (!type || !commodity || !qty || !price || !location) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const newReq = await Request.create({
    type,
    commodity,
    qty,
    price,
    location,
    status: "OPEN",
    createdBy: req.user.username
  });

  res.json(newReq);
});

/** ✅ Get all requests */
router.get("/", auth, async (req, res) => {
  const list = await Request.find().sort({ createdAt: -1 }).limit(300);
  res.json(list);
});

/** ✅ Update status (admin/dealer only) */
router.put("/:id/status", auth, async (req, res) => {
  const { status } = req.body;

  if (!["OPEN", "APPROVED", "REJECTED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  if (!["admin", "dealer"].includes(req.user.role)) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const updated = await Request.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(updated);
});

export default router;
