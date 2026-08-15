-- ==============================================================================
-- SUPABASE DATABASE SCHEMA FOR PORTOFOLIO (HMPoetra)
-- Jalankan skrip ini di Supabase SQL Editor (Dashboard Supabase > SQL Editor)
-- Aman dijalankan berulang kali (Idempotent / Safe Re-run)
-- ==============================================================================

-- 1. TABEL PROFILE INFO
CREATE TABLE IF NOT EXISTS public.profile_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL DEFAULT 'Hapsoro Mahendra Poetra',
    headline TEXT DEFAULT 'System.out.println("Web Developer Here!");',
    bio TEXT DEFAULT 'HI Selamat datang di dunia saya, saya Hapsoro Mahendra Poetra dari Bogor, Indonesia. Saya adalah mahasiswa aktif D3 Teknik Informatika di Universitas Logistik dan Bisnis Internasional.',
    status TEXT DEFAULT 'Ready for Internship / Web Projects.',
    available BOOLEAN DEFAULT true,
    profile_image TEXT DEFAULT '/profile.jpg',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABEL SKILLS
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#000000',
    category TEXT NOT NULL CHECK (category IN ('Frontend Engine', 'Backend Core', 'Utilities & Tools')),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABEL PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT DEFAULT '',
    github_url TEXT DEFAULT '',
    demo_url TEXT DEFAULT '',
    tags TEXT[] DEFAULT '{}',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TABEL CERTIFICATIONS
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date TEXT NOT NULL,
    credential_id TEXT NOT NULL,
    link TEXT DEFAULT '#',
    tags TEXT[] DEFAULT '{}',
    bg_color TEXT DEFAULT 'bg-brut-yellow',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TABEL CONTACT MESSAGES
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
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Hapus policy lama jika sudah ada (agar tidak error 42710)
DROP POLICY IF EXISTS "Public Read Profile" ON public.profile_info;
DROP POLICY IF EXISTS "Public Read Skills" ON public.skills;
DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
DROP POLICY IF EXISTS "Public Read Certifications" ON public.certifications;
DROP POLICY IF EXISTS "Public Insert Contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Public Read Contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Full Access Profile" ON public.profile_info;
DROP POLICY IF EXISTS "Full Access Skills" ON public.skills;
DROP POLICY IF EXISTS "Full Access Projects" ON public.projects;
DROP POLICY IF EXISTS "Full Access Certifications" ON public.certifications;
DROP POLICY IF EXISTS "Full Access Contact" ON public.contact_messages;

-- Policy Membaca (Public Read All)
CREATE POLICY "Public Read Profile" ON public.profile_info FOR SELECT USING (true);
CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public Read Certifications" ON public.certifications FOR SELECT USING (true);

-- Policy Menulis Pesan Kontak (Public Insert Contact)
CREATE POLICY "Public Insert Contact" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Contact" ON public.contact_messages FOR SELECT USING (true);

-- Policy Pengelolaan Admin (CRUD Full Access for Anon/Authenticated)
CREATE POLICY "Full Access Profile" ON public.profile_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Skills" ON public.skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Certifications" ON public.certifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Contact" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA (DATA AWAL)
-- ==============================================================================

-- Seed Profile Info
INSERT INTO public.profile_info (full_name, headline, bio, status, available, profile_image)
VALUES (
    'Hapsoro Mahendra Poetra',
    'System.out.println("Web Developer Here!");',
    'HI Selamat datang di dunia saya, saya Hapsoro Mahendra Poetra dari Bogor, Indonesia. Saya adalah mahasiswa aktif D3 Teknik Informatika di Universitas Logistik dan Bisnis Internasional. Dengan keahlian dan semangat dalam pembuatan Website, Aplikasi, dan Manajemen Proyek.',
    'Ready for Internship / Web Projects.',
    true,
    '/profile.jpg'
) ON CONFLICT DO NOTHING;

