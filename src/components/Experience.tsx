'use client';

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt, FaUniversity, FaGraduationCap } from 'react-icons/fa';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

export interface Experience {
  id?: string;
  role: string;
  company: string;
  type: 'Work' | 'Internship' | 'Organization' | 'Academic';
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  tags: string[];
  sort_order?: number;
}

const DEFAULT_EXPERIENCES_DATA: Record<'en' | 'id', Experience[]> = {
  en: [
    {
      role: 'Fullstack Web Developer (Freelance)',
      company: 'Self-Employed',
      type: 'Work' as const,
      location: 'Remote, Indonesia',
      start_date: '2023',
      end_date: 'Present',
      description:
        'Developing custom web applications for clients using Next.js, TypeScript, and Supabase. Handling end-to-end development from UI design to database architecture and deployment.',
      tags: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    },
    {
      role: 'D3 Informatics Student',
      company: 'Universitas Logistik dan Bisnis Internasional (ULBI)',
      type: 'Academic' as const,
      location: 'Bandung, Indonesia',
      start_date: '2022',
      end_date: 'Present',
      description:
        'Active student in D3 Informatics Engineering program. Focusing on web development, database systems, and software engineering. Participated in multiple practical projects and academic competitions.',
      tags: ['Web Development', 'Database', 'Software Engineering', 'ULBI'],
    },
    {
      role: 'Web Development Project — Waste Management Platform',
      company: 'Academic Project',
      type: 'Academic' as const,
      location: 'Bandung, Indonesia',
      start_date: '2024',
      end_date: 'Ongoing',
      description:
        'Building a community-level waste pickup platform with real-time vehicle tracking, interactive chat between drivers and residents, and admin dashboard for route management.',
      tags: ['Next.js', 'TypeScript', 'Supabase', 'Real-time', 'Maps API'],
    },
  ],
  id: [
    {
      role: 'Fullstack Web Developer (Freelance)',
      company: 'Pekerja Mandiri / Freelance',
      type: 'Work' as const,
      location: 'Remote, Indonesia',
      start_date: '2023',
      end_date: 'Sekarang',
      description:
        'Mengembangkan aplikasi web kustom untuk klien menggunakan Next.js, TypeScript, dan Supabase. Menangani proses end-to-end dari desain UI, arsitektur database, hingga deployment produksi.',
      tags: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    },
    {
      role: 'Mahasiswa D3 Teknik Informatika',
      company: 'Universitas Logistik dan Bisnis Internasional (ULBI)',
      type: 'Academic' as const,
      location: 'Bandung, Indonesia',
      start_date: '2022',
      end_date: 'Sekarang',
      description:
        'Mahasiswa aktif program studi D3 Teknik Informatika. Fokus pada pengembangan web modern, sistem basis data, dan rekayasa perangkat lunak. Terlibat aktif dalam berbagai proyek praktikum.',
      tags: ['Web Development', 'Database', 'Software Engineering', 'ULBI'],
    },
    {
      role: 'Proyek Aplikasi Web — Platform Pengangkutan Sampah',
      company: 'Proyek Kampus / Akademik',
      type: 'Academic' as const,
      location: 'Bandung, Indonesia',
      start_date: '2024',
      end_date: 'Sedang Berjalan',
      description:
        'Membangun website pengangkutan sampah tingkat RT/RW dengan fitur pelacakan waktu nyata armada pengangkut, chat interaktif warga dan driver, serta dashboard manajemen rute.',
      tags: ['Next.js', 'TypeScript', 'Supabase', 'Real-time', 'Maps API'],
    },
  ],
};

const TYPE_CONFIG: Record<Experience['type'], { bg: string; icon: React.ElementType }> = {
  Work: { bg: 'bg-brut-cyan', icon: FaBriefcase },
  Internship: { bg: 'bg-brut-pink', icon: FaBriefcase },
  Organization: { bg: 'bg-brut-orange', icon: FaBriefcase },
  Academic: { bg: 'bg-brut-violet', icon: FaUniversity },
};

