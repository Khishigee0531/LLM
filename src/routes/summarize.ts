import { Router, Request, Response } from "express";
import { getSummary } from "../services/huggingface";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || text.trim() === "") {
      return res.status(400).json({ error: "'text' field is required" });
    }

    if (process.env.USE_MOCK_SUMMARY === "true") {
      return res.status(200).json({ summary: "This is a mock summary." });
    }

    const input = `Summarize the following text in exactly one sentence. Do not use multiple sentences or lists:\n\n${text}`;
    const summaryRaw = await getSummary(input);
    const firstSentence = summaryRaw.split(".")[0].trim() + ".";

    return res.status(200).json({ summary: firstSentence });
  } catch (err) {
    console.error("Error in /summarize route:", err);
    return res.status(500).json({ error: "LLM service unavailable" });
  }
});

export default router;
