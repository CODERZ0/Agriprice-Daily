import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, default: "₹/kg" },
    qty: { type: String, default: "" },
    photo: { type: String, default: "" }, // image URL
    description: { type: String, default: "" },

    state: { type: String, default: "" },
    district: { type: String, default: "" },
    location: { type: String, default: "" },

    sellerName: { type: String, default: "" },
    sellerPhone: { type: String, default: "" },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Ad", adSchema);
