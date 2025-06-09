"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const huggingface_1 = require("../services/huggingface");
const Summary_1 = __importDefault(require("../models/Summary"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post("/", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text } = req.body;
        const userId = req.user.userId;
        if (!text || typeof text !== "string" || text.trim() === "") {
            return res.status(400).json({ error: "'text' field is required" });
        }
        if (process.env.USE_MOCK_SUMMARY === "true") {
            const mockSummary = "This is a mock summary.";
            yield Summary_1.default.create({ text, summary: mockSummary, userId });
            return res.status(200).json({ summary: mockSummary });
        }
        const input = `Summarize the following text in exactly one sentence. Do not use multiple sentences or lists:\n\n${text}`;
        const summaryRaw = yield (0, huggingface_1.getSummary)(input);
        const firstSentence = summaryRaw.split(".")[0].trim() + ".";
        yield Summary_1.default.create({ text, summary: firstSentence, userId });
        return res.status(200).json({ summary: firstSentence });
    }
    catch (err) {
        console.error("Error in /summarize route:", err);
        return res.status(500).json({ error: "LLM service unavailable" });
    }
}));
exports.default = router;
