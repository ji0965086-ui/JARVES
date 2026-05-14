import { GoogleGenAI } from "@google/genai";

export class JarvisService {
  private ai: any;
  private chat: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async initializeChat(personality: string = "sophisticated, British, helpful, and highly intelligent") {
    this.chat = this.ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are JARVIS, a sophisticated AI assistant. Your personality is ${personality}. 
        You are part of a Stark Industries level HUD. Speak concisely but elegantly. 
        Always respond as if you are controlling a high-tech system. 
        If asked to open something, simulate the confirmation. 
        You have access to simulated system stats, biometric data, and voice recognition.`,
      },
    });
  }

  async sendMessage(message: string) {
    if (!this.chat) await this.initializeChat();
    const response = await this.chat.sendMessage({ message });
    return response.text;
  }
}

export const jarvis = new JarvisService();
