require("dotenv").config({ path: __dirname + "/secrets.env" });
const express = require("express"), path = require("path");
const KEY = process.env.GEMINI_API_KEY, MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const app = express(); app.set("trust proxy", 1); app.use(express.json({ limit: "20kb" }));
const hits = new Map();
app.post("/api/chat", async (req, res) => {
  const ip = req.ip, now = Date.now(), a = (hits.get(ip) || []).filter(t => now - t < 60000);
  if (a.length >= 20) return res.status(429).json({ reply: "Too many requests. Please wait a minute." });
  a.push(now); hits.set(ip, a);
  if (!KEY || KEY.startsWith("PASTE")) return res.status(500).json({ reply: "The assistant is not set up yet. Add GEMINI_API_KEY to secrets.env." });
  try {
    const { system = "", messages = [] } = req.body;
    const contents = messages.slice(-8).map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: String(m.content).slice(0, 2000) }] }));
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: String(system).slice(0, 3000) }] }, contents, generationConfig: { maxOutputTokens: 400 } })
    });
    const j = await r.json();
    const t = (j.candidates?.[0]?.content?.parts || []).map(p => p.text).join("");
    if (!r.ok || !t) { console.error(JSON.stringify(j)); return res.status(502).json({ reply: "The AI service is unavailable right now." }); }
    res.json({ reply: t });
  } catch (e) { console.error(e); res.status(500).json({ reply: "Something went wrong. Please try again." }); }
});
app.use(express.static(path.join(__dirname, "public")));
const P = process.env.PORT || 3000;
app.listen(P, () => console.log("GreenCorridor AI running at http://localhost:" + P));
