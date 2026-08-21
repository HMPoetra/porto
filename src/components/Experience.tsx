'use client';

import { useState, useEffect, memo, useMemo } from 'react';
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
      id: 'default-1',
      role: 'Fullstack Web Developer (Freelance)',
      company: 'Self-Employed',
      type: 'Work' as const,
      location: 'Remote, Indonesia',
      start_date: '2023',
      end_date: 'Present',
      description:
        'Developing custom web applications for clients using Next.js, TypeScript, and Supabase. Handling end-to-end development from UI design to database architecture and deployment.',
      tags: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
      sort_order: 1,
    },
    {
      id: 'default-2',
      role: 'D3 Informatics Student',
      company: 'Universitas Logistik dan Bisnis Internasional (ULBI)',
      type: 'Academic' as const,
      location: 'Bandung, Indonesia',
      start_date: '2022',
      end_date: 'Present',
      description:
        'Active student in D3 Informatics Engineering program. Focusing on web development, database systems, and software engineering. Participated in multiple practical projects and academic competitions.',
      tags: ['Web Development', 'Database', 'Software Engineering', 'ULBI'],
      sort_order: 2,
    },
    {
      id: 'default-3',
      role: 'Web Development Project — Waste Management Platform',
      company: 'Academic Project',
      type: 'Academic' as const,
      location: 'Bandung, Indonesia',
      start_date: '2024',
      end_date: 'Ongoing',
      description:
        'Building a community-level waste pickup platform with real-time vehicle tracking, interactive chat between drivers and residents, and admin dashboard for route management.',
      tags: ['Next.js', 'TypeScript', 'Supabase', 'Real-time', 'Maps API'],
      sort_order: 3,
    },
  ],
  id: [
    {
      id: 'default-1',
      role: 'Fullstack Web Developer (Freelance)',
      company: 'Pekerja Mandiri / Freelance',
      type: 'Work' as const,
      location: 'Remote, Indonesia',
      start_date: '2023',
      end_date: 'Sekarang',
      description:
        'Mengembangkan aplikasi web kustom untuk klien menggunakan Next.js, TypeScript, dan Supabase. Menangani proses end-to-end dari desain UI, arsitektur database, hingga deployment produksi.',
      tags: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
      sort_order: 1,
    },
    {
      id: 'default-2',
      role: 'Mahasiswa D3 Teknik Informatika',
      company: 'Universitas Logistik dan Bisnis Internasional (ULBI)',
      type: 'Academic' as const,
      location: 'Bandung, Indonesia',
      start_date: '2022',
      end_date: 'Sekarang',
      description:
        'Mahasiswa aktif program studi D3 Teknik Informatika. Fokus pada pengembangan web modern, sistem basis data, dan rekayasa perangkat lunak. Terlibat aktif dalam berbagai proyek praktikum.',
      tags: ['Web Development', 'Database', 'Software Engineering', 'ULBI'],
      sort_order: 2,
    },
    {
      id: 'default-3',
      role: 'Proyek Aplikasi Web — Platform Pengangkutan Sampah',
      company: 'Proyek Kampus / Akademik',
      type: 'Academic' as const,
      location: 'Bandung, Indonesia',
      start_date: '2024',
      end_date: 'Sedang Berjalan',
      description:
        'Membangun website pengangkutan sampah tingkat RT/RW dengan fitur pelacakan waktu nyata armada pengangkut, chat interaktif warga dan driver, serta dashboard manajemen rute.',
      tags: ['Next.js', 'TypeScript', 'Supabase', 'Real-time', 'Maps API'],
      sort_order: 3,
    },
  ],
};

const TYPE_CONFIG: Record<string, { bg: string; icon: React.ElementType }> = {
  Work: { bg: 'bg-brut-cyan', icon: FaBriefcase },
  Internship: { bg: 'bg-brut-pink', icon: FaBriefcase },
  Organization: { bg: 'bg-brut-orange', icon: FaBriefcase },
  Academic: { bg: 'bg-brut-violet', icon: FaUniversity },
};

