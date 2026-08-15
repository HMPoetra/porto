# ⚡ Modern Neo-Brutalist Portfolio & CMS

<div align="center">

  <!-- Badges -->
  <img src="https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />

  <br/><br/>

  <h3>🚀 Personal Developer Portfolio & CMS Dashboard built with a bold Neo-Brutalist aesthetic.</h3>

  <p align="center">
    <a href="https://my-porto-gamma-self.vercel.app/" target="_blank"><strong>🌐 Live Demo</strong></a> ·
    <a href="https://github.com/HMPoetra/porto" target="_blank"><strong>📂 GitHub Repository</strong></a> ·
    <a href="#-fitur-utama--key-features"><strong>✨ Fitur</strong></a>
  </p>

</div>

---

## 📖 Tentang Proyek / About The Project

Website portofolio interaktif dan modern untuk **Fullstack Web Developer**. Dibangun menggunakan **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, serta backend **Supabase** dengan dashboard CMS mandiri untuk manajemen konten secara real-time.

Mengusung konsep desain **Neo-Brutalism** dengan kontras tinggi, border tebal, aksen warna cerah (*yellow, cyan, lime, pink, violet*), drop-shadow tegas, micro-interactions, serta dukungan dwibahasa (**Bahasa Indonesia & English**).

---

## ✨ Fitur Utama / Key Features

### 🎨 1. Neo-Brutalist UI/UX & Micro-Interactions
- **Stroke & Decrypted Text**: Animasi outline teks dan efek dekripsi hacker pada tagline dan status.
- **Floating Controls**: Akses cepat ke Theme Toggle, Language Switcher, Audio sound effects, dan navigasi.
- **Dynamic Background Particles & Graffiti**: Efek partikel interaktif dan visual stiker neo-brutalist.

### 🌐 2. Multi-Language Support (ID & EN)
- Sistem translasi kontekstual instan (Bahasa Indonesia & English) tanpa reload halaman.
- Otomatis menyimpan preferensi bahasa di `localStorage`.

### 📄 3. Interactive CV / Resume Preview & Direct Blob Downloader
- Modal PDF viewer responsif dengan pintasan keyboard (`ESC` to close).
- Fitur unduh file langsung via *cross-origin blob fetch* (tidak hanya sekadar membuka tab browser).
- Integrasi Supabase Storage untuk upload dan aktivasi berkas CV terbaru.

### 💼 & 🎓 4. Separated Journey Timeline (Experience vs Background)
- **Work & Professional Experience**: Riwayat pekerjaan, freelance, internship, dan organisasi.
- **Education & Academic Background**: Riwayat studi akademik, pendidikan formal, & proyek kampus.
- Tab filter interaktif (`ALL JOURNEY`, `WORK EXPERIENCE`, `EDUCATION & BACKGROUND`) dengan counter badge.

### ☕ 5. Sawer Kopi / Support Modal
- Modal dukungan langsung dengan integrasi scan QRIS untuk semua e-wallet (GoPay, OVO, Dana, ShopeePay) dan Mobile Banking.
- Fitur copy rekening / wallet address dengan notifikasi tooltip.

### 🛠️ 6. Full CMS Admin Dashboard (`/admin`)
- Autentikasi aman berbasis **Supabase Auth** & **Next.js Middleware**.
- Manajemen CRUD lengkap:
  - 👤 **Profile Info** (Bio, Status, Quote)
  - ⚡ **Skills & Tech Stack** (Icon registry, kategori, warna, sort order)
  - 🚀 **Projects** (Showcase, screenshot URL, GitHub repo, live demo link, tags)
  - 📜 **Certifications** (Penerbit sertifikat, tanggal, link verifikasi resmi)
  - 💼 **Experiences** (Work vs Academic types, periode, lokasi, deskripsi)
  - 📥 **Curriculum Vitae (CV)** (Drag & drop PDF upload ke bucket Supabase Storage, aktivasi 1-klik, penghapusan file)
  - 📬 **Contact Messages** (Inbox pesan masuk dari formulir kontak)

---

## 🛠️ Tech Stack & Dependencies

| Layer | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) | React Framework dengan App Router & Turbopack |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS dengan custom Neo-Brutalist tokens |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | Motion library untuk animasi fluid dan transisi layout |
| **Database & Auth** | [Supabase](https://supabase.com/) | PostgreSQL, Auth, Row Level Security (RLS), & Storage |
| **Icons** | [React Icons](https://react-icons.github.io/react-icons/) | FontAwesome, SimpleIcons, VS Code icons |
| **Hosting** | [Vercel](https://vercel.com/) | Production Deployment & Serverless Functions |

---

## 📁 Struktur Direktori / Project Structure

```bash
my-porto/
├── public/                     # Static assets (images, icons, manifest.json, og-image)
├── src/
│   ├── app/
│   │   ├── admin/              # CMS Admin Dashboard & Login Page
│   │   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── globals.css         # Custom Neo-Brutalist CSS utilities & design tokens
│   │   ├── layout.tsx          # Root layout with Language & Theme providers
│   │   ├── loading.tsx         # Next.js custom loading state
│   │   ├── error.tsx           # Next.js custom error boundary
│   │   ├── not-found.tsx       # Neo-Brutalist 404 page
│   │   └── page.tsx            # Main single-page portfolio
│   ├── components/             # Reusable UI components
│   │   ├── Hero.tsx            # Hero profile, CV preview modal, Sawer modal
│   │   ├── Skills.tsx          # Tech stack filterable grid
│   │   ├── Experience.tsx      # Work & Education separated timeline
│   │   ├── Projects.tsx        # Project showcase cards
│   │   ├── Certifications.tsx  # Verified credentials
│   │   ├── Contact.tsx         # Interactive contact form
│   │   ├── Navbar.tsx          # Sticky brutalist navbar with mobile menu
│   │   ├── Footer.tsx          # Running ticker & copyright
│   │   ├── FloatingControls.tsx# Theme, sound & language quick controls
│   │   ├── StrokeText.tsx      # Animated outline text
│   │   └── DecryptedText.tsx   # Hacker scramble text effect
│   ├── context/
│   │   └── LanguageContext.tsx # Context provider & bilingual dictionaries (ID & EN)
│   └── lib/
│       └── supabase.ts         # Supabase client initialization & helpers
├── supabase_admin_setup.sql    # SQL Script: Admin user seeding & RLS policies
├── supabase_cv_schema.sql      # SQL Script: CV Table & Storage Bucket
├── supabase_experience_schema.sql # SQL Script: Experiences table schema
├── supabase_schema.sql         # SQL Script: Full DB tables & initial seed data
├── middleware.ts               # Route guard protecting /admin
├── tailwind.config.ts          # Brutalist colors & shadow definitions
└── package.json
```

## 📜 Lisensi / License

Proyek ini dilisensikan di bawah [MIT License](LICENSE). Bebas digunakan sebagai inspirasi pengembangan portofolio modern.

<div align="center">
  <sub>Built with ❤️ and Modern Web Technologies</sub>
</div>