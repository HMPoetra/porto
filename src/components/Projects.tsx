'use client';

import { useState, useEffect, memo, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  FaGithub,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaImages,
  FaCode,
  FaLayerGroup,
} from 'react-icons/fa';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

export interface Project {
  id?: string;
  title: string;
  description: string;
  detail_description?: string;
  tags: string[];
  image: string;
  gallery_images?: string[];
  github?: string;
  demo?: string;
  sort_order?: number;
  is_visible?: boolean;
  created_at?: string;
}

const DEFAULT_PROJECTS_DATA: Record<'en' | 'id', Project[]> = {
  en: [
    {
      id: 'default-p1',
      title: 'Portofolio',
      description: 'Personal portfolio website featuring personal information, skills, and projects in a Neo Brutalist design.',
      detail_description:
        'A high-performance modern personal portfolio website engineered with Next.js 16 (App Router), React 19, TypeScript, and TailwindCSS in a distinctive Neo Brutalist aesthetic. Key architectural features include an integrated Supabase Headless CMS (PostgreSQL, Row Level Security, Storage Buckets), real-time bilingual support (ID/EN), interactive PDF CV viewer with blob downloader, guestbook system, and responsive micro-animations via Framer Motion.',
      tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Framer Motion'],
      image: '/projects/porto.png',
      gallery_images: ['/projects/porto.png', '/og-image.png'],
      github: 'https://github.com/HMPoetra/porto',
      demo: 'https://my-porto-gamma-self.vercel.app/',
      sort_order: 1,
    },
    {
      id: 'default-p2',
      title: 'Chartify',
      description: 'Sales data visualization dashboard with interactive charts and real-time analytics.',
      detail_description:
        'An analytics dashboard designed for enterprise sales and inventory monitoring. Built with Next.js, TailwindCSS, and MongoDB aggregation pipelines. Features include interactive time-series financial charts, multi-metric sales KPI cards, custom date-range filtering, downloadable PDF/CSV reports, and responsive UI for mobile and desktop dashboards.',
      tags: ['Next.js', 'Tailwind CSS', 'MongoDB', 'Chart.js', 'Analytics'],
      image: '/projects/chartify.png',
      gallery_images: ['/projects/chartify.png'],
      github: 'https://github.com/HMPoetra/hartify',
      sort_order: 2,
    },
    {
      id: 'default-p3',
      title: 'UI Toko Sepatu',
      description: 'Shoe store UI with product listing, cart functionality, and responsive layout.',
      detail_description:
        'A modern e-commerce storefront prototype for footwear retail. Built with semantic HTML5, modern CSS3 flexbox/grid architectures, and Vanilla JavaScript. Highlights include dynamic catalog filtering by brand, size, and color, interactive shopping cart simulation with price breakdown calculation, and optimized mobile-first responsive design.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'UI/UX Design', 'E-Commerce'],
      image: '/projects/toko_sepatu.png',
      gallery_images: ['/projects/toko_sepatu.png'],
      github: 'https://github.com/HMPoetra/Toko_Sepatu',
      sort_order: 3,
    },
    {
      id: 'default-p4',
      title: 'Upcoming Project',
      description: 'Community waste pickup platform with real-time tracking and interactive chat between drivers and residents.',
      detail_description:
        'A community-driven digital waste management platform engineered to streamline garbage collection at neighborhood (RT/RW) levels. Features real-time GPS tracking for waste transport trucks via Maps API, direct instant chat between waste collectors and residents, automated pickup scheduling, and comprehensive administrator dashboard for route optimization.',
      tags: ['Next.js', 'TypeScript', 'Supabase', 'Real-time', 'Maps API'],
      image: '',
      gallery_images: [],
      github: '',
      sort_order: 4,
    },
  ],
  id: [
    {
      id: 'default-p1',
      title: 'Portofolio',
      description: 'Website portofolio pribadi berisikan data diri, keahlian, dan showcase proyek dengan gaya Neo Brutalism.',
      detail_description:
        'Website portofolio pribadi modern berkinerja tinggi yang dibangun dengan Next.js 16 (App Router), React 19, TypeScript, dan TailwindCSS dalam arsitektur Neo Brutalism. Fitur utama mencakup Headless CMS Admin terintegrasi Supabase (PostgreSQL, Row Level Security, Storage Buckets), multi-bahasa real-time (ID/EN), preview dokumen CV interaktif dengan blob downloader, guestbook, dan animasi interaktif Framer Motion.',
      tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Framer Motion'],
      image: '/projects/porto.png',
      gallery_images: ['/projects/porto.png', '/og-image.png'],
      github: 'https://github.com/HMPoetra/porto',
      demo: 'https://my-porto-gamma-self.vercel.app/',
      sort_order: 1,
    },
    {
      id: 'default-p2',
      title: 'Chartify',
      description: 'Dashboard visualisasi data penjualan dengan grafik interaktif dan analitik performa.',
      detail_description:
        'Dashboard analitik untuk pemantauan penjualan bisnis dan inventaris secara real-time. Dibangun menggunakan Next.js, TailwindCSS, dan pipeline agregasi database MongoDB. Fitur mencakup grafik time-series performa penjualan interaktif, kartu KPI finansial, filter rentang tanggal kustom, serta ekspor laporan analitik.',
      tags: ['Next.js', 'Tailwind CSS', 'MongoDB', 'Chart.js', 'Analytics'],
      image: '/projects/chartify.png',
      gallery_images: ['/projects/chartify.png'],
      github: 'https://github.com/HMPoetra/hartify',
      sort_order: 2,
    },
    {
      id: 'default-p3',
      title: 'UI Toko Sepatu',
      description: 'Antarmuka e-commerce toko sepatu dengan katalog produk, keranjang belanja, dan desain responsif.',
      detail_description:
        'Prototipe antarmuka toko online sepatu modern yang responsif dan elegan. Dibangun dengan HTML5 semantik, CSS3 modular, dan JavaScript. Memiliki fitur filter katalog dinamis berdasarkan merek, ukuran, dan warna, simulasi keranjang belanja interaktif dengan kalkulasi total harga, serta optimasi tata letak mobile-first.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'UI/UX Design', 'E-Commerce'],
      image: '/projects/toko_sepatu.png',
      gallery_images: ['/projects/toko_sepatu.png'],
      github: 'https://github.com/HMPoetra/Toko_Sepatu',
      sort_order: 3,
    },
    {
      id: 'default-p4',
      title: 'Proyek Mendatang',
      description: 'Aplikasi pengangkutan sampah tingkat RT/RW dengan fitur live-tracking dan chat warga-driver.',
      detail_description:
        'Platform digital pengelolaan dan penjemputan sampah tingkat komunitas RT/RW. Dilengkapi fitur pelacakan armada truk pengangkut secara real-time via integrasi Maps API, sistem komunikasi chat instan antara petugas dan warga, penjadwalan otomatis penjemputan, serta portal kontrol admin untuk rute armada.',
      tags: ['Next.js', 'TypeScript', 'Supabase', 'Real-time', 'Maps API'],
      image: '',
      gallery_images: [],
      github: '',
      sort_order: 4,
    },
  ],
};

