let nftItems = [
  {
    title: "Konvo Seri Gemilang #018",
    creator: "Lensa Ilmu Studio",
    category: "Konvokesyen",
    price: 0.42,
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Graduan Senja #044",
    creator: "Afiq Visuals",
    category: "Konvokesyen",
    price: 0.31,
    image: "https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Akad Nikah Frame #012",
    creator: "Nura Lens",
    category: "Majlis",
    price: 0.27,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Portrait Heritage #103",
    creator: "Ruang Potret",
    category: "Potret",
    price: 0.18,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Kuala Lumpur Street #088",
    creator: "Urban Archive",
    category: "Street",
    price: 0.35,
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Studio Headshot #021",
    creator: "Pixel Haus",
    category: "Potret",
    price: 0.16,
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Convocation Walk #056",
    creator: "Kampus Capture",
    category: "Konvokesyen",
    price: 0.29,
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Festival Light #070",
    creator: "Event Frame Co.",
    category: "Majlis",
    price: 0.24,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Mountain Morning #014",
    creator: "Rimba Frame",
    category: "Landscape",
    price: 0.33,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Cafe Table #062",
    creator: "Foodgraph Studio",
    category: "Food",
    price: 0.19,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Product Detail #031",
    creator: "Catalog Lens",
    category: "Product",
    price: 0.22,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Mobile Rain Walk #009",
    creator: "Pocket Lens MY",
    category: "Mobilegraphy",
    price: 0.14,
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Stadium Sprint #077",
    creator: "Action Frame",
    category: "Sports",
    price: 0.28,
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Concrete Lines #045",
    creator: "Form Archive",
    category: "Architecture",
    price: 0.25,
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
  },
];

const grid = document.querySelector("#nftGrid");
const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const mintForm = document.querySelector("#mintForm");
const formNote = document.querySelector("#formNote");
const listedMetric = document.querySelector("#listedMetric");
const revenueMetric = document.querySelector("#revenueMetric");
const walletButton = document.querySelector("#walletButton");
const walletText = document.querySelector("#walletText");
const accountButton = document.querySelector("#accountButton");
const menuToggle = document.querySelector("#menuToggle");
const topbar = document.querySelector(".topbar");
const primaryNav = document.querySelector("#primaryNav");
const pageSections = document.querySelectorAll(".page-section");
const pageLinks = document.querySelectorAll("[data-page]");
const toast = document.querySelector("#toast");
const platformProfitMetric = document.querySelector("#platformProfitMetric");
const primaryFeeLabel = document.querySelector("#primaryFeeLabel");
const listingFeeLabel = document.querySelector("#listingFeeLabel");
const royaltyShareLabel = document.querySelector("#royaltyShareLabel");
const ownerWalletMetric = document.querySelector("#ownerWalletMetric");
const pendingPayoutMetric = document.querySelector("#pendingPayoutMetric");
const creatorMetric = document.querySelector("#creatorMetric");
const creatorEarningsMetric = document.querySelector("#creatorEarningsMetric");
const creatorListingsMetric = document.querySelector("#creatorListingsMetric");
const ownedMetric = document.querySelector("#ownedMetric");
const buyerSpendMetric = document.querySelector("#buyerSpendMetric");
const transactionTable = document.querySelector("#transactionTable");
const transactionCount = document.querySelector("#transactionCount");
const feeSettingsForm = document.querySelector("#feeSettingsForm");
const settingsNote = document.querySelector("#settingsNote");
const tabButtons = document.querySelectorAll(".tab-button");
const cmsPanels = document.querySelectorAll(".cms-panel");
const checkoutTitle = document.querySelector("#checkoutTitle");
const checkoutEth = document.querySelector("#checkoutEth");
const checkoutMyr = document.querySelector("#checkoutMyr");
const checkoutNote = document.querySelector("#checkoutNote");
const paymentMethod = document.querySelector("#paymentMethod");
const payFiatButton = document.querySelector("#payFiatButton");
const chatToggle = document.querySelector("#chatToggle");
const chatPanel = document.querySelector("#chatPanel");
const chatClose = document.querySelector("#chatClose");
const chatMessages = document.querySelector("#chatMessages");
const quickReplies = document.querySelectorAll(".quick-replies button");
const categoryPills = document.querySelectorAll(".category-pills button");
const itemCountLabel = document.querySelector("#itemCountLabel");
const authModal = document.querySelector("#authModal");
const authClose = document.querySelector("#authClose");
const authForm = document.querySelector("#authForm");
const authNote = document.querySelector("#authNote");
const authSubmit = document.querySelector("#authSubmit");
const authTabs = document.querySelectorAll("[data-auth-mode]");
const registerOnlyFields = document.querySelectorAll(".register-only");
const resetForm = document.querySelector("#resetForm");
const resetNote = document.querySelector("#resetNote");
const logoutButton = document.querySelector("#logoutButton");
const portalAccountName = document.querySelector("#portalAccountName");
const portalAccountEmail = document.querySelector("#portalAccountEmail");
const profileForm = document.querySelector("#profileForm");
const walletForm = document.querySelector("#walletForm");
const profileNote = document.querySelector("#profileNote");
const walletNote = document.querySelector("#walletNote");
const roleDashboardTitle = document.querySelector("#roleDashboardTitle");
const roleBadge = document.querySelector("#roleBadge");
const cryptoPriceList = document.querySelector("#cryptoPriceList");
const refreshCryptoButton = document.querySelector("#refreshCryptoButton");
const roleTools = document.querySelectorAll(".role-tools [data-page]");
const roleCards = document.querySelectorAll("[data-role-card]");
const scanForm = document.querySelector("#scanForm");
const scanNote = document.querySelector("#scanNote");
const newsFeed = document.querySelector("#newsFeed");
const newsForm = document.querySelector("#newsForm");
const newsNote = document.querySelector("#newsNote");
const portalNewsList = document.querySelector("#portalNewsList");
const newNewsButton = document.querySelector("#newNewsButton");
const accountTypeButtons = document.querySelectorAll(".account-type-toggle button");
const heroSection = document.querySelector(".hero");
const heroEyebrow = document.querySelector("#heroEyebrow");
const heroTitle = document.querySelector("#heroTitle");
const heroBody = document.querySelector("#heroBody");
const heroPrimaryAction = document.querySelector("#heroPrimaryAction");
const heroSecondaryAction = document.querySelector("#heroSecondaryAction");
const heroDots = document.querySelector("#heroDots");
const pendingReviewMetric = document.querySelector("#pendingReviewMetric");
const refreshCmsButton = document.querySelector("#refreshCmsButton");
const portalPhotoList = document.querySelector("#portalPhotoList");
const portalUserList = document.querySelector("#portalUserList");
const portalOrderList = document.querySelector("#portalOrderList");
const portalSlideList = document.querySelector("#portalSlideList");
const myListingList = document.querySelector("#myListingList");
const createUserForm = document.querySelector("#createUserForm");
const userManageNote = document.querySelector("#userManageNote");
const slideForm = document.querySelector("#slideForm");
const slideNote = document.querySelector("#slideNote");
const cartList = document.querySelector("#cartList");
const cartSubtotal = document.querySelector("#cartSubtotal");
const cartServiceFee = document.querySelector("#cartServiceFee");
const cartTotal = document.querySelector("#cartTotal");
const cartCheckoutButton = document.querySelector("#cartCheckoutButton");
const cartNote = document.querySelector("#cartNote");
const serviceFeeMetric = document.querySelector("#serviceFeeMetric");
const salesGrossMetric = document.querySelector("#salesGrossMetric");
const salesFeeMetric = document.querySelector("#salesFeeMetric");
const salesPayoutMetric = document.querySelector("#salesPayoutMetric");
const listingFeeMyrMetric = document.querySelector("#listingFeeMyrMetric");

