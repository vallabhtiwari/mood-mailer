import { HeaderValue, AddressObject } from "mailparser";
import { EmailComponents } from "./types";
import { DestinationEmails, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Gets the email address from the header value
export function getEmailAddress(
  headerValue: HeaderValue | undefined,
  index = 0
): string {
  if (!headerValue) return "";
  const addressObj = headerValue as AddressObject;
  return addressObj.value?.[index]?.address || "";
}

// Gets the email addresses(when multiple) from the header value
export function getEmailAddresses(
  headerValue: HeaderValue | undefined
): string[] {
  if (!headerValue) return [];
  const addressObj = headerValue as AddressObject;
  return (
    (addressObj.value
      ?.map((addr) => addr.address)
      .filter((addr) => addr !== undefined) as string[]) || []
  );
}

// Extracts the email components from the email text
export function extractEmailComponents(emailText: string): EmailComponents {
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

export async function getContext(from: string, to: DestinationEmails) {
  try {
    const context = await prisma.context.findUnique({
      where: { from_to: { from, to } },
    });
    return context?.summary;
  } catch (error) {
    console.error("Error getting context:", error);
    return "";
  }
}

export async function saveContext(
  from: string,
  to: DestinationEmails,
  summary: string
) {
  try {
    await prisma.context.upsert({
      where: { from_to: { from, to } },
      update: { summary },
      create: { from, to, summary },
    });
  } catch (error) {
    console.error("Error saving context:", error);
  }
}
