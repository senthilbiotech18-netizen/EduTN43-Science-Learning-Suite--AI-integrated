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
      const { prompt, strand, target, answer, history = [], level = "MYP 2 & 3" } = req.body;

      if (!answer || typeof answer !== "string" || !answer.trim()) {
        return res.status(400).json({ error: "Answer text is required" });
      }

      const studentTurns = (Array.isArray(history) ? history.filter((t: any) => t.sender === 'student').length : 0) + 1;
      const followUpCount = studentTurns - 1; // 0 for initial answer, 1 for 1st followup, etc.
      const isLowerGrade = !level || level.includes("PYP") || level.includes("MYP 1") || level.includes("MYP 2") || level.includes("MYP 3") || level.includes("Grade 6") || level.includes("Grade 7") || level.includes("Grade 8");

      if (!ai) {
        // Fallback local heuristic evaluator if GEMINI_API_KEY is not configured
        const localFeedback = generateFallbackFeedback(answer, target, prompt, history, level);
        return res.json(localFeedback);
      }

      const systemInstruction = `You are a warm, supportive, and encouraging Science teacher giving real-time Socratic formative feedback to a student (${level}) practicing for IB MYP Criterion A (Knowing and Understanding).

CRITICAL INSTRUCTIONS FOR LOWER GRADES / ACCESSIBILITY MODE (${isLowerGrade ? "ACTIVE LOWER GRADE MODE: MAX 5 FOLLOW-UPS" : "STANDARD MODE"}):
1. KEEP ALL LANGUAGE SIMPLE, SHORT, CLEAR, AND VERY EASY TO UNDERSTAND.
2. IF THE STUDENT'S ANSWER IS WRONG, INCOMPLETE, OR CONFUSED:
   - DO NOT overwhelm or frustrate them with complex probing questions!
   - GENTLY RECTIFY THEIR ANSWER IN SIMPLE WORDS FIRST in the "gap" field (e.g. "Good effort! Remember: [simple 1-sentence explanation of the correct concept].").
   - Ask a very simple, direct, single-step question in "followUp" to help them easily confirm understanding.
3. FOLLOW-UP LIMIT RULES:
   ${isLowerGrade ? `- This is follow-up #${followUpCount} of a MAXIMUM 5 follow-ups on this slide.
   - IF THIS IS FOLLOW-UP #5 (OR IF THEY REACHED UNDERSTANDING): Set depth="extending", exceedingAchieved=true, followUp=null, gap=null, and praise them warmly for completing the 5 follow-up questions on this slide!` : `- Guide the student step-by-step through follow-up questions until they reach "extending" (EXCEEDING) understanding.`}
4. Depth levels:
   - "surface": isolated fact, restating prompt, or very minimal answer
   - "developing": partially correct or missing key scientific terms/reasons
   - "secure": clear and correct for the grade level
   - "extending": outstanding, precise, uses accurate scientific terminology, connects causes to effects, or resolves all previous follow-up questions thoroughly.`;

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
                  description: "A gentle hint or simple 1-sentence rectification of the key concept if needed, or null if exceeding",
                },
                followUp: {
                  type: Type.STRING,
                  description: "A simple focused follow-up question asking the student to elaborate, or null if exceeding/max 5 follow-ups reached",
                },
                exceedingAchieved: {
                  type: Type.BOOLEAN,
                  description: "Set to true if student has attained Exceeding level or reached max 5 follow-ups for lower grade",
                },
              },
              required: ["depth", "misconception", "praise", "gap", "followUp", "exceedingAchieved"],
            },
          },
        });
      } catch (geminiError: any) {
        console.warn("Gemini API call unavailable or quota limited, providing Socratic Scribe local evaluation:", geminiError?.message || geminiError);
        const fallback = generateFallbackFeedback(req.body.answer || "", req.body.target || "", req.body.prompt || "", req.body.history || [], level);
        return res.json(fallback);
      }

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response from AI model");
      }

      const parsed = JSON.parse(responseText.trim());

      // Post-processing rule: Enforce max 5 follow-ups for lower grades
      if (isLowerGrade && followUpCount >= 4) {
        parsed.depth = "extending";
        parsed.exceedingAchieved = true;
        parsed.gap = null;
        parsed.followUp = null;
        if (!parsed.praise.includes("5")) {
          parsed.praise = (parsed.praise ? parsed.praise + " " : "") + "🎉 Fantastic work! You've completed all 5 follow-up questions for this slide. Click 'Finish Slide & Move to Next' to continue!";
        }
      }

      const isExceeding = parsed.exceedingAchieved || parsed.depth === "extending";

      return res.json({
        depth: parsed.depth || "developing",
        misconception: !!parsed.misconception,
        praise: parsed.praise || "Good attempt at explaining this science concept!",
        gap: isExceeding ? null : (parsed.gap || null),
        followUp: isExceeding ? null : (parsed.followUp || null),
        exceedingAchieved: isExceeding,
      });
    } catch (err: any) {
      console.warn("Error processing check-answer request, using fallback evaluator:", err?.message || err);
      // Fallback response on error
      const fallback = generateFallbackFeedback(req.body.answer || "", req.body.target || "", req.body.prompt || "", req.body.history || [], req.body.level || "MYP 2 & 3");
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

function generateFallbackFeedback(answer: string, target: string, prompt: string, history: any[] = [], level: string = "MYP 2 & 3") {
  const lowerAns = answer.toLowerCase();
  const lowerTarget = target.toLowerCase();

  const studentTurns = (Array.isArray(history) ? history.filter((t: any) => t.sender === 'student').length : 0) + 1;
  const followUpCount = studentTurns - 1;
  const isLowerGrade = !level || level.includes("PYP") || level.includes("MYP 1") || level.includes("MYP 2") || level.includes("MYP 3") || level.includes("Grade 6") || level.includes("Grade 7") || level.includes("Grade 8");

  if (isLowerGrade && followUpCount >= 4) {
    return {
      depth: 'extending',
      misconception: false,
      praise: '🎉 Excellent perseverance! You have completed all 5 follow-up questions for this slide. Great job practicing Criterion A!',
      gap: null,
      followUp: null,
      exceedingAchieved: true,
    };
  }

  // Basic keyword match count
  const keywords = lowerTarget.split(/[\s,.;()]+/).filter((w) => w.length > 4);
  const matched = keywords.filter((kw) => lowerAns.includes(kw));

  let depth: 'surface' | 'developing' | 'secure' | 'extending' = 'developing';
  let misconception = false;

  if (followUpCount >= 3 || (matched.length >= 3 && answer.length > 60)) {
    depth = 'extending';
  } else if (matched.length >= 2 || answer.length > 35) {
    depth = 'secure';
  } else if (answer.length < 15) {
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
      ? "🌟 Fantastic explanation! You have clearly demonstrated the Exceeding level of mastery for this concept."
      : matched.length > 0
      ? "You identified key science ideas in your response!"
      : "Good effort attempting this science question.",
    gap: isExceeding ? null : (isLowerGrade ? `💡 Key Concept Reminder: "${target}"` : "Consider linking the structure directly to its specific function."),
    followUp: isExceeding
      ? null
      : misconception
      ? "Remember: do cell structures 'create' energy out of nothing, or do they release or transform it?"
      : "Can you explain the main job of this structure in simple words?",
    exceedingAchieved: isExceeding,
  };
}

startServer();
