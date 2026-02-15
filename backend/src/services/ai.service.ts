import { GoogleGenAI } from "@google/genai"

const USE_MOCK = true // 🔥 DEV MODE (เปลี่ยนเป็น false ตอน production)

let ai: GoogleGenAI | null = null

if (!USE_MOCK) {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("❌ GOOGLE_API_KEY missing")
  }

  ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
  })
}

export async function generateDailyQuests() {

  // =====================
  // MOCK MODE
  // =====================
  if (USE_MOCK) {
    console.log("🧪 Using MOCK quests")

    return [
      {
        type: "health",
        difficulty: 1,
        base_exp: 100,
        description: "Drink 2L water"
      },
      {
        type: "focus",
        difficulty: 2,
        base_exp: 200,
        description: "Deep work 30 minutes"
      },
      {
        type: "fitness",
        difficulty: 2,
        base_exp: 250,
        description: "Walk 3000 steps"
      }
    ]
  }

  // =====================
  // REAL AI MODE
  // =====================

  try {
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
`

    const result = await ai!.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    })

    const text =
      result.candidates?.[0]?.content?.parts?.[0]?.text || ""

    console.log("RAW AI:", text)

    return JSON.parse(text)

  } catch (e) {
    console.error("❌ AI failed, fallback mock")

    return [
      {
        type: "health",
        difficulty: 1,
        base_exp: 100,
        description: "Stretch 10 minutes"
      }
    ]
  }
}
