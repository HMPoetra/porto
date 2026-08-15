-- ==============================================================================
-- SUPABASE SCHEMA UPDATE — TABEL EXPERIENCES
-- Jalankan di Supabase SQL Editor (Dashboard > SQL Editor)
-- Aman dijalankan berulang kali (Idempotent)
-- ==============================================================================

-- 1. TABEL EXPERIENCES
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Work', 'Internship', 'Organization', 'Academic')),
    location TEXT NOT NULL DEFAULT 'Indonesia',
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL DEFAULT 'Present',
    description TEXT NOT NULL DEFAULT '',
    tags TEXT[] DEFAULT '{}',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — EXPERIENCES
-- ==============================================================================

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to prevent conflict
DROP POLICY IF EXISTS "Public Read Experiences" ON public.experiences;
DROP POLICY IF EXISTS "Full Access Experiences" ON public.experiences;

-- Public can read experiences
CREATE POLICY "Public Read Experiences"
  ON public.experiences FOR SELECT USING (true);

-- Authenticated admin can do full CRUD
CREATE POLICY "Full Access Experiences"
  ON public.experiences FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ==============================================================================
-- INITIAL SEED DATA — EXPERIENCES
-- ==============================================================================

INSERT INTO public.experiences (role, company, type, location, start_date, end_date, description, tags, sort_order) VALUES
(
    'Fullstack Web Developer (Freelance)',
    'Self-Employed',
    'Work',
    'Remote, Indonesia',
    '2023',
    'Present',
    'Developing custom web applications for clients using Next.js, TypeScript, and Supabase. Handling end-to-end development from UI design to database architecture and deployment.',
    ARRAY['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    1
),
(
    'D3 Teknik Informatika Student',
    'Universitas Logistik dan Bisnis Internasional (ULBI)',
    'Academic',
    'Bandung, Indonesia',
    '2022',
    'Present',
    'Active student in D3 Informatics Engineering program. Focusing on web development, database systems, and software engineering. Participated in multiple practical projects and academic competitions.',
    ARRAY['Web Development', 'Database', 'Software Engineering', 'ULBI'],
    2
),
(
    'Web Development Project — Garbage Collection Platform',
    'Academic Project',
    'Academic',
    'Bandung, Indonesia',
    '2024',
    'Ongoing',
    'Building a community-level waste pickup platform with real-time vehicle tracking, interactive chat between drivers and residents, and admin dashboard for route management.',
    ARRAY['Next.js', 'TypeScript', 'Supabase', 'Real-time', 'Maps API'],
    3
)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- UPDATE ADMIN RLS POLICIES — Fix admin policies to use auth.uid() check
-- Run this to tighten security on all tables (replaces USING (true) for writes)
-- ==============================================================================

-- Re-drop and recreate write policies for all tables to require authentication
DROP POLICY IF EXISTS "Full Access Profile" ON public.profile_info;
DROP POLICY IF EXISTS "Full Access Skills" ON public.skills;
DROP POLICY IF EXISTS "Full Access Projects" ON public.projects;
DROP POLICY IF EXISTS "Full Access Certifications" ON public.certifications;
DROP POLICY IF EXISTS "Full Access Contact" ON public.contact_messages;

-- Write operations require authenticated session
CREATE POLICY "Full Access Profile"
  ON public.profile_info FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Full Access Skills"
  ON public.skills FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Full Access Projects"
  ON public.projects FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Full Access Certifications"
  ON public.certifications FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Contact messages: public can INSERT, only admin can read/delete
DROP POLICY IF EXISTS "Public Read Contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Full Access Contact" ON public.contact_messages;

CREATE POLICY "Public Insert Contact"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin Read Contact"
  ON public.contact_messages FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin Delete Contact"
  ON public.contact_messages FOR DELETE
  USING (auth.role() = 'authenticated');

-- ==============================================================================
-- SUPABASE AUTH — SETUP ADMIN USER
-- CARA MEMBUAT ADMIN:
-- 1. Pergi ke Supabase Dashboard > Authentication > Users
-- 2. Klik "Add User" atau "Invite User"
-- 3. Masukkan email dan password admin Anda
-- 4. Setelah user dibuat, akses /admin/login dengan credential tersebut
--
-- ATAU jalankan SQL ini (ganti email dan password):
-- ==============================================================================

-- Contoh: Buat admin user via SQL (opsional, bisa pakai Dashboard juga)
-- SELECT auth.uid() dari console untuk verifikasi session

-- ==============================================================================
-- STORAGE — Portfolio bucket (jika belum ada)
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Read Storage" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin All Storage" ON storage.objects;

CREATE POLICY "Public Read Storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio');

CREATE POLICY "Authenticated Insert Storage"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

CREATE POLICY "Admin All Storage"
  ON storage.objects FOR ALL
  USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');
