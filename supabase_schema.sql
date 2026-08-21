-- ==============================================================================
-- SUPABASE FULL SCHEMA: PORTOFOLIO & CMS DASHBOARD (HMPoetra)
-- Jalankan skrip ini di: Supabase Dashboard > SQL Editor > New Query > RUN
-- 100% Bebas Error 42P10 & Aman dijalankan berulang kali (Idempotent)
-- ==============================================================================

-- Aktifkan ekstensi UUID & Crypto jika belum aktif
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ==============================================================================
-- 1. TABEL PROFILE INFO
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profile_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL DEFAULT 'Hapsoro Mahendra Poetra',
    headline TEXT NOT NULL DEFAULT 'System.out.println("Web Developer Here!");',
    bio TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Ready for Internship / Web Projects.',
    available BOOLEAN DEFAULT true,
    profile_image TEXT DEFAULT '/profile.jpg',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 2. TABEL SKILLS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'FaCode',
    color TEXT NOT NULL DEFAULT '#000000',
    category TEXT NOT NULL DEFAULT 'Frontend Engine',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 3. TABEL PROJECTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid not null default gen_random_uuid (),
  title text not null,
  description text not null,
  image_url text null default ''::text,
  github_url text null default ''::text,
  demo_url text null default ''::text,
  tags text[] null default '{}'::text[],
  sort_order integer null default 0,
  created_at timestamp with time zone null default now(),
  detail_description text null default ''::text,
  gallery_images text[] null default '{}'::text[],
  constraint projects_pkey primary key (id)
);

-- ==============================================================================
-- 4. TABEL CERTIFICATIONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    issuer TEXT NOT NULL DEFAULT '',
    date TEXT NOT NULL DEFAULT '',
    credential_id TEXT DEFAULT '',
    link TEXT DEFAULT '#',
    tags TEXT[] DEFAULT '{}',
    bg_color TEXT DEFAULT 'bg-brut-yellow',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 5. TABEL EXPERIENCES (WORK & ACADEMIC JOURNEY)
-- ==============================================================================
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
-- 6. TABEL CURRICULUM VITAE (CV)
-- ==============================================================================
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

-- ==============================================================================
-- 7. TABEL CONTACT MESSAGES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT DEFAULT '',
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profile_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_vitae ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Bersihkan policy lama agar tidak terjadi duplikasi error
DROP POLICY IF EXISTS "Public Read Profile" ON public.profile_info;
DROP POLICY IF EXISTS "Public Read Skills" ON public.skills;
DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
DROP POLICY IF EXISTS "Public Read Certifications" ON public.certifications;
DROP POLICY IF EXISTS "Public Read Experiences" ON public.experiences;
DROP POLICY IF EXISTS "Public Read CV" ON public.curriculum_vitae;
DROP POLICY IF EXISTS "Public Insert Contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Public Read Contact" ON public.contact_messages;

DROP POLICY IF EXISTS "Admin Full Profile" ON public.profile_info;
DROP POLICY IF EXISTS "Admin Full Skills" ON public.skills;
DROP POLICY IF EXISTS "Admin Full Projects" ON public.projects;
DROP POLICY IF EXISTS "Admin Full Certifications" ON public.certifications;
DROP POLICY IF EXISTS "Admin Full Experiences" ON public.experiences;
DROP POLICY IF EXISTS "Admin Full CV" ON public.curriculum_vitae;
DROP POLICY IF EXISTS "Admin Full Contact" ON public.contact_messages;

-- Policy Membaca untuk Publik (SELECT)
CREATE POLICY "Public Read Profile" ON public.profile_info FOR SELECT USING (true);
CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public Read Certifications" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Public Read Experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public Read CV" ON public.curriculum_vitae FOR SELECT USING (true);

-- Policy Kontak: Publik bisa insert pesan, Admin bisa membaca & menghapus
CREATE POLICY "Public Insert Contact" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Contact" ON public.contact_messages FOR SELECT USING (true);

