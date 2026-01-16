// src/storeDetails.js

function hashCode(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0; // 32-bit
  }
  return Math.abs(h);
}

function pad(n, len = 5) {
  return String(n).padStart(len, "0");
}

/**
 * ✅ Generate UNIQUE demo store details for ANY market
 * Pass market + district + state
 */
export function getStoreDetails({ market = "", district = "", state = "" }) {
  const key = `${market}|${district}|${state}`;
  const h = hashCode(key);

  const storeNo = (h % 900) + 100; // 100-999
  const phoneMid = pad(h % 100000, 5);
  const phone = `+91 9${phoneMid}0${(h % 90) + 10}`; // demo
  const whatsapp = `+91 8${phoneMid}1${(h % 90) + 10}`; // demo

  const taglines = [
    "Wholesale Spices • Grocery",
    "Spice Powders • Bulk Supply",
    "Organic Spices • Retail",
    "Masala Powders • Wholesale",
    "Farm Fresh • Daily Rates",
  ];

  const highlightsList = [
    ["Wholesale & Retail", "Fresh stock daily", "Competitive rates"],
    ["Bulk orders available", "Fast dispatch", "Trusted quality"],
    ["Premium spice powders", "Best pricing", "Secure packaging"],
    ["Local + global spices", "Wholesale pricing", "Daily updated rates"],
    ["FSSAI style hygiene", "Bulk & small packs", "Delivery support"],
  ];

  const timingsList = [
    "8:00 AM – 8:00 PM",
    "9:00 AM – 9:00 PM",
    "8:30 AM – 7:30 PM",
    "10:00 AM – 9:30 PM",
  ];

  const idx = h % taglines.length;

  return {
    name: `${market} Spice Hub #${storeNo}`,
    tagline: taglines[idx],
    phone,
    whatsapp,
    address: `${market}, ${district}, ${state}, India`,
    timings: timingsList[h % timingsList.length],
    mapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${market}, ${district}, ${state}`
    )}`,
    highlights: highlightsList[idx],
  };
}
