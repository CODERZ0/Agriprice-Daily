import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Bell,
  Search,
  RefreshCcw,
  MapPin,
  UserRound,
  X,
  TrendingDown,
  TrendingUp,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";

import { BASE_URL, DATA_GOV_API_KEY } from "../config";
import { SPICE_MASTER } from "../spiceMaster";
import { useAuth } from "../context/AuthContext";

/* ✅ Convert ₹/Quintal -> ₹/Kg (1 quintal = 100 kg) */
function toPerKg(pricePerQuintal) {
  const n = Number(pricePerQuintal);
  if (!Number.isFinite(n)) return "—";
  return `₹${(n / 100).toFixed(2)}/kg`;
}

function normalize(s = "") {
  return (s || "").toLowerCase().trim();
}

/* ✅ Emoji support */
const ICONS = {
  chilli: "🌶️",
  turmeric: "🌿",
  coriander: "🟢",
  cumin: "🧂",
  pepper: "⚫",
  cardamom: "🌱",
  clove: "🍂",
  cinnamon: "🪵",
  onion: "🧅",
  tomato: "🍅",
  potato: "🥔",
  rice: "🌾",
  wheat: "🌾",
};

function getEmoji(name = "") {
  const lower = normalize(name);
  const key = Object.keys(ICONS).find((k) => lower.includes(k));
  return key ? ICONS[key] : "🌱";
}

/** ✅ demo store details generator (different per market) */
const storeFromMarket = (marketName = "Market") => {
  const seed = marketName.length;

  const phones = [
    "+91 98765 12345",
    "+91 91234 56789",
    "+91 99887 77665",
    "+91 70123 45678",
    "+91 79944 11223",
  ];
  const owners = [
    "Ramesh Traders",
    "Kannan Agencies",
    "GreenCrop Dealers",
    "Agri Link Hub",
    "Mandi Direct",
    "Krishi Wholesale",
  ];
  const areas = [
    "Main Road",
    "Market Junction",
    "APMC Gate",
    "Near Bus Stand",
    "Trade Center",
  ];

  return {
    storeName: owners[seed % owners.length],
    market: marketName,
    address: `${areas[seed % areas.length]}, ${marketName}`,
    phone: phones[seed % phones.length],
    timing: "9:00 AM - 7:30 PM",
    whatsapp: phones[(seed + 1) % phones.length],
    rating: (4.0 + (seed % 10) / 20).toFixed(1),
  };
};

