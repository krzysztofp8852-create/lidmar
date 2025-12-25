-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create site_content table (single row for site configuration)
CREATE TABLE IF NOT EXISTS site_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT NOT NULL,
  about_content TEXT NOT NULL,
  products_title TEXT NOT NULL,
  products_description TEXT NOT NULL,
  products_features JSONB NOT NULL DEFAULT '[]'::jsonb,
  applications JSONB NOT NULL DEFAULT '[]'::jsonb,
  why_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  cooperation_content TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_address TEXT NOT NULL,
  contact_message TEXT NOT NULL,
  footer_company_name TEXT NOT NULL DEFAULT 'LiD-MAR',
  footer_description TEXT NOT NULL DEFAULT 'Producent pasty BHP do mycia rąk',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT site_content_single_row CHECK (id = 1)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_updated_at ON products(updated_at);
CREATE INDEX IF NOT EXISTS idx_site_content_updated_at ON site_content(updated_at);
CREATE INDEX IF NOT EXISTS idx_site_content_id ON site_content(id);

-- Optimize: Since site_content only has one row, we can use a unique constraint
ALTER TABLE site_content DROP CONSTRAINT IF EXISTS site_content_single_row;
ALTER TABLE site_content ADD CONSTRAINT site_content_single_row CHECK (id = 1);

-- Insert default site content
INSERT INTO site_content (
  id,
  hero_title,
  hero_subtitle,
  about_content,
  products_title,
  products_description,
  products_features,
  applications,
  why_items,
  cooperation_content,
  contact_phone,
  contact_email,
  contact_address,
  contact_message,
  footer_company_name,
  footer_description
) VALUES (
  1,
  'LiD-MAR – producent pasty BHP do mycia rąk',
  'Produkujemy skuteczne pasty BHP do zastosowań przemysłowych – dla zakładów pracy, warsztatów i firm produkcyjnych.',
  'LiD-MAR to polski producent specjalizujący się w wytwarzaniu pasty BHP do mycia rąk dla zastosowań przemysłowych.

Nasza działalność opiera się na trzech fundamentach: jakości, powtarzalności i doświadczeniu w produkcji przemysłowej. 
Skupiamy się na współpracy B2B, oferując produkty dostosowane do potrzeb zakładów produkcyjnych, warsztatów i firm przemysłowych.

Dzięki własnej produkcji i ścisłej kontroli jakości, zapewniamy naszym partnerom biznesowym niezawodne rozwiązania 
w zakresie higieny przemysłowej.',
  'Pasta BHP do mycia rąk',
  'Skuteczna pasta BHP do zastosowań przemysłowych',
  '["Skuteczne usuwanie zabrudzeń przemysłowych", "Bezpieczna dla skóry", "Zastosowanie w przemyśle i warsztatach"]'::jsonb,
  '[{"title": "zakłady produkcyjne", "description": "Nasze produkty znajdują zastosowanie w zakładach produkcyjnych, zapewniając skuteczne i bezpieczne rozwiązania do mycia rąk w środowisku przemysłowym."}, {"title": "warsztaty mechaniczne", "description": "Nasze produkty znajdują zastosowanie w warsztatach mechanicznych, zapewniając skuteczne i bezpieczne rozwiązania do mycia rąk w środowisku przemysłowym."}, {"title": "serwisy techniczne", "description": "Nasze produkty znajdują zastosowanie w serwisach technicznych, zapewniając skuteczne i bezpieczne rozwiązania do mycia rąk w środowisku przemysłowym."}, {"title": "przemysł ciężki i lekki", "description": "Nasze produkty znajdują zastosowanie w przemyśle ciężkim i lekkim, zapewniając skuteczne i bezpieczne rozwiązania do mycia rąk w środowisku przemysłowym."}]'::jsonb,
  '[{"title": "Własna produkcja", "description": "Pełna kontrola nad procesem wytwarzania i jakością produktów."}, {"title": "Kontrola jakości", "description": "Ścisłe standardy zapewniające powtarzalność i niezawodność."}, {"title": "Elastyczność współpracy B2B", "description": "Dostosowanie warunków współpracy do potrzeb partnerów biznesowych."}, {"title": "Terminowe dostawy", "description": "Rzetelność w realizacji zamówień dla firm produkcyjnych."}]'::jsonb,
  'Oferujemy współpracę hurtową z firmami poszukującymi niezawodnego partnera w zakresie produktów BHP.

Specjalizujemy się w stałych dostawach dla zakładów produkcyjnych, warsztatów i dystrybutorów. 
Każdej firmie oferujemy indywidualne warunki współpracy dostosowane do potrzeb i skali działalności.

Skontaktuj się z nami, aby omówić szczegóły współpracy B2B.',
  '[Numer telefonu]',
  '[Adres email]',
  '[Adres firmy]',
  'Zapraszamy do kontaktu w sprawie współpracy B2B, wyceny zamówień hurtowych oraz indywidualnych warunków współpracy.',
  'LiD-MAR',
  'Producent pasty BHP do mycia rąk'
) ON CONFLICT (id) DO NOTHING;

-- Add contact_message column if it doesn't exist (for existing databases)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'site_content' AND column_name = 'contact_message'
  ) THEN
    ALTER TABLE site_content ADD COLUMN contact_message TEXT NOT NULL DEFAULT 'Zapraszamy do kontaktu w sprawie współpracy B2B, wyceny zamówień hurtowych oraz indywidualnych warunków współpracy.';
  END IF;
END $$;

-- Add footer columns if they don't exist (for existing databases)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'site_content' AND column_name = 'footer_company_name'
  ) THEN
    ALTER TABLE site_content ADD COLUMN footer_company_name TEXT NOT NULL DEFAULT 'LiD-MAR';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'site_content' AND column_name = 'footer_description'
  ) THEN
    ALTER TABLE site_content ADD COLUMN footer_description TEXT NOT NULL DEFAULT 'Producent pasty BHP do mycia rąk';
  END IF;
END $$;
