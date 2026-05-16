const fs = require("fs");
const path = require("path");
const http = require("http");
const net = require("net");
const express = require("express");
const cors = require("cors");
const expressionsApi = require("./expressionsApi");
const { importExpressions, initDb } = require("./db");

const PORT = Number.parseInt(process.env.PORT, 10) || 3300;
const FRONTEND_PORT = Number.parseInt(process.env.FRONTEND_PORT, 10) || 3301;
const buildDir = path.resolve(__dirname, "../frontend/build");
const viteOrigin = `http://127.0.0.1:${FRONTEND_PORT}`;
const isDevelopment = process.env.NODE_ENV !== "production";

function isHtmlRequest(request) {
  const accept = request.headers.accept || "";
  return request.method === "GET" && accept.includes("text/html");
}

function createFriendlyPage() {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>K-Expression Learner</title>
        <style>
          body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #09111f;
            color: #f5f7fb;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }
          main {
            width: min(680px, calc(100% - 32px));
            padding: 32px;
            border-radius: 24px;
            background: rgba(12, 22, 41, 0.92);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
          }
          code {
            background: rgba(255,255,255,0.08);
            padding: 2px 8px;
            border-radius: 999px;
          }
        </style>
      </head>
      <body>
        <main>
          <h1>K-Expression Learner is ready</h1>
          <p>The API server is running on <code>http://localhost:${PORT}</code>.</p>
          <p>Start the frontend dev server with <code>cd src/frontend && npm install && npm start</code>, or build the frontend with <code>npm run build</code> from the project root.</p>
        </main>
      </body>
    </html>
  `;
}

function proxyHttpRequest(request, response) {
  const target = new URL(request.url, viteOrigin);
  const proxyRequest = http.request(
    target,
    {
      method: request.method,
      headers: {
        ...request.headers,
        host: `127.0.0.1:${FRONTEND_PORT}`,
      },
    },
    (proxyResponse) => {
      response.writeHead(proxyResponse.statusCode || 200, proxyResponse.headers);
      proxyResponse.pipe(response, { end: true });
    },
  );

  proxyRequest.on("error", () => {
    if (isHtmlRequest(request)) {
      response.status(200).send(createFriendlyPage());
      return;
    }

    response.status(502).json({
      error: "Frontend dev server is not available. Start it with `npm start` in src/frontend.",
    });
  });

  request.pipe(proxyRequest, { end: true });
}

function proxyWebSocket(request, socket, head) {
  const targetSocket = net.connect(FRONTEND_PORT, "127.0.0.1", () => {
    let requestHeaders = `${request.method} ${request.url} HTTP/${request.httpVersion}\r\n`;

    for (const [header, value] of Object.entries(request.headers)) {
      requestHeaders += `${header}: ${value}\r\n`;
    }

    requestHeaders += "\r\n";
    targetSocket.write(requestHeaders);

    if (head && head.length > 0) {
      targetSocket.write(head);
    }

    socket.pipe(targetSocket).pipe(socket);
  });

  targetSocket.on("error", () => {
    socket.destroy();
  });
}

async function startServer() {
  await initDb();
  await importExpressions();

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api/expressions", expressionsApi);

  const hasBuild = fs.existsSync(buildDir);

  if (!isDevelopment && hasBuild) {
    app.use(express.static(buildDir));
    app.get("*", (request, response, next) => {
      if (request.path.startsWith("/api/")) {
        next();
        return;
      }

      response.sendFile(path.join(buildDir, "index.html"));
    });
  } else {
    app.use((request, response, next) => {
      if (request.path.startsWith("/api/")) {
        next();
        return;
      }

      proxyHttpRequest(request, response);
    });
  }

  const server = http.createServer(app);

  server.on("upgrade", (request, socket, head) => {
    if (isDevelopment) {
      proxyWebSocket(request, socket, head);
      return;
    }

    socket.destroy();
  });

  server.listen(PORT, () => {
    console.log(`K-Expression Learner server running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start the server:", error);
  process.exit(1);
});
