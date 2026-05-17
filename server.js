const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { URLSearchParams } = require("node:url");

const root = __dirname;
const localDataPath = path.join(root, ".photora-data.json");
const sessions = new Map();

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
  sessionSecret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"),
  superAdminEmail: process.env.SUPER_ADMIN_EMAIL || "admin@photora.local",
  superAdminPassword: process.env.SUPER_ADMIN_PASSWORD || "ChangeMe123!",
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

const seedPhotos = [
  {
    title: "Konvo Seri Gemilang #018",
    creator_name: "Lensa Ilmu Studio",
    category: "Konvokesyen",
    price_eth: 0.42,
    image_url: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80",
    description: "Foto konvokesyen asli untuk koleksi digital.",
    source_type: "dslr",
    status: "approved",
  },
  {
    title: "Kuala Lumpur Street #088",
    creator_name: "Urban Archive",
    category: "Street",
    price_eth: 0.35,
    image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=900&q=80",
    description: "Street photography daripada kamera sebenar.",
    source_type: "mobilegraphy",
    status: "approved",
  },
  {
    title: "Mobile Rain Walk #009",
    creator_name: "Pocket Lens MY",
    category: "Mobilegraphy",
    price_eth: 0.14,
    image_url: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80",
    description: "Mobilegraphy asli untuk marketplace Photora.",
    source_type: "mobilegraphy",
    status: "approved",
  },
];

function sendJson(res, statusCode, payload, extraHeaders = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    ...extraHeaders,
  });
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

function parseCookies(req) {
  return Object.fromEntries(
    String(req.headers.cookie || "")
      .split(";")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const index = entry.indexOf("=");
        return [entry.slice(0, index), decodeURIComponent(entry.slice(index + 1))];
      }),
  );
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
  return `pbkdf2$${salt}$${hash}`;
}

function verifyPassword(password, stored) {
  const [, salt, expected] = String(stored).split("$");
  if (!salt || !expected) return false;
  const actual = hashPassword(password, salt).split("$")[2];
  return crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

function createSession(user) {
  const token = crypto
    .createHmac("sha256", config.sessionSecret)
    .update(`${user.id}:${Date.now()}:${crypto.randomBytes(16).toString("hex")}`)
    .digest("hex");
  sessions.set(token, {
    userId: user.id,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
  });
  return token;
}

function clearExpiredSessions() {
  const now = Date.now();
  sessions.forEach((session, token) => {
    if (session.expiresAt < now) sessions.delete(token);
  });
}

async function optionalMysql() {
  if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) return null;
  try {
    const mysql = require("mysql2/promise");
    return mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 8,
      namedPlaceholders: true,
    });
  } catch (error) {
    console.warn("MySQL driver unavailable, using local JSON store:", error.message);
    return null;
  }
}

function loadLocalData() {
  if (fs.existsSync(localDataPath)) {
    const data = JSON.parse(fs.readFileSync(localDataPath, "utf8"));
    const superAdmin = data.users.find((user) => user.role === "super_admin");
    if (superAdmin && superAdmin.email !== config.superAdminEmail) {
      superAdmin.email = config.superAdminEmail;
      saveLocalData(data);
    }
    return data;
  }
  const data = {
    counters: { users: 1, photos: seedPhotos.length, orders: 0 },
    users: [
      {
        id: 1,
        name: "Super Admin",
        email: config.superAdminEmail,
        password_hash: hashPassword(config.superAdminPassword),
        role: "super_admin",
        status: "active",
        created_at: new Date().toISOString(),
      },
    ],
    photos: seedPhotos.map((photo, index) => ({ id: index + 1, creator_id: null, created_at: new Date().toISOString(), ...photo })),
    orders: [],
  };
  fs.writeFileSync(localDataPath, JSON.stringify(data, null, 2));
  return data;
}

function saveLocalData(data) {
  fs.writeFileSync(localDataPath, JSON.stringify(data, null, 2));
}

