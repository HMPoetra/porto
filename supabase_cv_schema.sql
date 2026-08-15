-- ==============================================================================
-- SUPABASE SCHEMA: CURRICULUM VITAE (CV) MANAGEMENT & STORAGE SETUP
-- Description: Tabel & Storage bucket untuk upload Drag & Drop file CV (PDF/DOC)
-- ==============================================================================

-- 1. Buat Tabel `curriculum_vitae`
CREATE TABLE IF NOT EXISTS curriculum_vitae (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Curriculum Vitae Hapsoro Mahendra Poetra',
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE curriculum_vitae ENABLE ROW LEVEL SECURITY;

-- 3. Policy RLS:
-- Akses Penuh (SELECT, INSERT, UPDATE, DELETE) untuk Publik & Authenticated
DROP POLICY IF EXISTS "Public can read active CV" ON curriculum_vitae;
DROP POLICY IF EXISTS "Admins can manage CV files" ON curriculum_vitae;
DROP POLICY IF EXISTS "Full access to curriculum_vitae" ON curriculum_vitae;

CREATE POLICY "Full access to curriculum_vitae" 
  ON curriculum_vitae 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- 4. Storage Bucket Setup untuk file CV (`cv_files` & `portfolio`)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cv_files', 
  'cv_files', 
  true, 
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 10485760;

-- 5. Policy Storage untuk Bucket `cv_files` & `portfolio`
DROP POLICY IF EXISTS "Public can view and download CV files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload CV files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update or delete CV files" ON storage.objects;
DROP POLICY IF EXISTS "Full storage access for cv_files and portfolio" ON storage.objects;

CREATE POLICY "Full storage access for cv_files and portfolio"
  ON storage.objects
  FOR ALL
  USING (bucket_id = 'cv_files' OR bucket_id = 'portfolio')
  WITH CHECK (bucket_id = 'cv_files' OR bucket_id = 'portfolio');

-- ==============================================================================
-- DATA AWAL (Opsional)
-- ==============================================================================
INSERT INTO curriculum_vitae (title, file_url, file_name, file_size, is_active)
VALUES (
  'CV Hapsoro Mahendra Poetra - Latest 2026',
  '/cv/HMPoetra_CV.pdf',
  'HMPoetra_CV.pdf',
  254000,
  true
)
ON CONFLICT DO NOTHING;
