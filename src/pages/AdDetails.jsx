import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function AdDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [ad, setAd] = useState(null);

  const fetchAd = async () => {
    const res = await axios.get(`http://localhost:5000/api/ads/${id}`);
    setAd(res.data.ad);
  };

  useEffect(() => {
    fetchAd();
    // eslint-disable-next-line
  }, []);

  const startChat = async () => {
    if (!token) return navigate("/login");

    const res = await axios.post(
      "http://localhost:5000/api/chat/start",
      { adId: id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    navigate(`/chat/${res.data.conversation._id}`);
  };

  if (!ad) return <div className="p-10 font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="rounded-3xl border bg-white overflow-hidden shadow-sm">
          <div className="h-72 bg-emerald-50 flex items-center justify-center">
            {ad.images?.[0] ? (
              <img src={ad.images[0]} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="text-emerald-700 font-bold">No Image</div>
            )}
          </div>

          <div className="p-6">
            <div className="text-2xl font-black text-emerald-900">{ad.title}</div>
            <div className="text-xl font-black text-emerald-700 mt-2">₹{ad.price}</div>
            <div className="mt-4 text-emerald-800">
              <b>Seller:</b> {ad.seller.username}
            </div>

            <div className="mt-2 text-emerald-800">
              <b>Location:</b> {ad.market} • {ad.district}, {ad.state}
            </div>

            <div className="mt-4 text-emerald-900">{ad.description}</div>

            <button
              onClick={startChat}
              className="mt-6 w-full px-6 py-3 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-700"
            >
              Chat with Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
