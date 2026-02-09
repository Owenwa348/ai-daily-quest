import { GoogleGenAI } from "@google/genai";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("❌ GOOGLE_API_KEY missing");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function generateDailyQuests() {
  const prompt = `
Generate 3 daily RPG quests.

Return ONLY raw JSON array.

Schema:

[
 {
  "type":"study|health|coding",
  "difficulty":1-3,
  "base_exp":number,
  "description":"string"
 }
]

No markdown.
No explanation.
`;

  const result = await ai.models.generateContent({
    model: "models/gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  const text =
    result.candidates?.[0]?.content?.parts?.[0]?.text || "";

  console.log("RAW AI:", text);

  return JSON.parse(text);
}
console.log("KEY:", process.env.GOOGLE_API_KEY);