import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PROMPTS, SYSTEM_PROMPT } from "./prompts";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateResponse(
  emailText: string,
  tone: string
): Promise<EmailComponents | string> {
  const systemPrompt = `${SYSTEM_PROMPT} ${PROMPTS[tone]}`;
  const userPrompt = `Email: ${emailText}`;

  try {
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL!,
      generationConfig: {
        temperature: 1.2,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 1500,
      },
    });

    // First, prime the model with the system prompt
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [
            { text: "I understand my role and will respond accordingly." },
          ],
        },
      ],
    });

    // Then, send the actual email for response
    const result = await chat.sendMessage([{ text: userPrompt }]);
    const response = result.response.text();

    if (response) {
      const {
        responseSubject,
        responseBody,
        responseSignature,
        responseClosing,
      } = extractEmailComponents(response);
      return {
        responseSubject,
        responseBody,
        responseSignature,
        responseClosing,
      };
    }
    return "Couldn't generate a response.";
  } catch (error) {
    console.error("Error generating response:", error);
    return "I'm unable to respond right now.";
  }
}

function extractEmailComponents(emailText: string): EmailComponents {
  const subjectMatch = emailText.match(/^Subject:\s*(.+)/m);
  const signatureMatch = emailText.match(/^\n*Signature:\n*(.+)/m);
  const closingMatch = emailText.match(/^\n*Closing:\n*(.+)/m);

  const responseSubject = subjectMatch ? subjectMatch[1].trim() : "";
  const responseSignature = signatureMatch ? signatureMatch[1].trim() : "";
  const responseClosing = closingMatch ? closingMatch[1].trim() : "";

  // Extract body by removing subject, signature, and closing
  let responseBody = emailText
    .replace(subjectMatch?.[0] || "", "")
    .replace(signatureMatch?.[0] || "", "")
    .replace(closingMatch?.[0] || "", "")
    .replace(/^\n*Body:\n*/m, "")
    .trim();

  return { responseSubject, responseBody, responseSignature, responseClosing };
}

export type EmailComponents = {
  responseSubject: string;
  responseBody: string;
  responseSignature: string;
  responseClosing: string;
};