let walletConnected = false;
let selectedCheckoutItem = null;
let currentUser = null;
let authMode = "login";
let heroSlides = [];
let activeSlideIndex = 0;
let slideTimer = null;
let ethToMyr = 15000;
let managedNewsPosts = [];
let cartItems = JSON.parse(localStorage.getItem("photoraCart") || "[]");
const transactions = [
  { item: "Konvo Seri Gemilang #018", buyer: "0x92B4...A81D", payment: "Wallet", gross: 0.42, type: "primary" },
  { item: "Akad Nikah Frame #012", buyer: "guest-1042", payment: "FPX", gross: 0.27, type: "primary" },
  { item: "Kuala Lumpur Street #088", buyer: "0x31D8...F09A", payment: "Wallet", gross: 0.35, type: "secondary" },
];

const feeSettings = {
  platformFee: 6,
  listingFee: 2,
  secondaryShare: 2,
};

function formatPrice(price) {
  return `${Number(price).toFixed(2)} ETH`;
}

function formatMyr(price) {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
  }).format(price);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Gambar news tidak dapat dibaca."));
    reader.readAsDataURL(file);
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2400);
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    cache: options.cache || "no-store",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.error || "Request failed.");
    error.result = result;
    throw error;
  }
  return result;
}

function normalisePhoto(photo) {
  return {
    id: photo.id,
    title: photo.title,
    creator: photo.creator || photo.creator_name,
    category: photo.category,
    price: Number(photo.price || photo.price_eth || 0),
    priceMyr: Number(photo.price_myr || Number(photo.price || photo.price_eth || 0) * ethToMyr),
    listingFeeMyr: Number(photo.listing_fee_myr || feeSettings.listingFee),
    image: photo.image || photo.image_url,
    description: photo.description || "",
    status: photo.status || "approved",
    authenticityCode: photo.authenticity_code || "",
  };
}

async function loadSettings() {
  try {
    const result = await apiRequest("/api/market/settings");
    const settings = result.settings || {};
    feeSettings.platformFee = Number(settings.serviceFeePercent || 6);
    feeSettings.listingFee = Number(settings.listingFeeMyr || 2);
    ethToMyr = Number(settings.ethToMyr || ethToMyr);
    serviceFeeMetric.textContent = `${feeSettings.platformFee}%`;
    listingFeeMyrMetric.textContent = formatMyr(feeSettings.listingFee);
  } catch {
    serviceFeeMetric.textContent = "6%";
    listingFeeMyrMetric.textContent = "RM 2.00";
  }
}

function updateAccountUi() {
  accountButton.textContent = "Login";
  roleBadge.textContent = currentUser?.role || "Guest";
  if (portalAccountName && portalAccountEmail) {
    portalAccountName.textContent = currentUser?.name || "Photora Account";
    portalAccountEmail.textContent = currentUser?.email || "Login diperlukan";
  }
  if (logoutButton) {
    logoutButton.hidden = !currentUser;
  }
  roleDashboardTitle.textContent = currentUser
    ? `Dashboard ${currentUser.role.replace("_", " ")}`
    : "Dashboard pengguna";
  if (currentUser && profileForm && walletForm) {
    profileForm.elements.name.value = currentUser.name || "";
    profileForm.elements.email.value = currentUser.email || "";
    profileForm.elements.phone.value = currentUser.phone || "";
    profileForm.elements.mobile_phone.value = currentUser.mobile_phone || "";
    profileForm.elements.address.value = currentUser.address || "";
    profileForm.elements.avatar_url.value = currentUser.avatar_url || "";
    walletForm.elements.wallet_crypto.value = currentUser.wallet_crypto || "";
    walletForm.elements.wallet_cash.value = currentUser.wallet_cash || "";
    walletForm.elements.luno_wallet.value = currentUser.luno_wallet || "";
    walletForm.elements.bank_name.value = currentUser.bank_name || "";
    walletForm.elements.bank_account_name.value = currentUser.bank_account_name || "";
    walletForm.elements.bank_account_number.value = currentUser.bank_account_number || "";
  }
  roleCards.forEach((card) => {
    const role = card.dataset.roleCard;
    const allowed =
      (!currentUser && role === "user") ||
      role === "user" ||
      currentUser?.role === "super_admin" ||
      (currentUser?.role === "admin" && role === "admin");
    card.hidden = !allowed;
  });
  document.querySelectorAll(".admin-only").forEach((item) => {
    item.hidden = !canManagePlatform();
  });
}

function setAuthMode(mode) {
  authMode = mode;
  authTabs.forEach((button) => button.classList.toggle("active", button.dataset.authMode === mode));
  registerOnlyFields.forEach((field) => {
    field.style.display = mode === "register" ? "grid" : "none";
  });
  authSubmit.textContent = mode === "register" ? "Register" : "Login";
  authNote.textContent = "";
}

