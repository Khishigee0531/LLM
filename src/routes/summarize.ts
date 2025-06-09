import { Router, Request, Response } from "express";
import { getSummary } from "../services/huggingface";
import Summary from "../models/Summary";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;
    const userId = req.user!.userId;

    if (!text || typeof text !== "string" || text.trim() === "") {
      return res.status(400).json({ error: "'text' field is required" });
    }

    if (process.env.USE_MOCK_SUMMARY === "true") {
      const mockSummary = "This is a mock summary.";
      await Summary.create({ text, summary: mockSummary, userId });
      return res.status(200).json({ summary: mockSummary });
    }

    const input = `Summarize the following text in exactly one sentence. Do not use multiple sentences or lists:\n\n${text}`;
    const summaryRaw = await getSummary(input);
    const firstSentence = summaryRaw.split(".")[0].trim() + ".";

    await Summary.create({ text, summary: firstSentence, userId });

    return res.status(200).json({ summary: firstSentence });
  } catch (err) {
    console.error("Error in /summarize route:", err);
    return res.status(500).json({ error: "LLM service unavailable" });
  }
});

export default router;