const CARD_COLORS = ['bg-brut-yellow', 'bg-brut-cyan', 'bg-brut-pink', 'bg-brut-lime'];

const cardVariants: Variants = {
  hidden: { y: 25, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

interface ProjectCardProps {
  project: Project;
  index: number;
  comingSoonText: string;
  codeText: string;
  demoText: string;
  detailText: string;
  onOpenDetail: (project: Project) => void;
}

// Extracted outside parent to prevent recreation on every render
const ProjectCard = memo(
  ({
    project,
    index,
    comingSoonText,
    codeText,
    demoText,
    detailText,
    onOpenDetail,
  }: ProjectCardProps) => {
    const tagsList = Array.isArray(project.tags)
      ? project.tags
      : typeof project.tags === 'string'
      ? (project.tags as string).split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const hasImages =
      (project.image && (project.image.includes('/') || project.image.includes('.'))) ||
      (project.gallery_images && project.gallery_images.length > 0);

    const thumbnailImage =
      project.image || (project.gallery_images && project.gallery_images[0]) || '';

    const photoCount = (project.gallery_images && project.gallery_images.length > 0)
      ? project.gallery_images.length
      : project.image ? 1 : 0;

    return (
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -6, rotate: index % 2 === 0 ? 1 : -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        className={`flex h-full flex-col border-4 border-black p-5 shadow-brut-lg transition-all duration-150 hover:shadow-brut-xl ${
          CARD_COLORS[index % CARD_COLORS.length]
        }`}
      >
        {/* Thumbnail Frame */}
        <div
          onClick={() => onOpenDetail(project)}
          className="relative mb-5 flex aspect-video w-full items-center justify-center overflow-hidden border-4 border-black bg-brut-paper cursor-pointer group"
          title="Klik untuk melihat detail projek"
        >
          {thumbnailImage ? (
            <>
              <Image
                src={thumbnailImage}
                alt={`${project.title} screenshot`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Photo Count Badge */}
              {photoCount > 1 && (
                <div className="absolute top-2 right-2 border-2 border-black bg-brut-yellow px-2 py-0.5 font-mono text-[10px] font-bold text-black shadow-brut-xs flex items-center gap-1">
                  <FaImages /> {photoCount} Foto
                </div>
              )}
              {/* Hover overlay prompt */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="border-2 border-black bg-white text-black px-3 py-1 font-display text-xs font-bold shadow-brut-xs flex items-center gap-1.5">
                  <FaInfoCircle /> {detailText}
                </span>
              </div>
            </>
          ) : (
            <div
              className="flex h-full w-full flex-col items-center justify-center text-center p-4"
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
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display text-xl text-black leading-tight">{project.title}</h3>
          </div>
          <p className="mb-5 line-clamp-3 text-xs leading-relaxed font-semibold text-black">
            {project.description}
          </p>

          {/* Tags */}
          {tagsList.length > 0 && (
            <div className="mb-6 flex flex-wrap justify-start gap-1.5">
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

          {/* Action Buttons */}
          <div className="mt-auto flex flex-col gap-2">
            {/* Primary Detail Button */}
            <button
              type="button"
              onClick={() => onOpenDetail(project)}
              className="flex w-full items-center justify-center gap-1.5 border-4 border-black bg-white px-3 py-2 font-display text-[11px] font-bold tracking-wider text-black shadow-brut-xs transition-all duration-150 hover:bg-brut-yellow hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut-sm active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <FaInfoCircle className="text-sm" /> {detailText}
            </button>

            {/* Links Bar */}
            <div className="flex w-full gap-2">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.title} source code on GitHub`}
                  className="flex flex-1 items-center justify-center gap-1.5 border-2 border-black bg-brut-paper px-2.5 py-1.5 font-display text-[10px] tracking-widest text-black shadow-brut-xs transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut-sm active:translate-x-0.5 active:translate-y-0.5"
                >
                  <FaGithub size={13} /> {codeText}
                </a>
              )}
              {project.demo && project.demo !== '#' && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.title} live demo`}
                  className="flex flex-1 items-center justify-center gap-1.5 border-2 border-black bg-black px-2.5 py-1.5 font-display text-[10px] tracking-widest text-brut-paper shadow-brut-xs transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut-sm active:translate-x-0.5 active:translate-y-0.5"
                >
                  <FaExternalLinkAlt size={11} /> {demoText}
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

ProjectCard.displayName = 'ProjectCard';

const Projects = () => {
  const { language, t } = useLanguage();
  const [supabaseProjects, setSupabaseProjects] = useState<Project[] | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0 && isMounted) {
          const mapped: Project[] = data.map((p) => {
            const gallery = Array.isArray(p.gallery_images)
              ? p.gallery_images
              : typeof p.gallery_images === 'string'
              ? (p.gallery_images as string).split(',').map((s: string) => s.trim()).filter(Boolean)
              : [];

            const primaryImage = p.image_url || (gallery.length > 0 ? gallery[0] : '');

            return {
              id: p.id,
              title: p.title || 'Untitled Project',
              description: p.description || '',
              detail_description: p.detail_description || '',
              image: primaryImage,
              gallery_images: gallery.length > 0 ? gallery : (primaryImage ? [primaryImage] : []),
              github: p.github_url || '',
              demo: p.demo_url || '',
              tags: Array.isArray(p.tags)
                ? p.tags
                : typeof p.tags === 'string'
                ? (p.tags as string).split(',').map((s: string) => s.trim()).filter(Boolean)
                : [],
              sort_order: p.sort_order ?? 0,
              is_visible: p.is_visible !== false,
              created_at: p.created_at || '',
            };
          });
          setSupabaseProjects(mapped);
        }
      } catch (err) {
        console.warn('Fallback to local projects data:', err);
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const currentList = useMemo<Project[]>(() => {
    if (supabaseProjects && supabaseProjects.length > 0) {
      return supabaseProjects;
    }
    return DEFAULT_PROJECTS_DATA[language] || DEFAULT_PROJECTS_DATA.en;
  }, [supabaseProjects, language]);

  const uniqueProjectsList = useMemo(() => {
    return Array.from(
      new Map(
        currentList
          .filter((p) => p && p.title && p.is_visible !== false)
          .map((p) => [p.title.toLowerCase().trim(), p])
      ).values()
    );
  }, [currentList]);

  // Handle ESC key and scrolling for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject]);

  const handleOpenDetail = (proj: Project) => {
    setSelectedProject(proj);
    setActivePhotoIndex(0);
  };

  // Compile all photos for active modal
  const modalPhotos = useMemo(() => {
    if (!selectedProject) return [];
    const list: string[] = [];
    if (selectedProject.gallery_images && selectedProject.gallery_images.length > 0) {
      selectedProject.gallery_images.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    if (selectedProject.image && !list.includes(selectedProject.image)) {
      list.unshift(selectedProject.image);
    }
    return list.filter((img) => img && (img.includes('/') || img.includes('.')));
  }, [selectedProject]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <section id="projects" className="flex min-h-screen items-center justify-center py-24">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.4 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 font-display text-4xl text-black md:text-6xl">
            {t.projects?.title || 'Latest'}{' '}
            <span className="inline-block -rotate-1 border-4 border-black bg-brut-pink px-3 shadow-brut-sm">
              {t.projects?.highlight || 'Missions'}
            </span>
          </h2>
          <span className="inline-block border-4 border-black bg-black px-4 py-1.5 font-display text-[11px] tracking-[0.3em] text-brut-lime">
            {t.projects?.subtitle || 'Selected Work'}
          </span>
        </motion.div>

        {/* Project Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
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
                comingSoonText={t.projects?.comingSoon || 'Coming Soon'}
                codeText={t.projects?.codeBtn || 'Code'}
                demoText={t.projects?.demoBtn || 'Demo'}
                detailText={t.projects?.detailBtn || 'Detail'}
                onOpenDetail={handleOpenDetail}
              />
            </div>
          ))}
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ delay: 0.2 }}
          className="mt-20 flex flex-col items-center gap-6 text-center"
        >
          <span className="border-4 border-black bg-brut-yellow px-4 py-2 font-display text-[11px] tracking-[0.25em] text-black shadow-brut-sm">
            {t.projects?.moreProjects || 'More Projects Coming Soon'}
          </span>

          <a
            href="https://github.com/HMPoetra?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="brut-btn bg-brut-cyan text-xs"
          >
            {t.projects?.exploreGithub || 'Explore All Repositories'}
            <FaGithub className="text-lg" />
          </a>
        </motion.div>
      </div>

      {/* POP-UP DETAIL MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 md:p-6 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-black bg-brut-paper shadow-brut-xl z-10 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b-4 border-black bg-brut-yellow p-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="border-2 border-black bg-black p-2 text-brut-yellow shadow-brut-xs">
                    <FaLayerGroup className="text-xl" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] font-bold uppercase tracking-widest bg-black text-brut-yellow px-2 py-0.5">
                      {t.projects?.modalTitle || 'PROJECT SPECIFICATION'}
                    </span>
                    <h3 className="font-display text-lg md:text-2xl text-black uppercase leading-tight mt-0.5">
                      {selectedProject.title}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="border-4 border-black bg-brut-red p-2 text-white shadow-brut-xs hover:bg-brut-yellow hover:text-black transition-colors cursor-pointer"
                  aria-label="Tutup Popup Detail"
                  title="Tutup Modal"
                >
                  <FaTimes className="text-base" />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {/* 1. Gallery Section */}
                {modalPhotos.length > 0 ? (
                  <div className="space-y-3">
                    {/* Main Image Display */}
                    <div className="relative aspect-video w-full overflow-hidden border-4 border-black bg-neutral-900 shadow-brut-sm flex items-center justify-center">
                      <Image
                        src={modalPhotos[activePhotoIndex] || modalPhotos[0]}
                        alt={`${selectedProject.title} preview ${activePhotoIndex + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 850px"
                      />

                      {/* Previous / Next Chevron Navigation */}
                      {modalPhotos.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setActivePhotoIndex((prev) =>
                                prev === 0 ? modalPhotos.length - 1 : prev - 1
                              )
                            }
                            className="absolute left-2 top-1/2 -translate-y-1/2 border-2 border-black bg-brut-yellow p-2 text-black shadow-brut-xs hover:bg-white transition-colors cursor-pointer"
                            title="Foto Sebelumnya"
                          >
                            <FaChevronLeft />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setActivePhotoIndex((prev) =>
                                prev === modalPhotos.length - 1 ? 0 : prev + 1
                              )
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 border-2 border-black bg-brut-yellow p-2 text-black shadow-brut-xs hover:bg-white transition-colors cursor-pointer"
                            title="Foto Berikutnya"
                          >
                            <FaChevronRight />
                          </button>

                          {/* Indicator Count */}
                          <div className="absolute bottom-2 right-2 border-2 border-black bg-black/90 text-white font-mono text-[10px] font-bold px-2 py-0.5">
                            {activePhotoIndex + 1} / {modalPhotos.length}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Thumbnails Row (if > 1 photo) */}
                    {modalPhotos.length > 1 && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {modalPhotos.map((photoUrl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActivePhotoIndex(idx)}
                            className={`relative h-16 w-24 shrink-0 border-2 overflow-hidden cursor-pointer transition-all ${
                              activePhotoIndex === idx
                                ? 'border-black ring-4 ring-brut-yellow scale-105 shadow-brut-xs'
                                : 'border-neutral-400 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <Image
                              src={photoUrl}
                              alt={`Thumbnail ${idx + 1}`}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}

                {/* 2. Short Description */}
                <div className="border-4 border-black bg-white p-4 shadow-brut-xs">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="border border-black bg-brut-cyan px-2 py-0.5 font-display text-[10px] font-bold text-black uppercase">
                      {t.projects?.shortDesc || 'Short Overview'}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-neutral-900 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* 3. Detailed Project Description */}
                <div className="border-4 border-black bg-brut-bg p-4 md:p-5 shadow-brut-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="border border-black bg-brut-pink px-2 py-0.5 font-display text-[10px] font-bold text-black uppercase">
                      {t.projects?.fullDesc || 'Detailed Specification'}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-neutral-800 leading-relaxed whitespace-pre-line">
                    {selectedProject.detail_description ||
                      selectedProject.description ||
                      'Detail lengkap proyek akan segera diperbarui.'}
                  </p>
                </div>

                {/* 4. Tags / Tech Stack */}
                {selectedProject.tags && selectedProject.tags.length > 0 && (
                  <div>
                    <h4 className="font-display text-xs text-black uppercase font-bold mb-2 flex items-center gap-1.5">
                      <FaCode /> {t.projects?.techStack || 'Technologies & Tags'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="border-2 border-black bg-black px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider text-white uppercase shadow-brut-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer / Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t-4 border-black bg-brut-paper p-4 shrink-0">
                <div className="flex flex-wrap gap-2">
                  {selectedProject.github && (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="brut-btn bg-brut-lime text-black text-xs py-2 px-3 flex items-center gap-1.5 font-bold"
                    >
                      <FaGithub /> GitHub Repo
                    </a>
                  )}
                  {selectedProject.demo && selectedProject.demo !== '#' && (
                    <a
                      href={selectedProject.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="brut-btn bg-brut-cyan text-black text-xs py-2 px-3 flex items-center gap-1.5 font-bold"
                    >
                      <FaExternalLinkAlt /> Live Demo
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="brut-btn bg-brut-red text-white text-xs py-2 px-4 font-bold cursor-pointer"
                >
                  <FaTimes /> {t.projects?.closeModal || 'Tutup'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;