async function loadSession() {
  try {
    const result = await apiRequest("/api/me");
    currentUser = result.user;
    updateAccountUi();
  } catch {
    currentUser = null;
    updateAccountUi();
  }
}

async function loadPhotos() {
  try {
    const result = await apiRequest("/api/photos");
    if (Array.isArray(result.photos) && result.photos.length > 0) {
      nftItems = result.photos.map(normalisePhoto);
      updateMetrics();
      renderCards();
    }
  } catch {
    showToast("Guna data demo kerana database belum tersedia.");
  }
}

function formatPriceValue(value, currency) {
  if (!value) return "Unavailable";
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "ms-MY", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "MYR" ? 0 : 2,
  }).format(value);
}

async function loadCryptoPrices() {
  if (!cryptoPriceList) return;
  cryptoPriceList.innerHTML = "<span>Loading crypto prices...</span>";
  try {
    const result = await apiRequest("/api/market/crypto-prices");
    const prices = result.prices || {};
    cryptoPriceList.innerHTML = ["BTC", "ETH", "USDT"]
      .map((symbol) => {
        const item = prices[symbol] || {};
        return `<span><b>${symbol}</b><em>${formatPriceValue(item.myr, "MYR")} / ${formatPriceValue(item.usd, "USD")}</em></span>`;
      })
      .join("");
  } catch {
    cryptoPriceList.innerHTML = "<span>Harga crypto belum tersedia.</span>";
  }
}

async function loadNews() {
  if (!newsFeed) return;
  try {
    const result = await apiRequest("/api/news");
    const posts = result.posts || [];
    newsFeed.innerHTML = posts.length
      ? posts
          .map(
            (post) => {
              const shareUrl = encodeURIComponent(`${location.origin}${location.pathname}#news-${post.slug || post.id}`);
              const shareText = encodeURIComponent(post.title);
              return `<article class="news-card" id="news-${escapeHtml(post.slug || post.id)}">
                <img src="${escapeHtml(post.image_url || "assets/photoralogo.png")}" alt="" />
                <div class="news-card-body">
                  <div class="news-meta">
                    <span>${escapeHtml(post.category || "Platform")}</span>
                    <span>${new Date(post.created_at).toLocaleDateString("ms-MY")}</span>
                  </div>
                  <h3>${escapeHtml(post.title)}</h3>
                  <p>${escapeHtml(post.excerpt || post.body)}</p>
                  <div class="news-share" aria-label="Share news">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" rel="noreferrer">Facebook</a>
                    <a href="https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}" target="_blank" rel="noreferrer">X</a>
                    <a href="https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}" target="_blank" rel="noreferrer">WhatsApp</a>
                    <a href="https://t.me/share/url?url=${shareUrl}&text=${shareText}" target="_blank" rel="noreferrer">Telegram</a>
                  </div>
                </div>
              </article>`;
            },
          )
          .join("")
      : '<p class="empty-state">Belum ada news platform.</p>';
  } catch {
    newsFeed.innerHTML = '<p class="empty-state">News belum tersedia.</p>';
  }
}

function applyHeroSlide(index) {
  if (!heroSlides.length || !heroSection) return;
  activeSlideIndex = (index + heroSlides.length) % heroSlides.length;
  const slide = heroSlides[activeSlideIndex];
  heroEyebrow.textContent = slide.eyebrow;
  heroTitle.textContent = slide.title;
  heroBody.textContent = slide.body;
  heroPrimaryAction.textContent = slide.primary_label || "Teroka Marketplace";
  heroPrimaryAction.dataset.page = slide.primary_page || "market";
  heroPrimaryAction.href = `#${heroPrimaryAction.dataset.page}`;
  heroSecondaryAction.textContent = slide.secondary_label || "Panduan Kreator";
  heroSecondaryAction.dataset.page = slide.secondary_page || "mint";
  heroSecondaryAction.href = `#${heroSecondaryAction.dataset.page}`;
  heroSection.style.setProperty("--hero-image", `url("${String(slide.image_url).replace(/"/g, "%22")}")`);
  heroDots.innerHTML = heroSlides
    .map((_, dotIndex) => `<button class="${dotIndex === activeSlideIndex ? "active" : ""}" type="button" data-slide-index="${dotIndex}" aria-label="Slide ${dotIndex + 1}"></button>`)
    .join("");
}

async function loadSlides() {
  try {
    const result = await apiRequest("/api/slides");
    heroSlides = Array.isArray(result.slides) && result.slides.length ? result.slides : heroSlides;
    applyHeroSlide(0);
    window.clearInterval(slideTimer);
    if (heroSlides.length > 1) {
      slideTimer = window.setInterval(() => applyHeroSlide(activeSlideIndex + 1), 6500);
    }
    renderSlideList(heroSlides);
  } catch {
    heroSlides = [];
  }
}

function canManagePlatform() {
  return currentUser && ["admin", "super_admin"].includes(currentUser.role);
}

function renderPhotoManager(photos = []) {
  if (!portalPhotoList) return;
  const pending = photos.filter((photo) => photo.status === "pending").length;
  pendingReviewMetric.textContent = pending;
  portalPhotoList.innerHTML = photos.length
    ? photos
        .map(
          (photo) => `<article class="manager-row">
            <img src="${escapeHtml(photo.image_url)}" alt="" />
            <div><strong>${escapeHtml(photo.title)}</strong><span>${escapeHtml(photo.creator_name)} · ${escapeHtml(photo.category)} · ${escapeHtml(photo.status)}</span><small>${escapeHtml(photo.authenticity_code || "")}</small></div>
            <div class="manager-actions">
              <button type="button" data-photo-status="approved" data-photo-id="${photo.id}">Approve</button>
              <button type="button" data-photo-status="rejected" data-photo-id="${photo.id}">Reject</button>
            </div>
          </article>`,
        )
        .join("")
    : '<p class="empty-state">Belum ada photo untuk review.</p>';
}