const itemVariants: Variants = {
  hidden: { x: -16, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

const ExperienceCard = memo(({ exp, typeLabel }: { exp: Experience; typeLabel: string }) => {
  const typeKey = exp.type || 'Work';
  const typeConf = TYPE_CONFIG[typeKey] || TYPE_CONFIG.Work;
  const TypeIcon = typeConf.icon || FaBriefcase;
  const tagsList = Array.isArray(exp.tags)
    ? exp.tags
    : typeof exp.tags === 'string'
    ? (exp.tags as string).split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
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
              {exp.role || 'Role'}
            </h3>
            <p className="mt-1 font-display text-xs md:text-sm text-black opacity-75 font-bold">
              {exp.company || 'Company'}
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
              {exp.start_date || '2023'} — {exp.end_date || 'Present'}
            </span>
          </div>
          {exp.location && (
            <div className="flex items-center gap-1.5">
              <FaMapMarkerAlt className="text-[10px] text-black opacity-60" />
              <span className="font-mono text-[11px] font-bold text-black">{exp.location}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {exp.description && (
          <p className="mb-4 text-xs font-semibold leading-relaxed text-black opacity-80">
            {exp.description}
          </p>
        )}

        {/* Tags */}
        {tagsList.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tagsList.map((tag, i) => (
              <span
                key={i}
                className="border-2 border-black bg-black px-2 py-0.5 font-mono text-[9px] font-bold tracking-wide text-brut-paper uppercase"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
});
ExperienceCard.displayName = 'ExperienceCard';

const Experience = () => {
  const { language, t } = useLanguage();
  const [supabaseExperiences, setSupabaseExperiences] = useState<Experience[] | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'WORK' | 'ACADEMIC'>('ALL');

  useEffect(() => {
    let isMounted = true;

    const fetchExperiences = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0 && isMounted) {
          const mapped: Experience[] = data.map((item) => {
            const rawType = (item.type || 'Work').toString().trim();
            const normalizedType: Experience['type'] =
              rawType.toLowerCase() === 'academic' || rawType.toLowerCase() === 'education'
                ? 'Academic'
                : rawType.toLowerCase() === 'internship'
                ? 'Internship'
                : rawType.toLowerCase() === 'organization'
                ? 'Organization'
                : 'Work';

            return {
              id: item.id,
              role: item.role || 'Position',
              company: item.company || 'Company / Institution',
              type: normalizedType,
              location: item.location || 'Indonesia',
              start_date: item.start_date || '2023',
              end_date: item.end_date || 'Present',
              description: item.description || '',
              tags: Array.isArray(item.tags)
                ? item.tags
                : typeof item.tags === 'string'
                ? item.tags.split(',').map((s: string) => s.trim()).filter(Boolean)
                : [],
              sort_order: item.sort_order ?? 0,
            };
          });
          setSupabaseExperiences(mapped);
        }
      } catch (err) {
        console.warn('Fallback to local experience data:', err);
      }
    };

    fetchExperiences();

    return () => {
      isMounted = false;
    };
  }, []);

  const currentList = useMemo<Experience[]>(() => {
    if (supabaseExperiences && supabaseExperiences.length > 0) {
      return supabaseExperiences;
    }
    return DEFAULT_EXPERIENCES_DATA[language] || DEFAULT_EXPERIENCES_DATA.en;
  }, [supabaseExperiences, language]);

  const workExperiences = useMemo(() => {
    return currentList.filter(
      (e) => e.type === 'Work' || e.type === 'Internship' || e.type === 'Organization'
    );
  }, [currentList]);

  const backgroundExperiences = useMemo(() => {
    return currentList.filter((e) => e.type === 'Academic');
  }, [currentList]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const tabs = [
    { key: 'ALL' as const, label: t.experience?.tabAll || 'ALL JOURNEY', count: currentList.length, bg: 'bg-brut-yellow' },
    { key: 'WORK' as const, label: t.experience?.tabExperience || 'WORK EXPERIENCE', count: workExperiences.length, bg: 'bg-brut-cyan', icon: FaBriefcase },
    { key: 'ACADEMIC' as const, label: t.experience?.tabBackground || 'EDUCATION & BACKGROUND', count: backgroundExperiences.length, bg: 'bg-brut-violet', icon: FaGraduationCap },
  ];

  return (
    <section id="experience" className="flex min-h-screen items-center justify-center py-24">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.4 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-4 font-display text-4xl text-black md:text-6xl">
            {t.experience?.title || 'MY'}{' '}
            <span className="inline-block -rotate-1 border-4 border-black bg-brut-orange px-3 shadow-brut-sm">
              {t.experience?.highlight || 'JOURNEY'}
            </span>
          </h2>
          <span className="inline-block border-4 border-black bg-black px-4 py-1.5 font-display text-[11px] tracking-[0.3em] text-brut-orange">
            {t.experience?.subtitle || 'Experience & Background'}
          </span>
        </motion.div>

        {/* Tab Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.3 }}
          className="mb-12 flex flex-wrap justify-center gap-3"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-12"
          >
            {/* 1. WORK EXPERIENCE SECTION */}
            {(activeTab === 'ALL' || activeTab === 'WORK') && workExperiences.length > 0 && (
              <div className="space-y-6">
                {activeTab === 'ALL' && (
                  <div className="flex items-center justify-between border-4 border-black bg-brut-cyan p-3.5 shadow-brut-sm">
                    <div className="flex items-center gap-3">
                      <div className="border-2 border-black bg-black p-1.5 text-brut-cyan">
                        <FaBriefcase className="text-base" />
                      </div>
                      <h3 className="font-display text-sm md:text-base text-black uppercase tracking-wider">
                        {t.experience?.experienceHeader || 'WORK EXPERIENCE'}
                      </h3>
                    </div>
                    <span className="border-2 border-black bg-black px-2.5 py-0.5 font-mono text-xs font-bold text-white">
                      {workExperiences.length} {language === 'id' ? 'POSISI' : 'ROLES'}
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
                      typeLabel={(t.experience?.types as any)?.[exp.type] || exp.type}
                    />
                  ))}
                </motion.div>
              </div>
            )}

            {/* 2. EDUCATION & ACADEMIC BACKGROUND SECTION */}
            {(activeTab === 'ALL' || activeTab === 'ACADEMIC') && backgroundExperiences.length > 0 && (
              <div className="space-y-6">
                {activeTab === 'ALL' && (
                  <div className="flex items-center justify-between border-4 border-black bg-brut-violet p-3.5 shadow-brut-sm">
                    <div className="flex items-center gap-3">
                      <div className="border-2 border-black bg-black p-1.5 text-brut-violet">
                        <FaUniversity className="text-base" />
                      </div>
                      <h3 className="font-display text-sm md:text-base text-black uppercase tracking-wider">
                        {t.experience?.backgroundHeader || 'EDUCATION & BACKGROUND'}
                      </h3>
                    </div>
                    <span className="border-2 border-black bg-black px-2.5 py-0.5 font-mono text-xs font-bold text-white">
                      {backgroundExperiences.length} {language === 'id' ? 'PENDIDIKAN & PROYEK' : 'ACADEMIC & PROJECTS'}
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
                      typeLabel={(t.experience?.types as any)?.[exp.type] || exp.type}
                    />
                  ))}
                </motion.div>
              </div>
            )}

            {/* Empty State Fallback */}
            {((activeTab === 'WORK' && workExperiences.length === 0) ||
              (activeTab === 'ACADEMIC' && backgroundExperiences.length === 0) ||
              (activeTab === 'ALL' && currentList.length === 0)) && (
              <div className="border-4 border-black bg-brut-paper p-8 text-center shadow-brut">
                <p className="font-display text-sm text-neutral-700 uppercase font-bold">
                  {language === 'id' ? 'Belum ada data pada kategori ini.' : 'No experience records found in this category.'}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Open to Work CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.4 }}
          className="mt-16 border-4 border-black bg-brut-lime p-6 shadow-brut text-center md:p-8"
        >
          <h4 className="mb-2 font-display text-xl text-black">
            {t.experience?.ctaTitle || 'Open to Collaboration'}
          </h4>
          <p className="mb-4 text-sm font-semibold text-black">
            {t.experience?.ctaDesc || 'Currently open for opportunities.'}
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
            {t.experience?.ctaButton || 'Get in Touch'}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;

