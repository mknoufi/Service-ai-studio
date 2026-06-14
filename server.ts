import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
let ai: GoogleGenAI | null = null;
const getAI = () => {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
};

// SLA Analysis Endpoint
app.post("/api/analyze-sla", async (req, res) => {
  try {
    const { tickets } = req.body;
    
    if (!tickets || !Array.isArray(tickets)) {
      return res.status(400).json({ error: "Tickets array is required." });
    }

    const aiClient = getAI();
    const prompt = `
Analyze the following helpdesk tickets and identify those at high risk of breaching SLAs.
Generate severe, structured internal notifications for the front desk.

Tickets:
${JSON.stringify(tickets)}
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "A list of SLA breach notifications based on the analysis of tickets.",
          items: {
            type: Type.OBJECT,
            properties: {
              ticketId: {
                type: Type.STRING,
                description: "The ID of the ticket.",
              },
              severity: {
                type: Type.STRING,
                description: "The severity of the SLA breach: 'High' or 'Critical'.",
              },
              message: {
                type: Type.STRING,
                description: "The detailed notification message explaining the risk and suggested action.",
              }
            },
            required: ["ticketId", "severity", "message"]
          }
        }
      }
    });

    const output = response.text;
    res.json(JSON.parse(output));

  } catch (err: any) {
    console.error("Gemini SLA Analysis Error:", err);
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
