import axios from "axios";
import MandiCache from "../models/MandiCache.js";

const AGMARKNET_RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const BASE_URL = `https://api.data.gov.in/resource/${AGMARKNET_RESOURCE_ID}`;

const PAGE_SIZE = 5000;
const MAX_PAGES = 25;

// ✅ Fetch (API key read at runtime)
async function fetchAllIndiaData() {
  const DATA_GOV_API_KEY = process.env.DATA_GOV_API_KEY;

  if (!DATA_GOV_API_KEY) {
    throw new Error("DATA_GOV_API_KEY missing in .env");
  }

  let all = [];
  let offset = 0;
  let page = 0;

  while (page < MAX_PAGES) {
    page++;

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

  return all;
}

// ✅ Auto refresh scheduler
export function startMandiCron() {
  console.log("⏳ Mandi Cron Started: Refresh every 30 minutes");

  const run = async () => {
    try {
      console.log("🔄 Refreshing mandi cache...");

      const records = await fetchAllIndiaData();

      await MandiCache.findOneAndUpdate(
        { key: "latest" },
        { records, updatedAt: new Date() },
        { upsert: true }
      );

      console.log("✅ Mandi cache updated:", records.length);
    } catch (e) {
      console.log("❌ Cron error:", e.message);
    }
  };

  run();
  setInterval(run, 30 * 60 * 1000);
}
