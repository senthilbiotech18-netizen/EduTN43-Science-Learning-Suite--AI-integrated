import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { checkBiologicalSpelling } from "./src/utils/bioSpellChecker";

dotenv.config();

async function startServer() {
  const app = express();
  // In development (AI Studio container), port 3000 is proxied by nginx.
  // In production (Cloud Run), Cloud Run passes PORT (usually 8080) and expects listening on 0.0.0.0:$PORT.
  const isDev = process.env.NODE_ENV !== "production" && !process.env.K_SERVICE;
  const PORT = process.env.PORT && !isDev
    ? parseInt(process.env.PORT, 10)
    : 3000;

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

  // Health check routes for Cloud Run / load balancers
  app.get(["/api/health", "/health", "/_health"], (_req, res) => {
    res.json({ status: "ok", aiConfigured: !!ai });
  });

  const CANDIDATE_MODELS = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];

  function getAiClient(req: express.Request): GoogleGenAI | null {
    const customKey = (req.headers["x-gemini-api-key"] as string) || req.body?.customApiKey;
    if (customKey && typeof customKey === "string" && customKey.trim().length > 0) {
      return new GoogleGenAI({
        apiKey: customKey.trim(),
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return ai;
  }

  async function callGeminiWithFallback(client: GoogleGenAI | null, reqFactory: (modelName: string) => Promise<any>) {
    if (!client) return null;
    let lastErr: any = null;
    for (const model of CANDIDATE_MODELS) {
      try {
        const res = await reqFactory(model);
        if (res && res.text) {
          return res;
        }
      } catch (err: any) {
        lastErr = err;
        const msg = String(err?.message || "");
        const status = err?.status || err?.code || err?.error?.code;
        const isUnavailable =
          status === 503 ||
          status === 429 ||
          msg.includes("503") ||
          msg.includes("429") ||
          msg.includes("demand") ||
          msg.includes("UNAVAILABLE") ||
          msg.includes("RESOURCE_EXHAUSTED");

        if (isUnavailable) {
          // Brief pause before trying next model candidate
          await new Promise((resolve) => setTimeout(resolve, 350));
          continue;
        }
        continue;
      }
    }
    throw lastErr;
  }

  app.post("/api/test-key", async (req, res) => {
    try {
      const client = getAiClient(req);
      if (!client) {
        return res.status(400).json({ valid: false, message: "No API key provided." });
      }
      const testRes = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: "Respond with the word 'Connected' if working.",
      });
      if (testRes && testRes.text) {
        return res.json({ valid: true, message: "Google Gemini API key connected successfully!" });
      }
      return res.status(400).json({ valid: false, message: "No response from Gemini API." });
    } catch (err: any) {
      return res.status(400).json({ valid: false, message: err?.message || "Invalid or restricted API key." });
    }
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

      const client = getAiClient(req);

      if (!client) {
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
   - "extending": outstanding, precise, uses accurate scientific terminology, connects causes to effects, or resolves all previous follow-up questions thoroughly.
5. BIOLOGICAL & SCIENTIFIC TERMINOLOGY SPELL CHECKING (CRITICAL MANDATE):
   - You MUST spot and identify ANY spelling errors, typos, or misspelled biological or scientific terms in the student's answer (e.g. 'mitocondria' -> 'mitochondria', 'chlorplast' -> 'chloroplast', 'citoplasm' -> 'cytoplasm', 'neucleus' -> 'nucleus', 'cromosome' -> 'chromosome', 'vacule' -> 'vacuole', 'ribosom' -> 'ribosome', 'photocynthesis' -> 'photosynthesis', 'resperaton' -> 'respiration', 'diffussion' -> 'diffusion', 'osmoses' -> 'osmosis', 'ensyme' -> 'enzyme', 'organell' -> 'organelle', 'membrance' -> 'membrane', 'prokaryot' -> 'prokaryote', 'eukariote' -> 'eukaryote', etc.).
   - Return every spotted biological spelling error in the 'spellingErrors' array with the student's exact misspelled word in 'original', the correct standard biological term in 'correction', and a brief supportive reminder or pronunciation tip in 'explanation'.
   - If there are no spelling errors in biological terminology, return an empty array [].`;

      let historyFormatted = "";
      if (Array.isArray(history) && history.length > 0) {
        historyFormatted = "\n\nPrevious Conversation History on this slide:\n" +
          history.map((turn: any) => `${turn.sender === 'student' ? 'Student' : 'Teacher'}: "${turn.text}"`).join("\n");
      }

      const userContent = `Question (Strand ${strand}): ${prompt}
Target Criteria / Concept: ${target}${historyFormatted}

Latest Student Response: "${answer.trim()}"

Evaluate the student's progress, spot any spelling errors in biological or scientific terminology, and return the JSON feedback object.`;

      let response;
      try {
        response = await callGeminiWithFallback(client, (modelName) =>
          client.models.generateContent({
            model: modelName,
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
                  spellingErrors: {
                    type: Type.ARRAY,
                    description: "List of spotted misspelled biological or scientific terms with their corrections",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        original: { type: Type.STRING, description: "The misspelled term as typed by the student" },
                        correction: { type: Type.STRING, description: "The correct standard biological spelling" },
                        explanation: { type: Type.STRING, description: "Helpful tip or reason for the correct spelling" },
                      },
                      required: ["original", "correction"],
                    },
                  },
                },
                required: ["depth", "misconception", "praise", "gap", "followUp", "exceedingAchieved"],
              },
            },
          })
        );
      } catch (geminiError: any) {
        console.log("[Info] Real-time AI evaluation using standard local Socratic Scribe engine.");
        const fallback = generateFallbackFeedback(req.body.answer || "", req.body.target || "", req.body.prompt || "", req.body.history || [], level);
        return res.json(fallback);
      }

      const responseText = response?.text;
      if (!responseText) {
        const fallback = generateFallbackFeedback(req.body.answer || "", req.body.target || "", req.body.prompt || "", req.body.history || [], level);
        return res.json(fallback);
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

      // Combine AI spotted spelling errors with high-precision local biological terminology detector
      const localSpelling = checkBiologicalSpelling(answer.trim());
      const mergedSpellingMap = new Map<string, { original: string; correction: string; explanation?: string }>();

      if (Array.isArray(parsed.spellingErrors)) {
        for (const item of parsed.spellingErrors) {
          if (item?.original && item?.correction) {
            mergedSpellingMap.set(item.original.toLowerCase(), {
              original: item.original,
              correction: item.correction,
              explanation: item.explanation,
            });
          }
        }
      }

      for (const item of localSpelling) {
        if (!mergedSpellingMap.has(item.original.toLowerCase())) {
          mergedSpellingMap.set(item.original.toLowerCase(), item);
        }
      }

      const finalSpellingErrors = Array.from(mergedSpellingMap.values());

      return res.json({
        depth: parsed.depth || "developing",
        misconception: !!parsed.misconception,
        praise: parsed.praise || "Good attempt at explaining this science concept!",
        gap: isExceeding ? null : (parsed.gap || null),
        followUp: isExceeding ? null : (parsed.followUp || null),
        exceedingAchieved: isExceeding,
        spellingErrors: finalSpellingErrors.length > 0 ? finalSpellingErrors : undefined,
      });
    } catch (err: any) {
      console.log("[Info] Check-answer handled via local Socratic evaluator.");
      const fallback = generateFallbackFeedback(req.body.answer || "", req.body.target || "", req.body.prompt || "", req.body.history || [], req.body.level || "MYP 2 & 3");
      return res.json(fallback);
    }
  });

  app.post("/api/generate-topic", async (req, res) => {
    try {
      const { topicTitle, level = "MYP 1–3 (Grade 6–8)", slideCount = 5 } = req.body;

      if (!topicTitle || typeof topicTitle !== "string" || !topicTitle.trim()) {
        return res.status(400).json({ error: "topicTitle is required" });
      }

      const count = Math.min(15, Math.max(3, parseInt(slideCount, 10) || 5));
      const isLowerGrade = !level || level.includes("PYP") || level.includes("MYP 1") || level.includes("MYP 2") || level.includes("MYP 3") || level.includes("Grade 6") || level.includes("Grade 7") || level.includes("Grade 8");

      const client = getAiClient(req);

      if (!client) {
        const fallbackTopic = generateFallbackTopic(topicTitle.trim(), level, count);
        return res.json(fallbackTopic);
      }

      const systemInstruction = `You are an expert IB MYP Science curriculum designer.
A student wants to practice IB MYP Criterion A (Knowing and Understanding) on the topic: "${topicTitle.trim()}".
Grade Level: "${level}" (${isLowerGrade ? "Lower Middle School, Ages 11-13" : "Upper Middle School, Ages 14-16"}).
Slide Count: Exactly ${count} questions.

CRITICAL LEVEL & SCAFFOLDING GUIDELINES:
${isLowerGrade ? `1. Strictly calibrate for lower grades (MYP 1–3, Grades 6–8).
2. Keep questions concise, simple, accessible, and grounded in core observable concepts.
3. DO NOT use overly high-end tertiary academic terms or university-level formulas.
4. Alternate Strand i (outline/state scientific knowledge) and Strand ii (apply knowledge to explain everyday situations).` : `1. Calibrate for upper grades (MYP 4–5, Grades 9–10).
2. Challenge students with mechanisms, cause-and-effect reasoning, and rigorous scientific terminology.
3. Alternate Strand i (describe/explain scientific knowledge) and Strand ii (apply scientific knowledge to analyze and solve problems).`}
5. Provide a helpful 'hint' for each slide that guides their thinking without giving away the direct answer.
6. Provide a clear, concise 'target' summarizing the key scientific concept expected.`;

      const prompt = `Generate a structured IB MYP Criterion A topic learning module for "${topicTitle.trim()}" with exactly ${count} slide questions.`;

      let response;
      try {
        response = await callGeminiWithFallback(client, (modelName) =>
          client.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction: systemInstruction,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  subject: {
                    type: Type.STRING,
                    description: "Must be 'Biology', 'Chemistry', 'Physics', or 'Environmental Science'",
                  },
                  description: { type: Type.STRING },
                  questions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.INTEGER },
                        strand: { type: Type.STRING, description: "Must be 'i' or 'ii'" },
                        prompt: { type: Type.STRING },
                        target: { type: Type.STRING },
                        hint: { type: Type.STRING },
                      },
                      required: ["id", "strand", "prompt", "target", "hint"],
                    },
                  },
                },
                required: ["title", "subject", "description", "questions"],
              },
            },
          })
        );
      } catch (geminiErr: any) {
        console.log("[Info] Cloud AI model temporarily busy; applying scaffolded curriculum generator for topic:", topicTitle.trim());
        const fallbackTopic = generateFallbackTopic(topicTitle.trim(), level, count);
        return res.json(fallbackTopic);
      }

      const responseText = response?.text;
      if (!responseText) {
        const fallbackTopic = generateFallbackTopic(topicTitle.trim(), level, count);
        return res.json(fallbackTopic);
      }

      const parsed = JSON.parse(responseText.trim());
      const questions = Array.isArray(parsed.questions) ? parsed.questions.slice(0, count) : [];

      const safeSubject = ["Biology", "Chemistry", "Physics", "Environmental Science"].includes(parsed.subject)
        ? parsed.subject
        : "Biology";

      const finalTopic = {
        id: `custom-${Date.now()}`,
        title: parsed.title || topicTitle.trim(),
        level: level,
        subject: safeSubject,
        description: parsed.description || `Student-guided inquiry and practice for ${topicTitle.trim()}`,
        badgeColor: isLowerGrade ? "bg-emerald-600" : "bg-blue-600",
        icon: safeSubject === "Physics" ? "Zap" : safeSubject === "Chemistry" ? "Atom" : "Sparkles",
        questions: questions.map((q: any, idx: number) => ({
          id: idx + 1,
          strand: q.strand === "ii" ? "ii" : "i",
          prompt: q.prompt,
          target: q.target,
          hint: q.hint || "Think about the core scientific principle involved in this question.",
        })),
      };

      return res.json(finalTopic);
    } catch (err: any) {
      console.log("[Info] Topic generation served via scaffolded curriculum engine.");
      const fallbackTopic = generateFallbackTopic(req.body.topicTitle || "Science Inquiry", req.body.level || "MYP 1–3 (Grade 6–8)", req.body.slideCount || 5);
      return res.json(fallbackTopic);
    }
  });

  // Vite middleware setup (development only)
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      const primaryPath = path.join(distPath, "index.html");
      res.sendFile(primaryPath, (err) => {
        if (err) {
          const fallbackPath = path.resolve(__dirname, "index.html");
          res.sendFile(fallbackPath, (fallbackErr) => {
            if (fallbackErr) {
              res.status(200).send("EduTN43 Science Learning Suite");
            }
          });
        }
      });
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduTN43 server running on http://0.0.0.0:${PORT}`);
  });

  // If running in production on a port other than 3000 (such as Cloud Run PORT=8080),
  // also attempt to bind a secondary listener on 3000 if available, so any internal proxy is satisfied.
  if (PORT !== 3000) {
    try {
      const secondaryServer = app.listen(3000, "0.0.0.0", () => {
        console.log(`Secondary listener active on http://0.0.0.0:3000`);
      });
      secondaryServer.on("error", (err: any) => {
        // Expected if port 3000 is already in use by an ingress proxy
        console.log(`Secondary listener port 3000 note: ${err.message}`);
      });
    } catch {
      // ignore
    }
  }

  // Graceful shutdown handling for Cloud Run deployment rollouts
  const handleShutdown = (signal: string) => {
    console.log(`Received ${signal}, closing server gracefully...`);
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  };
  process.on("SIGTERM", () => handleShutdown("SIGTERM"));
  process.on("SIGINT", () => handleShutdown("SIGINT"));
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
    gap: isExceeding ? null : (isLowerGrade ? `💡 Key Concept Reminder: "${target}"` : "Consider linking scientific principles and mechanisms directly to observable evidence and causes."),
    followUp: isExceeding
      ? null
      : misconception
      ? "Remember: in physical and natural systems, does energy or matter get created out of nothing, or is it transferred or transformed?"
      : "Can you explain the main mechanism or scientific principle behind this in your own words?",
    exceedingAchieved: isExceeding,
    spellingErrors: (() => {
      const sp = checkBiologicalSpelling(answer);
      return sp.length > 0 ? sp : undefined;
    })(),
  };
}

