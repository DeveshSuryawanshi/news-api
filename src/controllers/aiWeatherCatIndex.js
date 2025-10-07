import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Function to predict Weather/Cat Index from a news article
 * @param {Object} news - News object { title, content, city, date, source }
 * @returns {Object} - JSON with impact factors and Weather/Cat Index
 */
export const predictWeatherCatIndex = async (news) => {
  const prompt = `
You are an AI model that predicts regional flood risk and calculates a Weather/Cat Index from news articles. 

Analyze the news article below and automatically extract numeric impact factors. Produce ONLY JSON (no markdown) in this format:

{
  "title": "<news title>",
  "city": "<city/state>",
  "date": "<date>",
  "source": "<news source>",
  "reliability_score": <0-1>,
  "impact_factors": {
    "rainfall_intensity": <0-100>,
    "storm_surge": <0-100>,
    "river_discharge": <0-100>,
    "ground_saturation": <0-100>,
    "infrastructure_condition": <0-100>,
    "response_efficiency": <0-100>,
    "evacuation_alert": <0-100>
  },
  "weatherCatIndex": <0-100>
}

Use these weights to calculate weatherCatIndex:
rainfall 0.3, storm surge 0.25, river discharge 0.2, ground saturation 0.15, infrastructure inverse 0.1, response inverse 0.1, evacuation alert 0.1.

News Article:
"""
Title: ${news.title}
Content: ${news.content}
City: ${news.city}
Date: ${news.date}
Source: ${news.source}
"""
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    let jsonText = response.choices[0].message.content;

    // CLEAN UP markdown formatting
    jsonText = jsonText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error predicting Weather/Cat Index:", error);
    return null;
  }
};

// Example usage
(async () => {
  const newsExample = {
    title: "Heavy rain floods Miami streets",
    content:
      "Miami received over 5 inches of rain in 6 hours, causing streets to flood and some evacuations. Local infrastructure struggled to handle the water.",
    city: "Miami",
    date: "2025-10-09",
    source: "Miami Herald",
  };

  const result = await predictWeatherCatIndex(newsExample);
  return result;
  // console.log(JSON.stringify(result, null, 2));
})();
