import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { EmailComponents } from "../utils/types";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export function sendEmail(to: string, response: EmailComponents) {
  const body =
    response.responseBody +
    "\n\n" +
    response.responseSignature +
    "\n\n" +
    response.responseClosing;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: response.responseSubject,
    text: body,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) console.error("Email sending failed:", err);
    else console.log(`Email sent to ${to}`);
  });
}