/* ✅ Animated crop background */
function CropBackground() {
  const items = [
    { emoji: "🌾", x: "10%", y: "15%", s: 26, d: 0 },
    { emoji: "🍅", x: "20%", y: "70%", s: 28, d: 0.2 },
    { emoji: "🥔", x: "12%", y: "45%", s: 32, d: 0.4 },
    { emoji: "🧅", x: "85%", y: "20%", s: 30, d: 0.1 },
    { emoji: "🌶️", x: "78%", y: "55%", s: 28, d: 0.3 },
    { emoji: "🌽", x: "65%", y: "35%", s: 30, d: 0.15 },
    { emoji: "🥥", x: "92%", y: "72%", s: 28, d: 0.5 },
    { emoji: "🍌", x: "45%", y: "82%", s: 28, d: 0.35 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-lime-200/40 blur-3xl" />
      <div className="absolute top-40 right-20 w-[380px] h-[380px] rounded-full bg-teal-200/30 blur-3xl" />

      {items.map((i, idx) => (
        <span
          key={idx}
          className="absolute opacity-25 select-none"
          style={{
            left: i.x,
            top: i.y,
            fontSize: i.s,
            animation: `floaty 6.5s ease-in-out infinite`,
            animationDelay: `${i.d}s`,
          }}
        >
          {i.emoji}
        </span>
      ))}

      <style>{`
        @keyframes floaty {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(7deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}

/* ✅ Skeleton Card */
function SkeletonCard() {
  return (
    <div className="rounded-[32px] border border-emerald-200 bg-white/70 backdrop-blur shadow-sm overflow-hidden">
      <div className="p-5 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-emerald-100 rounded" />
            <div className="h-3 w-24 bg-emerald-100 rounded mt-2" />
          </div>
          <div className="h-6 w-20 bg-emerald-100 rounded-full" />
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="h-20 bg-emerald-100 rounded-2xl" />
          <div className="h-20 bg-emerald-200 rounded-2xl" />
          <div className="h-20 bg-emerald-100 rounded-2xl" />
        </div>

        <div className="h-12 bg-emerald-100 rounded-2xl mt-5" />
      </div>

      <div className="h-1 bg-gradient-to-r from-emerald-400 via-lime-400 to-teal-400" />
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  // UI
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  // Filters
  const [q, setQ] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [marketFilter, setMarketFilter] = useState("");

  // Modes
  const [viewMode, setViewMode] = useState("ALL");

  // Alerts
  const [alerts, setAlerts] = useState([]);
  const [showAlerts, setShowAlerts] = useState(true);

  // Profile dropdown
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Modal
  const [storeOpen, setStoreOpen] = useState(false);
  const [storeDetails, setStoreDetails] = useState(null);

  // Pagination
  const PAGE_SIZE = 5000;
  const MAX_PAGES = 25;

  const onLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handle = (e) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const playAlertSound = () => {
    try {
      const audio = new Audio("/alert.mp3");
      audio.play().catch(() => {});
    } catch {}
  };

  const computeAlerts = (data) => {
    const a = [];
    for (const r of data) {
      const min = Number(r.min_price) || 0;
      const max = Number(r.max_price) || 0;
      const modal = Number(r.modal_price) || 0;
      if (!min || !max) continue;

      const diff = max - min;
      const diffPct = (diff / Math.max(1, modal || max)) * 100;

      if (diffPct >= 18) {
        a.push({
          type: "high",
          title: `${r.commodity} price high`,
          msg: `${r.market} • max ₹${max} vs min ₹${min}`,
        });
      }

      if (modal && modal - min <= Math.max(1, min * 0.05)) {
        a.push({
          type: "drop",
          title: `${r.commodity} price drop`,
          msg: `${r.market} • modal ₹${modal} near min ₹${min}`,
        });
      }
    }
    return a.slice(0, 8);
  };

  async function fetchAllPages() {
    try {
      setError("");
      setLoading(true);
      setLoadingMsg("Starting download...");

      let all = [];
      let offset = 0;
      let page = 0;

      while (page < MAX_PAGES) {
        page++;
        setLoadingMsg(`Downloading page ${page}...`);

        const res = await axios.get(BASE_URL, {
          params: {
            "api-key": DATA_GOV_API_KEY,
            format: "json",
            limit: PAGE_SIZE,
            offset,
          },
        });

        const data = res?.data?.records ?? [];
        all = all.concat(data);

        if (data.length < PAGE_SIZE) break;
        offset += PAGE_SIZE;
      }

      setRecords(all);
      setLoadingMsg(`Loaded ${all.length} records ✅`);

      const computed = computeAlerts(all);
      setAlerts(computed);
      if (computed.length > 0) playAlertSound();
    } catch (e) {
      setError("API error: Check API key OR rate limit. Try again after 1-2 min.");
    } finally {
      setLoading(false);
      setTimeout(() => setLoadingMsg(""), 2000);
    }
  }

  useEffect(() => {
    fetchAllPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dropdown options
  const states = useMemo(
    () => [...new Set(records.map((r) => r.state).filter(Boolean))].sort(),
    [records]
  );

  const districts = useMemo(() => {
    const filtered = stateFilter
      ? records.filter((r) => r.state === stateFilter)
      : records;
    return [...new Set(filtered.map((r) => r.district).filter(Boolean))].sort();
  }, [records, stateFilter]);

  const markets = useMemo(() => {
    let filtered = records;
    if (stateFilter) filtered = filtered.filter((r) => r.state === stateFilter);
    if (districtFilter) filtered = filtered.filter((r) => r.district === districtFilter);

    return [...new Set(filtered.map((r) => r.market).filter(Boolean))].sort();
  }, [records, stateFilter, districtFilter]);

  // Spice map
  const commodityMap = useMemo(() => {
    const map = new Map();
    for (const r of records) {
      const key = normalize(r.commodity);
      if (!key) continue;
      if (!map.has(key)) map.set(key, r);
    }
    return map;
  }, [records]);

  // Spices list
  const spiceRecords = useMemo(() => {
    const today = records?.[0]?.arrival_date || "—";

    return SPICE_MASTER.map((spiceName) => {
      const key = normalize(spiceName);

      let found =
        [...commodityMap.entries()].find(([k]) => k.includes(key))?.[1] ||
        [...commodityMap.entries()].find(([k]) => key.includes(k))?.[1];

      if (!found) {
        return {
          commodity: spiceName,
          variety: "—",
          arrival_date: today,
          min_price: null,
          max_price: null,
          modal_price: null,
          market: "—",
          district: "—",
          state: "—",
          __noData: true,
        };
      }
      return found;
    });
  }, [commodityMap, records]);

  // Apply filters
  const filteredRecords = useMemo(() => {
    let data = viewMode === "SPICES" ? spiceRecords : [...records];

    if (stateFilter) data = data.filter((r) => r.state === stateFilter);
    if (districtFilter) data = data.filter((r) => r.district === districtFilter);
    if (marketFilter) data = data.filter((r) => r.market === marketFilter);

    if (q.trim()) {
      const s = q.toLowerCase();
      data = data.filter(
        (r) =>
          (r.commodity || "").toLowerCase().includes(s) ||
          (r.variety || "").toLowerCase().includes(s) ||
          (r.market || "").toLowerCase().includes(s)
      );
    }

    return data;
  }, [records, spiceRecords, viewMode, stateFilter, districtFilter, marketFilter, q]);

  const openStore = (marketName) => {
    const details = storeFromMarket(marketName);
    setStoreDetails(details);
    setStoreOpen(true);
  };

  const googleMapUrl = (marketName) => {
    const query = encodeURIComponent(marketName + " mandi market");
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50">
      <CropBackground />

      {/* ✅ HEADER */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-emerald-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="AgriPrice Daily"
              className="w-12 h-12 rounded-2xl border border-emerald-100 object-cover bg-white"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div>
              <h1 className="text-lg md:text-xl font-extrabold text-emerald-950 flex items-center gap-2">
                AgriPrice Daily <Sparkles size={18} className="text-emerald-600" />
              </h1>
              <p className="text-sm text-emerald-700/80 font-semibold">
                Daily India Trade Markets Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Alerts */}
            <button
              onClick={() => setShowAlerts((v) => !v)}
              className="p-2 rounded-2xl border border-emerald-200 bg-white/70 backdrop-blur shadow-sm hover:bg-emerald-50 transition"
              title="Alerts"
            >
              <Bell className="text-emerald-700" />
            </button>

            {/* Marketplace */}
            <Link
              to="/marketplace"
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-lime-600 text-white font-black shadow-lg hover:opacity-95 transition"
            >
              Marketplace
            </Link>

            {/* Profile */}
            {token ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-emerald-200 bg-white/70 backdrop-blur shadow-sm hover:bg-emerald-50 transition"
                >
                  <UserRound size={18} className="text-emerald-700" />
                  <span className="font-black text-emerald-950 hidden sm:block">
                    {user?.username || "User"}
                  </span>
                  <ChevronDown size={18} className="text-emerald-700" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-emerald-100 bg-white shadow-xl overflow-hidden z-50">
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 font-black text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-2xl bg-white/70 backdrop-blur border border-emerald-200 font-black text-emerald-950 shadow-sm hover:bg-emerald-50 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* ✅ ALERT BAR */}
        {token && showAlerts && alerts.length > 0 && (
          <div className="border-t border-emerald-100 bg-white/70 backdrop-blur">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-start gap-3">
              <Bell className="text-emerald-700 mt-0.5" size={18} />
              <div className="flex-1">
                <div className="text-sm font-black text-emerald-950">Market Alerts</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {alerts.map((a, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-emerald-100 bg-white/70 backdrop-blur text-sm shadow-sm"
                    >
                      {a.type === "drop" ? (
                        <TrendingDown size={16} className="text-emerald-700" />
                      ) : (
                        <TrendingUp size={16} className="text-emerald-700" />
                      )}
                      <div className="leading-tight">
                        <div className="font-black text-emerald-950">{a.title}</div>
                        <div className="text-emerald-700 font-semibold">{a.msg}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowAlerts(false)}
                className="p-2 rounded-2xl hover:bg-emerald-50 transition"
                title="Close alerts"
              >
                <X size={18} className="text-emerald-700" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ✅ MAIN */}
      <main className="max-w-6xl mx-auto px-4 py-7">
        {/* Mode + Reload */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setViewMode("ALL")}
            className={`px-4 py-2 rounded-2xl font-black border shadow-sm transition ${
              viewMode === "ALL"
                ? "bg-gradient-to-r from-emerald-600 to-lime-600 text-white border-transparent"
                : "bg-white/70 backdrop-blur text-emerald-900 border-emerald-100 hover:bg-emerald-50"
            }`}
          >
            ⭐ All Commodities
          </button>

          <button
            onClick={() => setViewMode("SPICES")}
            className={`px-4 py-2 rounded-2xl font-black border shadow-sm transition ${
              viewMode === "SPICES"
                ? "bg-gradient-to-r from-emerald-600 to-lime-600 text-white border-transparent"
                : "bg-white/70 backdrop-blur text-emerald-900 border-emerald-100 hover:bg-emerald-50"
            }`}
          >
            🌶️ Spices Only
          </button>

          <button
            onClick={fetchAllPages}
            className="ml-auto px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-lime-600 text-white font-black shadow-lg hover:opacity-95 transition flex items-center gap-2"
          >
            <RefreshCcw size={18} />
            Reload All India
          </button>
        </div>

        {/* Search + Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 flex items-center gap-2 bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-emerald-100 px-4 py-3">
            <Search className="text-emerald-600" size={20} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search commodity / market..."
              className="w-full outline-none text-emerald-950 placeholder:text-emerald-500 bg-transparent font-semibold"
            />
          </div>

          <select
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value);
              setDistrictFilter("");
              setMarketFilter("");
            }}
            className="bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-emerald-100 px-4 py-3 outline-none font-semibold"
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
            onChange={(e) => {
              setDistrictFilter(e.target.value);
              setMarketFilter("");
            }}
            className="bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-emerald-100 px-4 py-3 outline-none font-semibold"
          >
            <option value="">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={marketFilter}
            onChange={(e) => setMarketFilter(e.target.value)}
            className="bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-emerald-100 px-4 py-3 outline-none md:col-span-4 font-semibold"
          >
            <option value="">All Markets (Mandi)</option>
            {markets.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-emerald-950 font-black text-lg">
            Showing {filteredRecords.length} records
          </div>

          {loading && (
            <div className="text-sm font-bold text-emerald-700">
              {loadingMsg || "Loading..."}
            </div>
          )}
          {error && <div className="text-sm font-bold text-red-600">{error}</div>}
        </div>

        {/* Cards */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            filteredRecords.slice(0, 300).map((r, idx) => {
              const emoji = getEmoji(r.commodity);

              const minQ = r.min_price ? `₹${r.min_price}/q` : "—";
              const modalQ = r.modal_price ? `₹${r.modal_price}/q` : "—";
              const maxQ = r.max_price ? `₹${r.max_price}/q` : "—";

              const minKg = toPerKg(r.min_price);
              const modalKg = toPerKg(r.modal_price);
              const maxKg = toPerKg(r.max_price);

              return (
                <div
                  key={idx}
                  className="rounded-[32px] border border-emerald-200 bg-white/75 backdrop-blur shadow-sm hover:shadow-xl transition overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-2xl shadow-sm">
                          {emoji}
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-emerald-950 leading-tight">
                            {r.commodity || "Commodity"}
                          </h3>
                          <p className="text-sm text-emerald-700 font-semibold">
                            {r.__noData ? "No mandi data today" : r.variety || "—"}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-black text-emerald-800 bg-white/80 backdrop-blur border border-emerald-100 px-3 py-1 rounded-full">
                        {r.arrival_date || "—"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                      <div className="rounded-2xl bg-white/80 backdrop-blur border border-emerald-100 p-3 shadow-sm">
                        <div className="text-xs font-black text-emerald-700">MIN</div>
                        <div className="text-base font-black text-emerald-950">
                          {minQ}
                        </div>
                        <div className="text-xs font-bold text-emerald-700 mt-1">
                          {minKg}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-lime-600 text-white p-3 shadow-lg">
                        <div className="text-xs font-black opacity-95">MODAL</div>
                        <div className="text-base font-black">{modalQ}</div>
                        <div className="text-xs font-bold opacity-95 mt-1">{modalKg}</div>
                      </div>

                      <div className="rounded-2xl bg-white/80 backdrop-blur border border-emerald-100 p-3 shadow-sm">
                        <div className="text-xs font-black text-emerald-700">MAX</div>
                        <div className="text-base font-black text-emerald-950">
                          {maxQ}
                        </div>
                        <div className="text-xs font-bold text-emerald-700 mt-1">
                          {maxKg}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => openStore(r.market)}
                      className="mt-4 w-full flex items-center gap-2 text-sm text-emerald-900 font-black border border-emerald-100 bg-white/70 backdrop-blur rounded-2xl px-4 py-3 hover:bg-emerald-50 transition shadow-sm"
                      title="View dealer details"
                    >
                      <MapPin size={16} className="text-emerald-700" />
                      <span className="font-black">{r.market || "—"}</span>
                      <span className="opacity-70">
                        • {r.district || "—"}, {r.state || "—"}
                      </span>
                    </button>
                  </div>

                  <div className="h-1 bg-gradient-to-r from-emerald-400 via-lime-400 to-teal-400" />
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* ✅ STORE DETAILS MODAL */}
      {storeOpen && storeDetails && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-[32px] bg-white/85 backdrop-blur border border-emerald-100 shadow-2xl overflow-hidden">
            <div className="p-6 flex items-start justify-between gap-4 border-b border-emerald-100">
              <div>
                <div className="text-xl font-black text-emerald-950">
                  Dealer / Market Details
                </div>
              </div>
              <button
                onClick={() => setStoreOpen(false)}
                className="p-2 rounded-2xl hover:bg-emerald-50 transition"
              >
                <X className="text-emerald-700" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="font-black text-emerald-950 text-lg">
                  {storeDetails.storeName}
                </div>
                <div className="text-emerald-800 text-sm font-semibold">
                  {storeDetails.address}
                </div>
                <div className="text-emerald-800 text-sm mt-2 font-semibold">
                  ⭐ Rating: <b>{storeDetails.rating}</b> / 5
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-emerald-100 p-4 bg-white">
                  <div className="text-xs font-black text-emerald-700">Phone</div>
                  <div className="text-emerald-950 font-black">
                    {storeDetails.phone}
                  </div>
                </div>
                <div className="rounded-2xl border border-emerald-100 p-4 bg-white">
                  <div className="text-xs font-black text-emerald-700">WhatsApp</div>
                  <div className="text-emerald-950 font-black">
                    {storeDetails.whatsapp}
                  </div>
                </div>
                <div className="rounded-2xl border border-emerald-100 p-4 sm:col-span-2 bg-white">
                  <div className="text-xs font-black text-emerald-700">
                    Working Time
                  </div>
                  <div className="text-emerald-950 font-black">
                    {storeDetails.timing}
                  </div>
                </div>
              </div>

              <a
                href={googleMapUrl(storeDetails.market)}
                target="_blank"
                rel="noreferrer"
                className="block text-center px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-lime-600 text-white font-black shadow-lg hover:opacity-95 transition"
              >
                Open in Google Maps
              </a>

              <button
                onClick={() => setStoreOpen(false)}
                className="w-full px-5 py-3 rounded-2xl border border-emerald-200 bg-white text-emerald-950 font-black hover:bg-emerald-50 transition"
              >
                Close
              </button>
            </div>

            <div className="h-1 bg-gradient-to-r from-emerald-400 via-lime-400 to-teal-400" />
          </div>
        </div>
      )}
    </div>
  );
}
