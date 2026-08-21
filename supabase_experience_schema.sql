-- ==============================================================================
-- SUPABASE SCHEMA UPDATE — TABEL EXPERIENCES
-- Jalankan di Supabase SQL Editor (Dashboard > SQL Editor)
-- 100% Bebas Error 42P10 & Aman dijalankan berulang kali (Idempotent)
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

-- 2. ROW LEVEL SECURITY (RLS) POLICIES — EXPERIENCES
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Experiences" ON public.experiences;
DROP POLICY IF EXISTS "Admin Full Experiences" ON public.experiences;

CREATE POLICY "Public Read Experiences"
  ON public.experiences FOR SELECT USING (true);

CREATE POLICY "Admin Full Experiences"
  ON public.experiences FOR ALL
  USING (true)
  WITH CHECK (true);

-- 3. INITIAL SEED DATA — EXPERIENCES (WHERE NOT EXISTS)
INSERT INTO public.experiences (role, company, type, location, start_date, end_date, description, tags, sort_order)
SELECT d.role, d.company, d.type, d.location, d.start_date, d.end_date, d.description, d.tags, d.sort_order
FROM (VALUES
  ('Fullstack Web Developer (Freelance)', 'Self-Employed', 'Work', 'Remote, Indonesia', '2023', 'Present', 'Developing custom web applications for clients using Next.js, TypeScript, and Supabase. Handling end-to-end development from UI design to database architecture and deployment.', ARRAY['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'], 1),
  ('D3 Teknik Informatika Student', 'Universitas Logistik dan Bisnis Internasional (ULBI)', 'Academic', 'Bandung, Indonesia', '2022', 'Present', 'Active student in D3 Informatics Engineering program. Focusing on web development, database systems, and software engineering. Participated in multiple practical projects and academic competitions.', ARRAY['Web Development', 'Database', 'Software Engineering', 'ULBI'], 2),
  ('Web Development Project — Garbage Collection Platform', 'Academic Project', 'Academic', 'Bandung, Indonesia', '2024', 'Ongoing', 'Building a community-level waste pickup platform with real-time vehicle tracking, interactive chat between drivers and residents, and admin dashboard for route management.', ARRAY['Next.js', 'TypeScript', 'Supabase', 'Real-time', 'Maps API'], 3)
) AS d(role, company, type, location, start_date, end_date, description, tags, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.experiences e WHERE LOWER(TRIM(e.role)) = LOWER(TRIM(d.role)) AND LOWER(TRIM(e.company)) = LOWER(TRIM(d.company))
);
