import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  PhoneCall,
  IndianRupee,
  Plus,
  MessageCircle,
  Inbox,
  Star,
  Pencil,
  Trash2,
} from "lucide-react";

/* ✅ IMPORT YOUR LOCAL DEMO IMAGES */
import bananaImg from "../assets/demoAds/banana.jpg";
import coconutImg from "../assets/demoAds/coconut.jpg";
import onionImg from "../assets/demoAds/onion.jpg";
import turmericImg from "../assets/demoAds/turmeric.jpg";

/* ------------------ ✅ DEMO ADS (LOCAL IMAGES) ------------------ */
const DEMO_ADS = [
  {
    _id: "1",
    title: "Fresh Coconut (Big Size)",
    price: 28,
    unit: "₹/kg",
    qty: "200 kg available",
    photo: coconutImg,
    seller: "Ramesh Traders",
    phone: "9876512345",
    state: "Kerala",
    district: "Kozhikode",
    location: "Palayam Market",
    description: "Fresh big coconuts. Delivery possible inside district.",
    rating: 4.5,
    isMine: false,
  },
  {
    _id: "2",
    title: "Dry Turmeric (Quality A)",
    price: 180,
    unit: "₹/kg",
    qty: "50 kg available",
    photo: turmericImg,
    seller: "GreenCrop Dealers",
    phone: "9123456789",
    state: "Tamil Nadu",
    district: "Coimbatore",
    location: "Uzhavar Sandhai",
    description: "Good quality dry turmeric. Bulk offers available.",
    rating: 4.2,
    isMine: false,
  },
  {
    _id: "3",
    title: "Banana (Bulk)",
    price: 23,
    unit: "₹/kg",
    qty: "500 kg available",
    photo: bananaImg,
    seller: "Agri Link Hub",
    phone: "9988777665",
    state: "Kerala",
    district: "Malappuram",
    location: "Manjeri Mandi",
    description: "Fresh green banana. Bulk supply for shops & brokers.",
    rating: 4.0,
    isMine: false,
  },
  {
    _id: "4",
    title: "Onion (Medium size)",
    price: 32,
    unit: "₹/kg",
    qty: "1000 kg available",
    photo: onionImg,
    seller: "Mandi Direct",
    phone: "7012345678",
    state: "Maharashtra",
    district: "Nashik",
    location: "Nashik APMC",
    description: "Best onion mandi rate. Vehicle loading available.",
    rating: 4.7,
    isMine: false,
  },
];

/* ------------------ ✅ helpers ------------------ */
const unique = (arr) => [...new Set(arr.filter(Boolean))];

function safeLower(s = "") {
  return (s || "").toString().toLowerCase();
}

