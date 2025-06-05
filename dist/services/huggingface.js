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
exports.getSummary = getSummary;
const node_fetch_1 = __importDefault(require("node-fetch"));
const API_URL = "https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6";
const API_TOKEN = process.env.HF_API_TOKEN || "";
function getSummary(text) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const response = yield (0, node_fetch_1.default)(API_URL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inputs: text }),
            });
            if (!response.ok) {
                const errorText = yield response.text();
                throw new Error(`Hugging Face API error: ${response.status} ${errorText}`);
            }
            const data = (yield response.json());
            return ((_a = data[0]) === null || _a === void 0 ? void 0 : _a.summary_text) || "No summary generated";
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
