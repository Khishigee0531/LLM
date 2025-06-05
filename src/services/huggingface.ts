import fetch from "node-fetch";

const API_URL =
  "https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6";
const API_TOKEN = process.env.HF_API_TOKEN || "";

type HFResponse = { summary_text: string }[];

export async function getSummary(text: string): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Hugging Face API error: ${response.status} ${errorText}`
      );
    }

    const data = (await response.json()) as HFResponse;
    return data[0]?.summary_text || "No summary generated";
  } catch (error) {
    console.log(error);
    throw error;
  }
}
