'use client';

import { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

export interface Project {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  github?: string;
  demo?: string;
  sort_order?: number;
}

const DEFAULT_PROJECTS_DATA: Record<'en' | 'id', Project[]> = {
  en: [
    {
      title: 'Portofolio',
      description: 'Personal portfolio website featuring personal information, skills, and projects in a Neo Brutalist design.',
      tags: ['Next.js', 'TypeScript', 'tailwind'],
      image: '/projects/porto.png',
      github: 'https://github.com/HMPoetra/my-porto',
      demo: 'https://my-porto-gamma-self.vercel.app/',
    },
    {
      title: 'Chartify',
      description: 'Sales data visualization dashboard with interactive charts and real-time analytics.',
      tags: ['Next.js', 'Tailwind', 'MongoDB'],
      image: '/projects/chartify.png',
      github: 'https://github.com/HMPoetra/hartify',
    },
    {
      title: 'UI Toko Sepatu',
      description: 'Shoe store UI with product listing, cart functionality, and responsive layout.',
      tags: ['HTML', 'CSS'],
      image: '/projects/toko_sepatu.png',
      github: 'https://github.com/HMPoetra/Toko_Sepatu',
    },
    {
      title: 'Upcoming Project',
      description: 'Community waste pickup platform with real-time tracking and interactive chat between drivers and residents.',
      tags: ['Next.js', 'TypeScript', 'supabase', 'tailwind'],
      image: '',
      github: '',
    },
  ],
  id: [
    {
      title: 'Portofolio',
      description: 'Website portofolio pribadi berisikan data diri, keahlian, dan showcase proyek dengan gaya Neo Brutalism.',
      tags: ['Next.js', 'TypeScript', 'tailwind'],
      image: '/projects/porto.png',
      github: 'https://github.com/HMPoetra/my-porto',
      demo: 'https://my-porto-gamma-self.vercel.app/',
    },
    {
      title: 'Chartify',
      description: 'Dashboard visualisasi data penjualan dengan grafik interaktif dan analitik performa.',
      tags: ['Next.js', 'Tailwind', 'MongoDB'],
      image: '/projects/chartify.png',
      github: 'https://github.com/HMPoetra/hartify',
    },
    {
      title: 'UI Toko Sepatu',
      description: 'Antarmuka e-commerce toko sepatu dengan katalog produk, keranjang belanja, dan desain responsif.',
      tags: ['HTML', 'CSS'],
      image: '/projects/toko_sepatu.png',
      github: 'https://github.com/HMPoetra/Toko_Sepatu',
    },
    {
      title: 'Proyek Mendatang',
      description: 'Aplikasi pengangkutan sampah tingkat RT/RW dengan fitur live-tracking dan chat warga-driver.',
      tags: ['Next.js', 'TypeScript', 'supabase', 'tailwind'],
      image: '',
      github: '',
    },
  ],
};

const CARD_COLORS = ['bg-brut-yellow', 'bg-brut-cyan', 'bg-brut-pink', 'bg-brut-lime'];

const cardVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Extracted outside parent to prevent recreation on every render
const ProjectCard = memo(({ project, index, comingSoonText, codeText, demoText }: { project: Project; index: number; comingSoonText: string; codeText: string; demoText: string }) => (
  <motion.div
    variants={cardVariants}
    whileHover={{ y: -8, rotate: index % 2 === 0 ? 1.5 : -1.5 }}
    whileTap={{ scale: 0.96 }}
    transition={{ type: 'spring', stiffness: 350, damping: 20 }}
    className={`flex h-full flex-col border-4 border-black p-5 shadow-brut-lg transition-all duration-150 hover:shadow-brut-xl ${
      CARD_COLORS[index % CARD_COLORS.length]
    }`}
  >
    {/* Thumbnail Frame */}
    <div className="relative mb-5 flex aspect-video w-full items-center justify-center overflow-hidden border-4 border-black bg-brut-paper">
      {project.image && (project.image.includes('/') || project.image.includes('.')) ? (
        <Image
          src={project.image}
          alt={`${project.title} screenshot`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center text-center"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #000 0 6px, transparent 6px 18px)',
          }}
        >
          <span className="border-4 border-black bg-brut-paper px-3 py-2 font-display text-lg leading-none text-black">
            {comingSoonText}
          </span>
        </div>
      )}
    </div>

    {/* Content */}
    <div className="flex w-full flex-grow flex-col text-left">
      <h3 className="mb-2 font-display text-xl text-black">{project.title}</h3>
      <p className="mb-5 line-clamp-3 text-xs leading-relaxed font-semibold text-black">
        {project.description}
      </p>

      {/* Tags */}
      <div className="mb-6 flex flex-wrap justify-start gap-1.5">
        {project.tags.map((tag, i) => (
          <span
            key={i}
            className="border-2 border-black bg-black px-2 py-0.5 font-mono text-[9px] font-bold tracking-wide text-brut-paper uppercase"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-auto flex w-full gap-3">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} source code on GitHub`}
            className="flex flex-1 items-center justify-center gap-2 border-4 border-black bg-brut-paper px-3 py-2 font-display text-[10px] tracking-widest text-black shadow-brut-xs transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut-sm active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <FaGithub size={14} /> {codeText}
          </a>
        )}
        {project.demo && project.demo !== '#' && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} live demo`}
            className="flex flex-1 items-center justify-center gap-2 border-4 border-black bg-black px-3 py-2 font-display text-[10px] tracking-widest text-brut-paper shadow-brut-xs transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut-sm active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <FaExternalLinkAlt size={12} /> {demoText}
          </a>
        )}
      </div>
    </div>
  </motion.div>
));

ProjectCard.displayName = 'ProjectCard';

const Projects = () => {
  const { language, t } = useLanguage();
  const defaultList = DEFAULT_PROJECTS_DATA[language] || DEFAULT_PROJECTS_DATA.en;
  const [projectsList, setProjectsList] = useState<Project[]>(defaultList);

  useEffect(() => {
    setProjectsList(DEFAULT_PROJECTS_DATA[language] || DEFAULT_PROJECTS_DATA.en);
  }, [language]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          const mapped: Project[] = data.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            image: p.image_url || '',
            github: p.github_url || '',
            demo: p.demo_url || '',
            tags: p.tags || [],
            sort_order: p.sort_order,
          }));
          setProjectsList(mapped);
        }
      } catch (err) {
        console.warn('Fallback to local projects data:', err);
      }
    };

    fetchProjects();
  }, []);

  const uniqueProjectsList = Array.from(
    new Map(
      (projectsList && projectsList.length > 0 ? projectsList : defaultList)
        .filter((p) => p && p.title)
        .map((p) => [p.title.toLowerCase().trim(), p])
    ).values()
  );

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  return (
    <section id="projects" className="flex min-h-screen items-center justify-center py-24">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 font-display text-4xl text-black md:text-6xl">
            {t.projects.title}{' '}
            <span className="inline-block -rotate-1 border-4 border-black bg-brut-pink px-3 shadow-brut-sm">
              {t.projects.highlight}
            </span>
          </h2>
          <span className="inline-block border-4 border-black bg-black px-4 py-1.5 font-display text-[11px] tracking-[0.3em] text-brut-lime">
            {t.projects.subtitle}
          </span>
        </motion.div>

        {/* Project Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-wrap justify-center gap-8"
        >
          {uniqueProjectsList.map((project, index) => (
            <div
              key={project.id || index}
              className="w-full max-w-[400px] sm:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2rem)]"
            >
              <ProjectCard
                project={project}
                index={index}
                comingSoonText={t.projects.comingSoon}
                codeText={t.projects.codeBtn}
                demoText={t.projects.demoBtn}
              />
            </div>
          ))}
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20 flex flex-col items-center gap-6 text-center"
        >
          <span className="border-4 border-black bg-brut-yellow px-4 py-2 font-display text-[11px] tracking-[0.25em] text-black shadow-brut-sm">
            {t.projects.moreProjects}
          </span>

          <a
            href="https://github.com/HMPoetra?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="brut-btn bg-brut-cyan text-xs"
          >
            {t.projects.exploreGithub}
            <FaGithub className="text-lg" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
