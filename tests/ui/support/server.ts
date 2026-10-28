import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { appPort, cockpitPort, cockpitOrigin } from "./ports";

let guest: Record<string, unknown>;
let requests = 0;
let guests: Record<string, unknown>[];
let timeline: unknown = [];
let timelineFails = false;
function reset() {
  guest = { _id: "guest-1", name: "Alex Beispiel", groups: [], hosts: [], accepted: false, invited: false, companion: false, checked_in: false, points: 0 };
  guests = [guest];
  requests = 0;
  timeline = [];
  timelineFails = false;
}
reset();

const cockpit = createServer(async (request, response) => {
  response.setHeader("Content-Type", "application/json");
  if (request.url === "/__test/reset") { reset(); response.end("{}"); return; }
  if (request.url === "/__test/state") { response.end(JSON.stringify({ guest, guests, requests })); return; }
  if (request.url === "/__test/guests" && request.method === "POST") {
    let body = "";
    for await (const chunk of request) body += chunk;
    guests = JSON.parse(body);
    guest = guests[0];
    response.end("{}");
    return;
  }
  if (request.url === "/__test/timeline" && request.method === "POST") {
    let body = "";
    for await (const chunk of request) body += chunk;
    const data = JSON.parse(body);
    timeline = data.entries;
    timelineFails = data.fail === true;
    response.end("{}");
    return;
  }
  requests += 1;
  if (request.headers["api-key"] !== "isolated-test-key") { response.writeHead(401).end("{}"); return; }

  if (request.url === "/api/content/items/timeline") {
    if (timelineFails) response.writeHead(503).end(JSON.stringify({ error: "private upstream detail" }));
    else response.end(JSON.stringify(timeline));
  }
  else if (request.url?.startsWith("/api/content/items/guests")) response.end(JSON.stringify(guests));
  else if (request.url === "/api/content/item/guests/guest-1") response.end(JSON.stringify(guest));
  else if (request.url === "/api/content/item/guests" && request.method === "POST") {
    let body = "";
    for await (const chunk of request) body += chunk;
    const data = JSON.parse(body).data;
    const saved = data._id ? guests.find(item => item._id === data._id) : { _id: `guest-${guests.length + 1}` };
    if (!saved) { response.writeHead(404).end("{}"); return; }
    Object.assign(saved, data);
    if (!data._id) guests.push(saved);
    response.end(JSON.stringify(saved));
  } else { response.writeHead(404).end("{}"); }
});

cockpit.listen(cockpitPort, "127.0.0.1");
const production = process.env.ADMIN_TEST_PRODUCTION === "1";
const next = spawn(process.execPath, ["node_modules/next/dist/bin/next", production ? "start" : "dev", ...(production ? [] : ["--webpack"]), "--hostname", "127.0.0.1", "--port", String(appPort)], {
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_TEST_DIST_DIR: production ? ".next-admin-build" : ".next-admin-tests",
    COCKPIT_API_URL: `${cockpitOrigin}/api`,
    COCKPIT_API_KEY: "isolated-test-key",
    ADMIN_PASSWORD: "birthday test password",
  },
});

function stop() {
  next.kill("SIGTERM");
  cockpit.close();
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
next.on("exit", code => { cockpit.close(); process.exitCode = code ?? 0; });
