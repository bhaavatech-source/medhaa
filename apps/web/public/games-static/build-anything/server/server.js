// server/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Missing GEMINI_API_KEY in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const app = express();
app.use(cors());
app.use(express.json());

// Load the real technology catalogue so Gemini only picks valid IDs.
function loadValidTechIds() {
  const raw = readFileSync(
    path.join(__dirname, "..", "data", "technologies.js"),
    "utf-8"
  );

  const ids = [...raw.matchAll(/\bid\s*:\s*["']([a-zA-Z0-9_-]+)["']/g)].map(
    (m) => m[1]
  );

  return [...new Set(ids)];
}

const VALID_TECH_IDS = loadValidTechIds();

app.get("/health", (req, res) => {
  res.json({ status: "ok", techCount: VALID_TECH_IDS.length });
});

app.post("/api/bhava", async (req, res) => {
  try {
    const { goal } = req.body;
    if (!goal || typeof goal !== "string" || !goal.trim()) {
      return res.status(400).json({ error: "Missing goal text" });
    }

    const prompt = `You are Bhava, a friendly AI helper for a kids' invention app.
A child wants to build: "${goal.trim()}"

Choose between 4 and 8 technology IDs ONLY from this exact list (no other IDs allowed):
${VALID_TECH_IDS.join(", ")}

Always include at least one or two structural/assembly items (like fasteners, chassisframe, steel, aluminum, wiringharness) so the invention feels physically complete and buildable, not just functional parts. Only include adhesives or lubricant if the goal clearly needs strong sealing or has fast-moving mechanical parts.

Reply with ONLY valid JSON, no markdown, no explanation, in this exact shape:
{"techIds": ["id1", "id2", "id3"], "message": "one short friendly sentence for a child"}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const cleaned = text.replace(/```json|```/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(502).json({ error: "Bhava response was not valid JSON" });
    }

    const safeIds = Array.isArray(parsed.techIds)
      ? parsed.techIds.filter((id) => VALID_TECH_IDS.includes(id))
      : [];

    if (safeIds.length === 0) {
      return res.status(502).json({ error: "No valid technology IDs returned" });
    }

    res.json({
      techIds: safeIds,
      message: typeof parsed.message === "string" ? parsed.message : "Here are some ideas!"
    });
  } catch (error) {
    console.error("Bhava AI error:", error.message);
    res.status(500).json({ error: "Bhava AI request failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bhava AI server running on http://localhost:${PORT}`);
});