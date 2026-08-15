-- ==============================================================================
-- SUPABASE ADMIN AUTH & SECURITY POLICIES FOR PORTOFOLIO (HMPoetra)
-- Skrip ini digunakan untuk:
-- 1. Membuat akun user Admin di Supabase Auth
-- 2. Memperbarui RLS (Row Level Security) agar HANYA Admin yang terautentikasi
--    yang dapat menambah, mengubah, atau menghapus data / file.
--
-- Cara Penggunaan:
-- Buka Supabase Dashboard > SQL Editor > Paste skrip ini > Click RUN.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PILIHAN MEMBUAT USER ADMIN BARU VIA SQL
-- (Catatan: Anda juga bisa membuat user langsung melalui GUI Supabase Dashboard:
--  Authentication > Users > Add User > Create User)
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Gantikan 'admin@example.com' dan 'PasswordAdminSuperAman123!' dengan kredensial Anda.
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'dev@h.mp', -- Email Admin HMPoetra
    crypt('6Wh7A?J$3-p+6W?3k$-Vkh6gH9Up#uagPhAESMP52G!j*rYatY', gen_salt('bf')), -- Password Admin
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin HMPoetra"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'dev@h.mp'
);

-- ------------------------------------------------------------------------------
-- 2. KEAMANAN TABEL (ROW LEVEL SECURITY POLICIES)
-- Pembacaan (SELECT) tetap bersifat Publik, tetapi Perubahan (INSERT, UPDATE, DELETE)
-- HANYA BISA dilakukan oleh user yang telah terautentikasi (Admin yang sudah Login).
-- ------------------------------------------------------------------------------

-- Hapus policy lama yang memberikan akses Full publik
DROP POLICY IF EXISTS "Full Access Profile" ON public.profile_info;
DROP POLICY IF EXISTS "Full Access Skills" ON public.skills;
DROP POLICY IF EXISTS "Full Access Projects" ON public.projects;
DROP POLICY IF EXISTS "Full Access Certifications" ON public.certifications;
DROP POLICY IF EXISTS "Full Access Contact" ON public.contact_messages;

-- Pasang policy baru khusus untuk User Authenticated (Admin)
CREATE POLICY "Authenticated Admin Profile Modify" ON public.profile_info 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated Admin Skills Modify" ON public.skills 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated Admin Projects Modify" ON public.projects 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated Admin Certifications Modify" ON public.certifications 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated Admin Contact Modify" ON public.contact_messages 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 3. KEAMANAN STORAGE BUCKET (PORTFOLIO MEDIA UPLOADS)
-- Publik hanya bisa mengunduh / melihat gambar.
-- Upload & Hapus gambar HANYA BISA dilakukan oleh Admin yang terautentikasi.
-- ------------------------------------------------------------------------------

-- Hapus Policy Storage lama jika ada
DROP POLICY IF EXISTS "Public Insert Storage" ON storage.objects;
DROP POLICY IF EXISTS "Public All Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Modify Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Storage" ON storage.objects;

-- Policy Storage baru
CREATE POLICY "Admin Upload Storage" ON storage.objects 
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Admin Modify Storage" ON storage.objects 
    FOR UPDATE TO authenticated USING (bucket_id = 'portfolio');

CREATE POLICY "Admin Delete Storage" ON storage.objects 
    FOR DELETE TO authenticated USING (bucket_id = 'portfolio');

-- ------------------------------------------------------------------------------
-- 4. PEMBERSIHAN DATA DUPLIKAT (BERSIHKAN BARIS GANDA DI DATABASE SUPABASE)
-- ------------------------------------------------------------------------------

-- Hapus duplikat pada tabel skills (menyisakan 1 record unik untuk setiap nama skill)
DELETE FROM public.skills
WHERE id NOT IN (
    SELECT MIN(id)
    FROM public.skills
    GROUP BY LOWER(TRIM(name))
);

-- Hapus duplikat pada tabel projects (menyisakan 1 record unik untuk setiap judul project)
DELETE FROM public.projects
WHERE id NOT IN (
    SELECT MIN(id)
    FROM public.projects
    GROUP BY LOWER(TRIM(title))
);

-- Hapus duplikat pada tabel certifications (menyisakan 1 record unik untuk setiap judul sertifikat)
DELETE FROM public.certifications
WHERE id NOT IN (
    SELECT MIN(id)
    FROM public.certifications
    GROUP BY LOWER(TRIM(title))
);

-- ==============================================================================
-- SKRIP SELESAI
-- ==============================================================================
