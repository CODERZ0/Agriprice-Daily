import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: String, default: "" },
    category: { type: String, default: "General" },

    state: { type: String, required: true },
    district: { type: String, required: true },

    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    phone: { type: String, default: "" },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sellerName: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Ad", adSchema);
