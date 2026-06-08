import { GoogleGenAI } from '@google/genai';

// ---------------------------------------------------------------------------
// RHIVE AI Service — wraps @google/genai for the AI Assistant chat panel
//
// Security model: The Gemini API key is NEVER baked into the JS bundle.
// It is fetched at runtime from /api/config (served by vite.config.ts on dev,
// and by a Cloud Run sidecar on Firebase App Hosting in production).
// ---------------------------------------------------------------------------

let _cachedKey: string | null = null;

async function getApiKey(): Promise<string> {
    if (_cachedKey !== null) return _cachedKey;

    // Fetch from the secure server-side config endpoint
    try {
        const res = await fetch('/api/config');
        if (!res.ok) throw new Error(`/api/config returned ${res.status}`);
        const data = await res.json();
        _cachedKey = (data.geminiApiKey as string) || '';
    } catch (err) {
        console.warn('[RHIVE] Failed to load Gemini API key from /api/config:', err);
        _cachedKey = '';
    }
    return _cachedKey;
}

export let isAIConfigured = false;

// Pre-warm the key check so the UI can show the unconfigured state immediately
getApiKey().then(key => { isAIConfigured = !!key; });

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

const getClient = async (): Promise<GoogleGenAI> => {
    if (!ai) {
        const key = await getApiKey();
        if (!key) throw new Error('VITE_GEMINI_API_KEY is not configured. Add it to your .env file and restart the dev server.');
        ai = new GoogleGenAI({ apiKey: key });
        isAIConfigured = true;
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
    const client = await getClient();

    // Build Gemini-format history (all turns EXCEPT the current one)
    const geminiHistory = history.map(m => ({
        role: m.role,
        parts: [{ text: m.text }],
    }));

    const chat = client.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction: SYSTEM_PROMPT },
        history: geminiHistory,
    });

    const stream = await chat.sendMessageStream({ message: userMessage });

    for await (const chunk of stream) {
        const text = chunk.text;
        if (text) yield text;
    }
}
