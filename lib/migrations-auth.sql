-- =============================================
-- Users and Pages tables for secure page editing
-- =============================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create pages table with owner relationship
CREATE TABLE IF NOT EXISTS pages (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_pages_owner_id ON pages(owner_id);
CREATE INDEX IF NOT EXISTS idx_pages_updated_at ON pages(updated_at);

-- =============================================
-- Insert default admin user
-- Password: admin123 (hashed with bcrypt)
-- IMPORTANT: Change this password in production!
-- =============================================
INSERT INTO users (email, password_hash, name, role)
VALUES (
  'admin@lidmar.pl',
  '$2b$10$UWgHHA8fmEllaDlvLfy97eGFisLc1wk.S35eD2scbB6vr.C./GRo.',
  'Administrator',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert example page for testing
INSERT INTO pages (title, content, owner_id)
SELECT 
  'Strona testowa',
  'To jest przykładowa treść strony, którą możesz edytować.',
  id
FROM users
WHERE email = 'admin@lidmar.pl'
ON CONFLICT DO NOTHING;

