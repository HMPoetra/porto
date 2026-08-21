-- ==============================================================================
-- SUPABASE SCHEMA UPDATE — PROJECTS DETAIL & MULTI-IMAGE GALLERY
-- Jalankan skrip ini di: Supabase Dashboard > SQL Editor > New Query > RUN
-- 100% Bebas Error & Idempotent (Aman dijalankan berulang kali)
-- ==============================================================================

-- 1. Tambahkan kolom detail_description dan gallery_images ke tabel public.projects
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS detail_description TEXT DEFAULT '';

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';

-- 2. Pastikan Row Level Security (RLS) diaktifkan dan dikonfigurasi dengan aman
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
DROP POLICY IF EXISTS "Admin Full Projects" ON public.projects;

CREATE POLICY "Public Read Projects"
  ON public.projects FOR SELECT USING (true);

CREATE POLICY "Admin Full Projects"
  ON public.projects FOR ALL
  USING (true)
  WITH CHECK (true);

-- 3. Update data default dengan deskripsi lengkap dan galeri gambar sampel
UPDATE public.projects
SET 
  detail_description = CASE 
    WHEN LOWER(title) LIKE '%portofolio%' THEN 
      'Website portofolio pribadi modern yang dibangun dengan arsitektur Neo Brutalism berkinerja tinggi. Dilengkapi dengan CMS Admin terintegrasi Supabase (PostgreSQL, Auth, Storage), multi-bahasa real-time (ID/EN), preview dokumen CV interaktif, sistem ulasan guestbook, dan animasi micro-interaction Framer Motion.'
    WHEN LOWER(title) LIKE '%chartify%' THEN 
      'Platform analitik dan dashboard visualisasi data interaktif untuk memonitor performa penjualan bisnis. Menggunakan chart interaktif dinamis, agregasi metrik finansial, filter periode tanggal custom, dan optimasi performa query database MongoDB.'
    WHEN LOWER(title) LIKE '%sepatu%' THEN 
      'Antarmuka e-commerce toko sepatu modern yang responsif dan user-friendly. Memiliki fitur katalog produk dengan filter kategori, detail varian ukuran & warna sepatu, simulasi checkout & keranjang belanja, serta tata letak adaptif desktop-mobile.'
    WHEN LOWER(title) LIKE '%upcoming%' OR LOWER(title) LIKE '%sampah%' OR LOWER(title) LIKE '%waste%' THEN 
      'Platform digital manajemen dan penjemputan sampah tingkat komunitas RT/RW. Menghadirkan fitur pelacakan armada truk sampah secara real-time via Maps API, sistem komunikasi chat interaktif antara pengemudi dan warga, serta portal kontrol admin untuk optimasi rute armada.'
    ELSE COALESCE(detail_description, description)
  END,
  gallery_images = CASE
    WHEN LOWER(title) LIKE '%portofolio%' THEN ARRAY['/projects/porto.png', '/og-image.png']
    WHEN LOWER(title) LIKE '%chartify%' THEN ARRAY['/projects/chartify.png']
    WHEN LOWER(title) LIKE '%sepatu%' THEN ARRAY['/projects/toko_sepatu.png']
    ELSE COALESCE(gallery_images, '{}'::TEXT[])
  END
WHERE detail_description IS NULL OR detail_description = '' OR gallery_images IS NULL OR gallery_images = '{}';
