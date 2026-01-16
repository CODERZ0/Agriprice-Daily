import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Inbox,
  Search,
  CheckCheck,
  MessageCircle,
  PhoneCall,
  BadgeCheck,
} from "lucide-react";

const safeLower = (s = "") => (s || "").toString().toLowerCase();

// ✅ demo enquiries only for MY ADS
function createDemoEnquiriesForMyAds(myAds = []) {
  const now = Date.now();
  const names = ["Rahul Krishnan", "Fathima", "Arjun M", "Nihal", "Sona", "Jishnu"];
  const phones = ["9876543210", "9898989898", "9123456780", "9078901234", "9044778899"];
  const messages = [
    "Hi, is this still available?",
    "Can you give best rate for bulk?",
    "Need delivery tomorrow. Possible?",
    "Please share location and stock details.",
    "Can you reduce price little?",
    "I want 100kg. Call me.",
  ];

  const enquiries = [];
  myAds.slice(0, 4).forEach((ad, idx) => {
    const count = idx % 2 === 0 ? 2 : 1;
    for (let k = 0; k < count; k++) {
      const i = (idx + k) % names.length;
      enquiries.push({
        id: `demo_${ad.id}_${k}`,
        adId: ad.id,
        adTitle: ad.title,
        from: names[i],
        phone: phones[i],
        message: messages[(idx + k) % messages.length],
        time: new Date(now - (idx * 6 + k * 2) * 60 * 60 * 1000).toISOString(),
        unread: k === 0,
      });
    }
  });

  return enquiries;
}

export default function InboxPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const openId = params.get("open");

  const [q, setQ] = useState("");
  const [threads, setThreads] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const inbox = JSON.parse(localStorage.getItem("inbox") || "[]");
    const myAds = JSON.parse(localStorage.getItem("ads") || "[]");

    if (!inbox || inbox.length === 0) {
      const demo = createDemoEnquiriesForMyAds(myAds);

      const finalList =
        demo.length > 0
          ? demo
          : [
              {
                id: "demo_default_1",
                adId: "none",
                adTitle: "No Ads Yet",
                from: "Demo Buyer",
                phone: "9999999999",
                message: "Post an Ad to receive enquiries ✅",
                time: new Date().toISOString(),
                unread: true,
              },
            ];

      localStorage.setItem("inbox", JSON.stringify(finalList));
      setThreads(finalList);
    } else {
      setThreads(inbox);
    }
  }, []);

  // ✅ open thread = mark read
  const openThread = (t) => {
    setSelected(t);

    const updated = threads.map((x) =>
      x.id === t.id ? { ...x, unread: false } : x
    );

    setThreads(updated);
    localStorage.setItem("inbox", JSON.stringify(updated));
  };

  // ✅ AUTO OPEN enquiry when coming from marketplace chat
  useEffect(() => {
    if (!openId) return;
    if (!threads || threads.length === 0) return;

    const found = threads.find((x) => x.id === openId);
    if (found) openThread(found);
  }, [openId, threads]);

  const filtered = useMemo(() => {
    if (!q.trim()) return threads;
    const s = safeLower(q);
    return threads.filter(
      (t) =>
        safeLower(t.from).includes(s) ||
        safeLower(t.adTitle).includes(s) ||
        safeLower(t.message).includes(s)
    );
  }, [threads, q]);

  const unreadCount = useMemo(
    () => threads.filter((t) => t.unread).length,
    [threads]
  );

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone, msg) => {
    const formattedPhone = phone.replace(/\D/g, "");
    const text = encodeURIComponent(msg || "Hi, I saw your enquiry in AgriPrice Daily");
    window.open(`https://wa.me/91${formattedPhone}?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl border border-emerald-200 bg-white font-black text-emerald-900 hover:bg-emerald-50 transition flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <div className="text-2xl font-black text-emerald-950 flex items-center gap-2">
            <Inbox size={22} className="text-emerald-700" />
            Inbox
            <span className="ml-2 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black">
              {unreadCount} Unread
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 flex items-center gap-3 px-5 py-4 rounded-3xl bg-white border border-emerald-100 shadow-md">
          <Search className="text-emerald-700" size={18} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search enquiries..."
            className="w-full outline-none text-emerald-900 placeholder:text-emerald-400 font-semibold"
          />
        </div>

        {/* Layout */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Threads */}
          <div className="md:col-span-1 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center text-emerald-700 font-black mt-10">
                No enquiries yet
              </div>
            ) : (
              filtered.map((t) => (
                <button
                  key={t.id}
                  onClick={() => openThread(t)}
                  className={`w-full text-left rounded-3xl border shadow-md p-4 transition ${
                    selected?.id === t.id
                      ? "bg-emerald-50 border-emerald-300"
                      : "bg-white border-emerald-100 hover:bg-emerald-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-black text-emerald-950">{t.from}</div>
                      <div className="text-xs font-bold text-emerald-700 mt-1">
                        Enquiry for: {t.adTitle}
                      </div>
                    </div>

                    {t.unread ? (
                      <div className="w-3 h-3 rounded-full bg-emerald-600 mt-1" />
                    ) : (
                      <CheckCheck className="text-emerald-600" size={18} />
                    )}
                  </div>

                  <div className="mt-2 text-sm text-emerald-900 font-semibold line-clamp-1">
                    {t.message}
                  </div>

                  <div className="mt-2 text-[11px] font-bold text-emerald-700">
                    {new Date(t.time).toLocaleString()}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Right View */}
          <div className="md:col-span-2">
            {!selected ? (
              <div className="rounded-3xl bg-white border border-emerald-100 shadow-md p-10 text-center">
                <div className="text-emerald-950 font-black text-xl">
                  Select an enquiry
                </div>
                <div className="text-emerald-700 font-semibold mt-2">
                  Click a message from left panel.
                </div>
              </div>
            ) : (
              <div className="rounded-3xl bg-white border border-emerald-100 shadow-md p-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="text-xl font-black text-emerald-950 flex items-center gap-2">
                      {selected.from}
                      <BadgeCheck className="text-emerald-600" size={20} />
                    </div>
                    <div className="text-sm font-bold text-emerald-700 mt-1">
                      Enquiry for: {selected.adTitle}
                    </div>
                    <div className="text-xs font-bold text-emerald-700 mt-2">
                      {new Date(selected.time).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        handleWhatsApp(
                          selected.phone,
                          `Hi ${selected.from}, I received your enquiry for "${selected.adTitle}".`
                        )
                      }
                      className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black flex items-center gap-2 transition"
                    >
                      <MessageCircle size={18} /> WhatsApp
                    </button>

                    <button
                      onClick={() => handleCall(selected.phone)}
                      className="px-4 py-3 rounded-2xl bg-lime-600 hover:bg-lime-700 text-white font-black flex items-center gap-2 transition"
                    >
                      <PhoneCall size={18} /> Call
                    </button>
                  </div>
                </div>

                <div className="mt-6 p-5 rounded-3xl bg-emerald-50 border border-emerald-100 font-semibold text-emerald-950">
                  {selected.message}
                </div>

                <div className="mt-4 text-sm font-bold text-emerald-700">
                  Phone: {selected.phone}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