function createLocalStore() {
  const data = loadLocalData();

  return {
    async init() {},
    async getUserByEmail(email) {
      return data.users.find((user) => user.email.toLowerCase() === String(email).toLowerCase()) || null;
    },
    async getUserById(id) {
      return data.users.find((user) => user.id === Number(id)) || null;
    },
    async createUser(input) {
      const user = {
        id: ++data.counters.users,
        name: input.name,
        email: input.email,
        password_hash: hashPassword(input.password),
        role: input.role || "user",
        status: "active",
        created_at: new Date().toISOString(),
      };
      data.users.push(user);
      saveLocalData(data);
      return user;
    },
    async listUsers() {
      return data.users.map(publicUser);
    },
    async listPhotos({ includePending = false } = {}) {
      return data.photos.filter((photo) => includePending || photo.status === "approved");
    },
    async createPhoto(input, user) {
      const photo = {
        id: ++data.counters.photos,
        title: input.title,
        creator_id: user.id,
        creator_name: user.name,
        category: input.category,
        price_eth: Number(input.price_eth || input.price || 0),
        image_url: input.image_url || input.image,
        description: input.description || "",
        source_type: input.source_type || "mobilegraphy",
        status: user.role === "user" ? "pending" : "approved",
        created_at: new Date().toISOString(),
      };
      data.photos.unshift(photo);
      saveLocalData(data);
      return photo;
    },
    async updatePhotoStatus(id, status) {
      const photo = data.photos.find((item) => item.id === Number(id));
      if (!photo) return null;
      photo.status = status;
      saveLocalData(data);
      return photo;
    },
    async getPhotoById(id) {
      return data.photos.find((photo) => photo.id === Number(id)) || null;
    },
    async createOrder(input) {
      const order = {
        id: ++data.counters.orders,
        order_ref: input.order_ref,
        buyer_id: input.buyer_id || null,
        photo_id: input.photo_id || null,
        amount_myr: input.amount_myr,
        amount_eth: input.amount_eth,
        payment_provider: input.payment_provider || "ToyyibPay",
        payment_status: input.payment_status || "pending",
        bill_code: input.bill_code || null,
        created_at: new Date().toISOString(),
      };
      data.orders.unshift(order);
      saveLocalData(data);
      return order;
    },
    async updateOrderStatus(orderRef, status, billCode) {
      const order = data.orders.find((item) => item.order_ref === orderRef);
      if (!order) return null;
      order.payment_status = status;
      if (billCode) order.bill_code = billCode;
      saveLocalData(data);
      return order;
    },
    async listOrders() {
      return data.orders;
    },
  };
}

