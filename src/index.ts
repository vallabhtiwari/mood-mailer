import { startEmailListener } from "./lib/emailHandler";
import dotenv from "dotenv";

dotenv.config();

console.log("Email bot is running...");
startEmailListener();
