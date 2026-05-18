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

let walletConnected = false;
let selectedCheckoutItem = null;
let currentUser = null;
let authMode = "login";
const ethToMyr = 15000;
const transactions = [
  { item: "Konvo Seri Gemilang #018", buyer: "0x92B4...A81D", payment: "Wallet", gross: 0.42, type: "primary" },
  { item: "Akad Nikah Frame #012", buyer: "guest-1042", payment: "FPX", gross: 0.27, type: "primary" },
  { item: "Kuala Lumpur Street #088", buyer: "0x31D8...F09A", payment: "Wallet", gross: 0.35, type: "secondary" },
];

const feeSettings = {
  platformFee: 7,
  listingFee: 0.01,
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

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2400);
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Request failed.");
  return result;
}

function normalisePhoto(photo) {
  return {
    id: photo.id,
    title: photo.title,
    creator: photo.creator || photo.creator_name,
    category: photo.category,
    price: Number(photo.price || photo.price_eth || 0),
    image: photo.image || photo.image_url,
    description: photo.description || "",
    status: photo.status || "approved",
    authenticityCode: photo.authenticity_code || "",
  };
}

function updateAccountUi() {
  accountButton.textContent = currentUser ? "Portal" : "Login";
  roleBadge.textContent = currentUser?.role || "Guest";
  roleDashboardTitle.textContent = currentUser
    ? `Dashboard ${currentUser.role.replace("_", " ")}`
    : "Dashboard pengguna";
  if (currentUser && profileForm && walletForm) {
    profileForm.elements.name.value = currentUser.name || "";
    profileForm.elements.phone.value = currentUser.phone || "";
    walletForm.elements.wallet_crypto.value = currentUser.wallet_crypto || "";
    walletForm.elements.wallet_cash.value = currentUser.wallet_cash || "";
    walletForm.elements.luno_wallet.value = currentUser.luno_wallet || "";
  }
  roleCards.forEach((card) => {
    const role = card.dataset.roleCard;
    const allowed =
      !currentUser ||
      role === "user" ||
      currentUser.role === "super_admin" ||
      (currentUser.role === "admin" && role === "admin");
    card.hidden = !allowed;
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

function closeMobileMenu() {
  topbar.classList.remove("nav-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function showPage(page, shouldUpdateHash = true) {
  const targetPage = page || "market";
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
  listingFeeLabel.textContent = `${feeSettings.listingFee.toFixed(3)} ETH`;
  royaltyShareLabel.textContent = `${feeSettings.secondaryShare}%`;
  platformProfitMetric.textContent = formatPrice(platformProfit);
  ownerWalletMetric.textContent = formatPrice(platformProfit);
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
    price.textContent = formatPrice(item.price);
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
    fiatButton.textContent = "Pay MYR";
    fiatButton.addEventListener("click", () => {
      selectCheckoutItem(item);
      showToast(`${item.title} dipilih untuk bayaran MYR.`);
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

accountButton.addEventListener("click", async () => {
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

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(authForm);
  const endpoint = authMode === "register" ? "/api/auth/register" : "/api/auth/login";
  try {
    const result = await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
        password: data.get("password"),
      }),
    });
    currentUser = result.user;
    updateAccountUi();
    authForm.reset();
    showToast(`Login sebagai ${currentUser.role}.`);
    await loadPhotos();
    showPage("dashboard");
  } catch (error) {
    authNote.textContent = error.message;
  }
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
        phone: data.get("phone"),
        wallet_crypto: currentUser.wallet_crypto,
        wallet_cash: currentUser.wallet_cash,
        luno_wallet: currentUser.luno_wallet,
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
        phone: currentUser.phone,
        wallet_crypto: data.get("wallet_crypto"),
        wallet_cash: data.get("wallet_cash"),
        luno_wallet: data.get("luno_wallet"),
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

roleTools.forEach((button) => {
  button.addEventListener("click", () => showPage(button.dataset.page));
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
showPage((window.location.hash || "#market").replace("#", ""), false);
setAuthMode("login");
loadSession().then(loadPhotos);
loadCryptoPrices();
