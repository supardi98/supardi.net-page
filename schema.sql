CREATE TABLE IF NOT EXISTS clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  link_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  desc TEXT NOT NULL,
  full_desc TEXT NOT NULL,
  tech TEXT NOT NULL, -- Stored as JSON string array
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- Seed Data (using public CDN placeholders)
INSERT INTO portfolios (title, desc, full_desc, tech, image_url, order_index) VALUES 
('sys_ecommerce.exe', 'Executing commerce protocols...', 'A comprehensive e-commerce platform built from scratch. Features include real-time inventory tracking, secure payment gateways, and a custom admin dashboard for order management.', '["Vue 3", "Tailwind", "Cloudflare D1", "Stripe API"]', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80', 1),
('admin_panel.sh', 'Root access dashboard interface.', 'Internal tooling interface designed for system administrators. Provides data visualization, user access control, and live server health monitoring.', '["Nuxt.js", "Chart.js", "WebSockets", "PostgreSQL"]', 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80', 2),
('social_node.js', 'P2P network communication layer.', 'A decentralized social media prototype emphasizing user privacy and data ownership. Implements peer-to-peer message passing and encrypted local storage.', '["Node.js", "WebRTC", "IndexedDB", "Express"]', 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&q=80', 3);

CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- Seed Data for Skills
INSERT INTO skills (name, level, order_index) VALUES 
('JavaScript / TypeScript', 90, 1),
('Vue.js / Nuxt', 85, 2),
('Tailwind CSS', 95, 3),
('Node.js / Express', 80, 4),
('Cloudflare / D1', 75, 5),
('Linux / Bash', 85, 6);

CREATE TABLE IF NOT EXISTS links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- Seed Data for Links
INSERT INTO links (title, url, icon, order_index) VALUES 
('My Portfolio', '#portfolio', 'Terminal', 1),
('@supardi._', 'https://instagram.com/supardi._', 'Instagram', 2),
('supardi98', 'https://github.com/supardi98', 'Github', 3),
('contact@supardi.net', 'mailto:contact@supardi.net', 'Mail', 4),
('6287728864687', 'https://wa.me/6287728864687', 'MessageCircle', 5);
