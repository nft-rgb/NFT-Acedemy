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
    phone: user.phone || "",
    wallet_crypto: user.wallet_crypto || "",
    wallet_cash: user.wallet_cash || "",
    luno_wallet: user.luno_wallet || "",
    preferred_currency: user.preferred_currency || "MYR",
  };
}

function makeAuthenticityCode(input) {
  const source = `${input.title || ""}|${input.image_url || input.image || ""}|${input.creator_name || ""}|${Date.now()}`;
  return `PHOTORA-${crypto.createHash("sha256").update(source).digest("hex").slice(0, 16).toUpperCase()}`;
}

function makePerceptualHash(value) {
  return crypto.createHash("sha256").update(String(value || "")).digest("hex");
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
    data.news ||= [
      {
        id: 1,
        author_id: 1,
        title: "Photora portal kini menyokong photo authenticity scan",
        body: "Setiap foto berdaftar mempunyai kod khas Photora untuk semakan keaslian.",
        status: "published",
        created_at: new Date().toISOString(),
      },
    ];
    data.counters ||= {};
    data.counters.news ||= data.news.length;
    const superAdmin = data.users.find((user) => user.role === "super_admin");
    if (superAdmin && superAdmin.email !== config.superAdminEmail) {
      superAdmin.email = config.superAdminEmail;
      saveLocalData(data);
    }
    return data;
  }
  const data = {
    counters: { users: 1, photos: seedPhotos.length, orders: 0, news: 1 },
    users: [
      {
        id: 1,
        name: "Super Admin",
        email: config.superAdminEmail,
        password_hash: hashPassword(config.superAdminPassword),
        role: "super_admin",
        status: "active",
        phone: "",
        wallet_crypto: "",
        wallet_cash: "",
        luno_wallet: "",
        preferred_currency: "MYR",
        created_at: new Date().toISOString(),
      },
    ],
    photos: seedPhotos.map((photo, index) => ({ id: index + 1, creator_id: null, created_at: new Date().toISOString(), ...photo })),
    orders: [],
    news: [
      {
        id: 1,
        author_id: 1,
        title: "Photora portal kini menyokong photo authenticity scan",
        body: "Setiap foto berdaftar mempunyai kod khas Photora untuk semakan keaslian.",
        status: "published",
        created_at: new Date().toISOString(),
      },
    ],
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
        phone: "",
        wallet_crypto: "",
        wallet_cash: "",
        luno_wallet: "",
        preferred_currency: "MYR",
        created_at: new Date().toISOString(),
      };
      data.users.push(user);
      saveLocalData(data);
      return user;
    },
    async listUsers() {
      return data.users.map(publicUser);
    },
    async updateUserProfile(id, input) {
      const user = data.users.find((item) => item.id === Number(id));
      if (!user) return null;
      ["name", "phone", "wallet_crypto", "wallet_cash", "luno_wallet", "preferred_currency"].forEach((key) => {
        if (input[key] !== undefined) user[key] = String(input[key] || "").trim();
      });
      saveLocalData(data);
      return user;
    },
    async updateUserRole(id, input) {
      const user = data.users.find((item) => item.id === Number(id));
      if (!user) return null;
      if (input.role) user.role = input.role;
      if (input.status) user.status = input.status;
      saveLocalData(data);
      return publicUser(user);
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
        authenticity_code: makeAuthenticityCode(input),
        perceptual_hash: makePerceptualHash(input.image_url || input.image),
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
    async verifyPhoto(query) {
      const needle = String(query || "").trim().toLowerCase();
      return (
        data.photos.find((photo) => String(photo.authenticity_code || "").toLowerCase() === needle) ||
        data.photos.find((photo) => String(photo.image_url || "").toLowerCase() === needle) ||
        null
      );
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
    async listNews() {
      return data.news.filter((post) => post.status === "published").sort((a, b) => b.id - a.id);
    },
    async createNews(input, user) {
      const post = {
        id: (data.counters.news = (data.counters.news || data.news.length || 0) + 1),
        author_id: user.id,
        title: input.title,
        body: input.body,
        status: "published",
        created_at: new Date().toISOString(),
      };
      data.news.unshift(post);
      saveLocalData(data);
      return post;
    },
  };
}

