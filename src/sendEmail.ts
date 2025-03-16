import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export function sendEmail(to: string, subject: string, text: string) {
  const mailOptions = { from: process.env.EMAIL_USER, to, subject, text };

  transporter.sendMail(mailOptions, (err) => {
    if (err) console.error("Email sending failed:", err);
    else console.log(`Email sent to ${to}`);
  });
}
