import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PROMPTS, SYSTEM_PROMPT } from "./prompts";
import { EmailComponents } from "../utils/types";
import { extractEmailComponents } from "../utils/utils";

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

export async function generateContext(
  from: string,
  tone: string,
  emailText: string,
  response: EmailComponents
) {
  const conversation = `Email from ${from}: ${emailText} \n\nResponse from Mood Mailer: ${response.responseBody}`;

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

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SUMMARY_PROMPT }] },
        {
          role: "model",
          parts: [
            { text: "I understand my role and will respond accordingly." },
          ],
        },
      ],
    });

    const result = await chat.sendMessage([{ text: conversation }]);
    const summary = result.response.text();
    const to = tone as DestinationEmails;
    await saveContext(from, to, summary);
  } catch (error) {
    console.error("Error generating context:", error);
  }
}