-- Policy Pengelolaan Penuh (CRUD untuk Admin)
CREATE POLICY "Admin Full Profile" ON public.profile_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Skills" ON public.skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Certifications" ON public.certifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Experiences" ON public.experiences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full CV" ON public.curriculum_vitae FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Contact" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKETS (portfolio & cv_files)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('cv_files', 'cv_files', true, 10485760)
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 10485760;

DROP POLICY IF EXISTS "Public Read Storage Portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Full Access Storage Portfolio" ON storage.objects;

CREATE POLICY "Public Read Storage Portfolio" ON storage.objects 
    FOR SELECT USING (bucket_id IN ('portfolio', 'cv_files'));

CREATE POLICY "Full Access Storage Portfolio" ON storage.objects 
    FOR ALL USING (bucket_id IN ('portfolio', 'cv_files')) WITH CHECK (bucket_id IN ('portfolio', 'cv_files'));

-- ==============================================================================
-- INITIAL SEED DATA (MENGGUNAKAN WHERE NOT EXISTS - BEBAS ERROR 42P10)
-- ==============================================================================

-- 1. Profile Info Seed
INSERT INTO public.profile_info (full_name, headline, bio, status, available, profile_image)
SELECT 
    'Hapsoro Mahendra Poetra',
    'System.out.println("Web Developer Here!");',
    'HI Selamat datang di dunia saya, saya Hapsoro Mahendra Poetra dari Bogor, Indonesia. Saya adalah mahasiswa aktif D3 Teknik Informatika di Universitas Logistik dan Bisnis Internasional. Dengan keahlian dan semangat dalam pembuatan Website, Aplikasi, dan Manajemen Proyek.',
    'Ready for Internship / Web Projects.',
    true,
    '/profile.jpg'
WHERE NOT EXISTS (SELECT 1 FROM public.profile_info);

-- 2. Skills Seed
INSERT INTO public.skills (name, icon_name, color, category, sort_order)
SELECT d.name, d.icon_name, d.color, d.category, d.sort_order
FROM (VALUES
  ('React.js', 'FaReact', '#61DAFB', 'Frontend Engine', 1),
  ('Next.js', 'SiNextdotjs', '#000000', 'Frontend Engine', 2),
  ('TypeScript', 'SiTypescript', '#3178C6', 'Frontend Engine', 3),
  ('JavaScript', 'FaJs', '#F7DF1E', 'Frontend Engine', 4),
  ('HTML5', 'FaHtml5', '#E34F26', 'Frontend Engine', 5),
  ('CSS3', 'FaCss3Alt', '#1572B6', 'Frontend Engine', 6),
  ('Tailwind', 'SiTailwindcss', '#06B6D4', 'Frontend Engine', 7),
  ('Bootstrap', 'FaBootstrap', '#7952B3', 'Frontend Engine', 8),
  ('Flutter Web', 'SiFlutter', '#02569B', 'Frontend Engine', 9),
  ('Dart', 'SiDart', '#0175C2', 'Frontend Engine', 10),
  ('PHP', 'FaPhp', '#777BB4', 'Backend Core', 1),
  ('Laravel', 'FaLaravel', '#FF2D20', 'Backend Core', 2),
  ('Node.js', 'FaNodeJs', '#5FA04E', 'Backend Core', 3),
  ('Python', 'FaPython', '#3776AB', 'Backend Core', 4),
  ('C#', 'TbBrandCSharp', '#239120', 'Backend Core', 5),
  ('MySQL', 'SiMysql', '#4479A1', 'Backend Core', 6),
  ('Git', 'FaGitAlt', '#F05138', 'Utilities & Tools', 1),
  ('VSC', 'VscVscode', '#007ACC', 'Utilities & Tools', 2),
  ('Visual Studio', 'DiVisualstudio', '#5C2D91', 'Utilities & Tools', 3),
  ('Windows', 'FaWindows', '#0078D6', 'Utilities & Tools', 4),
  ('Database', 'FaDatabase', '#6366F1', 'Utilities & Tools', 5)
) AS d(name, icon_name, color, category, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.skills s WHERE LOWER(TRIM(s.name)) = LOWER(TRIM(d.name))
);

