import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserPlus, User, Mail, Lock } from "lucide-react";
import { API } from "../config/api"; // ✅ IMPORTANT

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/auth/signup`, {
        username,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-3xl border border-emerald-100 bg-white/70 backdrop-blur shadow-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center">
            <UserPlus className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-emerald-900">Sign Up</h1>
            <p className="text-emerald-700">Create your AgriPrice account</p>
          </div>
        </div>

        {msg && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {msg}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/60 px-12 py-4 text-emerald-900 placeholder-emerald-500 outline-none focus:ring-4 focus:ring-emerald-100"
              placeholder="Username"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/60 px-12 py-4 text-emerald-900 placeholder-emerald-500 outline-none focus:ring-4 focus:ring-emerald-100"
              placeholder="Email"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
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
            className="w-full rounded-2xl bg-emerald-600 py-4 text-white font-bold text-lg shadow-lg hover:bg-emerald-700 active:scale-[0.99] transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center font-semibold text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-700 hover:text-emerald-900 underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