function renderMyListings(photos = []) {
  if (!myListingList) return;
  const mine =
    currentUser && ["admin", "super_admin"].includes(currentUser.role)
      ? photos
      : photos.filter((photo) => Number(photo.creator_id) === Number(currentUser?.id));
  myListingList.innerHTML = mine.length
    ? mine
        .map(
          (photo) => `<article class="manager-row">
            <img src="${escapeHtml(photo.image_url)}" alt="" />
            <div><strong>${escapeHtml(photo.title)}</strong><span>${escapeHtml(photo.status)} · ${formatMyr(Number(photo.price_myr || 0))} · ${Number(photo.price_eth || 0).toFixed(4)} ETH</span><small>Listing fee RM2. Service fee jualan 6%.</small></div>
            <div class="pricing-actions">
              <input type="number" min="1" step="1" value="${Number(photo.price_myr || 0)}" data-price-myr="${photo.id}" aria-label="Harga MYR" />
              <button type="button" data-update-price="${photo.id}">Update</button>
            </div>
          </article>`,
        )
        .join("")
    : '<p class="empty-state">Belum ada listing milik akaun ini.</p>';
}

function renderUserManager(users = []) {
  if (!portalUserList) return;
  portalUserList.innerHTML = users.length
    ? users
        .map(
          (user) => `<article class="manager-row compact">
            <div><strong>${escapeHtml(user.name)}</strong><span>${escapeHtml(user.email)} · ${escapeHtml(user.role)} · ${escapeHtml(user.status)}</span></div>
            <div class="manager-actions">
              <button type="button" data-user-role="user" data-user-id="${user.id}">User</button>
              <button type="button" data-user-role="admin" data-user-id="${user.id}">Admin</button>
              <button type="button" data-user-status="${user.status === "active" ? "suspended" : "active"}" data-user-id="${user.id}">${user.status === "active" ? "Suspend" : "Activate"}</button>
            </div>
          </article>`,
        )
        .join("")
    : '<p class="empty-state">Login sebagai super admin untuk lihat user.</p>';
}

function renderOrderManager(orders = []) {
  if (!portalOrderList) return;
  portalOrderList.innerHTML = orders.length
    ? orders
        .map(
          (order) => `<article class="manager-row compact">
            <div><strong>${escapeHtml(order.photo_title || order.order_ref)}</strong><span>${escapeHtml(order.payment_provider)} · ${escapeHtml(order.payment_status)} · RM ${Number(order.amount_myr || 0).toFixed(2)}</span></div>
            <small>${escapeHtml(order.buyer_email || "Guest buyer")}</small>
          </article>`,
        )
        .join("")
    : '<p class="empty-state">Belum ada order direkodkan.</p>';
}

function renderSlideList(slides = heroSlides) {
  if (!portalSlideList) return;
  portalSlideList.innerHTML = slides.length
    ? slides
        .map(
          (slide, index) => `<article class="manager-row">
            <img src="${escapeHtml(slide.image_url)}" alt="" />
            <div><strong>${escapeHtml(slide.title)}</strong><span>${escapeHtml(slide.eyebrow)} · ${escapeHtml(slide.status || "active")}</span></div>
            <div class="manager-actions">
              <button type="button" data-preview-slide="${index}">Preview</button>
              <button type="button" data-slide-status="${slide.status === "active" ? "inactive" : "active"}" data-slide-id="${slide.id}">${slide.status === "active" ? "Hide" : "Show"}</button>
            </div>
          </article>`,
        )
        .join("")
    : '<p class="empty-state">Belum ada slider.</p>';
}

function renderNewsManager(posts = []) {
  if (!portalNewsList) return;
  portalNewsList.innerHTML = posts.length
    ? posts
        .map(
          (post) => `
            <div class="manager-row compact" data-news-row="${post.id}">
              <img src="${escapeHtml(post.image_url || "assets/photoralogo.png")}" alt="" />
              <div>
                <strong>${escapeHtml(post.title)}</strong>
                <span>${escapeHtml(post.category || "Platform")} · ${escapeHtml(post.status || "published")} · ${new Date(post.created_at).toLocaleDateString("ms-MY")}</span>
                <small>${escapeHtml(post.excerpt || String(post.body || "").slice(0, 120))}</small>
              </div>
              <div class="manager-actions">
                <button type="button" data-news-edit="${post.id}">Edit</button>
                <button type="button" data-news-delete="${post.id}">Delete</button>
              </div>
            </div>
          `,
        )
        .join("")
    : '<p class="empty-state">Belum ada news untuk diurus.</p>';
}

async function loadCmsData() {
  if (!currentUser) {
    renderPhotoManager([]);
    renderMyListings([]);
    renderUserManager([]);
    renderOrderManager([]);
    renderSlideList(heroSlides);
    renderNewsManager([]);
    return;
  }
  try {
    const photos = await apiRequest("/api/photos");
    renderPhotoManager(photos.photos || []);
    renderMyListings(photos.photos || []);
  } catch {
    renderPhotoManager([]);
    renderMyListings([]);
  }
  if (canManagePlatform()) {
    try {
      const orders = await apiRequest("/api/cms/orders");
      renderOrderManager(orders.orders || []);
    } catch {
      renderOrderManager([]);
    }
    try {
      const news = await apiRequest("/api/cms/news");
      managedNewsPosts = news.posts || [];
      renderNewsManager(managedNewsPosts);
    } catch {
      managedNewsPosts = [];
      renderNewsManager([]);
    }
  }
  if (currentUser.role === "super_admin") {
    try {
      const users = await apiRequest("/api/cms/users");
      renderUserManager(users.users || []);
    } catch {
      renderUserManager([]);
    }
  } else {
    renderUserManager([]);
  }
  await loadSlides();
  await loadSalesSummary();
}

async function loadSalesSummary() {
  if (!currentUser) return;
  try {
    const result = await apiRequest("/api/cms/sales-summary");
    const summary = result.summary || {};
    salesGrossMetric.textContent = formatMyr(Number(summary.gross_myr || 0));
    salesFeeMetric.textContent = formatMyr(Number(summary.platform_fee_myr || 0));
    salesPayoutMetric.textContent = formatMyr(Number(summary.creator_payout_myr || 0));
    serviceFeeMetric.textContent = `${Number(summary.service_fee_percent || feeSettings.platformFee)}%`;
    listingFeeMyrMetric.textContent = formatMyr(Number(summary.listing_fee_myr || feeSettings.listingFee));
  } catch {
    salesGrossMetric.textContent = formatMyr(0);
    salesFeeMetric.textContent = formatMyr(0);
    salesPayoutMetric.textContent = formatMyr(0);
  }
}

