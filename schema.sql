CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'super_admin') NOT NULL DEFAULT 'user',
  status ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
  email_verified TINYINT(1) NOT NULL DEFAULT 0,
  email_verified_at TIMESTAMP NULL,
  phone VARCHAR(40) NULL,
  wallet_crypto VARCHAR(190) NULL,
  wallet_cash VARCHAR(190) NULL,
  luno_wallet VARCHAR(190) NULL,
  preferred_currency VARCHAR(12) NOT NULL DEFAULT 'MYR',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  creator_id INT NULL,
  creator_name VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  price_eth DECIMAL(12,4) NOT NULL DEFAULT 0.0000,
  price_myr DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  listing_fee_myr DECIMAL(12,2) NOT NULL DEFAULT 2.00,
  image_url TEXT NOT NULL,
  authenticity_code VARCHAR(80) NULL UNIQUE,
  perceptual_hash VARCHAR(128) NULL,
  description TEXT NULL,
  source_type ENUM('dslr', 'mobilegraphy') NOT NULL DEFAULT 'mobilegraphy',
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_ref VARCHAR(80) NOT NULL UNIQUE,
  buyer_id INT NULL,
  photo_id INT NULL,
  amount_myr DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  amount_eth DECIMAL(12,4) NOT NULL DEFAULT 0.0000,
  platform_fee_myr DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  creator_payout_myr DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  payment_provider VARCHAR(40) NOT NULL DEFAULT 'ToyyibPay',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  bill_code VARCHAR(80) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE SET NULL
);

CREATE INDEX idx_photos_status ON photos(status);
CREATE INDEX idx_photos_category ON photos(category);
CREATE INDEX idx_orders_status ON orders(payment_status);

CREATE TABLE IF NOT EXISTS auth_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token_hash VARCHAR(128) NOT NULL UNIQUE,
  type ENUM('email_verify', 'password_reset') NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  consumed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_auth_tokens_lookup ON auth_tokens(type, token_hash, expires_at);

CREATE TABLE IF NOT EXISTS news_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  author_id INT NULL,
  title VARCHAR(180) NOT NULL,
  body TEXT NOT NULL,
  status ENUM('published', 'draft') NOT NULL DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_news_status ON news_posts(status);

CREATE TABLE IF NOT EXISTS hero_slides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  eyebrow VARCHAR(120) NOT NULL,
  title VARCHAR(180) NOT NULL,
  body TEXT NOT NULL,
  image_url TEXT NOT NULL,
  primary_label VARCHAR(80) NOT NULL DEFAULT 'Teroka Marketplace',
  primary_page VARCHAR(40) NOT NULL DEFAULT 'market',
  secondary_label VARCHAR(80) NOT NULL DEFAULT 'Panduan Kreator',
  secondary_page VARCHAR(40) NOT NULL DEFAULT 'mint',
  sort_order INT NOT NULL DEFAULT 0,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hero_slides_status ON hero_slides(status, sort_order);

CREATE TABLE IF NOT EXISTS platform_settings (
  setting_key VARCHAR(80) PRIMARY KEY,
  setting_value VARCHAR(190) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nfts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  photo_id INT NULL,
  token_id VARCHAR(120) NULL,
  blockchain VARCHAR(40) NOT NULL DEFAULT 'polygon',
  contract_address VARCHAR(190) NULL,
  owner_wallet VARCHAR(190) NULL,
  metadata_uri TEXT NULL,
  royalty_percent DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  status ENUM('draft', 'minted', 'listed') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NULL,
  nft_id INT NULL,
  buyer_wallet VARCHAR(190) NULL,
  seller_wallet VARCHAR(190) NULL,
  crypto_type VARCHAR(20) NULL,
  amount DECIMAL(18,8) NOT NULL DEFAULT 0.00000000,
  amount_myr DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  status ENUM('pending', 'paid', 'failed') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  FOREIGN KEY (nft_id) REFERENCES nfts(id) ON DELETE SET NULL
);
