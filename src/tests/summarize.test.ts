import request from "supertest";
import app from "../index";
import * as hfService from "../services/huggingface";

jest.mock("../services/huggingface");

describe("/summarize endpoint", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Valid Input Test: returns 200 and summary", async () => {
    (hfService.getSummary as jest.Mock).mockResolvedValue("Fake summary.");

    const response = await request(app)
      .post("/summarize")
      .send({ text: "Some sample text." })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ summary: "Fake summary." });
    expect(hfService.getSummary).toHaveBeenCalledTimes(1);
  });

  it("Empty Text Test: returns 400 and error", async () => {
    const response = await request(app).post("/summarize").send({ text: "" }).set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "'text' field is required" });
    expect(hfService.getSummary).not.toHaveBeenCalled();
  });

  it("Service Error Test: returns 500 if getSummary throws error", async () => {
    (hfService.getSummary as jest.Mock).mockRejectedValue(new Error("Test error"));

    const response = await request(app)
      .post("/summarize")
      .send({ text: "Trigger error" })
      .set("Accept", "application/json");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "LLM service unavailable" });
    expect(hfService.getSummary).toHaveBeenCalledTimes(1);
  });
});