function createMysqlStore(pool) {
  return {
    async init() {
      const schema = fs
        .readFileSync(path.join(root, "schema.sql"), "utf8")
        .split(";")
        .map((statement) => statement.trim())
        .filter(Boolean);
      for (const statement of schema) {
        try {
          await pool.query(statement);
        } catch (error) {
          if (error.code !== "ER_DUP_KEYNAME") throw error;
        }
      }
      const [rows] = await pool.execute("SELECT id FROM users WHERE role = 'super_admin' ORDER BY id ASC LIMIT 1");
      if (rows.length === 0) {
        await pool.execute(
          "INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, 'super_admin', 'active')",
          ["Super Admin", config.superAdminEmail, hashPassword(config.superAdminPassword)],
        );
      } else {
        await pool.execute("UPDATE users SET email = ? WHERE id = ? AND email <> ?", [config.superAdminEmail, rows[0].id, config.superAdminEmail]);
      }
      const [photoRows] = await pool.execute("SELECT id FROM photos LIMIT 1");
      if (photoRows.length === 0) {
        for (const photo of seedPhotos) {
          await pool.execute(
            "INSERT INTO photos (title, creator_name, category, price_eth, image_url, description, source_type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
              photo.title,
              photo.creator_name,
              photo.category,
              photo.price_eth,
              photo.image_url,
              photo.description,
              photo.source_type,
              photo.status,
            ],
          );
        }
      }
    },
    async getUserByEmail(email) {
      const [rows] = await pool.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
      return rows[0] || null;
    },
    async getUserById(id) {
      const [rows] = await pool.execute("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
      return rows[0] || null;
    },
    async createUser(input) {
      const [result] = await pool.execute(
        "INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, ?, 'active')",
        [input.name, input.email, hashPassword(input.password), input.role || "user"],
      );
      return this.getUserById(result.insertId);
    },
    async listUsers() {
      const [rows] = await pool.execute("SELECT id, name, email, role, status, created_at FROM users ORDER BY id DESC");
      return rows;
    },
    async listPhotos({ includePending = false } = {}) {
      const sql = includePending
        ? "SELECT * FROM photos ORDER BY id DESC"
        : "SELECT * FROM photos WHERE status = 'approved' ORDER BY id DESC";
      const [rows] = await pool.execute(sql);
      return rows;
    },
    async createPhoto(input, user) {
      const status = user.role === "user" ? "pending" : "approved";
      const [result] = await pool.execute(
        "INSERT INTO photos (title, creator_id, creator_name, category, price_eth, image_url, description, source_type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          input.title,
          user.id,
          user.name,
          input.category,
          Number(input.price_eth || input.price || 0),
          input.image_url || input.image,
          input.description || "",
          input.source_type || "mobilegraphy",
          status,
        ],
      );
      return this.getPhotoById(result.insertId);
    },
    async updatePhotoStatus(id, status) {
      await pool.execute("UPDATE photos SET status = ? WHERE id = ?", [status, id]);
      return this.getPhotoById(id);
    },
    async getPhotoById(id) {
      const [rows] = await pool.execute("SELECT * FROM photos WHERE id = ? LIMIT 1", [id]);
      return rows[0] || null;
    },
    async createOrder(input) {
      await pool.execute(
        "INSERT INTO orders (order_ref, buyer_id, photo_id, amount_myr, amount_eth, payment_provider, payment_status, bill_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          input.order_ref,
          input.buyer_id || null,
          input.photo_id || null,
          input.amount_myr,
          input.amount_eth,
          input.payment_provider || "ToyyibPay",
          input.payment_status || "pending",
          input.bill_code || null,
        ],
      );
      return input;
    },
    async updateOrderStatus(orderRef, status, billCode) {
      await pool.execute("UPDATE orders SET payment_status = ?, bill_code = COALESCE(?, bill_code) WHERE order_ref = ?", [
        status,
        billCode || null,
        orderRef,
      ]);
    },
    async listOrders() {
      const [rows] = await pool.execute(
        "SELECT orders.*, photos.title AS photo_title, users.email AS buyer_email FROM orders LEFT JOIN photos ON photos.id = orders.photo_id LEFT JOIN users ON users.id = orders.buyer_id ORDER BY orders.id DESC",
      );
      return rows;
    },
  };
}

let store;

async function getStore() {
  if (store) return store;
  const pool = await optionalMysql();
  store = pool ? createMysqlStore(pool) : createLocalStore();
  await store.init();
  return store;
}

async function currentUser(req) {
  clearExpiredSessions();
  const token = parseCookies(req).photora_session;
  const session = token && sessions.get(token);
  if (!session) return null;
  const db = await getStore();
  return db.getUserById(session.userId);
}

function requireRole(user, roles) {
  return user && user.status === "active" && roles.includes(user.role);
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

  if (!response.ok) throw new Error(`toyyibPay returned HTTP ${response.status}`);
  return data;
}