function generateFallbackTopic(title: string, level: string, count: number) {
  const isLowerGrade = !level || level.includes("PYP") || level.includes("MYP 1") || level.includes("MYP 2") || level.includes("MYP 3") || level.includes("Grade 6") || level.includes("Grade 7") || level.includes("Grade 8");
  const cleanTitle = title.trim();

  // Template bank of scaffolded questions tailored to grade level (12 distinct questions per track)
  const templatesLower = [
    {
      strand: "i" as const,
      prompt: `In simple terms, what is "${cleanTitle}" and why is it important in everyday science?`,
      target: `Basic definition, core components, and real-world significance of ${cleanTitle}.`,
      hint: `Start by defining what it is in one clear sentence, then give one place we see or use it.`
    },
    {
      strand: "ii" as const,
      prompt: `Imagine you are explaining "${cleanTitle}" to a friend. What is the main job, function, or role it performs?`,
      target: `Primary function and mechanism of ${cleanTitle} explained clearly without jargon.`,
      hint: `Think about what happens because of this, or what problem it solves.`
    },
    {
      strand: "i" as const,
      prompt: `What are the key parts, factors, or ingredients needed for "${cleanTitle}" to happen or work properly?`,
      target: `Identifying essential factors, conditions, or structures involved in ${cleanTitle}.`,
      hint: `List 2 or 3 essential elements or conditions that are involved.`
    },
    {
      strand: "ii" as const,
      prompt: `What would happen to the surrounding system or living organisms if "${cleanTitle}" stopped working or was absent?`,
      target: `Cause-and-effect reasoning describing consequences of disruption to ${cleanTitle}.`,
      hint: `Consider what depends on this process and how things would change without it.`
    },
    {
      strand: "i" as const,
      prompt: `How do scientists observe, test, or measure "${cleanTitle}" in an investigation or experiment?`,
      target: `Describing basic scientific observation or measurement methods for ${cleanTitle}.`,
      hint: `Think about tools, senses, or indicators scientists can use to see it in action.`
    },
    {
      strand: "ii" as const,
      prompt: `Give one real-world example where understanding "${cleanTitle}" helps solve a practical problem or improve human life.`,
      target: `Application of ${cleanTitle} to technology, health, or environmental stewardship.`,
      hint: `Think of medicine, environment, machines, or daily habits.`
    },
    {
      strand: "i" as const,
      prompt: `Compare "${cleanTitle}" with another related science concept you know. How are they similar or different?`,
      target: `Comparative scientific analysis highlighting similarities and distinctions.`,
      hint: `Pick something related and compare their main jobs.`
    },
    {
      strand: "ii" as const,
      prompt: `If you were demonstrating "${cleanTitle}" in a classroom experiment, what simple test could you set up?`,
      target: `Applying scientific understanding to design a simple observable demonstration.`,
      hint: `Think about what materials you would need and what change you would watch for.`
    },
    {
      strand: "i" as const,
      prompt: `What safety precautions or accurate tools should a student use when investigating "${cleanTitle}"?`,
      target: `Identifying appropriate scientific apparatus, measurements, and safe laboratory practices.`,
      hint: `Consider measurement precision, protection, and careful handling.`
    },
    {
      strand: "ii" as const,
      prompt: `How do changes in temperature, weather, or natural conditions influence "${cleanTitle}"?`,
      target: `Explaining environmental interactions and variable impacts on ${cleanTitle}.`,
      hint: `Think about what happens when it gets hotter, colder, or more crowded.`
    },
    {
      strand: "i" as const,
      prompt: `Identify the main cause and the resulting effect during a normal cycle of "${cleanTitle}".`,
      target: `Clear articulation of input-output or stimulus-response relationships in ${cleanTitle}.`,
      hint: `State what starts the process and what outcome is produced.`
    },
    {
      strand: "ii" as const,
      prompt: `Summarize the most important scientific takeaway about "${cleanTitle}" in two clear, complete sentences.`,
      target: `Synthesizing conceptual mastery and accurate scientific communication.`,
      hint: `State the fundamental idea and why it matters to living things or our world.`
    }
  ];

  const templatesHigher = [
    {
      strand: "i" as const,
      prompt: `Outline the fundamental scientific principles and biochemical or physical mechanisms that govern "${cleanTitle}".`,
      target: `Precise scientific definition, terminology, and core foundational laws underlying ${cleanTitle}.`,
      hint: `Focus on precise terminology, underlying laws, and interactions.`
    },
    {
      strand: "ii" as const,
      prompt: `Analyze how changes in external environmental variables directly impact the rate or equilibrium of "${cleanTitle}".`,
      target: `Multi-variable cause-and-effect analysis regarding ${cleanTitle}.`,
      hint: `Discuss variables such as temperature, pressure, concentration, or limiting factors.`
    },
    {
      strand: "i" as const,
      prompt: `Describe the molecular, structural, or mathematical relationships that characterize "${cleanTitle}".`,
      target: `Structural-functional relationships and theoretical models associated with ${cleanTitle}.`,
      hint: `Link structural organization directly to function and quantitative relationships.`
    },
    {
      strand: "ii" as const,
      prompt: `Apply your understanding of "${cleanTitle}" to evaluate a complex real-world ecological, industrial, or physiological scenario.`,
      target: `Evaluating systemic applications, trade-offs, and downstream impacts of ${cleanTitle}.`,
      hint: `Construct a reasoned argument evaluating benefits, constraints, or biological consequences.`
    },
    {
      strand: "ii" as const,
      prompt: `Critique a common scientific misconception related to "${cleanTitle}" and explain why the empirical scientific evidence disproves it.`,
      target: `Identifying and refuting misconceptions using empirical scientific evidence.`,
      hint: `Identify what people often get wrong and provide the true mechanism.`
    },
    {
      strand: "i" as const,
      prompt: `Explain how the laws of conservation (matter, energy, or momentum) apply directly to "${cleanTitle}".`,
      target: `Connecting conservation laws and thermodynamic principles to ${cleanTitle}.`,
      hint: `Trace the transfer or transformation of energy and mass through the system.`
    },
    {
      strand: "ii" as const,
      prompt: `Predict the quantitative or qualitative outcome if a key enzyme, catalyst, or reactant in "${cleanTitle}" is inhibited.`,
      target: `Predictive modeling of system disruptions and compensatory mechanisms in ${cleanTitle}.`,
      hint: `Explain how feedback loops or alternate pathways respond to the disruption.`
    },
    {
      strand: "i" as const,
      prompt: `Synthesize how "${cleanTitle}" operates across different organizational scales (from microscopic to macroscopic).`,
      target: `Cross-scale synthesis linking microscopic atomic/cellular events to macroscopic outcomes.`,
      hint: `Connect molecular/atomic interactions with observable whole-system properties.`
    },
    {
      strand: "ii" as const,
      prompt: `Design a controlled empirical investigation to test a specific falsifiable hypothesis concerning "${cleanTitle}".`,
      target: `Methodological design specifying independent, dependent, and controlled variables for ${cleanTitle}.`,
      hint: `Clearly identify the independent variable, dependent measurement, and at least two controlled variables.`
    },
    {
      strand: "i" as const,
      prompt: `Discuss the role of feedback mechanisms or homeostatic regulation in maintaining stability within "${cleanTitle}".`,
      target: `Articulating negative and positive feedback loops and regulatory thresholds.`,
      hint: `Explain what sensor, control center, and effector are involved in restoring equilibrium.`
    },
    {
      strand: "ii" as const,
      prompt: `Evaluate the ethical, societal, or technological implications of human intervention in "${cleanTitle}".`,
      target: `Critical evaluation of socio-scientific issues and technological applications related to ${cleanTitle}.`,
      hint: `Weigh the benefits against potential ecological, health, or ethical risks.`
    },
    {
      strand: "ii" as const,
      prompt: `Construct a comprehensive, evidence-based scientific argument concluding the overall significance of "${cleanTitle}".`,
      target: `Synthesizing conceptual mastery, scientific justification, and precise academic prose.`,
      hint: `Provide a thesis statement supported by at least two distinct lines of scientific evidence.`
    }
  ];

  const pool = isLowerGrade ? templatesLower : templatesHigher;
  const questions = [];

  for (let i = 0; i < count; i++) {
    const template = pool[i % pool.length];
    questions.push({
      id: i + 1,
      strand: template.strand,
      prompt: template.prompt,
      target: template.target,
      hint: template.hint,
    });
  }

  // Determine subject from title keywords
  const titleLower = cleanTitle.toLowerCase();
  let subject: "Biology" | "Chemistry" | "Physics" | "Environmental Science" = "Biology";
  if (titleLower.includes("force") || titleLower.includes("motion") || titleLower.includes("gravity") || titleLower.includes("light") || titleLower.includes("sound") || titleLower.includes("energy") || titleLower.includes("electric") || titleLower.includes("wave")) {
    subject = "Physics";
  } else if (titleLower.includes("reaction") || titleLower.includes("acid") || titleLower.includes("base") || titleLower.includes("atom") || titleLower.includes("element") || titleLower.includes("matter") || titleLower.includes("molecule") || titleLower.includes("periodic")) {
    subject = "Chemistry";
  } else if (titleLower.includes("ecosystem") || titleLower.includes("climate") || titleLower.includes("pollution") || titleLower.includes("water cycle") || titleLower.includes("earth") || titleLower.includes("planet") || titleLower.includes("environment")) {
    subject = "Environmental Science";
  }

  return {
    id: `custom-${Date.now()}`,
    title: cleanTitle,
    level: level,
    subject: subject,
    description: `Structured IB MYP Criterion A inquiry practice on ${cleanTitle}`,
    badgeColor: isLowerGrade ? "bg-emerald-600" : "bg-blue-600",
    icon: subject === "Physics" ? "Zap" : subject === "Chemistry" ? "Atom" : "Sparkles",
    questions: questions,
  };
}

startServer();
