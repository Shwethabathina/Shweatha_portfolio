
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const PORT = 8787;
const MODEL = "gemini-3.8-flash";

// Load private API key
const envPath = path.join(process.cwd(), ".env");

if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);

    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2]
        .trim()
        .replace(/^["']|["']$/g, "");
    }
  }
}

const API_KEY = process.env.GEMINI_API_KEY;

// Verified resume facts only
const PROFILE_CONTEXT = `
You are Shwe's Personal Assistant on Shwetha's portfolio website.

You represent Shwetha to recruiters and other visitors.
Always refer to Shwetha in THIRD PERSON.

VERIFIED FACTS:
- Preferred name: Shwetha.
- Full name: Shweatha Bathina Mallikarjuna.
- She is pursuing an MS in Computer Science at Rutgers University.
- Her expected graduation is December 2026.
- Her graduate GPA is 3.77.
- She earned a BE in Computer Science from R.M.D. Engineering College.
- She was a Website Developer Intern at Rutgers Democracy Lab.
- She was a Teaching Assistant / Grader for Software Methodology at Rutgers.
- She was a Computer Science Trainer at Edu-Ideal Academy.
- Her projects include:
  Role Ready, Face Recognition Attendance System,
  Phishing Aware, and Feminine Impunity.
- Her technical work includes Python, RAG, LangGraph,
  LangChain, AI applications, full-stack development,
  computer vision, and cybersecurity.

STRICT RESPONSE RULES:
1. Use plain text only. Never use Markdown, asterisks,
   hashtags, bullet points, bold formatting, or code fences.
2. Write naturally, like a professional human assistant.
3. Keep answers short: generally 2 to 4 sentences.
4. Only state information supported by VERIFIED FACTS.
5. Do not invent job titles, achievements, certifications,
   project metrics, dates, or additional skills.
6. Do not call her a graduate; she is still pursuing her MS.
7. Do not claim she is currently employed in a role
   unless that is explicitly confirmed.
8. If asked for something not provided in VERIFIED FACTS,
   say you do not have that information.
9. Do not repeat her entire resume unless specifically asked.
10. Never speak as Shwetha. Speak about her in third person.
`;

function sendJSON(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });

  res.end(JSON.stringify(data));
}

function cleanPlainText(value) {
  return String(value ?? "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/^\s*#{1,6}\s+/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    return sendJSON(res, 200, {});
  }

  if (req.url !== "/api/chat" || req.method !== "POST") {
    return sendJSON(res, 404, {
      error: "Endpoint not found"
    });
  }

  if (!API_KEY) {
    return sendJSON(res, 503, {
      error: "GEMINI_API_KEY is missing from .env"
    });
  }

  try {
    let body = "";

    for await (const chunk of req) {
      body += chunk;

      if (body.length > 50000) {
        return sendJSON(res, 413, {
          error: "Request too large"
        });
      }
    }

    let payload;

    try {
      payload = JSON.parse(body);
    } catch {
      return sendJSON(res, 400, {
        error: "Invalid JSON"
      });
    }

    const messages = Array.isArray(payload.messages)
      ? payload.messages
      : [];

    const contents = messages
      .filter(
        message =>
          typeof (message.text ?? message.content) === "string"
      )
      .slice(-10)
      .map(message => ({
        role:
          message.role === "assistant" ||
          message.role === "model"
            ? "model"
            : "user",
        parts: [{
          text: String(
            message.text ?? message.content
          ).slice(0, 2000)
        }]
      }));

    if (!contents.length) {
      return sendJSON(res, 400, {
        error: "No message provided"
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": API_KEY
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: PROFILE_CONTEXT }]
          },
          contents,
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.2,
            thinkingConfig: {
              thinkingLevel: "low"
            }
          }
        }),
        signal: AbortSignal.timeout(20000)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Gemini API error:",
        response.status,
        JSON.stringify(data, null, 2)
      );

      return sendJSON(res, 502, {
        error: "Gemini request failed",
        status: response.status
      });
    }

    const rawReply = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text ?? "")
      .join("");

    const reply = cleanPlainText(rawReply);

    return sendJSON(res, 200, {
      reply:
        reply ||
        "Sorry, I couldn't generate an answer. Please try again."
    });

  } catch (error) {
    console.error("Backend error:", error.message);

    return sendJSON(res, 500, {
      error: "Assistant request failed"
    });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(
    `Shwe's Personal Assistant running at http://127.0.0.1:${PORT}`
  );
  console.log(`AI provider: Google Gemini`);
  console.log(`Model: ${MODEL}`);
});
