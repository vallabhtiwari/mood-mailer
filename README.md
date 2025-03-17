# Mood Mailer

Mood Mailer is an AI-powered email bot that responds to specific emotional prompts. The bot not only responds based on the email address it receives messages on (e.g., roast@vallabhtiwari.com triggers a humorous roast) but also considers the email's content while generating the response, ensuring a tailored and context-aware reply to customized email addresses. It delivers personalized responses based on the mood indicated by the email prefix (e.g., flirt@vallabhtiwari.com responds flirtatiously). The bot leverages cutting-edge generative AI to craft unique replies for each mood.

## 🎯 Features

- **Emotion-Based Replies:** Automatically responds to emails with tone-specific messages for:

  - Flirt (flirt@vallabhtiwari.com)
  - Poems (poems@vallabhtiwari.com)
  - Rant (rant@vallabhtiwari.com)
  - Roast (roast@vallabhtiwari.com)
  - Therapy (therapy@vallabhtiwari.com)
  - Yearn (yearn@vallabhtiwari.com)

- **Context Awareness:** Stores conversation summaries for continuity and personalized replies.
- **Dynamic Response Generation:** Uses Google Generative AI to craft intelligent, mood-based responses.
- **Email Handling:** Manages incoming and outgoing emails using IMAP and Nodemailer.

## 🛠️ Technologies Used

- **[@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai):** For generating mood-specific email responses.
- **Prisma:** For managing conversation history and storing summaries.
- **IMAP & Mailparser:** For handling incoming emails and parsing content.
- **Nodemailer:** For sending AI-generated replies.

## 📬 How It Works

1. **Email Parsing:** The bot fetches emails using IMAP, parses content with mailparser, and identifies the emotion based on the prefix.

2. **AI Response Generation:** Mood-specific prompts are sent to Google Generative AI to craft a unique response tailored to the user's mood.

3. **Context Storage:** Conversation summaries are stored in a Prisma database to maintain context for future replies.

4. **Sending Replies:** Replies are sent using Nodemailer from the Gmail account.

## 📊 Example Email Flow

1. **User Email:**
   Sent to **flirt@vallabhtiwari.com**:

   > "Hey, Mood Mailer, charm me!"

2. **AI Response:**
   > "Is it just me, or did the inbox get brighter when your email arrived? 😉"

## 🎮 Try It Out!

Send emails to any of the mood-specific addresses and experience the magic of AI-powered responses! Whether you want to be roasted, need some therapy, or just want to exchange poetic verses, Mood Mailer is ready to engage.

Have feedback, suggestions, or just want to share your experience? Drop a line at [contact@vallabhtiwari.com](mailto:contact@vallabhtiwari.com) - I'd love to hear how Mood Mailer brightened your day!

Happy Mailing! 📧✨

## 📝 Note

The mood-specific email addresses currently forward to a Gmail account, so you'll receive responses from sender.vallabhtiwari@gmail.com. Don't worry - the AI still knows which mood you're going for based on which address you originally wrote to!
