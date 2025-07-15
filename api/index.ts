import app from "../server/index";
import { initializeApp } from "../server/index";

// Initialize the app for Vercel
await initializeApp();

export default app; 