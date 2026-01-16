import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: { type: String, default: "" },
      },
    ],
    adId: { type: mongoose.Schema.Types.ObjectId, ref: "Ad" },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
