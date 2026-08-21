-- ==============================================================================
-- SUPABASE ADMIN AUTH SETUP (HMPoetra)
-- Buka Supabase Dashboard > Authentication > Users untuk melihat user terdaftar
-- atau jalankan query ini jika ingin membuat akun admin manual.
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Contoh pembuatan user admin langsung via SQL (Ganti email dan password sesuai kebutuhan):
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
    updated_at
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@hmpoetra.dev',
    crypt('AdminPassword123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin HMPoetra"}',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@hmpoetra.dev'
);
