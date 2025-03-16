import dotenv from "dotenv";
import Imap from "imap";
import { MailParser, AddressObject, HeaderValue } from "mailparser";
import { generateResponse } from "./responseGenerator";
import { sendEmail } from "./sendEmail";

dotenv.config();

function getEmailAddress(
  headerValue: HeaderValue | undefined,
  index = 0
): string {
  if (!headerValue) return "";
  const addressObj = headerValue as AddressObject;
  console.log(addressObj);
  return addressObj.value?.[index]?.address || "";
}

function getEmailAddresses(headerValue: HeaderValue | undefined): string[] {
  if (!headerValue) return [];
  const addressObj = headerValue as AddressObject;
  console.log(addressObj);
  return (
    (addressObj.value
      ?.map((addr) => addr.address)
      .filter((addr) => addr !== undefined) as string[]) || []
  );
}

const imap = new Imap({
  user: process.env.EMAIL_USER!,
  password: process.env.EMAIL_PASS!,
  host: process.env.IMAP_HOST!,
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
});

export function startEmailListener() {
  imap.once("ready", () => {
    openInbox((err: any) => {
      if (err) throw err;

      imap.on("mail", () => fetchUnreadEmails());
      console.log("Listening for new emails...");
    });
  });

  imap.once("error", (err: any) => {
    console.error("IMAP Error:", err);
    setTimeout(() => {
      console.log("Reconnecting to IMAP...");
      imap.connect();
    }, 5000);
  });

  imap.once("end", () => {
    console.log("IMAP Connection Ended, reconnecting...");
    setTimeout(() => {
      imap.connect();
    }, 5000);
  });

  imap.connect();
}
function openInbox(callback: any) {
  imap.openBox("INBOX", false, callback);
}

function fetchUnreadEmails() {
  imap.search(["UNSEEN"], (err, results) => {
    if (err) {
      console.error("Search error:", err);
      return;
    }
    if (!results.length) {
      console.log("No unread emails.");
      return;
    }

    const fetcher = imap.fetch(results, { bodies: "", markSeen: false }); // Fetch without marking seen initially

    fetcher.on("message", (msg, seqno) => {
      const mailParser = new MailParser();

      msg.on("body", (stream) => {
        stream.pipe(mailParser);

        mailParser.on("headers", (headers) => {
          const from = getEmailAddress(headers.get("from"));
          const to = getEmailAddresses(headers.get("to"));
          const deliveredTo = getEmailAddress(headers.get("delivered-to"));
          const subject = headers.get("subject")?.toString() || "";
          const recipientEmail = deliveredTo || to[0] || "";

          console.log("------------------");
          console.log(`From: ${from}`);
          console.log(`To: ${to || "Unknown Recipient"}`);
          console.log(`Subject: ${subject}`);
          console.log(`Delivered To: ${deliveredTo}`);
          console.log("------------------");

          const emotionEmail = to[0];
          let tone = "default";
          if (emotionEmail.includes("flirt@")) tone = "flirty";
          else if (emotionEmail.includes("friend@")) tone = "friendly";
          else if (emotionEmail.includes("roast@")) tone = "roasting";
          console.log("Tone:", tone);

          mailParser.on("data", async (data) => {
            if (data.type === "text") {
              console.log("Email text:", data.text);

              // Process the email (generate response & send reply)
              if (tone in PROMPTS) {
                const text = `Subject: ${subject}\n Body: ${data.text}`;
                let response = await generateResponse(text, tone);
                if (typeof response === "string") {
                  response = {
                    responseSubject: "Problem Occured",
                    responseBody: response,
                    responseSignature: "Mood Mailer",
                    responseClosing: "",
                  };
                }

                sendEmail(from, response);
              }

              imap.addFlags(seqno, "\\Seen", (err) => {
                if (err)
                  console.error(`Failed to mark email ${seqno} as read:`, err);
                else console.log(`Email ${seqno} marked as read.`);
              });
            }
          });
        });
      });
    });

    fetcher.once("end", () => {
      console.log("Finished processing unread emails, continuing to listen...");
    });
  });
}
