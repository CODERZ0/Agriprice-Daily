import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    // ✅ ONLY USE passwordHash
    passwordHash: { type: String, required: true },

    role: { type: String, default: "user" }, // "admin" | "user"
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