function closeMobileMenu() {
  topbar.classList.remove("nav-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function showPage(page, shouldUpdateHash = true) {
  const targetPage = page || "market";
  if (["dashboard", "cms"].includes(targetPage) && !currentUser) {
    showToast("Login dahulu untuk buka dashboard.");
    showPage("login", shouldUpdateHash);
    return;
  }
  document.body.classList.toggle("login-mode", targetPage === "login");
  pageSections.forEach((section) => {
    section.classList.toggle("active", section.dataset.page === targetPage);
  });
  primaryNav.querySelectorAll("a").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === targetPage);
  });
  closeMobileMenu();

  if (shouldUpdateHash) {
    history.replaceState(null, "", `#${targetPage}`);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function selectCheckoutItem(item) {
  selectedCheckoutItem = item;
  checkoutTitle.textContent = item.title;
  checkoutEth.textContent = formatPrice(item.price);
  checkoutMyr.textContent = formatMyr(item.price * ethToMyr);
  checkoutNote.textContent = "Sedia untuk checkout menggunakan wang biasa.";
  showPage("checkout");
}

function getPlatformCut(transaction) {
  const rate = transaction.type === "secondary" ? feeSettings.secondaryShare : feeSettings.platformFee;
  return transaction.gross * (rate / 100);
}

function updateMetrics() {
  listedMetric.textContent = nftItems.length;
  const revenue = nftItems.reduce((total, item) => total + Number(item.price), 0);
  revenueMetric.textContent = `${revenue.toFixed(2)} ETH`;
  creatorListingsMetric.textContent = nftItems.length;
  creatorMetric.textContent = new Set(nftItems.map((item) => item.creator)).size;

  const platformCommission = transactions.reduce((total, trx) => total + getPlatformCut(trx), 0);
  const listingRevenue = nftItems.length * feeSettings.listingFee;
  const platformProfit = platformCommission + listingRevenue;
  const grossSales = transactions.reduce((total, trx) => total + trx.gross, 0);
  const creatorPayout = grossSales - platformCommission;

  primaryFeeLabel.textContent = `${feeSettings.platformFee}%`;
  listingFeeLabel.textContent = formatMyr(feeSettings.listingFee);
  royaltyShareLabel.textContent = `${feeSettings.secondaryShare}%`;
  platformProfitMetric.textContent = formatMyr(platformProfit);
  ownerWalletMetric.textContent = formatMyr(platformProfit);
  pendingPayoutMetric.textContent = formatPrice(creatorPayout);
  creatorEarningsMetric.textContent = formatPrice(creatorPayout);
  ownedMetric.textContent = transactions.length;
  buyerSpendMetric.textContent = formatPrice(grossSales);
  renderTransactions();
}

function renderTransactions() {
  transactionTable.innerHTML = "";
  transactionCount.textContent = `${transactions.length} records`;

  transactions.forEach((transaction) => {
    const row = document.createElement("tr");
    const platformCut = getPlatformCut(transaction);
    const payout = transaction.gross - platformCut;
    [
      transaction.item,
      transaction.buyer,
      transaction.payment,
      formatPrice(transaction.gross),
      formatPrice(platformCut),
      formatPrice(payout),
    ].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });
    transactionTable.appendChild(row);
  });
}

function saveCart() {
  localStorage.setItem("photoraCart", JSON.stringify(cartItems));
}

function addToCart(item) {
  if (!cartItems.some((cartItem) => Number(cartItem.id) === Number(item.id))) {
    cartItems.push(item);
    saveCart();
  }
  renderCart();
  showToast(`${item.title} ditambah ke cart.`);
}

function renderCart() {
  if (!cartList) return;
  const subtotal = cartItems.reduce((total, item) => total + Number(item.priceMyr || item.price * ethToMyr || 0), 0);
  const fee = subtotal * (feeSettings.platformFee / 100);
  cartSubtotal.textContent = formatMyr(subtotal);
  cartServiceFee.textContent = formatMyr(fee);
  cartTotal.textContent = formatMyr(subtotal);
  cartList.innerHTML = cartItems.length
    ? cartItems
        .map(
          (item) => `<article class="cart-row">
            <img src="${escapeHtml(item.image)}" alt="" />
            <div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.creator)} · ${formatMyr(item.priceMyr || item.price * ethToMyr)}</span><small>Platform split: ${formatMyr((item.priceMyr || item.price * ethToMyr) * (feeSettings.platformFee / 100))} / Creator: ${formatMyr((item.priceMyr || item.price * ethToMyr) * (1 - feeSettings.platformFee / 100))}</small></div>
            <button type="button" data-remove-cart="${item.id}">Remove</button>
          </article>`,
        )
        .join("")
    : '<p class="empty-state">Cart masih kosong. Tambah foto dari marketplace.</p>';
}

function renderCards() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const filtered = nftItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const searchable = `${item.title} ${item.creator} ${item.category}`.toLowerCase();
    return matchesCategory && searchable.includes(query);
  });

  grid.innerHTML = "";
  itemCountLabel.textContent = `${filtered.length} items`;

  if (filtered.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "Tiada NFT ditemui untuk carian ini.";
    grid.appendChild(emptyState);
    return;
  }

  filtered.forEach((item) => {
    const card = document.createElement("article");
    card.className = "nft-card";

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.title;
    image.loading = "lazy";

    const body = document.createElement("div");
    body.className = "nft-card-body";

    const cardTop = document.createElement("div");
    cardTop.className = "card-top";

    const titleWrap = document.createElement("div");
    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = item.title;
    const creator = document.createElement("span");
    creator.className = "creator";
    creator.textContent = `by ${item.creator}`;
    titleWrap.append(title, creator);

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = item.category;
    cardTop.append(titleWrap, tag);

    if (item.authenticityCode) {
      const code = document.createElement("span");
      code.className = "auth-code";
      code.textContent = item.authenticityCode;
      titleWrap.appendChild(code);
    }

    const cardBottom = document.createElement("div");
    cardBottom.className = "card-bottom";
    const price = document.createElement("strong");
    price.innerHTML = `${formatMyr(item.priceMyr || item.price * ethToMyr)} <span>${formatPrice(item.price)}</span>`;
    const actionGroup = document.createElement("div");
    actionGroup.className = "card-actions";
    const buyButton = document.createElement("button");
    buyButton.type = "button";
    buyButton.textContent = "Wallet";
    buyButton.addEventListener("click", () => {
      if (!walletConnected) {
        showToast("Connect wallet dahulu sebelum membeli NFT.");
        return;
      }
      transactions.unshift({
        item: item.title,
        buyer: "0x7A91...C24F",
        payment: "Wallet",
        gross: Number(item.price),
        type: "primary",
      });
      updateMetrics();
      showToast(`${item.title} dibeli melalui wallet.`);
    });

    const fiatButton = document.createElement("button");
    fiatButton.type = "button";
    fiatButton.className = "fiat-button";
    fiatButton.textContent = "Add cart";
    fiatButton.addEventListener("click", () => {
      addToCart(item);
    });

    actionGroup.append(buyButton, fiatButton);
    cardBottom.append(price, actionGroup);
    body.append(cardTop, cardBottom);
    card.append(image, body);
    grid.appendChild(card);
  });
}

