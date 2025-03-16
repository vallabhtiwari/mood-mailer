import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateResponse(
  emailText: string,
  tone: string
): Promise<string> {
  const prompt = `Reply to the following email in a ${tone} tone:\n"${emailText}"`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return response || "Couldn't generate a response.";
  } catch (error) {
    console.error("Error generating response:", error);
    return "I'm unable to respond right now.";
  }
}
