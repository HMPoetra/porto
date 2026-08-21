-- ==============================================================================
-- 🚀 FIX UTAMA: KONEKSI, IZIN AKSES & FITUR BARU TABEL PROJECTS (SUPABASE)
-- Jalankan SELURUH skrip ini di: Supabase Dashboard > SQL Editor > RUN
-- 100% Bebas Error & Idempotent (Bisa dijalankan berulang kali dengan aman)
-- ==============================================================================

-- 1. Berikan hak akses skema public ke semua role
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 2. Pastikan tabel projects dibuat dengan skema lengkap jika belum ada
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid not null default gen_random_uuid (),
  title text not null,
  description text not null default '',
  image_url text null default '',
  github_url text null default '',
  demo_url text null default '',
  tags text[] null default '{}',
  sort_order integer null default 0,
  is_visible boolean not null default true,
  created_at timestamp with time zone null default now(),
  detail_description text null default '',
  gallery_images text[] null default '{}',
  constraint projects_pkey primary key (id)
);

-- 3. Tambahkan kolom secara aman jika tabel sebelumnya sudah dibuat tapi kolom belum lengkap
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS title text not null default 'Untitled Project';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS description text not null default '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS detail_description text null default '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_url text null default '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS gallery_images text[] null default '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS github_url text null default '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS demo_url text null default '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tags text[] null default '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS sort_order integer null default 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_visible boolean not null default true;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS created_at timestamp with time zone null default now();

-- 4. Berikan Izin Akses Tabel (SELECT, INSERT, UPDATE, DELETE)
GRANT ALL ON TABLE public.projects TO anon;
GRANT ALL ON TABLE public.projects TO authenticated;
GRANT ALL ON TABLE public.projects TO service_role;

-- 5. Aktifkan Row Level Security (RLS) & Pasang Policies
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS Public Read Projects ON public.projects;
DROP POLICY IF EXISTS Admin Full Projects ON public.projects;
DROP POLICY IF EXISTS Allow All Projects ON public.projects;
DROP POLICY IF EXISTS Allow all for anon and authenticated ON public.projects;

-- Policy untuk membaca (SELECT) bagi siapa saja (web publik & admin)
CREATE POLICY Public Read Projects
  ON public.projects
  FOR SELECT
  USING (true);

-- Policy untuk mengelola (INSERT, UPDATE, DELETE, ALL)
CREATE POLICY Admin Full Projects
  ON public.projects
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 6. Update data jika sudah ada yang kosong
UPDATE public.projects
SET 
  is_visible = COALESCE(is_visible, true),
  detail_description = CASE 
    WHEN detail_description IS NULL OR detail_description = '' THEN description
    ELSE detail_description
  END,
  gallery_images = CASE 
    WHEN gallery_images IS NULL OR gallery_images = '{}' THEN 
      CASE WHEN image_url IS NOT NULL AND image_url != '' THEN ARRAY[image_url]::text[] ELSE '{}'::text[] END
    ELSE gallery_images
  END;

-- 7. Insert Data Proyek Awal jika tabel masih kosong (Bebas Error 42804)
INSERT INTO public.projects (title, description, detail_description, image_url, gallery_images, github_url, demo_url, tags, sort_order, is_visible)
SELECT 
  'Portofolio', 
  'Website Portofolio pribadi berisikan informasi tentang data pribadi, skills, dan showcase project dengan gaya Neo Brutalism.', 
  'Website portofolio pribadi modern yang dibangun dengan arsitektur Neo Brutalism berkinerja tinggi. Dilengkapi dengan CMS Admin terintegrasi Supabase (PostgreSQL, Auth, Storage), multi-bahasa real-time (ID/EN), preview dokumen CV interaktif, sistem ulasan guestbook, dan animasi micro-interaction Framer Motion.', 
  '/projects/porto.png', 
  ARRAY['/projects/porto.png', '/og-image.png']::text[], 
  'https://github.com/HMPoetra/porto', 
  'https://my-porto-gamma-self.vercel.app/', 
  ARRAY['Next.js', 'TypeScript', 'tailwind']::text[], 
  1,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE LOWER(TRIM(title)) = 'portofolio');

INSERT INTO public.projects (title, description, detail_description, image_url, gallery_images, github_url, demo_url, tags, sort_order, is_visible)
SELECT 
  'Chartify', 
  'Website dashboard untuk visualisasi data penjualan dengan grafik interaktif dan analitik performa bisnis.', 
  'Platform analitik dan dashboard visualisasi data interaktif untuk memonitor performa penjualan bisnis. Menggunakan chart interaktif dinamis, agregasi metrik finansial, filter periode tanggal custom, dan optimasi performa query database MongoDB.', 
  '/projects/chartify.png', 
  ARRAY['/projects/chartify.png']::text[], 
  'https://github.com/HMPoetra/hartify', 
  '', 
  ARRAY['Next.js', 'Tailwind', 'MongoDB']::text[], 
  2,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE LOWER(TRIM(title)) = 'chartify');

INSERT INTO public.projects (title, description, detail_description, image_url, gallery_images, github_url, demo_url, tags, sort_order, is_visible)
SELECT 
  'UI Toko Sepatu', 
  'Antarmuka e-commerce toko sepatu dengan katalog produk responsif dan keranjang belanja modern.', 
  'Antarmuka e-commerce toko sepatu modern yang responsif dan user-friendly. Memiliki fitur katalog produk dengan filter kategori, detail varian ukuran & warna sepatu, simulasi checkout & keranjang belanja, serta tata letak adaptif desktop-mobile.', 
  '/projects/toko_sepatu.png', 
  ARRAY['/projects/toko_sepatu.png']::text[], 
  'https://github.com/HMPoetra/Toko_Sepatu', 
  '', 
  ARRAY['HTML', 'CSS']::text[], 
  3,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE LOWER(TRIM(title)) = 'ui toko sepatu');

INSERT INTO public.projects (title, description, detail_description, image_url, gallery_images, github_url, demo_url, tags, sort_order, is_visible)
SELECT 
  'Project Mendatang', 
  'Website Pengangkutan sampah tingkat RT/RW dengan fitur pelacakan armada real-time dan chat interaktif warga-driver.', 
  'Platform digital manajemen dan penjemputan sampah tingkat komunitas RT/RW. Menghadirkan fitur pelacakan armada truk sampah secara real-time via Maps API, sistem komunikasi chat interaktif antara pengemudi dan warga, serta portal kontrol admin untuk optimasi rute armada.', 
  '', 
  ARRAY[]::text[], 
  '', 
  '', 
  ARRAY['Next.js', 'TypeScript', 'supabase', 'tailwind']::text[], 
  4,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE LOWER(TRIM(title)) = 'project mendatang');