async function ensureUserColumns(pool) {
  const columns = [
    ["phone", "VARCHAR(40) NULL"],
    ["wallet_crypto", "VARCHAR(190) NULL"],
    ["wallet_cash", "VARCHAR(190) NULL"],
    ["luno_wallet", "VARCHAR(190) NULL"],
    ["preferred_currency", "VARCHAR(12) NOT NULL DEFAULT 'MYR'"],
  ];

  for (const [column, definition] of columns) {
    try {
      await pool.query(`ALTER TABLE users ADD COLUMN ${column} ${definition}`);
    } catch (error) {
      if (error.code !== "ER_DUP_FIELDNAME") throw error;
    }
  }
  const photoColumns = [
    ["authenticity_code", "VARCHAR(80) NULL UNIQUE"],
    ["perceptual_hash", "VARCHAR(128) NULL"],
  ];
  for (const [column, definition] of photoColumns) {
    try {
      await pool.query(`ALTER TABLE photos ADD COLUMN ${column} ${definition}`);
    } catch (error) {
      if (!["ER_DUP_FIELDNAME", "ER_DUP_KEYNAME"].includes(error.code)) throw error;
    }
  }
}

async function backfillPhotoAuthenticity(pool) {
  const [rows] = await pool.execute("SELECT id, title, image_url, creator_name FROM photos WHERE authenticity_code IS NULL OR authenticity_code = ''");
  for (const row of rows) {
    await pool.execute("UPDATE photos SET authenticity_code = ?, perceptual_hash = ? WHERE id = ?", [
      makeAuthenticityCode(row),
      makePerceptualHash(row.image_url),
      row.id,
    ]);
  }
}