const itemVariants: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const ExperienceCard = memo(({ exp, typeLabel }: { exp: Experience; typeLabel: string }) => {
  const typeConf = TYPE_CONFIG[exp.type] || TYPE_CONFIG.Work;
  const TypeIcon = typeConf.icon;

  return (
    <motion.div
      variants={itemVariants}
      className="relative flex flex-col gap-4 border-4 border-black bg-brut-paper p-5 shadow-brut-lg transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brut-xl md:flex-row md:gap-6"
    >
      {/* Accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-2 border-r-4 border-black ${typeConf.bg} hidden md:block`} />

      {/* Icon */}
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center border-4 border-black shadow-brut-sm ${typeConf.bg}`}>
        <TypeIcon className="text-xl text-black" />
      </div>

      {/* Content */}
      <div className="flex-1 md:pl-2">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-base md:text-xl leading-tight text-black">
              {exp.role}
            </h3>
            <p className="mt-1 font-display text-xs md:text-sm text-black opacity-75 font-bold">
              {exp.company}
            </p>
          </div>
          <span className={`shrink-0 self-start border-2 border-black px-2.5 py-1 font-display text-[10px] md:text-[11px] tracking-widest text-black shadow-brut-xs ${typeConf.bg}`}>
            {typeLabel}
          </span>
        </div>

        {/* Meta */}
        <div className="mb-3 flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            <FaCalendarAlt className="text-[10px] text-black opacity-60" />
            <span className="font-mono text-[11px] font-bold text-black">
              {exp.start_date} — {exp.end_date}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaMapMarkerAlt className="text-[10px] text-black opacity-60" />
            <span className="font-mono text-[11px] font-bold text-black">{exp.location}</span>
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 text-xs font-semibold leading-relaxed text-black opacity-80">
          {exp.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {exp.tags.map((tag, i) => (
            <span
              key={i}
              className="border-2 border-black bg-black px-2 py-0.5 font-mono text-[9px] font-bold tracking-wide text-brut-paper uppercase"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
});
ExperienceCard.displayName = 'ExperienceCard';

const Experience = () => {
  const { language, t } = useLanguage();
  const defaultList = DEFAULT_EXPERIENCES_DATA[language] || DEFAULT_EXPERIENCES_DATA.en;
  const [expList, setExpList] = useState<Experience[]>(defaultList);
  const [activeTab, setActiveTab] = useState<'ALL' | 'WORK' | 'ACADEMIC'>('ALL');

  useEffect(() => {
    setExpList(DEFAULT_EXPERIENCES_DATA[language] || DEFAULT_EXPERIENCES_DATA.en);
  }, [language]);

  useEffect(() => {
    const fetchExperiences = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setExpList(data as Experience[]);
        }
      } catch (err) {
        console.warn('Fallback to local experience data:', err);
      }
    };

    fetchExperiences();
  }, []);

  const workExperiences = expList.filter(
    (e) => e.type === 'Work' || e.type === 'Internship' || e.type === 'Organization'
  );
  const backgroundExperiences = expList.filter((e) => e.type === 'Academic');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const tabs = [
    { key: 'ALL' as const, label: t.experience.tabAll, count: expList.length, bg: 'bg-brut-yellow' },
    { key: 'WORK' as const, label: t.experience.tabExperience, count: workExperiences.length, bg: 'bg-brut-cyan', icon: FaBriefcase },
    { key: 'ACADEMIC' as const, label: t.experience.tabBackground, count: backgroundExperiences.length, bg: 'bg-brut-violet', icon: FaGraduationCap },
  ];

  return (
    <section id="experience" className="flex min-h-screen items-center justify-center py-24">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="mb-4 font-display text-4xl text-black md:text-6xl">
            {t.experience.title}{' '}
            <span className="inline-block -rotate-1 border-4 border-black bg-brut-orange px-3 shadow-brut-sm">
              {t.experience.highlight}
            </span>
          </h2>
          <span className="inline-block border-4 border-black bg-black px-4 py-1.5 font-display text-[11px] tracking-[0.3em] text-brut-orange">
            {t.experience.subtitle}
          </span>
        </motion.div>

        {/* Tab Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-wrap justify-center gap-3"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 border-4 border-black px-4 py-2 font-display text-[11px] tracking-wider text-black shadow-brut-xs transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
                  isActive ? `${tab.bg} shadow-brut font-black` : 'bg-brut-paper'
                }`}
              >
                {Icon && <Icon className="text-xs" />}
                <span>{tab.label}</span>
                <span className="border border-black bg-black text-white px-1.5 py-0.2 font-mono text-[9px]">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Content with Separation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-12"
          >
            {/* 1. WORK EXPERIENCE SECTION */}
            {(activeTab === 'ALL' || activeTab === 'WORK') && (
              <div className="space-y-6">
                {activeTab === 'ALL' && (
                  <div className="flex items-center justify-between border-4 border-black bg-brut-cyan p-3.5 shadow-brut-sm">
                    <div className="flex items-center gap-3">
                      <div className="border-2 border-black bg-black p-1.5 text-brut-cyan">
                        <FaBriefcase className="text-base" />
                      </div>
                      <h3 className="font-display text-sm md:text-base text-black uppercase tracking-wider">
                        {t.experience.experienceHeader}
                      </h3>
                    </div>
                    <span className="border-2 border-black bg-black px-2.5 py-0.5 font-mono text-xs font-bold text-white">
                      {workExperiences.length} POSISI
                    </span>
                  </div>
                )}

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="relative space-y-6"
                >
                  <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-black opacity-20 hidden md:block" />
                  {workExperiences.map((exp, index) => (
                    <ExperienceCard
                      key={exp.id || `work-${index}`}
                      exp={exp}
                      typeLabel={t.experience.types[exp.type] || exp.type}
                    />
                  ))}
                </motion.div>
              </div>
            )}

            {/* 2. EDUCATION & ACADEMIC BACKGROUND SECTION */}
            {(activeTab === 'ALL' || activeTab === 'ACADEMIC') && (
              <div className="space-y-6">
                {activeTab === 'ALL' && (
                  <div className="flex items-center justify-between border-4 border-black bg-brut-violet p-3.5 shadow-brut-sm">
                    <div className="flex items-center gap-3">
                      <div className="border-2 border-black bg-black p-1.5 text-brut-violet">
                        <FaUniversity className="text-base" />
                      </div>
                      <h3 className="font-display text-sm md:text-base text-black uppercase tracking-wider">
                        {t.experience.backgroundHeader}
                      </h3>
                    </div>
                    <span className="border-2 border-black bg-black px-2.5 py-0.5 font-mono text-xs font-bold text-white">
                      {backgroundExperiences.length} PENDIDIKAN & PROYEK
                    </span>
                  </div>
                )}

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="relative space-y-6"
                >
                  <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-black opacity-20 hidden md:block" />
                  {backgroundExperiences.map((exp, index) => (
                    <ExperienceCard
                      key={exp.id || `academic-${index}`}
                      exp={exp}
                      typeLabel={t.experience.types[exp.type] || exp.type}
                    />
                  ))}
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Open to Work CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 border-4 border-black bg-brut-lime p-6 shadow-brut text-center md:p-8"
        >
          <h4 className="mb-2 font-display text-xl text-black">
            {t.experience.ctaTitle}
          </h4>
          <p className="mb-4 text-sm font-semibold text-black">
            {t.experience.ctaDesc}
          </p>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="brut-btn bg-brut-paper text-xs inline-flex"
          >
            <FaBriefcase />
            {t.experience.ctaButton}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