walletButton.addEventListener("click", () => {
  walletConnected = !walletConnected;
  walletButton.classList.toggle("connected", walletConnected);
  walletText.textContent = walletConnected ? "0x7A91...C24F" : "Connect Wallet";
  showToast(walletConnected ? "Wallet disambungkan." : "Wallet diputuskan.");
});

accountButton.addEventListener("click", async (event) => {
  event.preventDefault();
  if (currentUser) {
    showPage("dashboard");
    return;
  }

  showPage("login");
  setAuthMode("login");
});

authClose.addEventListener("click", () => {
  showPage("market");
});

authTabs.forEach((button) => {
  button.addEventListener("click", () => setAuthMode(button.dataset.authMode));
});

async function submitAuthForm() {
  const data = new FormData(authForm);
  const endpoint = authMode === "register" ? "/api/auth/register" : "/api/auth/login";
  authNote.textContent = authMode === "register" ? "Mendaftar akaun..." : "Sedang log masuk...";
  authSubmit.disabled = true;
  try {
    const result = await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
        password: data.get("password"),
        phone: data.get("phone"),
      }),
    });
    authForm.reset();
    if (authMode === "register") {
      currentUser = null;
      updateAccountUi();
      setAuthMode("login");
      authNote.innerHTML = result.delivery?.previewUrl
        ? `Akaun didaftar. Sahkan email melalui link ini: <a href="${result.delivery.previewUrl}">Sahkan email</a>`
        : "Akaun didaftar. Sila semak email untuk link pengesahan.";
    } else {
      currentUser = result.user;
      updateAccountUi();
      showToast(`Login sebagai ${currentUser.role}.`);
      await loadPhotos();
      await loadCmsData();
      showPage("dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } catch (error) {
    authNote.innerHTML = error.result?.delivery?.previewUrl
      ? `${error.message} <a href="${error.result.delivery.previewUrl}">Sahkan email</a>`
      : error.message;
  } finally {
    authSubmit.disabled = false;
  }
}

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitAuthForm();
});

authSubmit.addEventListener("click", async (event) => {
  event.preventDefault();
  await submitAuthForm();
});

resetForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(resetForm);
  resetNote.textContent = "Menghantar link keselamatan...";
  try {
    const result = await apiRequest("/api/auth/request-reset", {
      method: "POST",
      body: JSON.stringify({ email: data.get("email") }),
    });
    resetNote.innerHTML = result.delivery?.previewUrl
      ? `Link tersedia: <a href="${result.delivery.previewUrl}">Buka link reset</a>`
      : "Jika akaun wujud, link reset telah dihantar ke email/WhatsApp.";
    resetForm.reset();
  } catch (error) {
    resetNote.textContent = error.message;
  }
});

logoutButton.addEventListener("click", async () => {
  await apiRequest("/api/auth/logout", { method: "POST" }).catch(() => null);
  currentUser = null;
  updateAccountUi();
  await loadCmsData();
  showToast("Anda telah log keluar.");
  showPage("market");
});

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!currentUser) {
    profileNote.textContent = "Login dahulu untuk update profile.";
    showPage("login");
    return;
  }
  const data = new FormData(profileForm);
  try {
    const result = await apiRequest("/api/me/profile", {
      method: "PATCH",
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
        phone: data.get("phone"),
        mobile_phone: data.get("mobile_phone"),
        address: data.get("address"),
        avatar_url: data.get("avatar_url"),
        wallet_crypto: currentUser.wallet_crypto,
        wallet_cash: currentUser.wallet_cash,
        luno_wallet: currentUser.luno_wallet,
        bank_name: currentUser.bank_name,
        bank_account_name: currentUser.bank_account_name,
        bank_account_number: currentUser.bank_account_number,
      }),
    });
    currentUser = result.user;
    updateAccountUi();
    profileNote.textContent = "Profile dikemaskini.";
  } catch (error) {
    profileNote.textContent = error.message;
  }
});

walletForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!currentUser) {
    walletNote.textContent = "Login dahulu untuk update wallet.";
    showPage("login");
    return;
  }
  const data = new FormData(walletForm);
  try {
    const result = await apiRequest("/api/me/profile", {
      method: "PATCH",
      body: JSON.stringify({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        mobile_phone: currentUser.mobile_phone,
        address: currentUser.address,
        avatar_url: currentUser.avatar_url,
        wallet_crypto: data.get("wallet_crypto"),
        wallet_cash: data.get("wallet_cash"),
        luno_wallet: data.get("luno_wallet"),
        bank_name: data.get("bank_name"),
        bank_account_name: data.get("bank_account_name"),
        bank_account_number: data.get("bank_account_number"),
      }),
    });
    currentUser = result.user;
    updateAccountUi();
    walletNote.textContent = "Wallet dikemaskini. LUNO disokong sebagai rujukan wallet crypto.";
  } catch (error) {
    walletNote.textContent = error.message;
  }
});

refreshCryptoButton.addEventListener("click", loadCryptoPrices);
refreshCmsButton.addEventListener("click", loadCmsData);

heroDots.addEventListener("click", (event) => {
  const button = event.target.closest("[data-slide-index]");
  if (!button) return;
  applyHeroSlide(Number(button.dataset.slideIndex));
});

roleTools.forEach((button) => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});

