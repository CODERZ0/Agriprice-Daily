import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Send } from "lucide-react";

export default function Chat() {
  const token = localStorage.getItem("token");
  const me = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const [convos, setConvos] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  const loadConversations = async () => {
    const res = await axios.get("http://localhost:5000/api/chat/conversations", {
      headers,
    });
    setConvos(res.data);
    if (!active && res.data.length > 0) setActive(res.data[0]);
  };

  const loadMessages = async (convoId) => {
    const res = await axios.get(
      `http://localhost:5000/api/chat/messages/${convoId}`,
      { headers }
    );
    setMessages(res.data);
  };

  const send = async () => {
    if (!text.trim() || !active) return;

    const res = await axios.post(
      "http://localhost:5000/api/chat/message",
      { conversationId: active._id, text },
      { headers }
    );

    setMessages((p) => [...p, res.data]);
    setText("");
  };

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (active?._id) loadMessages(active._id);
    // eslint-disable-next-line
  }, [active?._id]);

  if (!token) {
    return (
      <div className="p-10 text-center font-black text-emerald-900">
        Login required
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* left convos */}
        <div className="md:col-span-1 rounded-3xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b border-emerald-100 font-black text-emerald-900">
            Inbox
          </div>

          <div className="divide-y divide-emerald-50">
            {convos.map((c) => {
              const other = c.members?.find((m) => m._id !== me?.id);
              return (
                <button
                  key={c._id}
                  onClick={() => setActive(c)}
                  className={`w-full text-left p-4 hover:bg-emerald-50 transition ${
                    active?._id === c._id ? "bg-emerald-50" : ""
                  }`}
                >
                  <div className="font-black text-emerald-900">
                    {other?.username || "User"}
                  </div>
                  <div className="text-sm text-emerald-700 line-clamp-1">
                    {c.lastMessage || "No messages yet"}
                  </div>
                </button>
              );
            })}

            {convos.length === 0 && (
              <div className="p-6 text-emerald-700 font-bold">
                No chats yet
              </div>
            )}
          </div>
        </div>

        {/* right chat */}
        <div className="md:col-span-2 rounded-3xl border border-emerald-100 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-emerald-100 font-black text-emerald-900">
            Chat
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m) => {
              const mine = m.senderId === me?.id;
              return (
                <div
                  key={m._id}
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-semibold ${
                    mine
                      ? "bg-emerald-600 text-white ml-auto"
                      : "bg-emerald-50 text-emerald-900"
                  }`}
                >
                  {m.text}
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-emerald-100 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type message..."
              className="flex-1 px-4 py-3 rounded-2xl border border-emerald-200 outline-none"
            />
            <button
              onClick={send}
              className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-700 transition flex items-center gap-2"
            >
              <Send size={18} />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
