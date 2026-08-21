-- ==============================================================================
-- SUPABASE SCHEMA: CURRICULUM VITAE (CV) MANAGEMENT & STORAGE SETUP
-- 100% Bebas Error 42P10 & Aman dijalankan berulang kali (Idempotent)
-- ==============================================================================

-- 1. Buat Tabel `curriculum_vitae`
CREATE TABLE IF NOT EXISTS public.curriculum_vitae (
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
ALTER TABLE public.curriculum_vitae ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read CV" ON public.curriculum_vitae;
DROP POLICY IF EXISTS "Admin Full CV" ON public.curriculum_vitae;

CREATE POLICY "Public Read CV" ON public.curriculum_vitae FOR SELECT USING (true);
CREATE POLICY "Admin Full CV" ON public.curriculum_vitae FOR ALL USING (true) WITH CHECK (true);

-- 3. Storage Bucket Setup untuk file CV (`cv_files`)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cv_files', 
  'cv_files', 
  true, 
  10485760,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 10485760;

DROP POLICY IF EXISTS "Public Read Storage CV" ON storage.objects;
DROP POLICY IF EXISTS "Admin Full Storage CV" ON storage.objects;

CREATE POLICY "Public Read Storage CV" ON storage.objects 
  FOR SELECT USING (bucket_id IN ('cv_files', 'portfolio'));

CREATE POLICY "Admin Full Storage CV" ON storage.objects 
  FOR ALL USING (bucket_id IN ('cv_files', 'portfolio')) WITH CHECK (bucket_id IN ('cv_files', 'portfolio'));

-- 4. Initial CV Seed (WHERE NOT EXISTS)
INSERT INTO public.curriculum_vitae (title, file_url, file_name, file_size, is_active)
SELECT 
  'CV Hapsoro Mahendra Poetra - Latest 2026',
  '/cv/HMPoetra_CV.pdf',
  'HMPoetra_CV.pdf',
  254000,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.curriculum_vitae);
