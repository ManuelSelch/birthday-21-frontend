import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { createPasswordHash } from "../../../features/admin-auth/infra/security";

let guest: Record<string, unknown>;
let requests = 0;
function reset() {
  guest = { _id: "guest-1", name: "Alex Beispiel", accepted: false, invited: false, companion: false, checked_in: false, points: 0 };
  requests = 0;
}
reset();

const cockpit = createServer(async (request, response) => {
  response.setHeader("Content-Type", "application/json");
  if (request.url === "/__test/reset") { reset(); response.end("{}"); return; }
  if (request.url === "/__test/state") { response.end(JSON.stringify({ guest, requests })); return; }
  requests += 1;
  if (request.headers["api-key"] !== "isolated-test-key") { response.writeHead(401).end("{}"); return; }

  if (request.url?.startsWith("/api/content/items/guests")) response.end(JSON.stringify([guest]));
  else if (request.url === "/api/content/item/guests/guest-1") response.end(JSON.stringify(guest));
  else if (request.url === "/api/content/item/guests" && request.method === "POST") {
    let body = "";
    for await (const chunk of request) body += chunk;
    Object.assign(guest, JSON.parse(body).data);
    response.end(JSON.stringify(guest));
  } else { response.writeHead(404).end("{}"); }
});

cockpit.listen(3188, "127.0.0.1");
const production = process.env.ADMIN_TEST_PRODUCTION === "1";
const next = spawn(process.execPath, ["node_modules/next/dist/bin/next", production ? "start" : "dev", ...(production ? [] : ["--webpack"]), "--hostname", "127.0.0.1", "--port", "3187"], {
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_TEST_DIST_DIR: production ? ".next-admin-build" : ".next-admin-tests",
    COCKPIT_API_URL: "http://127.0.0.1:3188/api",
    COCKPIT_API_KEY: "isolated-test-key",
    ADMIN_PASSWORD_HASH: createPasswordHash("birthday test password"),
    ADMIN_SESSION_SECRET: "isolated-test-secret-".repeat(4),
    APP_ORIGIN: production ? "https://localhost:3187" : "http://localhost:3187",
  },
});

function stop() {
  next.kill("SIGTERM");
  cockpit.close();
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
next.on("exit", code => { cockpit.close(); process.exitCode = code ?? 0; });
