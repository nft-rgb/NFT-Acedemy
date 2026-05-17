const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { URLSearchParams } = require("node:url");

const root = __dirname;

function loadEnv() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;

  fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .forEach((line) => {
      const index = line.indexOf("=");
      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    });
}

loadEnv();

const config = {
  port: Number(process.env.PORT || 4173),
  baseUrl: process.env.TOYYIBPAY_BASE_URL || "https://dev.toyyibpay.com",
  secretKey: process.env.TOYYIBPAY_SECRET_KEY || "",
  categoryCode: process.env.TOYYIBPAY_CATEGORY_CODE || "",
  autoCreateCategory: process.env.TOYYIBPAY_AUTO_CREATE_CATEGORY !== "false",
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:4173",
  callbackUrl: process.env.TOYYIBPAY_CALLBACK_URL || "",
};

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
  });
}

function sanitizeToyyibText(value, fallback, maxLength) {
  const cleaned = String(value || fallback)
    .replace(/[^a-zA-Z0-9 _]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return (cleaned || fallback).slice(0, maxLength);
}

async function postToyyib(pathname, fields) {
  const response = await fetch(`${config.baseUrl}${pathname}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(fields),
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(`toyyibPay returned HTTP ${response.status}`);
  }

  return data;
}

async function getCategoryCode() {
  if (config.categoryCode) return config.categoryCode;
  if (!config.autoCreateCategory) {
    throw new Error("TOYYIBPAY_CATEGORY_CODE is required when auto-create is disabled.");
  }

  const result = await postToyyib("/index.php/api/createCategory", {
    userSecretKey: config.secretKey,
    catname: "Photora NFT Marketplace",
    catdescription: "Photora photo NFT payments",
  });

  const categoryCode = Array.isArray(result) && result[0] && result[0].CategoryCode;
  if (!categoryCode) {
    throw new Error("Unable to create ToyyibPay category.");
  }

  config.categoryCode = categoryCode;
  return categoryCode;
}

async function handleCreateBill(req, res) {
  if (!config.secretKey) {
    sendJson(res, 500, {
      error: "TOYYIBPAY_SECRET_KEY is not configured on the server.",
    });
    return;
  }

  const payload = await readJson(req);
  const amountCents = Number(payload.amountCents);
  if (!Number.isInteger(amountCents) || amountCents < 100) {
    sendJson(res, 400, { error: "amountCents must be an integer of at least 100." });
    return;
  }

  const orderId = `PHOTORA_${Date.now()}_${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  const billName = sanitizeToyyibText(payload.title, "Photora NFT", 30);
  const billDescription = sanitizeToyyibText(
    `Photora real photo NFT ${payload.title || ""}`,
    "Photora real photo NFT",
    100,
  );
  const categoryCode = await getCategoryCode();

  const result = await postToyyib("/index.php/api/createBill", {
    userSecretKey: config.secretKey,
    categoryCode,
    billName,
    billDescription,
    billPriceSetting: "1",
    billPayorInfo: "1",
    billAmount: String(amountCents),
    billReturnUrl: `${config.appBaseUrl}/#checkout`,
    billCallbackUrl: config.callbackUrl,
    billExternalReferenceNo: orderId,
    billTo: sanitizeToyyibText(payload.customerName, "Photora Buyer", 30),
    billEmail: payload.customerEmail || "buyer@example.com",
    billPhone: payload.customerPhone || "0100000000",
    billSplitPayment: "0",
    billSplitPaymentArgs: "",
    billPaymentChannel: "0",
    billContentEmail: "Thank you for purchasing from Photora.",
    billChargeToCustomer: "1",
    billExpiryDays: "3",
  });

  const billCode = Array.isArray(result) && result[0] && result[0].BillCode;
  if (!billCode) {
    sendJson(res, 502, { error: "ToyyibPay did not return a BillCode.", raw: result });
    return;
  }

  sendJson(res, 200, {
    billCode,
    orderId,
    checkoutUrl: `${config.baseUrl}/${billCode}`,
  });
}

async function handleCallback(req, res) {
  const chunks = [];
  req.on("data", (chunk) => chunks.push(chunk));
  req.on("end", () => {
    const form = new URLSearchParams(Buffer.concat(chunks).toString("utf8"));
    const status = form.get("status") || "";
    const orderId = form.get("order_id") || "";
    const refno = form.get("refno") || "";
    const receivedHash = form.get("hash") || "";
    const expectedHash = crypto
      .createHash("md5")
      .update(`${config.secretKey}${status}${orderId}${refno}ok`)
      .digest("hex");

    if (receivedHash && receivedHash !== expectedHash) {
      sendJson(res, 400, { ok: false, error: "Invalid callback hash." });
      return;
    }

    sendJson(res, 200, { ok: true });
  });
}

function serveStatic(req, res) {
  const requestUrl = new URL(req.url, config.appBaseUrl);
  const safePath = path
    .normalize(decodeURIComponent(requestUrl.pathname))
    .replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(root, safePath === "/" ? "index.html" : safePath);

  if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const ext = path.extname(filePath);
  res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/api/toyyibpay/create-bill") {
      await handleCreateBill(req, res);
      return;
    }

    if (req.method === "POST" && req.url === "/api/toyyibpay/callback") {
      await handleCallback(req, res);
      return;
    }

    if (req.method === "GET") {
      serveStatic(req, res);
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Server error" });
  }
});

server.listen(config.port, () => {
  console.log(`Photora server running at http://localhost:${config.port}`);
});
