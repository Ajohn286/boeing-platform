import app from "../server/index";
import { initializeApp } from "../server/index";

// Initialize the app for Vercel
let isInitialized = false;

// Initialize the app when the module is loaded
if (!isInitialized) {
  initializeApp().catch(console.error);
  isInitialized = true;
}

export default app; 