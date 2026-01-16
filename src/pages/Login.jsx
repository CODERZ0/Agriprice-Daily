import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { User, Lock, LogIn } from "lucide-react";
import { API } from "../config/api";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // username OR email
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-3xl border border-emerald-100 bg-white/70 backdrop-blur shadow-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <img
            src="/logo.png"
            alt="AgriPrice Daily"
            className="w-14 h-14 rounded-2xl border border-emerald-100 object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div>
            <h1 className="text-3xl font-extrabold text-emerald-900">Login</h1>
            <p className="text-emerald-700">
              Secure access for Alerts & Marketplace
            </p>
          </div>
        </div>

        {msg && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {msg}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="relative">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"
              size={20}
            />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/60 px-12 py-4 text-emerald-900 placeholder-emerald-500 outline-none focus:ring-4 focus:ring-emerald-100"
              placeholder="Username or Email"
              required
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"
              size={20}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/60 px-12 py-4 text-emerald-900 placeholder-emerald-500 outline-none focus:ring-4 focus:ring-emerald-100"
              placeholder="Password"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-600 py-4 text-white font-bold text-lg shadow-lg hover:bg-emerald-700 active:scale-[0.99] transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm font-semibold">
          <Link to="/" className="text-emerald-700 hover:text-emerald-900">
            Back to Home
          </Link>
          <Link to="/signup" className="text-emerald-700 hover:text-emerald-900">
            Create Account →
          </Link>
        </div>
      </div>
    </div>
  );
}
