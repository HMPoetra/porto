'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'id';

export interface Translations {
  nav: {
    home: string;
    about: string;
    skills: string;
    experience: string;
    projects: string;
    certifications: string;
    contact: string;
  };
  hero: {
    whoAmI: string;
    whoAmIBadge: string;
    codeLine: string;
    bio: string;
    statusLabel: string;
    statusText: string;
    webDevSkill: string;
    gamerSkill: string;
    viewProjects: string;
    downloadCv: string;
    gamingStats: string;
    sawer: string;
    quotePrefix: string;
    quoteWord1: string;
    quoteWord2: string;
    quoteMid: string;
    systemStatsTitle: string;
    systemOnline: string;
    supportTitle: string;
    supportSubtitle: string;
    supportInstruction: string;
    waitingTransaction: string;
    close: string;
  };
  skills: {
    title: string;
    highlight: string;
    subtitle: string;
    allSkills: string;
    frontend: string;
    backend: string;
    tools: string;
  };
  experience: {
    title: string;
    highlight: string;
    subtitle: string;
    tabAll: string;
    tabExperience: string;
    tabBackground: string;
    experienceHeader: string;
    backgroundHeader: string;
    types: {
      Work: string;
      Internship: string;
      Organization: string;
      Academic: string;
    };
    ctaTitle: string;
    ctaDesc: string;
    ctaButton: string;
    present: string;
    ongoing: string;
  };
  projects: {
    title: string;
    highlight: string;
    subtitle: string;
    comingSoon: string;
    moreProjects: string;
    exploreGithub: string;
    codeBtn: string;
    demoBtn: string;
  };
  certifications: {
    title: string;
    highlight: string;
    subtitle: string;
    verifyBtn: string;
    linkComingSoon: string;
    academicTitle: string;
    academicDesc: string;
    verifiedBadge: string;
  };
  contact: {
    title: string;
    highlight: string;
    subtitle: string;
    contactInfo: string;
    socials: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    subjectPlaceholder: string;
    messagePlaceholder: string;
    transmitBtn: string;
    transmittingBtn: string;
    successMsg: string;
    errorMsg: string;
    backToTop: string;
  };
  footer: {
    tickerDay: string;
    tickerNight: string;
    allRights: string;
    quote: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      experience: 'Experience',
      projects: 'Projects',
      certifications: 'Certifications',
      contact: 'Contact',
    },
    hero: {
      whoAmI: 'WHO AM I',
      whoAmIBadge: '!?',
      codeLine: 'System.out.println("Web Developer Here!");',
      bio: "Hi! Welcome to my world. I'm Hapsoro Mahendra Poetra from Bogor, Indonesia. An active D3 Informatics student at Universitas Logistik dan Bisnis Internasional (ULBI), passionate about building Websites, Applications, and Project Management.",
      statusLabel: 'Status: Available',
      statusText: 'Ready for Internship / Web Projects.',
      webDevSkill: 'WebDev',
      gamerSkill: 'Gamer',
      viewProjects: 'View Projects',
      downloadCv: 'Download CV',
      gamingStats: 'Gaming Stats',
      sawer: 'Support',
      quotePrefix: 'Think',
      quoteWord1: 'Big',
      quoteMid: ', then',
      quoteWord2: 'Act',
      systemStatsTitle: 'SYSTEM STATS',
      systemOnline: 'System: Online',
      supportTitle: 'SUPPORT ME',
      supportSubtitle: 'Buy me a coffee / support my journey',
      supportInstruction: 'Scan QRIS above with any banking or e-wallet app.',
      waitingTransaction: 'WAITING TRANSACTION...',
      close: 'Close',
    },
    skills: {
      title: 'TECH',
      highlight: 'STACK',
      subtitle: 'Arsenal & Tools',
      allSkills: 'ALL SKILLS',
      frontend: 'FRONTEND ENGINE',
      backend: 'BACKEND CORE',
      tools: 'UTILITIES & TOOLS',
    },
    experience: {
      title: 'MY',
      highlight: 'JOURNEY',
      subtitle: 'Experience & Background',
      tabAll: 'ALL JOURNEY',
      tabExperience: 'WORK EXPERIENCE',
      tabBackground: 'EDUCATION & BACKGROUND',
      experienceHeader: 'WORK & PROFESSIONAL EXPERIENCE',
      backgroundHeader: 'EDUCATION & ACADEMIC BACKGROUND',
      types: {
        Work: 'Work',
        Internship: 'Internship',
        Organization: 'Organization',
        Academic: 'Academic',
      },
      ctaTitle: 'Open to Internship & Collaboration',
      ctaDesc: 'Currently seeking internship opportunities in web development, fullstack, or frontend roles.',
      ctaButton: 'Get in Touch',
      present: 'Present',
      ongoing: 'Ongoing',
    },
    projects: {
      title: 'Latest',
      highlight: 'Missions',
      subtitle: 'Selected Work',
      comingSoon: 'Coming Soon',
      moreProjects: 'More Projects Coming Soon',
      exploreGithub: 'Explore All Repositories',
      codeBtn: 'Code',
      demoBtn: 'Demo',
    },
    certifications: {
      title: 'CERTIFIED',
      highlight: 'CREDENTIALS',
      subtitle: 'Validated Professional Training',
      verifyBtn: 'Verify Credential',
      linkComingSoon: 'Verification Link Coming Soon',
      academicTitle: 'Academic Background',
      academicDesc: 'D3 Teknik Informatika — Universitas Logistik dan Bisnis Internasional (ULBI)',
      verifiedBadge: 'Verified Student & Developer',
    },
    contact: {
      title: 'CONNECT',
      highlight: 'HUB',
      subtitle: "Let's Build Something",
      contactInfo: 'Contact Info',
      socials: 'Socials',
      namePlaceholder: 'Full Name',
      emailPlaceholder: 'Email Address',
      subjectPlaceholder: 'Subject',
      messagePlaceholder: 'Your Message...',
      transmitBtn: 'Transmit Message',
      transmittingBtn: 'Transmitting...',
      successMsg: "Thank you, {name}! Your message has been sent successfully. I'll get back to you soon.",
      errorMsg: 'Failed to send message. Please try again or contact me directly via email.',
      backToTop: 'Back to Top',
    },
    footer: {
      tickerDay: 'CODE BY DAY',
      tickerNight: 'GAME BY NIGHT',
      allRights: 'All rights reserved.',
      quote: 'Code by day, Game by night',
    },
  },
  id: {
    nav: {
      home: 'Beranda',
      about: 'Tentang',
      skills: 'Keahlian',
      experience: 'Pengalaman',
      projects: 'Proyek',
      certifications: 'Sertifikasi',
      contact: 'Kontak',
    },
    hero: {
      whoAmI: 'SIAPA SAYA',
      whoAmIBadge: '!?',
      codeLine: 'System.out.println("Web Developer Here!");',
      bio: 'Fullstack Web Developer & Mahasiswa D3 Teknik Informatika yang berfokus pada ekosistem React, Next.js, TypeScript, dan Supabase. Terbiasa membangun aplikasi web modern yang cepat, andal, dan berkinerja tinggi.',
      statusLabel: 'STATUS SAAT INI',
      statusText: 'Terbuka untuk Magang, Pekerjaan Full-time, & Proyek Freelance',
      webDevSkill: 'Pengembang Web',
      gamerSkill: 'Gamer',
      viewProjects: 'Lihat Proyek',
      downloadCv: 'Unduh CV',
      gamingStats: 'Statistik Game',
      sawer: 'Sawer Kopi',
      quotePrefix: 'Kode di siang hari,',
      quoteWord1: 'GAME',
      quoteMid: 'di malam hari —',
      quoteWord2: 'LEVEL UP',
      systemStatsTitle: 'STATISTIK SISTEM',
      systemOnline: 'SEMUA SISTEM AKTIF',
      supportTitle: 'SAWER SAYA',
      supportSubtitle: 'Dukungan Langsung / Traktir Kopi',
      supportInstruction: 'Scan QRIS di atas dengan GoPay, OVO, Dana, ShopeePay, atau Mobile Banking apa saja.',
      waitingTransaction: 'MENUNGGU TRANSAKSI...',
      close: 'Tutup',
    },
    skills: {
      title: 'TECH',
      highlight: 'STACK',
      subtitle: 'Keahlian & Alat Kerja',
      allSkills: 'SEMUA KEAHLIAN',
      frontend: 'FRONTEND ENGINE',
      backend: 'BACKEND CORE',
      tools: 'ALAT & UTILITY',
    },
    experience: {
      title: 'PERJALANAN',
      highlight: 'SAYA',
      subtitle: 'Pengalaman & Latar Belakang',
      tabAll: 'SEMUA PERJALANAN',
      tabExperience: 'PENGALAMAN KERJA',
      tabBackground: 'PENDIDIKAN & AKADEMIK',
      experienceHeader: 'PENGALAMAN KERJA & PROFESIONAL',
      backgroundHeader: 'PENDIDIKAN & LATAR BELAKANG AKADEMIK',
      types: {
        Work: 'Pekerjaan',
        Internship: 'Magang',
        Organization: 'Organisasi',
        Academic: 'Akademik',
      },
      ctaTitle: 'Terbuka untuk Magang & Kolaborasi',
      ctaDesc: 'Saat ini aktif mencari peluang magang di bidang web development, fullstack, atau frontend.',
      ctaButton: 'Hubungi Saya',
      present: 'Sekarang',
      ongoing: 'Sedang Berjalan',
    },
    projects: {
      title: 'Karya',
      highlight: 'Terbaru',
      subtitle: 'Proyek Terpilih',
      comingSoon: 'Segera Hadir',
      moreProjects: 'Lebih Banyak Proyek Segera Hadir',
      exploreGithub: 'Lihat Semua Repositori',
      codeBtn: 'Kode',
      demoBtn: 'Demo',
    },
    certifications: {
      title: 'SERTIFIKAT',
      highlight: 'RESMI',
      subtitle: 'Pelatihan Profesional Tervalidasi',
      verifyBtn: 'Verifikasi Sertifikat',
      linkComingSoon: 'Link Verifikasi Segera Hadir',
      academicTitle: 'Latar Belakang Akademik',
      academicDesc: 'D3 Teknik Informatika — Universitas Logistik dan Bisnis Internasional (ULBI)',
      verifiedBadge: 'Mahasiswa & Pengembang Terverifikasi',
    },
    contact: {
      title: 'HUBUNGI',
      highlight: 'SAYA',
      subtitle: 'Mari Wujudkan Sesuatu Bersama',
      contactInfo: 'Informasi Kontak',
      socials: 'Media Sosial',
      namePlaceholder: 'Nama Lengkap',
      emailPlaceholder: 'Alamat Email',
      subjectPlaceholder: 'Subjek Pesan',
      messagePlaceholder: 'Tulis pesan Anda...',
      transmitBtn: 'Kirim Pesan',
      transmittingBtn: 'Mengirimkan...',
      successMsg: 'Terima kasih, {name}! Pesan berhasil terkirim. Saya akan segera menghubungi Anda.',
      errorMsg: 'Gagal mengirim pesan. Silakan coba lagi atau hubungi langsung via email.',
      backToTop: 'Ke Atas',
    },
    footer: {
      tickerDay: 'KODING SIANG HARI',
      tickerNight: 'MAIN GAME MALAM HARI',
      allRights: 'Hak cipta dilindungi undang-undang.',
      quote: 'Koding di siang hari, Gaming di malam hari',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('id'); // Default to 'id' / Bahasa Indonesia

  useEffect(() => {
    const saved = localStorage.getItem('hm_language') as Language | null;
    if (saved === 'en' || saved === 'id') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('hm_language', lang);
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'id' : 'en';
    setLanguage(nextLang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