/* ------------------ ✅ Animated Crop Background ------------------ */
function CropBackground() {
  const items = ["🍅", "🥔", "🌶️", "🌽", "🍌", "🧅", "🧄", "🌾", "🥕", "🥬"];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 -left-40 w-[520px] h-[520px] rounded-full bg-emerald-200/40 blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-40 w-[520px] h-[520px] rounded-full bg-lime-200/40 blur-3xl animate-pulse" />

      {Array.from({ length: 18 }).map((_, i) => {
        const x = (i * 13) % 100;
        const y = (i * 19) % 100;
        const size = 20 + (i % 4) * 8;
        const emoji = items[i % items.length];
        const duration = 10 + (i % 6) * 2;

        return (
          <div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              fontSize: `${size}px`,
              animation: `floaty ${duration}s ease-in-out infinite`,
            }}
          >
            {emoji}
          </div>
        );
      })}

      <style>{`
        @keyframes floaty {
          0%   { transform: translateY(0px) translateX(0px) rotate(0deg); }
          50%  { transform: translateY(-18px) translateX(12px) rotate(5deg); }
          100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}

/* ------------------ ✅ Marketplace ------------------ */
export default function Marketplace() {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");

  const [ads, setAds] = useState([]);

  // ✅ Load My Ads + Demo Ads
  useEffect(() => {
    const myAds = JSON.parse(localStorage.getItem("ads") || "[]");

    const formattedMyAds = myAds.map((a) => ({
      _id: a.id,
      title: a.title,
      price: a.price,
      unit: "₹",
      qty: a.qty || "Available",
      photo: a.images?.[0] || bananaImg, // fallback
      seller: "My Account",
      phone: a.phone || "",
      state: "Kerala",
      district: a.district || "Kozhikode",
      location: a.location || a.district || "Local Area",
      description: a.desc || "",
      rating: 5,
      isMine: true,
    }));

    setAds([...formattedMyAds, ...DEMO_ADS]);
  }, []);

  const states = useMemo(() => unique(ads.map((a) => a.state)).sort(), [ads]);

  const districts = useMemo(() => {
    const filtered = stateFilter ? ads.filter((a) => a.state === stateFilter) : ads;
    return unique(filtered.map((a) => a.district)).sort();
  }, [ads, stateFilter]);

  const filteredAds = useMemo(() => {
    let data = [...ads];

    if (stateFilter) data = data.filter((a) => a.state === stateFilter);
    if (districtFilter) data = data.filter((a) => a.district === districtFilter);

    if (q.trim()) {
      const s = safeLower(q);
      data = data.filter(
        (a) =>
          safeLower(a.title).includes(s) ||
          safeLower(a.location).includes(s) ||
          safeLower(a.seller).includes(s)
      );
    }

    return data;
  }, [ads, q, stateFilter, districtFilter]);

  // ✅ Delete My Ad
  const handleDelete = (adId) => {
    const ok = window.confirm("Are you sure you want to delete this ad?");
    if (!ok) return;

    const myAds = JSON.parse(localStorage.getItem("ads") || "[]");
    const updated = myAds.filter((a) => a.id !== adId);
    localStorage.setItem("ads", JSON.stringify(updated));

    setAds((prev) => prev.filter((a) => a._id !== adId));
    alert("✅ Ad deleted successfully!");
  };

  // ✅ Edit My Ad
  const handleEdit = (adId) => {
    navigate(`/postad?edit=${adId}`);
  };

  // ✅ OLX Chat: create enquiry and go inbox
  const handleChatEnquiry = (ad) => {
    const inbox = JSON.parse(localStorage.getItem("inbox") || "[]");

    const enquiry = {
      id: "enq_" + Date.now(),
      adId: ad._id,
      adTitle: ad.title,
      from: "Demo Buyer",
      phone: "9999999999",
      message: `Hi, I'm interested in "${ad.title}". Is it still available?`,
      time: new Date().toISOString(),
      unread: true,
    };

    localStorage.setItem("inbox", JSON.stringify([enquiry, ...inbox]));
    navigate(`/inbox?open=${enquiry.id}`);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50">
      <CropBackground />

      {/* TOP BAR */}
      <header className="relative sticky top-0 z-40 bg-white/75 backdrop-blur border-b border-emerald-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-3xl font-black text-emerald-950 flex items-center gap-2">
              Marketplace <span className="text-lime-600">✧</span>
            </div>
            <div className="text-emerald-700 font-semibold">
              Buy • Sell • Chat with traders
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/inbox")}
              className="px-5 py-2 rounded-2xl border border-emerald-200 bg-white font-black text-emerald-900 hover:bg-emerald-50 transition flex items-center gap-2 shadow-sm"
            >
              <Inbox size={18} className="text-emerald-700" />
              Inbox
            </button>

            <button
              onClick={() => navigate("/postad")}
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-lime-500 text-white font-black shadow-lg hover:opacity-95 transition flex items-center gap-2"
            >
              <Plus size={18} />
              Post Ad
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 px-5 py-4 rounded-3xl bg-white border border-emerald-100 shadow-md">
            <Search className="text-emerald-700" size={18} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search ads..."
              className="w-full outline-none text-emerald-900 placeholder:text-emerald-400 font-semibold"
            />
          </div>

          <select
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value);
              setDistrictFilter("");
            }}
            className="px-5 py-4 rounded-3xl bg-white border border-emerald-100 shadow-md outline-none font-bold"
          >
            <option value="">All States</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-5 py-4 rounded-3xl bg-white border border-emerald-100 shadow-md outline-none font-bold"
          >
            <option value="">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 text-emerald-900 font-black text-lg">
          Showing {filteredAds.length} ads
        </div>

        {/* Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAds.map((ad) => (
            <div
              key={ad._id}
              className="rounded-[28px] border border-emerald-100 bg-white/90 shadow-lg hover:shadow-xl transition overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={ad.photo}
                  alt={ad.title}
                  className="w-full h-48 object-cover group-hover:scale-[1.02] transition"
                  onError={(e) => (e.currentTarget.src = bananaImg)}
                />

                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 border border-emerald-100 text-emerald-900 font-black text-sm flex items-center gap-1">
                  <Star size={14} className="text-lime-600" />
                  {ad.rating}
                </div>

                {ad.isMine && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs shadow">
                    MY AD
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="text-lg font-black text-emerald-950 line-clamp-2">
                  {ad.title}
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-emerald-950 font-black">
                    <IndianRupee size={18} className="text-emerald-700" />
                    {ad.price}{" "}
                    <span className="text-emerald-700">{ad.unit}</span>
                  </div>

                  <div className="text-sm font-black text-emerald-700">
                    {ad.qty}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-emerald-900">
                  <MapPin size={16} className="text-emerald-700" />
                  <span className="font-black">{ad.location}</span>
                  <span className="opacity-40">•</span>
                  <span className="font-semibold text-emerald-700">
                    {ad.district}, {ad.state}
                  </span>
                </div>

                {/* Call / Chat */}
                <div className="mt-5 flex gap-3">
                  <a
                    href={`tel:${ad.phone}`}
                    className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-lime-500 text-white font-black shadow hover:opacity-95 transition flex items-center justify-center gap-2"
                  >
                    <PhoneCall size={18} />
                    Call
                  </a>

                  <button
                    onClick={() => handleChatEnquiry(ad)}
                    className="flex-1 px-4 py-3 rounded-2xl border border-emerald-200 bg-white text-emerald-950 font-black hover:bg-emerald-50 transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} className="text-emerald-700" />
                    Chat
                  </button>
                </div>

                {/* Edit/Delete for MY ADS */}
                {ad.isMine && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(ad._id)}
                      className="flex-1 px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black flex items-center justify-center gap-2 transition"
                    >
                      <Pencil size={18} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(ad._id)}
                      className="flex-1 px-4 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black flex items-center justify-center gap-2 transition"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredAds.length === 0 && (
          <div className="mt-10 text-center text-emerald-700 font-black text-lg">
            No ads found. Try another search.
          </div>
        )}
      </main>
    </div>
  );
}
