import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ImagePlus,
  IndianRupee,
  MapPin,
  PhoneCall,
  Tag,
  Upload,
  Save,
  ClipboardList,
} from "lucide-react";

/* ✅ base64 converter */
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/* ------------------ ✅ Animated Crop Background (same as Marketplace) ------------------ */
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

export default function PostAd() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get("edit");

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [district, setDistrict] = useState("Kozhikode");
  const [phone, setPhone] = useState("");
  const [desc, setDesc] = useState("");
  const [qty, setQty] = useState("");
  const [location, setLocation] = useState("Local Market");
  const [images, setImages] = useState([]);

  const districts = useMemo(
    () => [
      "Kozhikode",
      "Malappuram",
      "Kannur",
      "Wayanad",
      "Palakkad",
      "Thrissur",
      "Ernakulam",
      "Trivandrum",
      "Kollam",
      "Kottayam",
      "Idukki",
      "Alappuzha",
      "Pathanamthitta",
      "Kasargod",
    ],
    []
  );

  // ✅ Load ad when editing
  useEffect(() => {
    if (!editId) return;

    const savedAds = JSON.parse(localStorage.getItem("ads") || "[]");
    const ad = savedAds.find((a) => a.id === editId);
    if (!ad) return;

    setTitle(ad.title || "");
    setPrice(ad.price || "");
    setDistrict(ad.district || "Kozhikode");
    setPhone(ad.phone || "");
    setDesc(ad.desc || "");
    setQty(ad.qty || "");
    setLocation(ad.location || "Local Market");
    setImages(ad.images || []);
  }, [editId]);

  // ✅ pick images (gallery)
  const handlePickImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const limited = files.slice(0, 5);
    const base64s = [];
    for (const f of limited) {
      const b64 = await toBase64(f);
      base64s.push(b64);
    }
    setImages((prev) => [...prev, ...base64s].slice(0, 5));
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // ✅ Create or Update
  const handleSave = () => {
    if (!title.trim()) return alert("Enter Ad Title");
    if (!price.trim()) return alert("Enter Price");
    if (!phone.trim()) return alert("Enter Phone number");
    if (images.length === 0) return alert("Please add at least 1 image");

    const savedAds = JSON.parse(localStorage.getItem("ads") || "[]");

    if (editId) {
      const updated = savedAds.map((a) =>
        a.id === editId
          ? {
              ...a,
              title,
              price,
              district,
              phone,
              desc,
              qty,
              location,
              images,
            }
          : a
      );

      localStorage.setItem("ads", JSON.stringify(updated));
      alert("✅ Ad updated successfully!");
      navigate("/marketplace");
      return;
    }

    const newAd = {
      id: "ad_" + Date.now(),
      title,
      price,
      district,
      phone,
      desc,
      qty,
      location,
      images,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("ads", JSON.stringify([newAd, ...savedAds]));
    alert("✅ Ad posted successfully!");
    navigate("/marketplace");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50">
      <CropBackground />

      <div className="relative max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl border border-emerald-200 bg-white font-black text-emerald-900 hover:bg-emerald-50 transition flex items-center gap-2 shadow-sm"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <div className="text-2xl md:text-3xl font-black text-emerald-950 flex items-center gap-2">
            {editId ? (
              <>
                <Save size={24} className="text-emerald-700" />
                Edit Your Ad
              </>
            ) : (
              <>
                <Upload size={24} className="text-emerald-700" />
                Post New Ad
              </>
            )}
            <span className="text-lime-600">✧</span>
          </div>

          <button
            onClick={() => navigate("/marketplace")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-lime-500 text-white font-black shadow hover:opacity-95 transition"
          >
            Go Marketplace
          </button>
        </div>

        {/* Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT FORM */}
          <div className="rounded-[28px] bg-white/90 border border-emerald-100 shadow-lg p-6">
            <div className="font-black text-emerald-950 text-lg mb-4 flex items-center gap-2">
              <ClipboardList size={18} className="text-emerald-700" />
              Ad Details
            </div>

            {/* Title */}
            <label className="text-sm font-black text-emerald-800 flex items-center gap-2">
              <Tag size={16} /> Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Eg: Fresh Tomato 10kg"
              className="w-full mt-2 mb-4 px-4 py-3 rounded-2xl border border-emerald-200 outline-none font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-300 bg-white"
            />

            {/* Price */}
            <label className="text-sm font-black text-emerald-800 flex items-center gap-2">
              <IndianRupee size={16} /> Price
            </label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Eg: 450"
              type="number"
              className="w-full mt-2 mb-4 px-4 py-3 rounded-2xl border border-emerald-200 outline-none font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-300 bg-white"
            />

            {/* Qty */}
            <label className="text-sm font-black text-emerald-800">
              Stock / Quantity
            </label>
            <input
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="Eg: 200 kg available"
              className="w-full mt-2 mb-4 px-4 py-3 rounded-2xl border border-emerald-200 outline-none font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-300 bg-white"
            />

            {/* District */}
            <label className="text-sm font-black text-emerald-800 flex items-center gap-2">
              <MapPin size={16} /> District
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full mt-2 mb-4 px-4 py-3 rounded-2xl border border-emerald-200 outline-none font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-300 bg-white"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Location */}
            <label className="text-sm font-black text-emerald-800">
              Location (optional)
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Eg: Feroke Market"
              className="w-full mt-2 mb-4 px-4 py-3 rounded-2xl border border-emerald-200 outline-none font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-300 bg-white"
            />

            {/* Phone */}
            <label className="text-sm font-black text-emerald-800 flex items-center gap-2">
              <PhoneCall size={16} /> Phone
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Eg: 9876543210"
              className="w-full mt-2 mb-4 px-4 py-3 rounded-2xl border border-emerald-200 outline-none font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-300 bg-white"
            />

            {/* Desc */}
            <label className="text-sm font-black text-emerald-800">
              Description (optional)
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Write something about your product..."
              rows={4}
              className="w-full mt-2 px-4 py-3 rounded-2xl border border-emerald-200 outline-none font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-300 bg-white"
            />
          </div>

          {/* RIGHT IMAGES */}
          <div className="rounded-[28px] bg-white/90 border border-emerald-100 shadow-lg p-6">
            <div className="font-black text-emerald-950 text-lg mb-4 flex items-center gap-2">
              <ImagePlus size={18} className="text-emerald-700" />
              Upload Images (Gallery)
            </div>

            {/* Upload box */}
            <label className="cursor-pointer flex flex-col items-center justify-center gap-2 px-4 py-8 rounded-[28px] border-2 border-dashed border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition font-black text-emerald-900 text-center">
              <ImagePlus size={28} />
              Click to Select Images
              <span className="text-xs font-bold text-emerald-700">
                Max 5 images Upload
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePickImages}
              />
            </label>

            {/* Preview grid */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img}
                    alt="preview"
                    className="h-32 w-full object-cover rounded-2xl border border-emerald-100 shadow-sm"
                  />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 px-2 py-1 text-xs rounded-xl bg-red-600 text-white font-black shadow"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              className="mt-6 w-full px-4 py-4 rounded-[28px] bg-gradient-to-r from-emerald-600 to-lime-500 text-white font-black text-lg shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2"
            >
              {editId ? <Save size={20} /> : <Upload size={20} />}
              {editId ? "Save Changes" : "Post Ad"}
            </button>

            <div className="mt-3 text-xs font-bold text-emerald-700">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
