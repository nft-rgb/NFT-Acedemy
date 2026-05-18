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
  mailFrom: process.env.MAIL_FROM || "hello@photora.my",
  whatsappWebhookUrl: process.env.WHATSAPP_WEBHOOK_URL || "",
};

const marketplaceDefaults = {
  serviceFeePercent: 6,
  listingFeeMyr: 2,
  ethToMyr: 15000,
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
    price_myr: 6300,
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
    price_myr: 5250,
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
    price_myr: 2100,
    image_url: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80",
    description: "Mobilegraphy asli untuk marketplace Photora.",
    source_type: "mobilegraphy",
    status: "approved",
  },
];

const seedSlides = [
  {
    eyebrow: "Platform foto NFT rasmi",
    title: "Meraikan Foto Asli, Mengiktiraf Kreator.",
    body:
      "Photora NFT Marketplace membantu jurugambar DSLR dan mobilegraphy menjual foto sebenar sebagai aset digital yang boleh disahkan.",
    image_url: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=2200&q=84",
    primary_label: "Teroka Marketplace",
    primary_page: "market",
    secondary_label: "Panduan Kreator",
    secondary_page: "mint",
    sort_order: 1,
    status: "active",
  },
  {
    eyebrow: "NFT photo drop",
    title: "Jual koleksi konvokesyen, event dan mobilegraphy.",
    body:
      "Creator boleh upload foto, admin semak keaslian, dan buyer boleh bayar dengan wallet atau ToyyibPay.",
    image_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=2200&q=84",
    primary_label: "Mint Foto",
    primary_page: "mint",
    secondary_label: "Semak Keaslian",
    secondary_page: "dashboard",
    sort_order: 2,
    status: "active",
  },
  {
    eyebrow: "Verified real photo",
    title: "Setiap foto ada kod keaslian Photora.",
    body:
      "Marketplace ini fokus kepada foto sebenar daripada kamera DSLR dan mobile phone, bukan gambar AI atau manipulasi berat.",
    image_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2200&q=84",
    primary_label: "Discover",
    primary_page: "market",
    secondary_label: "Login",
    secondary_page: "login",
    sort_order: 3,
    status: "active",
  },
];

function sendJson(res, statusCode, payload, extraHeaders = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    ...extraHeaders,
  });
  res.end(JSON.stringify(payload));
}

function formatMoney(value) {
  return `MYR ${Number(value || 0).toFixed(2)}`;
}