document.querySelectorAll(".dashboard-jump").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showPage("dashboard");
    const target = document.querySelector(link.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

newsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!currentUser || !["admin", "super_admin"].includes(currentUser.role)) {
    newsNote.textContent = "Hanya admin atau super admin boleh urus news.";
    showPage("login");
    return;
  }
  const data = new FormData(newsForm);
  const imageFile = data.get("image_file");
  const uploadedImage = imageFile && imageFile.size ? await readFileAsDataUrl(imageFile) : "";
  const newsId = data.get("id");
  const payload = {
    title: data.get("title"),
    category: data.get("category"),
    excerpt: data.get("excerpt"),
    image_url: uploadedImage || data.get("image_url"),
    body: data.get("body"),
    status: data.get("status"),
  };
  try {
    await apiRequest(newsId ? `/api/cms/news/${newsId}` : "/api/cms/news", {
      method: newsId ? "PATCH" : "POST",
      body: JSON.stringify(payload),
    });
    newsForm.reset();
    newsForm.elements.status.value = "published";
    newsNote.textContent = newsId ? "News berjaya dikemaskini." : "News berjaya dipublish.";
    await loadNews();
    await loadCmsData();
  } catch (error) {
    newsNote.textContent = error.message;
  }
});

newNewsButton.addEventListener("click", () => {
  newsForm.reset();
  newsForm.elements.id.value = "";
  newsForm.elements.status.value = "published";
  newsNote.textContent = "Sedia untuk post news baharu.";
});

portalNewsList.addEventListener("click", async (event) => {
  const editButton = event.target.closest("[data-news-edit]");
  const deleteButton = event.target.closest("[data-news-delete]");
  if (editButton) {
    const post = managedNewsPosts.find((item) => Number(item.id) === Number(editButton.dataset.newsEdit));
    if (!post) return;
    newsForm.elements.id.value = post.id;
    newsForm.elements.title.value = post.title || "";
    newsForm.elements.category.value = post.category || "Platform";
    newsForm.elements.excerpt.value = post.excerpt || "";
    newsForm.elements.image_url.value = post.image_url || "";
    newsForm.elements.body.value = post.body || "";
    newsForm.elements.status.value = post.status || "published";
    newsNote.textContent = "Sedang edit news. Tekan Publish news untuk simpan.";
    newsForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (deleteButton) {
    try {
      await apiRequest(`/api/cms/news/${deleteButton.dataset.newsDelete}`, { method: "DELETE" });
      newsNote.textContent = "News telah dipadam.";
      await loadNews();
      await loadCmsData();
    } catch (error) {
      newsNote.textContent = error.message;
    }
  }
});

scanForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = new FormData(scanForm).get("query");
  scanNote.textContent = "Scanning authenticity code...";
  try {
    const result = await apiRequest("/api/photos/verify", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
    scanNote.textContent = result.valid
      ? `Sah: ${result.photo.title} (${result.photo.authenticity_code || "registered asset"})`
      : "Tidak ditemui dalam rekod Photora. Semak semula kod atau URL gambar.";
  } catch (error) {
    scanNote.textContent = error.message;
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = topbar.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

pageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const page = link.dataset.page;
    if (!page) return;
    event.preventDefault();
    showPage(page);
  });
});

window.addEventListener("hashchange", () => {
  showPage((window.location.hash || "#market").replace("#", ""), false);
});

accountTypeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    accountTypeButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

portalPhotoList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-photo-id]");
  if (!button) return;
  try {
    await apiRequest(`/api/cms/photos/${button.dataset.photoId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: button.dataset.photoStatus }),
    });
    await loadPhotos();
    await loadCmsData();
    showToast("Status photo dikemaskini.");
  } catch (error) {
    showToast(error.message);
  }
});

myListingList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-update-price]");
  if (!button) return;
  const input = myListingList.querySelector(`[data-price-myr="${button.dataset.updatePrice}"]`);
  try {
    await apiRequest(`/api/photos/${button.dataset.updatePrice}/pricing`, {
      method: "PATCH",
      body: JSON.stringify({ price_myr: Number(input.value || 0), price_eth: Number(input.value || 0) / ethToMyr }),
    });
    await loadPhotos();
    await loadCmsData();
    showToast("Harga listing dikemaskini.");
  } catch (error) {
    showToast(error.message);
  }
});

portalUserList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-user-id]");
  if (!button) return;
  const payload = button.dataset.userRole ? { role: button.dataset.userRole } : { status: button.dataset.userStatus };
  try {
    await apiRequest(`/api/cms/users/${button.dataset.userId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    await loadCmsData();
    showToast("User dikemaskini.");
  } catch (error) {
    showToast(error.message);
  }
});

