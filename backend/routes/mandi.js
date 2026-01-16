import express from "express";
import axios from "axios";
import MandiCache from "../models/MandiCache.js";

const router = express.Router();

const DATA_GOV_API_KEY = process.env.DATA_GOV_API_KEY;
const AGMARKNET_RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";

const BASE_URL = `https://api.data.gov.in/resource/${AGMARKNET_RESOURCE_ID}`;

const PAGE_SIZE = 5000;
const MAX_PAGES = 25; // ✅ can go 25 -> 125k max

// ✅ function to fetch ALL INDIA
async function fetchAllIndiaData() {
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

// ✅ Update cache manually or auto
router.get("/refresh", async (req, res) => {
  try {
    const records = await fetchAllIndiaData();

    const cache = await MandiCache.findOneAndUpdate(
      { key: "latest" },
      { records, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({
      message: "✅ Cache refreshed",
      total: cache.records.length,
      updatedAt: cache.updatedAt,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to refresh cache", error: err.message });
  }
});

// ✅ FRONTEND uses this endpoint
router.get("/latest", async (req, res) => {
  try {
    let cache = await MandiCache.findOne({ key: "latest" });

    // ✅ If cache missing, fetch once
    if (!cache || !cache.records?.length) {
      const records = await fetchAllIndiaData();
      cache = await MandiCache.create({
        key: "latest",
        records,
        updatedAt: new Date(),
      });
    }

    res.json({
      updatedAt: cache.updatedAt,
      total: cache.records.length,
      records: cache.records,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get cached data", error: err.message });
  }
});

export default router;
