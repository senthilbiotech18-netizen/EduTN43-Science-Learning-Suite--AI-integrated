import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Google GenAI client if API key is present
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      })
    : null;

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", aiConfigured: !!ai });
  });

  app.post("/api/check-answer", async (req, res) => {
    try {
      const { prompt, strand, target, answer, history = [] } = req.body;

      if (!answer || typeof answer !== "string" || !answer.trim()) {
        return res.status(400).json({ error: "Answer text is required" });
      }

      if (!ai) {
        // Fallback local heuristic evaluator if GEMINI_API_KEY is not configured
        const localFeedback = generateFallbackFeedback(answer, target, prompt, history);
        return res.json(localFeedback);
      }

      const systemInstruction = `You are a supportive, sharp Science teacher giving real-time Socratic formative feedback to an IB MYP student practicing for an IB MYP Criterion A (Knowing and Understanding) task on science concepts.

CRITICAL INSTRUCTIONS FOR SOCRATIC SCAFFOLDING:
1. NEVER state the full direct answer verbatim. Your goal is strictly to SCAFFOLD the student's thinking.
2. Guide the student step-by-step through follow-up questions until they reach the "extending" (EXCEEDING) level of understanding.
3. Depth levels:
   - "surface": isolated fact, restating prompt, or very minimal answer
   - "developing": partially correct or missing key scientific terms/reasons
   - "secure": clear and correct for the MYP grade level
   - "extending": outstanding, precise, uses accurate scientific terminology, connects causes to effects, or resolves all previous follow-up questions thoroughly.
4. If the student hasn't reached "extending" yet:
   - Point out what they did well.
   - Give a subtle hint/gap (never the answer).
   - Ask a focused follow-up question that prompts them to explain the "why", "how", or missing mechanism.
5. If the student's answer (considering previous conversation turns) demonstrates comprehensive, precise understanding, set depth="extending", exceedingAchieved=true, praise them for attaining the Exceeding level, and set gap=null and followUp=null.`;

      // Build context including history
      let historyFormatted = "";
      if (Array.isArray(history) && history.length > 0) {
        historyFormatted = "\n\nPrevious Conversation History on this slide:\n" +
          history.map((turn: any) => `${turn.sender === 'student' ? 'Student' : 'Teacher'}: "${turn.text}"`).join("\n");
      }

      const userContent = `Question (Strand ${strand}): ${prompt}
Target Criteria / Concept: ${target}${historyFormatted}

Latest Student Response: "${answer.trim()}"

Evaluate the student's progress and return the JSON feedback object.`;

      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: userContent,
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                depth: {
                  type: Type.STRING,
                  description: "Must be 'surface', 'developing', 'secure', or 'extending'",
                },
                misconception: {
                  type: Type.BOOLEAN,
                  description: "True if student exhibits a scientific misconception",
                },
                praise: {
                  type: Type.STRING,
                  description: "One or two short specific encouraging sentences",
                },
                gap: {
                  type: Type.STRING,
                  description: "A hint about what key idea is missing (never give away full answer), or null if exceeding",
                },
                followUp: {
                  type: Type.STRING,
                  description: "A focused follow-up question asking the student to elaborate or clarify, or null if exceeding",
                },
                exceedingAchieved: {
                  type: Type.BOOLEAN,
                  description: "Set to true if student has attained the Exceeding (extending) level",
                },
              },
              required: ["depth", "misconception", "praise", "gap", "followUp", "exceedingAchieved"],
            },
          },
        });
      } catch (geminiError: any) {
        console.warn("Gemini API call unavailable or quota limited, providing Socratic Scribe local evaluation:", geminiError?.message || geminiError);
        const fallback = generateFallbackFeedback(req.body.answer || "", req.body.target || "", req.body.prompt || "", req.body.history || []);
        return res.json(fallback);
      }

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response from AI model");
      }

      const parsed = JSON.parse(responseText.trim());
      const isExceeding = parsed.exceedingAchieved || parsed.depth === "extending";

      return res.json({
        depth: parsed.depth || "developing",
        misconception: !!parsed.misconception,
        praise: parsed.praise || "Good attempt at explaining this cell concept!",
        gap: isExceeding ? null : (parsed.gap || null),
        followUp: isExceeding ? null : (parsed.followUp || null),
        exceedingAchieved: isExceeding,
      });
    } catch (err: any) {
      console.warn("Error processing check-answer request, using fallback evaluator:", err?.message || err);
      // Fallback response on error
      const fallback = generateFallbackFeedback(req.body.answer || "", req.body.target || "", req.body.prompt || "", req.body.history || []);
      return res.json(fallback);
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cell Explorer server running on http://localhost:${PORT}`);
  });
}

function generateFallbackFeedback(answer: string, target: string, prompt: string, history: any[] = []) {
  const lowerAns = answer.toLowerCase();
  const lowerTarget = target.toLowerCase();

  // Basic keyword match count
  const keywords = lowerTarget.split(/[\s,.;()]+/).filter((w) => w.length > 4);
  const matched = keywords.filter((kw) => lowerAns.includes(kw));

  let depth: 'surface' | 'developing' | 'secure' | 'extending' = 'developing';
  let misconception = false;

  const turnCount = Array.isArray(history) ? history.length : 0;

  if (turnCount >= 2 || (matched.length >= 3 && answer.length > 80)) {
    depth = 'extending';
  } else if (matched.length >= 2 || answer.length > 40) {
    depth = 'secure';
  } else if (answer.length < 20) {
    depth = 'surface';
  }

  if (lowerAns.includes('creates energy') || lowerAns.includes('makes energy')) {
    misconception = true;
  }

  const isExceeding = depth === 'extending';

  return {
    depth,
    misconception,
    praise: isExceeding
      ? "🌟 Fantastic explanation! You have clearly demonstrated the Exceeding level of mastery for this organelle concept."
      : matched.length > 0
      ? "You identified key biological ideas in your response!"
      : "Good effort attempting this science question.",
    gap: isExceeding ? null : "Consider linking the organelle's structure directly to its specific biological function.",
    followUp: isExceeding
      ? null
      : misconception
      ? "Remember: do mitochondria 'create' energy out of nothing, or do they release it from glucose through respiration?"
      : "Can you explain step-by-step how this process specifically benefits the organism as a whole?",
    exceedingAchieved: isExceeding,
  };
}

startServer();
