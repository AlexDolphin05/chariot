import { createServer } from "node:http";
import {
  buildCompiledHermitPrompt,
  buildPolishedHermitPrompt,
} from "@chariot/module-hermit";
import type {
  HermitPromptCompileRequest,
  HermitPromptPolishRequest,
} from "@chariot/types";

const port = Number(process.env.CHARIOT_PROMPT_PORT ?? "4311");

function sendJson(
  response: import("node:http").ServerResponse,
  statusCode: number,
  body: unknown,
) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  });
  response.end(JSON.stringify(body));
}

const server = createServer((request, response) => {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  if (request.method === "GET" && request.url === "/api/health") {
    sendJson(response, 200, {
      ok: true,
      service: "prompt-service",
      port,
    });
    return;
  }

  if (request.method === "POST" && request.url === "/api/prompt/compile") {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      try {
        const payload = JSON.parse(body) as HermitPromptCompileRequest;
        const result = buildCompiledHermitPrompt(payload);
        sendJson(response, 200, result);
      } catch (error) {
        sendJson(response, 400, {
          ok: false,
          error:
            error instanceof Error
              ? error.message
              : "Unable to compile prompt",
        });
      }
    });

    return;
  }

  if (request.method === "POST" && request.url === "/api/prompt/polish") {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      try {
        const payload = JSON.parse(body) as HermitPromptPolishRequest;
        const result = buildPolishedHermitPrompt(payload);
        sendJson(response, 200, result);
      } catch (error) {
        sendJson(response, 400, {
          ok: false,
          error:
            error instanceof Error
              ? error.message
              : "Unable to polish prompt",
        });
      }
    });

    return;
  }

  sendJson(response, 404, {
    ok: false,
    error: "Not found",
  });
});

server.listen(port, () => {
  console.log(`Chariot prompt-service listening on http://localhost:${port}`);
});