async function getCategoryCode() {
  if (config.categoryCode) return config.categoryCode;
  if (!config.autoCreateCategory) throw new Error("TOYYIBPAY_CATEGORY_CODE is required when auto-create is disabled.");

  const result = await postToyyib("/index.php/api/createCategory", {
    userSecretKey: config.secretKey,
    catname: "Photora NFT Marketplace",
    catdescription: "Photora photo NFT payments",
  });

  const categoryCode = Array.isArray(result) && result[0] && result[0].CategoryCode;
  if (!categoryCode) throw new Error("Unable to create ToyyibPay category.");
  config.categoryCode = categoryCode;
  return categoryCode;
}

async function handleAuth(req, res, pathname) {
  const db = await getStore();

  if (req.method === "GET" && pathname === "/api/me") {
    sendJson(res, 200, { user: publicUser(await currentUser(req)) });
    return true;
  }

  if (req.method === "POST" && pathname === "/api/auth/register") {
    const payload = await readJson(req);
    if (!payload.name || !payload.email || !payload.password) {
      sendJson(res, 400, { error: "Name, email and password are required." });
      return true;
    }
    if (await db.getUserByEmail(payload.email)) {
      sendJson(res, 409, { error: "Email already registered." });
      return true;
    }
    const user = await db.createUser({ name: payload.name, email: payload.email, password: payload.password, role: "user" });
    const token = createSession(user);
    sendJson(res, 201, { user: publicUser(user) }, { "Set-Cookie": cookieHeader(token) });
    return true;
  }

  if (req.method === "POST" && pathname === "/api/auth/login") {
    const payload = await readJson(req);
    const user = await db.getUserByEmail(payload.email || "");
    if (!user || !verifyPassword(payload.password || "", user.password_hash) || user.status !== "active") {
      sendJson(res, 401, { error: "Invalid login." });
      return true;
    }
    const token = createSession(user);
    sendJson(res, 200, { user: publicUser(user) }, { "Set-Cookie": cookieHeader(token) });
    return true;
  }

  if (req.method === "POST" && pathname === "/api/auth/logout") {
    const token = parseCookies(req).photora_session;
    if (token) sessions.delete(token);
    sendJson(res, 200, { ok: true }, { "Set-Cookie": "photora_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0" });
    return true;
  }

  return false;
}

function cookieHeader(token) {
  return `photora_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`;
}

async function handleApi(req, res, pathname) {
  const db = await getStore();

  if (await handleAuth(req, res, pathname)) return true;

  if (req.method === "GET" && pathname === "/api/photos") {
    const user = await currentUser(req);
    const includePending = requireRole(user, ["admin", "super_admin"]);
    sendJson(res, 200, { photos: await db.listPhotos({ includePending }) });
    return true;
  }

  if (req.method === "POST" && pathname === "/api/photos") {
    const user = await currentUser(req);
    if (!user) {
      sendJson(res, 401, { error: "Login required." });
      return true;
    }
    const payload = await readJson(req);
    if (!payload.title || !payload.category || !payload.image_url) {
      sendJson(res, 400, { error: "Title, category and image URL are required." });
      return true;
    }
    const photo = await db.createPhoto(payload, user);
    sendJson(res, 201, { photo });
    return true;
  }

  const statusMatch = pathname.match(/^\/api\/cms\/photos\/(\d+)\/status$/);
  if (req.method === "PATCH" && statusMatch) {
    const user = await currentUser(req);
    if (!requireRole(user, ["admin", "super_admin"])) {
      sendJson(res, 403, { error: "Admin access required." });
      return true;
    }
    const payload = await readJson(req);
    const allowed = ["pending", "approved", "rejected"];
    if (!allowed.includes(payload.status)) {
      sendJson(res, 400, { error: "Invalid status." });
      return true;
    }
    sendJson(res, 200, { photo: await db.updatePhotoStatus(statusMatch[1], payload.status) });
    return true;
  }

  if (req.method === "GET" && pathname === "/api/cms/users") {
    const user = await currentUser(req);
    if (!requireRole(user, ["super_admin"])) {
      sendJson(res, 403, { error: "Super admin access required." });
      return true;
    }
    sendJson(res, 200, { users: await db.listUsers() });
    return true;
  }

  if (req.method === "GET" && pathname === "/api/cms/orders") {
    const user = await currentUser(req);
    if (!requireRole(user, ["admin", "super_admin"])) {
      sendJson(res, 403, { error: "Admin access required." });
      return true;
    }
    sendJson(res, 200, { orders: await db.listOrders() });
    return true;
  }

  return false;
}

