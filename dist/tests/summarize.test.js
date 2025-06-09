"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const hfService = __importStar(require("../services/huggingface"));
jest.mock("../services/huggingface");
describe("/summarize endpoint", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("Valid Input Test: returns 200 and summary", () => __awaiter(void 0, void 0, void 0, function* () {
        hfService.getSummary.mockResolvedValue("Fake summary.");
        const response = yield (0, supertest_1.default)(index_1.default)
            .post("/summarize")
            .send({ text: "Some sample text." })
            .set("Accept", "application/json");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ summary: "Fake summary." });
        expect(hfService.getSummary).toHaveBeenCalledTimes(1);
    }));
    it("Empty Text Test: returns 400 and error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/summarize").send({ text: "" }).set("Accept", "application/json");
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "'text' field is required" });
        expect(hfService.getSummary).not.toHaveBeenCalled();
    }));
    it("Service Error Test: returns 500 if getSummary throws error", () => __awaiter(void 0, void 0, void 0, function* () {
        hfService.getSummary.mockRejectedValue(new Error("Test error"));
        const response = yield (0, supertest_1.default)(index_1.default)
            .post("/summarize")
            .send({ text: "Trigger error" })
            .set("Accept", "application/json");
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "LLM service unavailable" });
        expect(hfService.getSummary).toHaveBeenCalledTimes(1);
    }));
});