async function seedNews(pool) {
  const [rows] = await pool.execute("SELECT id FROM news_posts LIMIT 1");
  if (rows.length > 0) return;
  const [users] = await pool.execute("SELECT id FROM users WHERE role = 'super_admin' ORDER BY id ASC LIMIT 1");
  await pool.execute("INSERT INTO news_posts (author_id, title, body, status) VALUES (?, ?, ?, 'published')", [
    users[0]?.id || null,
    "Photora portal kini menyokong photo authenticity scan",
    "Setiap foto berdaftar mempunyai kod khas Photora untuk semakan keaslian.",
  ]);
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
      await ensureUserColumns(pool);
      await backfillPhotoAuthenticity(pool);
      await seedNews(pool);
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
            "INSERT INTO photos (title, creator_name, category, price_eth, image_url, authenticity_code, perceptual_hash, description, source_type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              photo.title,
              photo.creator_name,
              photo.category,
              photo.price_eth,
              photo.image_url,
              makeAuthenticityCode(photo),
              makePerceptualHash(photo.image_url),
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
      const [rows] = await pool.execute(
        "SELECT id, name, email, role, status, phone, wallet_crypto, wallet_cash, luno_wallet, preferred_currency, created_at FROM users ORDER BY id DESC",
      );
      return rows;
    },
    async updateUserProfile(id, input) {
      await pool.execute(
        "UPDATE users SET name = COALESCE(?, name), phone = ?, wallet_crypto = ?, wallet_cash = ?, luno_wallet = ?, preferred_currency = ? WHERE id = ?",
        [
          input.name || null,
          input.phone || "",
          input.wallet_crypto || "",
          input.wallet_cash || "",
          input.luno_wallet || "",
          input.preferred_currency || "MYR",
          id,
        ],
      );
      return this.getUserById(id);
    },
    async updateUserRole(id, input) {
      await pool.execute("UPDATE users SET role = COALESCE(?, role), status = COALESCE(?, status) WHERE id = ?", [
        input.role || null,
        input.status || null,
        id,
      ]);
      return publicUser(await this.getUserById(id));
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
        "INSERT INTO photos (title, creator_id, creator_name, category, price_eth, image_url, authenticity_code, perceptual_hash, description, source_type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          input.title,
          user.id,
          user.name,
          input.category,
          Number(input.price_eth || input.price || 0),
          input.image_url || input.image,
          makeAuthenticityCode({ ...input, creator_name: user.name }),
          makePerceptualHash(input.image_url || input.image),
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
    async verifyPhoto(query) {
      const [rows] = await pool.execute(
        "SELECT * FROM photos WHERE authenticity_code = ? OR image_url = ? OR perceptual_hash = ? LIMIT 1",
        [query, query, makePerceptualHash(query)],
      );
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
    async listNews() {
      const [rows] = await pool.execute("SELECT news_posts.*, users.name AS author_name FROM news_posts LEFT JOIN users ON users.id = news_posts.author_id WHERE news_posts.status = 'published' ORDER BY news_posts.id DESC");
      return rows;
    },
    async createNews(input, user) {
      const [result] = await pool.execute("INSERT INTO news_posts (author_id, title, body, status) VALUES (?, ?, ?, 'published')", [
        user.id,
        input.title,
        input.body,
      ]);
      const [rows] = await pool.execute("SELECT * FROM news_posts WHERE id = ? LIMIT 1", [result.insertId]);
      return rows[0] || null;
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

async function getCryptoPrices() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=myr,usd",
      { headers: { accept: "application/json" } },
    );
    if (!response.ok) throw new Error("Crypto price provider unavailable.");
    const data = await response.json();
    return {
      BTC: { myr: data.bitcoin?.myr || 0, usd: data.bitcoin?.usd || 0, provider: "CoinGecko" },
      ETH: { myr: data.ethereum?.myr || 0, usd: data.ethereum?.usd || 0, provider: "CoinGecko" },
      USDT: { myr: data.tether?.myr || 0, usd: data.tether?.usd || 0, provider: "CoinGecko" },
      walletProvider: "LUNO supported for user wallet reference",
    };
  } catch {
    return {
      BTC: { myr: 0, usd: 0, provider: "manual" },
      ETH: { myr: 0, usd: 0, provider: "manual" },
      USDT: { myr: 0, usd: 0, provider: "manual" },
      walletProvider: "LUNO supported for user wallet reference",
    };
  }
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

  if (req.method === "PATCH" && pathname === "/api/me/profile") {
    const user = await currentUser(req);
    if (!user) {
      sendJson(res, 401, { error: "Login required." });
      return true;
    }
    const payload = await readJson(req);
    const updated = await db.updateUserProfile(user.id, {
      name: payload.name,
      phone: payload.phone,
      wallet_crypto: payload.wallet_crypto,
      wallet_cash: payload.wallet_cash,
      luno_wallet: payload.luno_wallet,
      preferred_currency: payload.preferred_currency || "MYR",
    });
    sendJson(res, 200, { user: publicUser(updated) });
    return true;
  }

  if (req.method === "GET" && pathname === "/api/market/crypto-prices") {
    sendJson(res, 200, { prices: await getCryptoPrices() });
    return true;
  }

  if (req.method === "POST" && pathname === "/api/photos/verify") {
    const payload = await readJson(req);
    const photo = await db.verifyPhoto(payload.query || "");
    sendJson(res, 200, {
      valid: Boolean(photo),
      photo: photo
        ? {
            id: photo.id,
            title: photo.title,
            creator_name: photo.creator_name,
            category: photo.category,
            status: photo.status,
            authenticity_code: photo.authenticity_code,
          }
        : null,
    });
    return true;
  }

  if (req.method === "GET" && pathname === "/api/news") {
    sendJson(res, 200, { posts: await db.listNews() });
    return true;
  }

  if (req.method === "POST" && pathname === "/api/news") {
    const user = await currentUser(req);
    if (!requireRole(user, ["admin", "super_admin"])) {
      sendJson(res, 403, { error: "Admin access required." });
      return true;
    }
    const payload = await readJson(req);
    if (!payload.title || !payload.body) {
      sendJson(res, 400, { error: "Title and body are required." });
      return true;
    }
    sendJson(res, 201, { post: await db.createNews(payload, user) });
    return true;
  }

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

  const userRoleMatch = pathname.match(/^\/api\/cms\/users\/(\d+)$/);
  if (req.method === "PATCH" && userRoleMatch) {
    const user = await currentUser(req);
    if (!requireRole(user, ["super_admin"])) {
      sendJson(res, 403, { error: "Super admin access required." });
      return true;
    }
    const payload = await readJson(req);
    const roles = ["user", "admin", "super_admin"];
    const statuses = ["active", "suspended"];
    if (payload.role && !roles.includes(payload.role)) {
      sendJson(res, 400, { error: "Invalid role." });
      return true;
    }
    if (payload.status && !statuses.includes(payload.status)) {
      sendJson(res, 400, { error: "Invalid status." });
      return true;
    }
    sendJson(res, 200, { user: await db.updateUserRole(userRoleMatch[1], payload) });
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
  if (req.method === "HEAD") {
    res.end();
    return;
  }
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

    if (req.method === "GET" || req.method === "HEAD") {
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
