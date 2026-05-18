CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'super_admin') NOT NULL DEFAULT 'user',
  status ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
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
