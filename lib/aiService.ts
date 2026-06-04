import { GoogleGenAI } from '@google/genai';

// ---------------------------------------------------------------------------
// RHIVE AI Service — wraps @google/genai for the AI Assistant chat panel
// ---------------------------------------------------------------------------

const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;

export const isAIConfigured = !!API_KEY;

const SYSTEM_PROMPT = `You are ARIA — the RHIVE AI Operations Assistant.

RHIVE is a professional roofing and construction company. You assist employees, admins, contractors, suppliers, and customers with:
- Project status, stage tracking, and pipeline updates
- Quote creation, approval workflows, and pricing estimates
- Lead intake, customer lookup, and property registration
- Scheduling site visits, contractor dispatch, and crew coordination
- Roofing materials: shingles, membranes, gutters, heat trace, skylights
- Government compliance: certified payroll, wage determination, solicitation numbers
- Storm alerts and emergency tarping workflows
- General construction operations and team coordination

Always be concise, professional, and action-oriented. Use bullet points where helpful. If you don't know something, say so honestly.`;

let ai: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
    if (!ai) {
        if (!API_KEY) throw new Error('VITE_GEMINI_API_KEY is not set.');
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }
    return ai;
};

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

// ---------------------------------------------------------------------------
// Stream a single turn, yielding text chunks as they arrive.
// history = all prior messages in [{role, parts:[{text}]}] format for Gemini.
// ---------------------------------------------------------------------------
export async function* streamChat(
    history: ChatMessage[],
    userMessage: string
): AsyncGenerator<string, void, unknown> {
    const client = getClient();

    // Build Gemini-format history (all turns EXCEPT the current one)
    const geminiHistory = history.map(m => ({
        role: m.role,
        parts: [{ text: m.text }],
    }));

    const chat = client.chats.create({
        model: 'gemini-2.0-flash',
        config: { systemInstruction: SYSTEM_PROMPT },
        history: geminiHistory,
    });

    const stream = await chat.sendMessageStream({ message: userMessage });

    for await (const chunk of stream) {
        const text = chunk.text;
        if (text) yield text;
    }
}
