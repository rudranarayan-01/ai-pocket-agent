// GlobalApi.tsx
// Export a single function AIChatModel({ messages }) -> diagnostic result.
// Uses fetch (works in Expo). Normalizes messages and returns a structured result.

import Constants from "expo-constants";

export type Message = {
    role: "user" | "assistant" | "system" | string;
    content: string;
};

export type ApiSuccess = {
    ok: true;
    status: number;
    data: any;
    rawText: string;
    headers: Record<string, string>;
};

export type ApiFailure = {
    ok: false;
    status?: number;
    bodyText?: string;
    bodyJson?: any;
    headers?: Record<string, string>;
    error?: string;
};

const KRAVIX_URL = "https://kravixstudio.com/api/v1/chat";

// Read API key from expo config `extra` (recommended) or replace placeholder temporarily.
// To use Constants.manifest.extra.KRAVIX_API_KEY you must add it to app.config.js / app.json (see notes below).
const API_KEY =
    (Constants.manifest && (Constants.manifest as any).extra?.KRAVIX_API_KEY) ||
    (Constants.expoConfig && (Constants.expoConfig as any).extra?.KRAVIX_API_KEY) ||
    "sk_live_a1601c27-e708-4293-a0c6-c5275893e586"; // replace only for quick local debug (avoid shipping this)

function maskKey(k?: string) {
    if (!k) return "<missing>";
    return k.length > 8 ? `${k.slice(0, 4)}...${k.slice(-4)}` : "****";
}

/**
 * AIChatModel
 * @param param0.messages - array of {role, content}
 * Returns ApiSuccess or ApiFailure
 */
export async function AIChatModel({ messages }: { messages: Message[] }): Promise<ApiSuccess | ApiFailure> {
    // Normalize messages to safe shape (strip any functions / nested objects)
    const normalized: Message[] = (Array.isArray(messages) ? messages : [])
        .map((m) => ({
            role: String(m?.role ?? "user"),
            content: String(m?.content ?? ""),
        }))
        .filter((m) => m.content.length > 0); // drop empty messages

    const payload = {
        // Kravix accepted `message: [{role,content}]` when you tested successfully.
        message: normalized,
        aiModel: "gpt-4.1-mini", // keep the working model you tested; change if required
        outputType: "text",
    };

    const payloadText = JSON.stringify(payload);

    console.log("[AIChatModel] API_KEY:", maskKey(API_KEY));
    console.log("[AIChatModel] Sending payload:", payloadText);

    try {
        const res = await fetch(KRAVIX_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
            body: payloadText,
        });

        const status = res.status;
        // Collect headers into a plain object
        const headersObj: Record<string, string> = {};
        res.headers.forEach((v, k) => (headersObj[k] = v));

        const rawText = await res.text();
        let parsed = null;
        try {
            parsed = rawText ? JSON.parse(rawText) : null;
        } catch {
            parsed = null;
        }

        console.log("[AIChatModel] HTTP", status);
        console.log("[AIChatModel] Response headers:", headersObj);
        console.log("[AIChatModel] Raw body:", rawText);

        if (status >= 200 && status < 300) {
            return { ok: true, status, data: parsed ?? rawText, rawText, headers: headersObj };
        } else {
            // Return full diagnostic info for caller to inspect
            return { ok: false, status, bodyText: rawText, bodyJson: parsed, headers: headersObj };
        }
    } catch (err: any) {
        console.error("[AIChatModel] Network/Fetch error:", err);
        return { ok: false, error: String(err) };
    }
}
