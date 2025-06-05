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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const huggingface_1 = require("../services/huggingface");
const router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text } = req.body;
        if (!text || typeof text !== "string" || text.trim() === "") {
            return res.status(400).json({ error: "'text' field is required" });
        }
        if (process.env.USE_MOCK_SUMMARY === "true") {
            return res.status(200).json({ summary: "This is a mock summary." });
        }
        const input = `Summarize the following text in exactly one sentence. Do not use multiple sentences or lists:\n\n${text}`;
        const summaryRaw = yield (0, huggingface_1.getSummary)(input);
        const firstSentence = summaryRaw.split(".")[0].trim() + ".";
        return res.status(200).json({ summary: firstSentence });
    }
    catch (err) {
        console.error("Error in /summarize route:", err);
        return res.status(500).json({ error: "LLM service unavailable" });
    }
}));
exports.default = router;