function escapePdfText(value) {
  return String(value ?? "")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function buildReceiptPdf(order, type = "buyer") {
  const receiptType = type === "seller" ? "Resit Jualan Creator" : "Resit Pembelian";
  const receiptNo = `${type === "seller" ? "SALE" : "BUY"}-${order.order_ref}`;
  const gross = Number(order.amount_myr || 0);
  const platformFee = Number(order.platform_fee_myr || 0);
  const creatorPayout = Number(order.creator_payout_myr || Math.max(gross - platformFee, 0));
  const lines = [
    "P  PHOTORA NFT MARKETPLACE",
    "Malaysia Trusted Photography & NFT Creative Ecosystem",
    "",
    receiptType,
    `Receipt No: ${receiptNo}`,
    `Order Ref: ${order.order_ref || "-"}`,
    `Bill Code: ${order.bill_code || "-"}`,
    `Payment Status: ${order.payment_status || "pending"}`,
    `Payment Provider: ${order.payment_provider || "ToyyibPay"}`,
    "",
    `Photo: ${order.photo_title || "Photora digital photo"}`,
    `Buyer: ${order.buyer_name || order.buyer_email || "Guest buyer"}`,
    `Seller: ${order.creator_name || "Photora Creator"}`,
    "",
    `Gross Amount: ${formatMoney(gross)}`,
    `Platform Service Fee 6%: ${formatMoney(platformFee)}`,
    `Creator Payout: ${formatMoney(creatorPayout)}`,
    "",
    `Generated: ${new Date().toLocaleString("en-MY", { timeZone: "Asia/Kuala_Lumpur" })}`,
    "This receipt is generated automatically by Photora after ToyyibPay bill creation or payment update.",
  ];

  const textCommands = lines
    .map((line, index) => {
      const y = 790 - index * 24;
      const fontSize = index === 0 ? 20 : index === 3 ? 17 : 11;
      return `BT /F1 ${fontSize} Tf 50 ${y} Td (${escapePdfText(line)}) Tj ET`;
    })
    .join("\n");
  const stream = `${textCommands}\n`;
  const objects = [];
  const chunks = ["%PDF-1.4\n"];
  const addObject = (content) => {
    const offset = Buffer.byteLength(chunks.join(""), "binary");
    objects.push(offset);
    chunks.push(`${objects.length} 0 obj\n${content}\nendobj\n`);
  };

  addObject("<< /Type /Catalog /Pages 2 0 R >>");
  addObject("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  addObject("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>");
  addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  addObject(`<< /Length ${Buffer.byteLength(stream, "binary")} >>\nstream\n${stream}endstream`);

  const xrefOffset = Buffer.byteLength(chunks.join(""), "binary");
  chunks.push(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`);
  for (const offset of objects) {
    chunks.push(`${String(offset).padStart(10, "0")} 00000 n \n`);
  }
  chunks.push(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);
  return Buffer.from(chunks.join(""), "binary");
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
    avatar_url: user.avatar_url || "",
    address: user.address || "",
    mobile_phone: user.mobile_phone || "",
    wallet_crypto: user.wallet_crypto || "",
    wallet_cash: user.wallet_cash || "",
    luno_wallet: user.luno_wallet || "",
    bank_name: user.bank_name || "",
    bank_account_name: user.bank_account_name || "",
    bank_account_number: user.bank_account_number || "",
    preferred_currency: user.preferred_currency || "MYR",
    email_verified: Boolean(user.email_verified || user.role === "admin" || user.role === "super_admin"),
  };
}

function createRawToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

function makeAppUrl(pathname, params = {}) {
  const url = new URL(pathname, config.appBaseUrl);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return url.toString();
}

async function sendAccountLink(user, type, url) {
  const subject = type === "email_verify" ? "Sahkan akaun Photora" : "Reset password Photora";
  const message =
    type === "email_verify"
      ? `Klik link ini untuk sahkan akaun Photora anda: ${url}`
      : `Klik link ini untuk reset password Photora anda: ${url}`;

  console.log(`[Photora notification] to=${user.email} subject="${subject}" ${url}`);

  if (config.whatsappWebhookUrl && user.phone) {
    await fetch(config.whatsappWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: user.phone, message, subject, email: user.email }),
    }).catch((error) => console.warn("WhatsApp webhook failed:", error.message));
  }

  return {
    channel: config.whatsappWebhookUrl && user.phone ? "email_whatsapp" : "preview",
    to: user.email,
    previewUrl: url,
  };
}

async function issueAccountToken(db, user, type) {
  const rawToken = createRawToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * (type === "email_verify" ? 60 * 24 : 30));
  await db.createAuthToken({
    user_id: user.id,
    token_hash: hashToken(rawToken),
    type,
    expires_at: expiresAt,
  });
  const pathname = type === "email_verify" ? "/api/auth/verify-email" : "/api/auth/reset-password";
  const url = makeAppUrl(pathname, { token: rawToken });
  return sendAccountLink(user, type, url);
}

function makeAuthenticityCode(input) {
  const source = `${input.title || ""}|${input.image_url || input.image || ""}|${input.creator_name || ""}|${Date.now()}`;
  return `PHOTORA-${crypto.createHash("sha256").update(source).digest("hex").slice(0, 16).toUpperCase()}`;
}

function makePerceptualHash(value) {
  return crypto.createHash("sha256").update(String(value || "")).digest("hex");
}

function makeSlug(value) {
  const base = String(value || "photora-news")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
  return `${base || "photora-news"}-${crypto.randomBytes(3).toString("hex")}`;
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
        slug: makeSlug("Photora portal kini menyokong photo authenticity scan"),
        category: "Platform",
        excerpt: "Setiap foto berdaftar mempunyai kod khas Photora untuk semakan keaslian.",
        image_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
        body: "Setiap foto berdaftar mempunyai kod khas Photora untuk semakan keaslian.",
        status: "published",
        created_at: new Date().toISOString(),
      },
    ];
    data.slides ||= seedSlides.map((slide, index) => ({
      id: index + 1,
      created_at: new Date().toISOString(),
      ...slide,
    }));
    data.counters ||= {};
    data.counters.news ||= data.news.length;
    data.counters.slides ||= data.slides.length;
    data.counters.tokens ||= data.auth_tokens?.length || 0;
    data.auth_tokens ||= [];
    data.users.forEach((user) => {
      if (user.email_verified === undefined) user.email_verified = user.role === "admin" || user.role === "super_admin";
    });
    data.news.forEach((post) => {
      post.slug ||= makeSlug(post.title);
      post.category ||= "Platform";
      post.excerpt ||= String(post.body || "").slice(0, 140);
      post.image_url ||= "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80";
    });
    const superAdmin = data.users.find((user) => user.role === "super_admin");
    if (superAdmin && superAdmin.email !== config.superAdminEmail) {
      superAdmin.email = config.superAdminEmail;
      superAdmin.email_verified = true;
      superAdmin.email_verified_at ||= new Date().toISOString();
      saveLocalData(data);
    } else if (superAdmin && !superAdmin.email_verified) {
      superAdmin.email_verified = true;
      superAdmin.email_verified_at ||= new Date().toISOString();
      saveLocalData(data);
    }
    return data;
  }
  const data = {
    counters: { users: 1, photos: seedPhotos.length, orders: 0, news: 1, slides: seedSlides.length, tokens: 0 },
    users: [
      {
        id: 1,
        name: "Super Admin",
        email: config.superAdminEmail,
        password_hash: hashPassword(config.superAdminPassword),
        role: "super_admin",
        status: "active",
        email_verified: true,
        email_verified_at: new Date().toISOString(),
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
    auth_tokens: [],
    news: [
      {
        id: 1,
        author_id: 1,
        title: "Photora portal kini menyokong photo authenticity scan",
        slug: makeSlug("Photora portal kini menyokong photo authenticity scan"),
        category: "Platform",
        excerpt: "Setiap foto berdaftar mempunyai kod khas Photora untuk semakan keaslian.",
        image_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
        body: "Setiap foto berdaftar mempunyai kod khas Photora untuk semakan keaslian.",
        status: "published",
        created_at: new Date().toISOString(),
      },
    ],
    slides: seedSlides.map((slide, index) => ({
      id: index + 1,
      created_at: new Date().toISOString(),
      ...slide,
    })),
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
      const role = input.role || "user";
      const user = {
        id: ++data.counters.users,
        name: input.name,
        email: input.email,
        password_hash: hashPassword(input.password),
        role,
        status: "active",
        email_verified: role === "admin" || role === "super_admin" || Boolean(input.email_verified),
        email_verified_at: role === "admin" || role === "super_admin" || input.email_verified ? new Date().toISOString() : null,
        phone: input.phone || "",
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
    async createAuthToken(input) {
      data.auth_tokens.push({
        id: ++data.counters.tokens,
        user_id: input.user_id,
        token_hash: input.token_hash,
        type: input.type,
        expires_at: input.expires_at.toISOString(),
        consumed_at: null,
        created_at: new Date().toISOString(),
      });
      saveLocalData(data);
    },
    async consumeAuthToken(rawToken, type) {
      const token = data.auth_tokens.find(
        (item) =>
          item.token_hash === hashToken(rawToken) &&
          item.type === type &&
          !item.consumed_at &&
          new Date(item.expires_at).getTime() > Date.now(),
      );
      if (!token) return null;
      token.consumed_at = new Date().toISOString();
      saveLocalData(data);
      return token;
    },
    async setEmailVerified(id) {
      const user = data.users.find((item) => item.id === Number(id));
      if (!user) return null;
      user.email_verified = true;
      user.email_verified_at = new Date().toISOString();
      saveLocalData(data);
      return user;
    },
    async updatePassword(id, password) {
      const user = data.users.find((item) => item.id === Number(id));
      if (!user) return null;
      user.password_hash = hashPassword(password);
      saveLocalData(data);
      return user;
    },
    async updateUserProfile(id, input) {
      const user = data.users.find((item) => item.id === Number(id));
      if (!user) return null;
      [
        "name",
        "email",
        "phone",
        "mobile_phone",
        "address",
        "avatar_url",
        "wallet_crypto",
        "wallet_cash",
        "luno_wallet",
        "bank_name",
        "bank_account_name",
        "bank_account_number",
        "preferred_currency",
      ].forEach((key) => {
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
        price_myr: Number(input.price_myr || input.price_myr === 0 ? input.price_myr : Number(input.price_eth || input.price || 0) * marketplaceDefaults.ethToMyr),
        listing_fee_myr: marketplaceDefaults.listingFeeMyr,
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
    async updatePhotoPricing(id, input, user) {
      const photo = data.photos.find((item) => item.id === Number(id));
      if (!photo) return null;
      const canEdit = user.role === "admin" || user.role === "super_admin" || Number(photo.creator_id) === Number(user.id);
      if (!canEdit) return null;
      if (input.price_eth !== undefined) photo.price_eth = Number(input.price_eth || 0);
      if (input.price_myr !== undefined) photo.price_myr = Number(input.price_myr || 0);
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
        platform_fee_myr: input.platform_fee_myr || Number(input.amount_myr || 0) * (marketplaceDefaults.serviceFeePercent / 100),
        creator_payout_myr:
          input.creator_payout_myr ||
          Number(input.amount_myr || 0) - Number(input.amount_myr || 0) * (marketplaceDefaults.serviceFeePercent / 100),
        payment_provider: input.payment_provider || "ToyyibPay",
        payment_status: input.payment_status || "pending",
        bill_code: input.bill_code || null,
        buyer_name: input.buyer_name || null,
        buyer_email: input.buyer_email || null,
        buyer_phone: input.buyer_phone || null,
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
    async getOrderByRef(orderRef) {
      const order = data.orders.find((item) => item.order_ref === orderRef);
      if (!order) return null;
      const photo = data.photos.find((item) => Number(item.id) === Number(order.photo_id));
      const buyer = data.users.find((item) => Number(item.id) === Number(order.buyer_id));
      return {
        ...order,
        photo_title: photo?.title || null,
        creator_name: photo?.creator_name || null,
        buyer_name: buyer?.name || order.buyer_name || null,
        buyer_email: buyer?.email || order.buyer_email || null,
      };
    },
    async listOrders() {
      return data.orders;
    },
    async getSalesSummary(user) {
      const orders = data.orders.filter((order) => user.role === "super_admin" || user.role === "admin" || Number(order.buyer_id) === Number(user.id));
      const grossMyr = orders.reduce((total, order) => total + Number(order.amount_myr || 0), 0);
      const platformFeeMyr = orders.reduce((total, order) => total + Number(order.platform_fee_myr || 0), 0);
      return {
        orders: orders.length,
        gross_myr: grossMyr,
        platform_fee_myr: platformFeeMyr,
        creator_payout_myr: grossMyr - platformFeeMyr,
        service_fee_percent: marketplaceDefaults.serviceFeePercent,
        listing_fee_myr: marketplaceDefaults.listingFeeMyr,
      };
    },
    async listNews({ includeDrafts = false } = {}) {
      return data.news.filter((post) => includeDrafts || post.status === "published").sort((a, b) => b.id - a.id);
    },
    async createNews(input, user) {
      const post = {
        id: (data.counters.news = (data.counters.news || data.news.length || 0) + 1),
        author_id: user.id,
        title: input.title,
        slug: makeSlug(input.title),
        category: input.category || "Platform",
        excerpt: input.excerpt || String(input.body || "").slice(0, 150),
        image_url: input.image_url || "",
        body: input.body,
        status: input.status === "draft" ? "draft" : "published",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      data.news.unshift(post);
      saveLocalData(data);
      return post;
    },
    async updateNews(id, input) {
      const post = data.news.find((item) => Number(item.id) === Number(id));
      if (!post) return null;
      ["title", "category", "excerpt", "image_url", "body", "status"].forEach((key) => {
        if (input[key] !== undefined) post[key] = input[key];
      });
      if (input.title) post.slug = post.slug || makeSlug(input.title);
      post.updated_at = new Date().toISOString();
      saveLocalData(data);
      return post;
    },
    async deleteNews(id) {
      const index = data.news.findIndex((item) => Number(item.id) === Number(id));
      if (index === -1) return false;
      data.news.splice(index, 1);
      saveLocalData(data);
      return true;
    },
    async listSlides({ includeInactive = false } = {}) {
      return data.slides
        .filter((slide) => includeInactive || slide.status === "active")
        .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0) || Number(a.id) - Number(b.id));
    },
    async createSlide(input) {
      const slide = {
        id: (data.counters.slides = (data.counters.slides || data.slides.length || 0) + 1),
        eyebrow: input.eyebrow,
        title: input.title,
        body: input.body,
        image_url: input.image_url,
        primary_label: input.primary_label || "Teroka Marketplace",
        primary_page: input.primary_page || "market",
        secondary_label: input.secondary_label || "Panduan Kreator",
        secondary_page: input.secondary_page || "mint",
        sort_order: Number(input.sort_order || data.slides.length + 1),
        status: input.status || "active",
        created_at: new Date().toISOString(),
      };
      data.slides.push(slide);
      saveLocalData(data);
      return slide;
    },
    async updateSlide(id, input) {
      const slide = data.slides.find((item) => item.id === Number(id));
      if (!slide) return null;
      ["eyebrow", "title", "body", "image_url", "primary_label", "primary_page", "secondary_label", "secondary_page", "status"].forEach((key) => {
        if (input[key] !== undefined) slide[key] = String(input[key] || "").trim();
      });
      if (input.sort_order !== undefined) slide.sort_order = Number(input.sort_order || 0);
      saveLocalData(data);
      return slide;
    },
  };
}

async function ensureUserColumns(pool) {
  const columns = [
    ["phone", "VARCHAR(40) NULL"],
    ["wallet_crypto", "VARCHAR(190) NULL"],
    ["wallet_cash", "VARCHAR(190) NULL"],
    ["luno_wallet", "VARCHAR(190) NULL"],
    ["avatar_url", "TEXT NULL"],
    ["address", "TEXT NULL"],
    ["mobile_phone", "VARCHAR(40) NULL"],
    ["bank_name", "VARCHAR(120) NULL"],
    ["bank_account_name", "VARCHAR(160) NULL"],
    ["bank_account_number", "VARCHAR(80) NULL"],
    ["preferred_currency", "VARCHAR(12) NOT NULL DEFAULT 'MYR'"],
    ["email_verified", "TINYINT(1) NOT NULL DEFAULT 0"],
    ["email_verified_at", "TIMESTAMP NULL"],
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
    ["price_myr", "DECIMAL(12,2) NOT NULL DEFAULT 0.00"],
    ["listing_fee_myr", "DECIMAL(12,2) NOT NULL DEFAULT 2.00"],
  ];
  for (const [column, definition] of photoColumns) {
    try {
      await pool.query(`ALTER TABLE photos ADD COLUMN ${column} ${definition}`);
    } catch (error) {
      if (!["ER_DUP_FIELDNAME", "ER_DUP_KEYNAME"].includes(error.code)) throw error;
    }
  }
  const orderColumns = [
    ["platform_fee_myr", "DECIMAL(12,2) NOT NULL DEFAULT 0.00"],
    ["creator_payout_myr", "DECIMAL(12,2) NOT NULL DEFAULT 0.00"],
    ["buyer_name", "VARCHAR(160) NULL"],
    ["buyer_email", "VARCHAR(190) NULL"],
    ["buyer_phone", "VARCHAR(40) NULL"],
  ];
  for (const [column, definition] of orderColumns) {
    try {
      await pool.query(`ALTER TABLE orders ADD COLUMN ${column} ${definition}`);
    } catch (error) {
      if (error.code !== "ER_DUP_FIELDNAME") throw error;
    }
  }
  const newsColumns = [
    ["slug", "VARCHAR(200) NULL UNIQUE"],
    ["category", "VARCHAR(80) NOT NULL DEFAULT 'Platform'"],
    ["excerpt", "VARCHAR(255) NULL"],
    ["image_url", "TEXT NULL"],
    ["updated_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"],
  ];
  for (const [column, definition] of newsColumns) {
    try {
      await pool.query(`ALTER TABLE news_posts ADD COLUMN ${column} ${definition}`);
    } catch (error) {
      if (!["ER_DUP_FIELDNAME", "ER_DUP_KEYNAME"].includes(error.code)) throw error;
    }
  }
  try {
    await pool.query("CREATE INDEX idx_news_category ON news_posts(category)");
  } catch (error) {
    if (error.code !== "ER_DUP_KEYNAME") throw error;
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
  await pool.execute("INSERT INTO news_posts (author_id, title, slug, category, excerpt, image_url, body, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'published')", [
    users[0]?.id || null,
    "Photora portal kini menyokong photo authenticity scan",
    makeSlug("Photora portal kini menyokong photo authenticity scan"),
    "Platform",
    "Setiap foto berdaftar mempunyai kod khas Photora untuk semakan keaslian.",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    "Setiap foto berdaftar mempunyai kod khas Photora untuk semakan keaslian.",
  ]);
}

async function seedHeroSlides(pool) {
  const [rows] = await pool.execute("SELECT id FROM hero_slides LIMIT 1");
  if (rows.length > 0) return;
  for (const slide of seedSlides) {
    await pool.execute(
      "INSERT INTO hero_slides (eyebrow, title, body, image_url, primary_label, primary_page, secondary_label, secondary_page, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        slide.eyebrow,
        slide.title,
        slide.body,
        slide.image_url,
        slide.primary_label,
        slide.primary_page,
        slide.secondary_label,
        slide.secondary_page,
        slide.sort_order,
        slide.status,
      ],
    );
  }
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
          if (!["ER_DUP_KEYNAME", "ER_KEY_COLUMN_DOES_NOT_EXITS"].includes(error.code)) throw error;
        }
      }
      await ensureUserColumns(pool);
      await backfillPhotoAuthenticity(pool);
      await seedNews(pool);
      await seedHeroSlides(pool);
      const [rows] = await pool.execute("SELECT id FROM users WHERE role = 'super_admin' ORDER BY id ASC LIMIT 1");
      if (rows.length === 0) {
        await pool.execute(
          "INSERT INTO users (name, email, password_hash, role, status, email_verified, email_verified_at) VALUES (?, ?, ?, 'super_admin', 'active', 1, NOW())",
          ["Super Admin", config.superAdminEmail, hashPassword(config.superAdminPassword)],
        );
      } else {
        await pool.execute("UPDATE users SET email = ?, email_verified = 1, email_verified_at = COALESCE(email_verified_at, NOW()) WHERE id = ?", [
          config.superAdminEmail,
          rows[0].id,
        ]);
      }
      const [photoRows] = await pool.execute("SELECT id FROM photos LIMIT 1");
      if (photoRows.length === 0) {
        for (const photo of seedPhotos) {
          await pool.execute(
            "INSERT INTO photos (title, creator_name, category, price_eth, price_myr, listing_fee_myr, image_url, authenticity_code, perceptual_hash, description, source_type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              photo.title,
              photo.creator_name,
              photo.category,
              photo.price_eth,
              photo.price_myr || Number(photo.price_eth || 0) * marketplaceDefaults.ethToMyr,
              marketplaceDefaults.listingFeeMyr,
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
      const role = input.role || "user";
      const verified = role === "admin" || role === "super_admin" || input.email_verified ? 1 : 0;
      const [result] = await pool.execute(
        "INSERT INTO users (name, email, password_hash, role, status, phone, email_verified, email_verified_at) VALUES (?, ?, ?, ?, 'active', ?, ?, ?)",
        [input.name, input.email, hashPassword(input.password), role, input.phone || "", verified, verified ? new Date() : null],
      );
      return this.getUserById(result.insertId);
    },
    async listUsers() {
      const [rows] = await pool.execute(
        "SELECT id, name, email, role, status, phone, mobile_phone, address, avatar_url, wallet_crypto, wallet_cash, luno_wallet, bank_name, bank_account_name, bank_account_number, preferred_currency, email_verified, created_at FROM users ORDER BY id DESC",
      );
      return rows;
    },
    async createAuthToken(input) {
      await pool.execute("INSERT INTO auth_tokens (user_id, token_hash, type, expires_at) VALUES (?, ?, ?, ?)", [
        input.user_id,
        input.token_hash,
        input.type,
        input.expires_at,
      ]);
    },
    async consumeAuthToken(rawToken, type) {
      const [rows] = await pool.execute(
        "SELECT auth_tokens.*, users.email, users.name, users.role FROM auth_tokens JOIN users ON users.id = auth_tokens.user_id WHERE auth_tokens.token_hash = ? AND auth_tokens.type = ? AND auth_tokens.consumed_at IS NULL AND auth_tokens.expires_at > NOW() LIMIT 1",
        [hashToken(rawToken), type],
      );
      const token = rows[0];
      if (!token) return null;
      await pool.execute("UPDATE auth_tokens SET consumed_at = NOW() WHERE id = ?", [token.id]);
      return token;
    },
    async setEmailVerified(id) {
      await pool.execute("UPDATE users SET email_verified = 1, email_verified_at = NOW() WHERE id = ?", [id]);
      return this.getUserById(id);
    },
    async updatePassword(id, password) {
      await pool.execute("UPDATE users SET password_hash = ? WHERE id = ?", [hashPassword(password), id]);
      return this.getUserById(id);
    },
    async updateUserProfile(id, input) {
      await pool.execute(
        "UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), phone = ?, mobile_phone = ?, address = ?, avatar_url = ?, wallet_crypto = ?, wallet_cash = ?, luno_wallet = ?, bank_name = ?, bank_account_name = ?, bank_account_number = ?, preferred_currency = ? WHERE id = ?",
        [
          input.name || null,
          input.email || null,
          input.phone || "",
          input.mobile_phone || "",
          input.address || "",
          input.avatar_url || "",
          input.wallet_crypto || "",
          input.wallet_cash || "",
          input.luno_wallet || "",
          input.bank_name || "",
          input.bank_account_name || "",
          input.bank_account_number || "",
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
        "INSERT INTO photos (title, creator_id, creator_name, category, price_eth, price_myr, listing_fee_myr, image_url, authenticity_code, perceptual_hash, description, source_type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          input.title,
          user.id,
          user.name,
          input.category,
          Number(input.price_eth || input.price || 0),
          Number(input.price_myr || Number(input.price_eth || input.price || 0) * marketplaceDefaults.ethToMyr),
          marketplaceDefaults.listingFeeMyr,
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
    async updatePhotoPricing(id, input, user) {
      const photo = await this.getPhotoById(id);
      if (!photo) return null;
      const canEdit = user.role === "admin" || user.role === "super_admin" || Number(photo.creator_id) === Number(user.id);
      if (!canEdit) return null;
      await pool.execute("UPDATE photos SET price_eth = COALESCE(?, price_eth), price_myr = COALESCE(?, price_myr) WHERE id = ?", [
        input.price_eth === undefined ? null : Number(input.price_eth),
        input.price_myr === undefined ? null : Number(input.price_myr),
        id,
      ]);
      return this.getPhotoById(id);
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
        "INSERT INTO orders (order_ref, buyer_id, photo_id, amount_myr, amount_eth, platform_fee_myr, creator_payout_myr, payment_provider, payment_status, bill_code, buyer_name, buyer_email, buyer_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          input.order_ref,
          input.buyer_id || null,
          input.photo_id || null,
          input.amount_myr,
          input.amount_eth,
          input.platform_fee_myr || Number(input.amount_myr || 0) * (marketplaceDefaults.serviceFeePercent / 100),
          input.creator_payout_myr ||
            Number(input.amount_myr || 0) - Number(input.amount_myr || 0) * (marketplaceDefaults.serviceFeePercent / 100),
          input.payment_provider || "ToyyibPay",
          input.payment_status || "pending",
          input.bill_code || null,
          input.buyer_name || null,
          input.buyer_email || null,
          input.buyer_phone || null,
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
    async getOrderByRef(orderRef) {
      const [rows] = await pool.execute(
        "SELECT orders.*, photos.title AS photo_title, photos.creator_name, COALESCE(users.name, orders.buyer_name) AS buyer_name, COALESCE(users.email, orders.buyer_email) AS buyer_email FROM orders LEFT JOIN photos ON photos.id = orders.photo_id LEFT JOIN users ON users.id = orders.buyer_id WHERE orders.order_ref = ? LIMIT 1",
        [orderRef],
      );
      return rows[0] || null;
    },
    async listOrders() {
      const [rows] = await pool.execute(
        "SELECT orders.*, photos.title AS photo_title, COALESCE(users.email, orders.buyer_email) AS buyer_email FROM orders LEFT JOIN photos ON photos.id = orders.photo_id LEFT JOIN users ON users.id = orders.buyer_id ORDER BY orders.id DESC",
      );
      return rows;
    },
    async getSalesSummary(user) {
      const where = user.role === "super_admin" || user.role === "admin" ? "" : "WHERE orders.buyer_id = ?";
      const params = where ? [user.id] : [];
      const [rows] = await pool.execute(
        `SELECT COUNT(*) AS orders, COALESCE(SUM(amount_myr),0) AS gross_myr, COALESCE(SUM(platform_fee_myr),0) AS platform_fee_myr, COALESCE(SUM(creator_payout_myr),0) AS creator_payout_myr FROM orders ${where}`,
        params,
      );
      return {
        ...(rows[0] || {}),
        service_fee_percent: marketplaceDefaults.serviceFeePercent,
        listing_fee_myr: marketplaceDefaults.listingFeeMyr,
      };
    },
    async listNews({ includeDrafts = false } = {}) {
      const sql = includeDrafts
        ? "SELECT news_posts.*, users.name AS author_name FROM news_posts LEFT JOIN users ON users.id = news_posts.author_id ORDER BY news_posts.id DESC"
        : "SELECT news_posts.*, users.name AS author_name FROM news_posts LEFT JOIN users ON users.id = news_posts.author_id WHERE news_posts.status = 'published' ORDER BY news_posts.id DESC";
      const [rows] = await pool.execute(sql);
      return rows;
    },
    async createNews(input, user) {
      const [result] = await pool.execute("INSERT INTO news_posts (author_id, title, slug, category, excerpt, image_url, body, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
        user.id,
        input.title,
        makeSlug(input.title),
        input.category || "Platform",
        input.excerpt || String(input.body || "").slice(0, 150),
        input.image_url || "",
        input.body,
        input.status === "draft" ? "draft" : "published",
      ]);
      const [rows] = await pool.execute("SELECT * FROM news_posts WHERE id = ? LIMIT 1", [result.insertId]);
      return rows[0] || null;
    },
    async updateNews(id, input) {
      await pool.execute(
        "UPDATE news_posts SET title = COALESCE(?, title), category = COALESCE(?, category), excerpt = COALESCE(?, excerpt), image_url = COALESCE(?, image_url), body = COALESCE(?, body), status = COALESCE(?, status) WHERE id = ?",
        [
          input.title || null,
          input.category || null,
          input.excerpt ?? null,
          input.image_url ?? null,
          input.body || null,
          input.status || null,
          id,
        ],
      );
      const [rows] = await pool.execute("SELECT * FROM news_posts WHERE id = ? LIMIT 1", [id]);
      return rows[0] || null;
    },
    async deleteNews(id) {
      const [result] = await pool.execute("DELETE FROM news_posts WHERE id = ?", [id]);
      return result.affectedRows > 0;
    },
    async listSlides({ includeInactive = false } = {}) {
      const sql = includeInactive
        ? "SELECT * FROM hero_slides ORDER BY sort_order ASC, id ASC"
        : "SELECT * FROM hero_slides WHERE status = 'active' ORDER BY sort_order ASC, id ASC";
      const [rows] = await pool.execute(sql);
      return rows;
    },
    async createSlide(input) {
      const [result] = await pool.execute(
        "INSERT INTO hero_slides (eyebrow, title, body, image_url, primary_label, primary_page, secondary_label, secondary_page, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          input.eyebrow,
          input.title,
          input.body,
          input.image_url,
          input.primary_label || "Teroka Marketplace",
          input.primary_page || "market",
          input.secondary_label || "Panduan Kreator",
          input.secondary_page || "mint",
          Number(input.sort_order || 0),
          input.status || "active",
        ],
      );
      const [rows] = await pool.execute("SELECT * FROM hero_slides WHERE id = ? LIMIT 1", [result.insertId]);
      return rows[0] || null;
    },
    async updateSlide(id, input) {
      await pool.execute(
        "UPDATE hero_slides SET eyebrow = COALESCE(?, eyebrow), title = COALESCE(?, title), body = COALESCE(?, body), image_url = COALESCE(?, image_url), primary_label = COALESCE(?, primary_label), primary_page = COALESCE(?, primary_page), secondary_label = COALESCE(?, secondary_label), secondary_page = COALESCE(?, secondary_page), sort_order = COALESCE(?, sort_order), status = COALESCE(?, status) WHERE id = ?",
        [
          input.eyebrow || null,
          input.title || null,
          input.body || null,
          input.image_url || null,
          input.primary_label || null,
          input.primary_page || null,
          input.secondary_label || null,
          input.secondary_page || null,
          input.sort_order === undefined ? null : Number(input.sort_order),
          input.status || null,
          id,
        ],
      );
      const [rows] = await pool.execute("SELECT * FROM hero_slides WHERE id = ? LIMIT 1", [id]);
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

  const categoryCode =
    (Array.isArray(result) && result[0] && result[0].CategoryCode) ||
    (result && typeof result === "object" && result.CategoryCode);
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
    const user = await db.createUser({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone || "",
      role: "user",
    });
    const delivery = await issueAccountToken(db, user, "email_verify");
    sendJson(res, 201, {
      user: publicUser(user),
      delivery,
      message: "Akaun didaftarkan. Sila sahkan email sebelum login.",
    });
    return true;
  }

  if (req.method === "GET" && pathname === "/api/auth/verify-email") {
    const url = new URL(req.url, config.appBaseUrl);
    const token = await db.consumeAuthToken(url.searchParams.get("token") || "", "email_verify");
    if (!token) {
      res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>Link tidak sah</h1><p>Link pengesahan tamat tempoh atau sudah digunakan.</p>");
      return true;
    }
    await db.setEmailVerified(token.user_id);
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end('<h1>Email berjaya disahkan</h1><p>Akaun Photora anda sudah aktif. <a href="/#login">Login sekarang</a>.</p>');
    return true;
  }

  if (req.method === "POST" && pathname === "/api/auth/request-reset") {
    const payload = await readJson(req);
    const user = await db.getUserByEmail(payload.email || "");
    if (!user) {
      sendJson(res, 200, { ok: true, message: "Jika akaun wujud, link reset akan dihantar." });
      return true;
    }
    const delivery = await issueAccountToken(db, user, "password_reset");
    sendJson(res, 200, { ok: true, delivery, message: "Link reset password telah disediakan." });
    return true;
  }

  if (req.method === "GET" && pathname === "/api/auth/reset-password") {
    const url = new URL(req.url, config.appBaseUrl);
    const token = String(url.searchParams.get("token") || "");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<!doctype html>
      <html lang="ms">
        <head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Reset Password Photora</title></head>
        <body style="font-family:Inter,Arial,sans-serif;background:#f8fafc;margin:0;display:grid;min-height:100vh;place-items:center;color:#0f172a">
          <form id="reset" style="display:grid;gap:14px;width:min(420px,92vw);padding:28px;border:1px solid #e5e7eb;border-radius:18px;background:white;box-shadow:0 20px 70px rgba(15,23,42,.12)">
            <h1 style="margin:0;font-size:1.8rem">Reset password</h1>
            <p style="margin:0;color:#64748b">Masukkan password baharu untuk akaun Photora anda.</p>
            <input name="password" type="password" required minlength="8" placeholder="Password baharu" style="min-height:48px;border:1px solid #dbe3ef;border-radius:12px;padding:0 14px">
            <button style="min-height:48px;border:0;border-radius:12px;background:#010066;color:white;font-weight:900">Simpan password</button>
            <p id="note" style="margin:0;color:#64748b"></p>
          </form>
          <script>
            document.querySelector("#reset").addEventListener("submit", async (event) => {
              event.preventDefault();
              const note = document.querySelector("#note");
              note.textContent = "Menyimpan...";
              const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: ${JSON.stringify(token)}, password: new FormData(event.currentTarget).get("password") })
              });
              const result = await response.json().catch(() => ({}));
              note.innerHTML = response.ok ? 'Password sudah ditukar. <a href="/#login">Login sekarang</a>.' : (result.error || "Reset gagal.");
            });
          </script>
        </body>
      </html>`);
    return true;
  }

  if (req.method === "POST" && pathname === "/api/auth/reset-password") {
    const payload = await readJson(req);
    if (!payload.token || !payload.password || String(payload.password).length < 8) {
      sendJson(res, 400, { error: "Token dan password minimum 8 aksara diperlukan." });
      return true;
    }
    const token = await db.consumeAuthToken(payload.token, "password_reset");
    if (!token) {
      sendJson(res, 400, { error: "Link reset tidak sah atau telah tamat tempoh." });
      return true;
    }
    await db.updatePassword(token.user_id, payload.password);
    sendJson(res, 200, { ok: true });
    return true;
  }

  if (req.method === "POST" && pathname === "/api/auth/login") {
    const payload = await readJson(req);
    const user = await db.getUserByEmail(payload.email || "");
    if (!user || !verifyPassword(payload.password || "", user.password_hash) || user.status !== "active") {
      sendJson(res, 401, { error: "Invalid login." });
      return true;
    }
    if (!user.email_verified && user.role === "user") {
      const delivery = await issueAccountToken(db, user, "email_verify");
      sendJson(res, 403, { error: "Sila sahkan email sebelum login.", delivery });
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

  const receiptMatch = pathname.match(/^\/api\/orders\/([^/]+)\/receipt\.pdf$/);
  if (req.method === "GET" && receiptMatch) {
    const requestUrl = new URL(req.url, config.appBaseUrl);
    const order = await db.getOrderByRef(decodeURIComponent(receiptMatch[1]));
    if (!order) {
      sendJson(res, 404, { error: "Order not found." });
      return true;
    }
    const type = requestUrl.searchParams.get("type") === "seller" ? "seller" : "buyer";
    const pdf = buildReceiptPdf(order, type);
    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="photora-${type}-receipt-${order.order_ref}.pdf"`,
      "Cache-Control": "no-store",
    });
    res.end(pdf);
    return true;
  }

  if (req.method === "PATCH" && pathname === "/api/me/profile") {
    const user = await currentUser(req);
    if (!user) {
      sendJson(res, 401, { error: "Login required." });
      return true;
    }
    const payload = await readJson(req);
    const updated = await db.updateUserProfile(user.id, {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      mobile_phone: payload.mobile_phone,
      address: payload.address,
      avatar_url: payload.avatar_url,
      wallet_crypto: payload.wallet_crypto,
      wallet_cash: payload.wallet_cash,
      luno_wallet: payload.luno_wallet,
      bank_name: payload.bank_name,
      bank_account_name: payload.bank_account_name,
      bank_account_number: payload.bank_account_number,
      preferred_currency: payload.preferred_currency || "MYR",
    });
    sendJson(res, 200, { user: publicUser(updated) });
    return true;
  }

  if (req.method === "GET" && pathname === "/api/market/crypto-prices") {
    sendJson(res, 200, { prices: await getCryptoPrices() });
    return true;
  }

  if (req.method === "GET" && pathname === "/api/market/settings") {
    sendJson(res, 200, { settings: marketplaceDefaults });
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

  if (req.method === "GET" && pathname === "/api/cms/news") {
    const user = await currentUser(req);
    if (!requireRole(user, ["admin", "super_admin"])) {
      sendJson(res, 403, { error: "Admin access required." });
      return true;
    }
    sendJson(res, 200, { posts: await db.listNews({ includeDrafts: true }) });
    return true;
  }

  if (req.method === "POST" && (pathname === "/api/news" || pathname === "/api/cms/news")) {
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

  const newsMatch = pathname.match(/^\/api\/cms\/news\/(\d+)$/);
  if (newsMatch && req.method === "PATCH") {
    const user = await currentUser(req);
    if (!requireRole(user, ["admin", "super_admin"])) {
      sendJson(res, 403, { error: "Admin access required." });
      return true;
    }
    const payload = await readJson(req);
    if (payload.status && !["published", "draft"].includes(payload.status)) {
      sendJson(res, 400, { error: "Invalid news status." });
      return true;
    }
    sendJson(res, 200, { post: await db.updateNews(newsMatch[1], payload) });
    return true;
  }

  if (newsMatch && req.method === "DELETE") {
    const user = await currentUser(req);
    if (!requireRole(user, ["admin", "super_admin"])) {
      sendJson(res, 403, { error: "Admin access required." });
      return true;
    }
    sendJson(res, 200, { ok: await db.deleteNews(newsMatch[1]) });
    return true;
  }

  if (req.method === "GET" && pathname === "/api/slides") {
    const user = await currentUser(req);
    const includeInactive = requireRole(user, ["admin", "super_admin"]);
    sendJson(res, 200, { slides: await db.listSlides({ includeInactive }) });
    return true;
  }

  if (req.method === "POST" && pathname === "/api/cms/slides") {
    const user = await currentUser(req);
    if (!requireRole(user, ["admin", "super_admin"])) {
      sendJson(res, 403, { error: "Admin access required." });
      return true;
    }
    const payload = await readJson(req);
    if (!payload.eyebrow || !payload.title || !payload.body || !payload.image_url) {
      sendJson(res, 400, { error: "Eyebrow, title, body and image URL are required." });
      return true;
    }
    sendJson(res, 201, { slide: await db.createSlide(payload) });
    return true;
  }

  const slideMatch = pathname.match(/^\/api\/cms\/slides\/(\d+)$/);
  if (req.method === "PATCH" && slideMatch) {
    const user = await currentUser(req);
    if (!requireRole(user, ["admin", "super_admin"])) {
      sendJson(res, 403, { error: "Admin access required." });
      return true;
    }
    const payload = await readJson(req);
    if (payload.status && !["active", "inactive"].includes(payload.status)) {
      sendJson(res, 400, { error: "Invalid slide status." });
      return true;
    }
    sendJson(res, 200, { slide: await db.updateSlide(slideMatch[1], payload) });
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

  const priceMatch = pathname.match(/^\/api\/photos\/(\d+)\/pricing$/);
  if (req.method === "PATCH" && priceMatch) {
    const user = await currentUser(req);
    if (!user) {
      sendJson(res, 401, { error: "Login required." });
      return true;
    }
    const payload = await readJson(req);
    const photo = await db.updatePhotoPricing(priceMatch[1], payload, user);
    if (!photo) {
      sendJson(res, 403, { error: "Not allowed to update this photo." });
      return true;
    }
    sendJson(res, 200, { photo });
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

  if (req.method === "POST" && pathname === "/api/cms/users") {
    const user = await currentUser(req);
    if (!requireRole(user, ["super_admin"])) {
      sendJson(res, 403, { error: "Super admin access required." });
      return true;
    }
    const payload = await readJson(req);
    const roles = ["user", "admin", "super_admin"];
    if (!payload.name || !payload.email || !payload.password || !roles.includes(payload.role || "user")) {
      sendJson(res, 400, { error: "Name, email, password and valid role are required." });
      return true;
    }
    if (await db.getUserByEmail(payload.email)) {
      sendJson(res, 409, { error: "Email already registered." });
      return true;
    }
    sendJson(res, 201, { user: publicUser(await db.createUser({ ...payload, email_verified: true })) });
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

  if (req.method === "GET" && pathname === "/api/cms/sales-summary") {
    const user = await currentUser(req);
    if (!user) {
      sendJson(res, 401, { error: "Login required." });
      return true;
    }
    sendJson(res, 200, { summary: await db.getSalesSummary(user) });
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

  const billCode =
    (Array.isArray(result) && result[0] && result[0].BillCode) ||
    (result && typeof result === "object" && result.BillCode);
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
    platform_fee_myr: (amountCents / 100) * (marketplaceDefaults.serviceFeePercent / 100),
    creator_payout_myr: amountCents / 100 - (amountCents / 100) * (marketplaceDefaults.serviceFeePercent / 100),
    payment_status: "pending",
    bill_code: billCode,
    buyer_name: payload.customerName || user?.name || "Photora Buyer",
    buyer_email: payload.customerEmail || user?.email || "buyer@example.com",
    buyer_phone: payload.customerPhone || "0100000000",
  });

  sendJson(res, 200, {
    billCode,
    orderId,
    checkoutUrl: `${config.baseUrl}/${billCode}`,
    buyerReceiptUrl: `/api/orders/${encodeURIComponent(orderId)}/receipt.pdf?type=buyer`,
    sellerReceiptUrl: `/api/orders/${encodeURIComponent(orderId)}/receipt.pdf?type=seller`,
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
