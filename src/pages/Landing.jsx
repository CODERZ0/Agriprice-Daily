import { Link } from "react-router-dom";
import {
  Bell,
  BarChart3,
  Store,
  ShieldCheck,
  MessageCircle,
  ShoppingBag,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

/** ✅ Animated crop emoji background */
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
    { emoji: "🫚", x: "55%", y: "12%", s: 26, d: 0.25 },
    { emoji: "🧄", x: "35%", y: "25%", s: 26, d: 0.45 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* soft gradient blobs */}
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-lime-200/40 blur-3xl" />
      <div className="absolute top-40 right-20 w-[380px] h-[380px] rounded-full bg-teal-200/30 blur-3xl" />

      {/* floating emojis */}
      {items.map((i, idx) => (
        <span
          key={idx}
          className="absolute opacity-25 select-none"
          style={{
            left: i.x,
            top: i.y,
            fontSize: i.s,
            animation: `floaty 6s ease-in-out infinite`,
            animationDelay: `${i.d}s`,
          }}
        >
          {i.emoji}
        </span>
      ))}

      <style>{`
        @keyframes floaty {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(6deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}

function Badge({ icon, text }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-emerald-200 bg-white/70 backdrop-blur font-bold text-emerald-900 shadow-sm">
      <span className="text-emerald-700">{icon}</span>
      <span className="text-sm">{text}</span>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="group rounded-3xl border border-emerald-200 bg-white/70 backdrop-blur shadow-sm hover:shadow-xl transition overflow-hidden">
      <div className="p-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-500 shadow flex items-center justify-center">
          {icon}
        </div>
        <div className="mt-4 text-xl font-black text-emerald-950">{title}</div>
        <div className="mt-2 text-sm font-semibold text-emerald-800/90 leading-relaxed">
          {desc}
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-lime-400 to-teal-400 opacity-70 group-hover:opacity-100 transition" />
    </div>
  );
}

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50">
      <CropBackground />

      {/* ✅ TOP NAV */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-emerald-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="AgriPrice Daily"
              className="w-12 h-12 rounded-2xl border border-emerald-100 object-cover bg-white"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div>
              <div className="text-xl font-extrabold text-emerald-950 flex items-center gap-2">
                AgriPrice Daily <Sparkles className="text-emerald-600" size={18} />
              </div>
              <div className="text-sm text-emerald-700 font-semibold">
                Live mandi prices • Alerts • Marketplace
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-lime-600 text-white font-black shadow hover:opacity-95 active:scale-[0.99] transition flex items-center gap-2"
            >
              Login <ArrowRight size={18} />
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 rounded-2xl border border-emerald-300 bg-white/70 backdrop-blur text-emerald-950 font-black shadow-sm hover:bg-emerald-50 active:scale-[0.99] transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* ✅ HERO */}
      <section className="relative max-w-6xl mx-auto px-6 pt-14 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <div>
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge icon={<CheckCircle2 size={18} />} text="Govt Agmarknet API Data" />
              <Badge icon={<Bell size={18} />} text="Smart Price Alerts" />
              <Badge icon={<ShoppingBag size={18} />} text="Buy & Sell Marketplace" />
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-emerald-950 leading-tight drop-shadow-sm">
              Track <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-lime-600">Mandi Prices</span>
              <br />
              get smart
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                market alerts
              </span>
              
            </h1>

            <p className="mt-6 text-lg text-emerald-900/90 leading-relaxed max-w-xl font-semibold">
              Monitor vegetables, grains & spices all over India. Receive alerts for
              drops/high prices and connect directly with traders
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/login"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-lime-600 text-white font-black shadow-lg hover:opacity-95 active:scale-[0.99] transition flex items-center gap-2"
              >
                Start Now <ArrowRight size={18} />

                
              </Link>
            </div>

            <div className="mt-10 text-sm font-black text-emerald-700">
              ↓ Scroll down to explore Marketplace features
            </div>
          </div>

          {/* Right highlight panel */}
          <div className="rounded-[32px] bg-white/75 backdrop-blur border border-emerald-200 shadow-xl overflow-hidden">
            <div className="p-7">
              <div className="text-2xl font-black text-emerald-950">
                Everything you need in one app
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4">
                <FeatureRow
                  icon={<BarChart3 className="text-white" size={20} />}
                  title="Live Mandi Prices"
                  desc="Daily updated India-wide commodity data."
                />
                <FeatureRow
                  icon={<Bell className="text-white" size={20} />}
                  title="Price Alerts"
                  desc="Auto alerts for sudden drop & peaks."
                />
                <FeatureRow
                  icon={<Store className="text-white" size={20} />}
                  title="Dealer Requests"
                  desc="Post your request and contact dealers."
                />
                <FeatureRow
                  icon={<ShieldCheck className="text-white" size={20} />}
                  title="Secure Login"
                  desc="Login to manage alerts, profile and trades."
                />
              </div>
            </div>

            <div className="h-2 bg-gradient-to-r from-emerald-500 via-lime-400 to-teal-400" />
          </div>
        </div>
      </section>

      {/* ✅ MARKETPLACE SECTION */}
      <section className="relative max-w-6xl mx-auto px-6 pb-16">
        <div className="rounded-[32px] bg-white/75 backdrop-blur border border-emerald-200 shadow-xl p-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-lime-500 shadow flex items-center justify-center">
              <ShoppingBag className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-emerald-950">Marketplace</h2>
              <p className="text-emerald-700 font-bold">
                Buy • Sell • Connect directly with traders
              </p>
            </div>
          </div>

          <p className="mt-6 text-emerald-900 leading-relaxed text-lg font-semibold">
            AgriPrice Marketplace helps farmers, small shop owners, brokers and big
            dealers trade easily. Post products, find buyers instantly and negotiate
            directly.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Store className="text-white" size={22} />}
              title="Post Your Products"
              desc="Upload product name, price, quantity, photos & location."
            />
            <FeatureCard
              icon={<MapPin className="text-white" size={22} />}
              title="Find Nearby Deals"
              desc="Filter deals by state, district, mandi and commodity."
            />
            <FeatureCard
              icon={<MessageCircle className="text-white" size={22} />}
              title="Chat Directly"
              desc="Confirm deals fast and safely."
            />
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/login"
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-lime-600 text-white font-black shadow hover:opacity-95 transition flex items-center gap-2"
            >
              Login to Access Marketplace <ArrowRight size={18} />
            </Link>

            <Link
              to="/signup"
              className="px-7 py-3 rounded-2xl border border-emerald-300 bg-white/70 backdrop-blur text-emerald-950 font-black shadow-sm hover:bg-emerald-50 transition"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>

      {/* ✅ FOOTER */}
      <footer className="py-10 text-center text-sm text-emerald-700/80 font-semibold">
        © {new Date().getFullYear()} AgriPrice Daily 
      </footer>
    </div>
  );
}

/* ---------- components ---------- */

function FeatureRow({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-3xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 shadow-sm">
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-lime-600 shadow flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="font-black text-emerald-950">{title}</div>
        <div className="text-sm text-emerald-700 font-semibold">{desc}</div>
      </div>
    </div>
  );
}