-- Seed Skills
INSERT INTO public.skills (name, icon_name, color, category, sort_order) VALUES
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
ON CONFLICT DO NOTHING;

-- Seed Projects
INSERT INTO public.projects (title, description, image_url, github_url, demo_url, tags, sort_order) VALUES
(
    'Portofolio',
    'Website Portofolia, berisikan informasi tentang data pribadi, skills, dan project.',
    '/projects/porto.png',
    'https://github.com/HMPoetra/my-porto',
    'https://my-porto-gamma-self.vercel.app/',
    ARRAY['Next.js', 'TypeScript', 'tailwind'],
    1
),
(
    'Chartify',
    'Website dashboard untuk visualisasi data penjualan dengan grafik interaktif.',
    '/projects/chartify.png',
    'https://github.com/HMPoetra/hartify',
    '',
    ARRAY['Next.js', 'Tailwind', 'MongoDB'],
    2
),
(
    'UI Toko Sepatu',
    'Aplikasi manajemen tugas dengan fitur drag & drop dan deadline reminder.',
    '/projects/toko_sepatu.png',
    'https://github.com/HMPoetra/Toko_Sepatu',
    '',
    ARRAY['HTML', 'CSS'],
    3
),
(
    'Project Mendatang',
    'Website Pengangkutan sampah tingkat rt/rw dengan fitur pelacakan waktu nyata dan chat interaktif antara driver dan warga.',
    '',
    '',
    '',
    ARRAY['Next.js', 'TypeScript', 'supabase', 'tailwind'],
    4
)
ON CONFLICT DO NOTHING;

-- Seed Certifications
INSERT INTO public.certifications (title, issuer, date, credential_id, link, tags, bg_color, sort_order) VALUES
(
    'Junior Web Developer',
    'BNSP (Badan Nasional Sertifikasi Profesi)',
    '2024',
    'REG.JWD.2024.08821',
    'https://github.com/HMPoetra',
    ARRAY['BNSP', 'WebDev', 'FullStack'],
    'bg-brut-yellow',
    1
),
(
    'Database Systems & SQL Specialist',
    'Oracle Academy / Digital Talent',
    '2023',
    'ORCL-DB-774012',
    'https://github.com/HMPoetra',
    ARRAY['Database', 'MySQL', 'SQL'],
    'bg-brut-cyan',
    2
),
(
    'Linux System Administration Basic',
    'Adinusa Digital Academy',
    '2023',
    'AD-LNX-2023-4410',
    'https://github.com/HMPoetra',
    ARRAY['Linux', 'SysAdmin', 'CLI'],
    'bg-brut-pink',
    3
),
(
    'Frontend Web Development Certification',
    'Dicoding Academy',
    '2023',
    'DCD-FWD-99120',
    'https://github.com/HMPoetra',
    ARRAY['React.js', 'JavaScript', 'Frontend'],
    'bg-brut-lime',
    4
)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- UPDATE URL GAMBAR PADA TABEL PROJECTS (JIKA TABEL SUDAH ADA)
-- ==============================================================================
UPDATE public.projects SET image_url = '/projects/porto.png' WHERE title ILIKE '%Portofolio%';
UPDATE public.projects SET image_url = '/projects/chartify.png' WHERE title ILIKE '%Chartify%';
UPDATE public.projects SET image_url = '/projects/toko_sepatu.png' WHERE title ILIKE '%Toko Sepatu%';

-- ==============================================================================
-- SUPABASE STORAGE BUCKET (PENGELOLAAN UPLOAD GAMBAR)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Read Storage" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Storage" ON storage.objects;
DROP POLICY IF EXISTS "Public All Storage" ON storage.objects;

CREATE POLICY "Public Read Storage" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
CREATE POLICY "Public Insert Storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio');
CREATE POLICY "Public All Storage" ON storage.objects FOR ALL USING (bucket_id = 'portfolio');

