import mongoose from "mongoose";

const mandiCacheSchema = new mongoose.Schema(
  {
    key: { type: String, default: "latest", unique: true },
    updatedAt: { type: Date, default: Date.now },
    records: { type: Array, default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("MandiCache", mandiCacheSchema);
