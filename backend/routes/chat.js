import express from "express";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

/** ✅ create/find conversation between 2 users */
router.post("/conversation", authMiddleware, async (req, res) => {
  try {
    const { otherUserId } = req.body;

    let convo = await Conversation.findOne({
      members: { $all: [req.user.id, otherUserId] },
    });

    if (!convo) {
      convo = await Conversation.create({
        members: [req.user.id, otherUserId],
      });
    }

    res.json(convo);
  } catch (err) {
    res.status(500).json({ message: "Failed conversation" });
  }
});

/** ✅ list my conversations */
router.get("/conversations", authMiddleware, async (req, res) => {
  try {
    const convos = await Conversation.find({
      members: { $in: [req.user.id] },
    })
      .sort({ lastMessageAt: -1 })
      .populate("members", "username");

    res.json(convos);
  } catch (err) {
    res.status(500).json({ message: "Failed list" });
  }
});

/** ✅ get messages */
router.get("/messages/:conversationId", authMiddleware, async (req, res) => {
  try {
    const msgs = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });

    res.json(msgs);
  } catch (err) {
    res.status(500).json({ message: "Failed messages" });
  }
});

/** ✅ send message */
router.post("/message", authMiddleware, async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    const msg = await Message.create({
      conversationId,
      senderId: req.user.id,
      text,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      lastMessageAt: new Date(),
    });

    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: "Failed send message" });
  }
});

export default router;