portalSlideList.addEventListener("click", async (event) => {
  const preview = event.target.closest("[data-preview-slide]");
  if (preview) {
    applyHeroSlide(Number(preview.dataset.previewSlide));
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const statusButton = event.target.closest("[data-slide-id]");
  if (!statusButton) return;
  try {
    await apiRequest(`/api/cms/slides/${statusButton.dataset.slideId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: statusButton.dataset.slideStatus }),
    });
    await loadSlides();
    showToast("Slider dikemaskini.");
  } catch (error) {
    showToast(error.message);
  }
});

cartList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-cart]");
  if (!button) return;
  cartItems = cartItems.filter((item) => Number(item.id) !== Number(button.dataset.removeCart));
  saveCart();
  renderCart();
});

cartCheckoutButton.addEventListener("click", () => {
  if (!cartItems.length) {
    cartNote.textContent = "Cart masih kosong.";
    return;
  }
  const subtotal = cartItems.reduce((total, item) => total + Number(item.priceMyr || item.price * ethToMyr || 0), 0);
  selectedCheckoutItem = {
    id: cartItems[0].id,
    title: `Photora cart (${cartItems.length} foto)`,
    price: subtotal / ethToMyr,
  };
  checkoutTitle.textContent = selectedCheckoutItem.title;
  checkoutEth.textContent = formatPrice(selectedCheckoutItem.price);
  checkoutMyr.textContent = formatMyr(subtotal);
  checkoutNote.textContent = `Termasuk split platform ${feeSettings.platformFee}% dan payout creator.`;
  showPage("checkout");
});

createUserForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (currentUser?.role !== "super_admin") {
    userManageNote.textContent = "Login sebagai super admin untuk cipta admin/user.";
    return;
  }
  const data = new FormData(createUserForm);
  try {
    await apiRequest("/api/cms/users", {
      method: "POST",
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
        password: data.get("password"),
        role: data.get("role"),
      }),
    });
    createUserForm.reset();
    userManageNote.textContent = "User berjaya dicipta.";
    await loadCmsData();
  } catch (error) {
    userManageNote.textContent = error.message;
  }
});

slideForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!canManagePlatform()) {
    slideNote.textContent = "Login sebagai admin atau super admin untuk update slider.";
    return;
  }
  const data = new FormData(slideForm);
  try {
    await apiRequest("/api/cms/slides", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(data.entries())),
    });
    slideForm.reset();
    slideNote.textContent = "Slider hadapan berjaya dipublish.";
    await loadSlides();
  } catch (error) {
    slideNote.textContent = error.message;
  }
});

searchInput.addEventListener("input", renderCards);
categoryFilter.addEventListener("change", () => {
  categoryPills.forEach((button) => {
    button.classList.toggle("active", button.dataset.category === categoryFilter.value);
  });
  renderCards();
});

categoryPills.forEach((button) => {
  button.addEventListener("click", () => {
    categoryFilter.value = button.dataset.category;
    categoryPills.forEach((pill) => pill.classList.remove("active"));
    button.classList.add("active");
    renderCards();
  });
});

mintForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!currentUser) {
    formNote.textContent = "Login dahulu sebelum submit foto.";
    showPage("login");
    return;
  }
  const data = new FormData(mintForm);
  const item = {
    title: data.get("title").trim(),
    creator: data.get("creator").trim(),
    category: data.get("category"),
    price: Number(data.get("price")),
    image: data.get("image").trim(),
  };

  try {
    const result = await apiRequest("/api/photos", {
      method: "POST",
      body: JSON.stringify({
        title: item.title,
        category: item.category,
        price_eth: item.price,
        price_myr: Number(data.get("price_myr") || item.price * ethToMyr),
        image_url: item.image,
        description: data.get("description") || "",
        source_type: item.category === "Mobilegraphy" ? "mobilegraphy" : "dslr",
      }),
    });
    const created = normalisePhoto(result.photo);
    if (created.status === "approved") nftItems.unshift(created);
    mintForm.reset();
    formNote.textContent =
      created.status === "pending"
        ? `${created.title} dihantar untuk approval admin.`
        : `${created.title} berjaya disenaraikan.`;
    categoryFilter.value = "all";
    searchInput.value = "";
    updateMetrics();
    renderCards();
    renderCart();
    showToast("Foto sudah dihantar ke sistem CMS.");
  } catch (error) {
    formNote.textContent = error.message;
  }
});

feeSettingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(feeSettingsForm);
  feeSettings.platformFee = Number(data.get("platformFee"));
  feeSettings.listingFee = Number(data.get("listingFee"));
  feeSettings.secondaryShare = Number(data.get("secondaryShare"));
  updateMetrics();
  settingsNote.textContent = "Fee settings dikemaskini untuk simulasi profit.";
  showToast("CMS owner sudah update model keuntungan.");
});

payFiatButton.addEventListener("click", async () => {
  if (!selectedCheckoutItem) {
    checkoutNote.textContent = "Pilih foto dari marketplace dahulu.";
    showToast("Pilih foto sebelum bayar.");
    return;
  }

  const method = paymentMethod.value;
  const amountMyr = selectedCheckoutItem.price * ethToMyr;
  payFiatButton.disabled = true;
  checkoutNote.textContent = "Mencipta bill ToyyibPay...";

  try {
    const response = await fetch("/api/toyyibpay/create-bill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: selectedCheckoutItem.title,
        amountCents: Math.round(amountMyr * 100),
        amountEth: selectedCheckoutItem.price,
        photoId: selectedCheckoutItem.id,
        customerName: "Photora Buyer",
        customerEmail: currentUser?.email || "buyer@example.com",
        customerPhone: "0100000000",
        paymentMethod: method,
      }),
    });
    const result = await response.json();

    if (!response.ok || !result.checkoutUrl) {
      throw new Error(result.error || "ToyyibPay bill gagal dicipta.");
    }

    transactions.unshift({
      item: selectedCheckoutItem.title,
      buyer: result.orderId,
      payment: "ToyyibPay",
      gross: Number(selectedCheckoutItem.price),
      type: "primary",
    });
    updateMetrics();
    checkoutNote.textContent = "Redirect ke ToyyibPay sandbox...";
    window.location.href = result.checkoutUrl;
  } catch (error) {
    checkoutNote.textContent = error.message;
    showToast("ToyyibPay checkout gagal.");
  } finally {
    payFiatButton.disabled = false;
  }
});

function setChatOpen(isOpen) {
  chatPanel.hidden = !isOpen;
  chatToggle.setAttribute("aria-expanded", String(isOpen));
}

function getChatAnswer(question) {
  if (question.includes("MYR")) {
    return "Ya. Pilih Pay MYR pada foto, pilih FPX/kad/e-wallet, kemudian original file dibuka selepas bayaran berjaya.";
  }

  if (question.includes("upload")) {
    return "Creator perlu upload foto asli daripada DSLR atau mobile phone. Foto AI-generated dan manipulasi berat tidak diterima.";
  }

  return "Preview dipaparkan dalam resolusi rendah dengan watermark. Fail original disimpan private dan dibuka melalui signed URL selepas pembelian.";
}

function appendChatMessage(text, type) {
  const message = document.createElement("p");
  message.className = type === "user" ? "user-message" : "bot-message";
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatToggle.addEventListener("click", () => {
  setChatOpen(chatPanel.hidden);
});

chatClose.addEventListener("click", () => {
  setChatOpen(false);
});

quickReplies.forEach((button) => {
  button.addEventListener("click", () => {
    const question = button.dataset.reply;
    appendChatMessage(question, "user");
    appendChatMessage(getChatAnswer(question), "bot");
  });
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((tab) => tab.classList.remove("active"));
    cmsPanels.forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    document.querySelector(`#${button.dataset.panel}`).classList.add("active");
  });
});

updateMetrics();
renderCards();
setAuthMode("login");
loadSettings().then(() => {
  updateMetrics();
  renderCards();
  renderCart();
});
loadSlides();
loadSession().then(async () => {
  await loadPhotos();
  await loadCmsData();
  showPage((window.location.hash || "#market").replace("#", ""), false);
});
loadCryptoPrices();
loadNews();