async function handleCreateBill(req, res) {
  if (!config.secretKey) {
    sendJson(res, 500, { error: "TOYYIBPAY_SECRET_KEY is not configured on the server." });
    return;
  }

  const db = await getStore();
  const user = await currentUser(req);
  const payload = await readJson(req);
  const amountCents = Number(payload.amountCents);
  if (!Number.isInteger(amountCents) || amountCents < 100) {
    sendJson(res, 400, { error: "amountCents must be an integer of at least 100." });
    return;
  }

  const orderId = `PHOTORA_${Date.now()}_${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  const billName = sanitizeToyyibText(payload.title, "Photora NFT", 30);
  const billDescription = sanitizeToyyibText(`Photora real photo NFT ${payload.title || ""}`, "Photora real photo NFT", 100);
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
    billTo: sanitizeToyyibText(payload.customerName || user?.name, "Photora Buyer", 30),
    billEmail: payload.customerEmail || user?.email || "buyer@example.com",
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

  await db.createOrder({
    order_ref: orderId,
    buyer_id: user?.id,
    photo_id: payload.photoId || null,
    amount_myr: amountCents / 100,
    amount_eth: Number(payload.amountEth || 0),
    payment_status: "pending",
    bill_code: billCode,
  });

  sendJson(res, 200, {
    billCode,
    orderId,
    checkoutUrl: `${config.baseUrl}/${billCode}`,
  });
}

async function handleCallback(req, res) {
  const db = await getStore();
  const chunks = [];
  req.on("data", (chunk) => chunks.push(chunk));
  req.on("end", async () => {
    const form = new URLSearchParams(Buffer.concat(chunks).toString("utf8"));
    const status = form.get("status") || "";
    const orderId = form.get("order_id") || form.get("billExternalReferenceNo") || "";
    const refno = form.get("refno") || "";
    const billCode = form.get("billcode") || form.get("billCode") || "";
    const receivedHash = form.get("hash") || "";
    const expectedHash = crypto.createHash("md5").update(`${config.secretKey}${status}${orderId}${refno}ok`).digest("hex");

    if (receivedHash && receivedHash !== expectedHash) {
      sendJson(res, 400, { ok: false, error: "Invalid callback hash." });
      return;
    }

    const paymentStatus = status === "1" ? "paid" : status === "3" ? "failed" : "pending";
    if (orderId) await db.updateOrderStatus(orderId, paymentStatus, billCode);
    sendJson(res, 200, { ok: true });
  });
}

function serveStatic(req, res) {
  const requestUrl = new URL(req.url, config.appBaseUrl);
  const safePath = path.normalize(decodeURIComponent(requestUrl.pathname)).replace(/^(\.\.[/\\])+/, "");
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
    const requestUrl = new URL(req.url, config.appBaseUrl);

    if (req.method === "POST" && requestUrl.pathname === "/api/toyyibpay/create-bill") {
      await handleCreateBill(req, res);
      return;
    }

    if (req.method === "POST" && requestUrl.pathname === "/api/toyyibpay/callback") {
      await handleCallback(req, res);
      return;
    }

    if (requestUrl.pathname.startsWith("/api/") && (await handleApi(req, res, requestUrl.pathname))) return;

    if (req.method === "GET") {
      serveStatic(req, res);
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Server error" });
  }
});

getStore()
  .then(() => {
    server.listen(config.port, () => {
      console.log(`Photora server running at http://localhost:${config.port}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