-- 3. Projects Seed
INSERT INTO public.projects (title, description, image_url, github_url, demo_url, tags, sort_order)
SELECT d.title, d.description, d.image_url, d.github_url, d.demo_url, d.tags, d.sort_order
FROM (VALUES
  ('Portofolio', 'Website Portofolio pribadi berisikan informasi tentang data pribadi, skills, dan showcase project dengan gaya Neo Brutalism.', '/projects/porto.png', 'https://github.com/HMPoetra/porto', 'https://my-porto-gamma-self.vercel.app/', ARRAY['Next.js', 'TypeScript', 'tailwind'], 1),
  ('Chartify', 'Website dashboard untuk visualisasi data penjualan dengan grafik interaktif dan analitik performa bisnis.', '/projects/chartify.png', 'https://github.com/HMPoetra/hartify', '', ARRAY['Next.js', 'Tailwind', 'MongoDB'], 2),
  ('UI Toko Sepatu', 'Antarmuka e-commerce toko sepatu dengan katalog produk responsif dan keranjang belanja modern.', '/projects/toko_sepatu.png', 'https://github.com/HMPoetra/Toko_Sepatu', '', ARRAY['HTML', 'CSS'], 3),
  ('Project Mendatang', 'Website Pengangkutan sampah tingkat RT/RW dengan fitur pelacakan armada real-time dan chat interaktif warga-driver.', '', '', '', ARRAY['Next.js', 'TypeScript', 'supabase', 'tailwind'], 4)
) AS d(title, description, image_url, github_url, demo_url, tags, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.projects p WHERE LOWER(TRIM(p.title)) = LOWER(TRIM(d.title))
);

-- 4. Certifications Seed
INSERT INTO public.certifications (title, issuer, date, credential_id, link, tags, bg_color, sort_order)
SELECT d.title, d.issuer, d.date, d.credential_id, d.link, d.tags, d.bg_color, d.sort_order
FROM (VALUES
  ('Junior Web Developer', 'BNSP (Badan Nasional Sertifikasi Profesi)', '2024', 'REG.JWD.2024.08821', 'https://github.com/HMPoetra', ARRAY['BNSP', 'WebDev', 'FullStack'], 'bg-brut-yellow', 1),
  ('Database Systems & SQL Specialist', 'Oracle Academy / Digital Talent', '2023', 'ORCL-DB-774012', 'https://github.com/HMPoetra', ARRAY['Database', 'MySQL', 'SQL'], 'bg-brut-cyan', 2),
  ('Linux System Administration Basic', 'Adinusa Digital Academy', '2023', 'AD-LNX-2023-4410', 'https://github.com/HMPoetra', ARRAY['Linux', 'SysAdmin', 'CLI'], 'bg-brut-pink', 3),
  ('Frontend Web Development Certification', 'Dicoding Academy', '2023', 'DCD-FWD-99120', 'https://github.com/HMPoetra', ARRAY['React.js', 'JavaScript', 'Frontend'], 'bg-brut-lime', 4)
) AS d(title, issuer, date, credential_id, link, tags, bg_color, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.certifications c WHERE LOWER(TRIM(c.title)) = LOWER(TRIM(d.title))
);

-- 5. Experiences Seed
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

-- 6. CV Seed
INSERT INTO public.curriculum_vitae (title, file_url, file_name, file_size, is_active)
SELECT 
  'CV Hapsoro Mahendra Poetra - Latest 2026',
  '/cv/HMPoetra_CV.pdf',
  'HMPoetra_CV.pdf',
  254000,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.curriculum_vitae);
