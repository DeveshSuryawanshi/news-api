import fs from "fs";
import { predictWeatherCatIndex } from "./aiWeatherCatIndex.js";
import { calculateFLPremium } from "./calculateFLPremium.js";
const news = JSON.parse(
  fs.readFileSync("../news/src/dataset/data.json", "utf8")
);

export const getNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default page = 1
    const limit = 10; // 10 news per request

    const allNews = news.flood_news; // access flood_news array
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedNews = allNews.slice(startIndex, endIndex);

    res.json({
      currentPage: page,
      totalNews: allNews.length,
      totalPages: Math.ceil(allNews.length / limit),
      news: paginatedNews,
    });
  } catch (error) {
    console.error("Error in getNews:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
};

export const predictCatIndex = async (req, res) => {
  try {
    const result = await predictWeatherCatIndex(news.flood_news[0]);
    const weatherCatIndex = result?.weatherCatIndex || 0;
    const scaledIndex = weatherCatIndex / 10;
    // console.log("Weather/Cat Index:", (weatherCatIndex * 100) / 10000);
    console.log("Weather/Cat Index:", scaledIndex);
    const premium = calculateFLPremium(
      800000, // sumInsured (₹8 lakh)
      "commercial",
      "A",
      scaledIndex, // Regional Cat Trend Index (0-100 scaled to 0-1)
      false, // Sprinkler System
      "poor", // Fire Protection
      1, // Geopolitical Score
      1.0 // Inflation Index
    );
    res.json(premium);
  } catch (error) {
    console.error("Error in getNews:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
};
