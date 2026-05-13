import { GoogleGenAI } from "@google/genai";
import { APPS } from "../constants";

export async function interpretAICommand(query: string, onLaunch: (id: string, name: string) => void) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Commander requested: "${query}". Determine which system applications should be launched. 
      Available apps: 
      - terminal: Command line access
      - files: Data storage/filesystem
      - settings: System configuration
      - security: Threat detection/Firewall
      - ai-lab: Neural core training
      
      Respond ONLY with the app IDs in brackets, e.g., [LAUNCH: terminal][LAUNCH: files]. If none match, respond with [LAUNCH: NONE].`,
    });

    const aiText = response.text || "";
    const launchRegex = /\[LAUNCH: (\w+)\]/g;
    let match;
    let found = false;

    while ((match = launchRegex.exec(aiText)) !== null) {
      const appId = match[1];
      const app = APPS.find(a => a.id === appId);
      if (app) {
        onLaunch(app.id, app.name);
        found = true;
      }
    }
    return found;
  } catch (err) {
    console.error("AI Command failure:", err);
    return false;
  }
}
