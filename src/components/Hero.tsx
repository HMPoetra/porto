'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  FaCode,
  FaGamepad,
  FaTimes,
  FaCoffee,
  FaDownload,
  FaFilePdf,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import DecryptedText from './DecryptedText';
import StrokeText from './StrokeText';

const Hero = () => {
  const { language, t } = useLanguage();
  const [isGamingPopupOpen, setIsGamingPopupOpen] = useState(false);
  const [isSawerOpen, setIsSawerOpen] = useState(false);
  const [isCvPreviewOpen, setIsCvPreviewOpen] = useState(false);
  const [activeCvUrl, setActiveCvUrl] = useState<string>('/cv/HMPoetra_CV.pdf');
  const [activeCvFileName, setActiveCvFileName] = useState<string>('HMPoetra_CV.pdf');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadCV = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const res = await fetch(activeCvUrl);
      if (!res.ok) throw new Error('Fetch file failed');
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = activeCvFileName || 'CV_Hapsoro_Mahendra_Poetra.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn('Direct blob download fallback:', err);
      const link = document.createElement('a');
      link.href = activeCvUrl;
      link.target = '_blank';
      link.download = activeCvFileName || 'CV_Hapsoro_Mahendra_Poetra.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase
        .from('curriculum_vitae')
        .select('file_url, file_name')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .then(({ data }) => {
          if (data && data[0] && data[0].file_url) {
            setActiveCvUrl(data[0].file_url);
            if (data[0].file_name) setActiveCvFileName(data[0].file_name);
          }
        });
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCvPreviewOpen(false);
        setIsGamingPopupOpen(false);
        setIsSawerOpen(false);
      }
    };
    if (isCvPreviewOpen || isGamingPopupOpen || isSawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCvPreviewOpen, isGamingPopupOpen, isSawerOpen]);

  const scrollToProjects = () => {
    const projectSection = document.getElementById('projects');
    if (projectSection) projectSection.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const skills = [
    { icon: <FaCode />, label: t.hero.webDevSkill, bg: 'bg-brut-cyan' },
    { icon: <FaGamepad />, label: t.hero.gamerSkill, bg: 'bg-brut-pink' },
  ];

  const favoriteGames = [
    {
      name: 'Valorant',
      rank: 'Bronze 3',
      rankImage: null,
      logo: '/game/valorant.png',
      bg: 'bg-brut-red',
    },
    {
      name: 'FiveM',
      rank: null,
      rankImage: '/game/kitarp.png',
      logo: '/game/fivem.png',
      bg: 'bg-brut-orange',
    },
    {
      name: 'Heartopia',
      rank: 'DG Master 19',
      rankImage: null,
      logo: '/game/heartopia.png',
      bg: 'bg-brut-pink',
    },
  ];

  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-16"
    >
      <div className="relative z-10 container mx-auto flex max-w-6xl flex-col items-center px-4 md:px-6">
        {/* PROFILE FRAME */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid w-full items-center gap-8 border-4 border-black bg-brut-paper p-6 shadow-brut-xl md:grid-cols-12 md:gap-10 md:p-10"
        >
          {/* --- LEFT SIDE: CONTENT --- */}
          <div className="space-y-6 md:col-span-7">
            <motion.div variants={itemVariants}>
              <div className="mb-3 text-4xl md:text-6xl">
                <StrokeText
                  text={t.hero.whoAmI}
                  badgeText={t.hero.whoAmIBadge}
                />
              </div>
              <h1 className="font-display text-lg sm:text-2xl md:text-[26px] lg:text-[32px] xl:text-[36px] leading-tight whitespace-nowrap text-black tracking-tight">
                Hapsoro Mahendra Poetra
              </h1>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="w-full max-w-lg border-4 border-black bg-black p-3 shadow-brut-sm group/code"
            >
              <p className="scrollbar-hide overflow-x-auto font-mono text-[11px] font-bold whitespace-nowrap text-brut-lime md:text-xs flex items-center">
                <span className="mr-2 text-brut-pink select-none animate-pulse">{`>`}</span>
                <DecryptedText
                  text={t.hero.codeLine}
                  speed={30}
                  className="text-brut-lime"
                  encryptedClassName="text-brut-pink font-bold"
                  animateOnHover={true}
                  animateOnView={true}
                />
                <span className="ml-1 inline-block h-3.5 w-2 bg-brut-lime animate-pulse select-none" />
              </p>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="max-w-xl text-sm leading-relaxed font-medium text-black md:text-base"
            >
              {t.hero.bio}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="inline-block border-4 border-black bg-brut-lime p-3 shadow-brut-sm"
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="block h-3 w-3 border-2 border-black bg-black" />
                <span className="font-display text-[11px] tracking-widest text-black">
                  {t.hero.statusLabel}
                </span>
              </div>
              <p className="text-[11px] leading-tight font-bold text-black">
                {t.hero.statusText}
              </p>
            </motion.div>

            <div className="space-y-6">
              <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
                {skills.map((skill, i) => (
                  <div
                    key={i}
                    className={`flex cursor-default items-center gap-3 border-4 border-black px-4 py-2.5 shadow-brut-sm transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut ${skill.bg}`}
                  >
                    <span className="text-xl text-black">{skill.icon}</span>
                    <span className="font-display text-[11px] tracking-widest text-black">
                      {skill.label}
                    </span>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-3 pt-1">
                <button
                  onClick={scrollToProjects}
                  className="brut-btn bg-brut-pink text-[11px]"
                >
                  {t.hero.viewProjects}
                </button>

                <button
                  onClick={() => setIsGamingPopupOpen(true)}
                  className="brut-btn bg-brut-cyan text-[11px]"
                >
                  <FaGamepad /> {t.hero.gamingStats}
                </button>

                <button
                  onClick={() => setIsSawerOpen(true)}
                  className="brut-btn bg-brut-yellow text-[11px]"
                >
                  <FaCoffee /> {t.hero.sawer}
                </button>
              </motion.div>
            </div>
          </div>

          {/* --- RIGHT SIDE: IMAGE --- */}
          <motion.div
            variants={itemVariants}
            className="relative mt-4 flex items-center justify-center md:col-span-5 md:mt-0"
          >
            {/* Brutalist offset block behind photo */}
            <div className="absolute h-64 w-64 translate-x-4 translate-y-4 border-4 border-black bg-brut-yellow md:h-80 md:w-80" />
            <motion.div
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.2}
              whileDrag={{ rotate: 4, cursor: 'grabbing' }}
              className="relative z-20 h-64 w-64 cursor-grab overflow-hidden border-4 border-black bg-brut-paper md:h-80 md:w-80"
            >
              <Image
                src="/profile.jpg"
                alt="Hapsoro Mahendra Poetra — Web Developer"
                fill
                className="pointer-events-none object-cover"
                priority
                sizes="(max-width: 768px) 256px, 320px"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* CV ACTION BUTTON BAR BELOW CARD */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 z-20 flex items-center justify-center"
        >
          {/* PREVIEW CV BUTTON */}
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsCvPreviewOpen(true)}
            className="brut-btn bg-brut-lime text-black font-display text-xs md:text-sm tracking-wider shadow-brut hover:bg-brut-yellow flex items-center gap-2.5 border-4 border-black px-6 py-3 cursor-pointer"
            aria-label="Curriculum Vitae (CV)"
            title="Buka Dokumen Curriculum Vitae (CV)"
          >
            <FaFilePdf className="text-lg text-brut-red" />
            <span className="font-black uppercase tracking-wider">
              CURRICULUM VITAE (CV)
            </span>
            <span className="border border-black bg-black text-white px-2 py-0.5 font-mono text-[9px]">
              PDF
            </span>
          </motion.button>
        </motion.div>

        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="z-20 mt-12 flex justify-center"
        >
          <div className="rotate-[-1deg] border-4 border-black bg-brut-violet px-6 py-3 shadow-brut">
            <p className="text-center font-display text-[11px] tracking-widest text-black md:text-sm">
              &ldquo;{t.hero.quotePrefix}{' '}
              <span className="bg-black px-1 text-brut-yellow">{t.hero.quoteWord1}</span>
              {t.hero.quoteMid}{' '}
              <span className="bg-black px-1 text-brut-yellow">{t.hero.quoteWord2}</span>&rdquo;
            </p>
          </div>
        </motion.div>
      </div>

      {/* GAMING POPUP MODAL */}
      <AnimatePresence>
        {isGamingPopupOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGamingPopupOpen(false)}
              className="absolute inset-0 bg-black/70"
            />
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              className="relative w-full max-w-md border-4 border-black bg-brut-paper p-6 shadow-brut-xl md:p-8"
            >
              <button
                onClick={() => setIsGamingPopupOpen(false)}
                className="absolute -top-4 -right-4 border-4 border-black bg-brut-red p-2 text-black shadow-brut-xs transition-all duration-150 hover:bg-brut-yellow active:translate-x-1 active:translate-y-1 active:shadow-none"
                aria-label={t.hero.close}
              >
                <FaTimes />
              </button>

              <div className="mb-6 border-b-4 border-black pb-4 text-center">
                <h3 className="font-display text-3xl tracking-tighter text-black">
                  {t.hero.systemStatsTitle.split(' ')[0]}{' '}
                  <span className="inline-block border-4 border-black bg-brut-cyan px-2">
                    {t.hero.systemStatsTitle.split(' ').slice(1).join(' ') || 'STATS'}
                  </span>
                </h3>
              </div>

              <div className="space-y-3">
                {favoriteGames.map((game, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.08 }}
                    className={`flex items-center justify-between border-4 border-black p-3 shadow-brut-xs transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut-sm ${game.bg}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center border-4 border-black bg-brut-paper p-1">
                        <img
                          src={game.logo}
                          alt={`${game.name} logo`}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <span className="font-display text-xs tracking-widest text-black">
                        {game.name}
                      </span>
                    </div>

                    <div className="flex items-center">
                      {game.rankImage ? (
                        <div className="h-8 w-auto border-4 border-black bg-brut-paper px-2 py-0.5">
                          <img src={game.rankImage} alt={`${game.name} rank`} className="h-full w-full object-contain" />
                        </div>
                      ) : (
                        <span className="border-4 border-black bg-brut-paper px-2 py-0.5 font-mono text-[10px] font-black text-black">
                          {game.rank}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 flex justify-center border-t-4 border-black pt-4">
                <span className="border-4 border-black bg-brut-lime px-3 py-1 font-display text-[10px] tracking-widest text-black">
                  {t.hero.systemOnline}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SAWER/DONATION POPUP MODAL */}
      <AnimatePresence>
        {isSawerOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSawerOpen(false)}
              className="absolute inset-0 bg-black/70"
            />
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm border-4 border-black bg-brut-paper p-6 shadow-brut-xl md:p-8"
            >
              <button
                onClick={() => setIsSawerOpen(false)}
                className="absolute -top-4 -right-4 border-4 border-black bg-brut-red p-2 text-black shadow-brut-xs transition-all duration-150 hover:bg-brut-yellow active:translate-x-1 active:translate-y-1 active:shadow-none"
                aria-label={t.hero.close}
              >
                <FaTimes />
              </button>

              <div className="mb-5 border-b-4 border-black pb-4 text-center">
                <h3 className="font-display text-3xl tracking-tighter text-black">
                  {t.hero.supportTitle.split(' ')[0]}{' '}
                  <span className="inline-block border-4 border-black bg-brut-yellow px-2">
                    {t.hero.supportTitle.split(' ').slice(1).join(' ') || 'ME'}
                  </span>
                </h3>
                <p className="mt-2 text-[11px] font-bold tracking-widest text-black uppercase">
                  {t.hero.supportSubtitle}
                </p>
              </div>

              {/* QRIS Image */}
              <div className="border-4 border-black bg-brut-paper p-3 shadow-brut-sm">
                <img
                  src="/qris.png"
                  alt="QRIS Donation Code"
                  className="h-auto w-full"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/qr.png';
                  }}
                />
              </div>

              <div className="mt-5 space-y-3">
                <div className="border-4 border-black bg-brut-cyan px-3 py-2 text-center">
                  <p className="text-[11px] font-bold text-black">
                    {t.hero.supportInstruction}
                  </p>
                </div>
                <div className="flex justify-center">
                  <span className="border-4 border-black bg-brut-yellow px-3 py-1 font-display text-[10px] tracking-widest text-black">
                    {t.hero.waitingTransaction}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CV PREVIEW MODAL */}
      <AnimatePresence>
        {isCvPreviewOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 md:p-6 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCvPreviewOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-5xl max-h-[90vh] flex flex-col border-4 border-black bg-brut-paper shadow-brut-xl z-10"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-black bg-brut-yellow p-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="border-2 border-black bg-black p-2 text-brut-yellow shadow-brut-xs">
                    <FaFilePdf className="text-xl text-brut-red" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-base md:text-lg text-black uppercase leading-tight">
                        CURRICULUM VITAE PREVIEW
                      </h3>
                      <span className="border border-black bg-brut-lime px-2 py-0.5 font-mono text-[9px] font-bold text-black uppercase">
                        ACTIVE CV
                      </span>
                    </div>
                    <p className="font-mono text-xs text-neutral-800 font-bold truncate max-w-xs md:max-w-md">
                      {activeCvFileName}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadCV}
                    disabled={isDownloading}
                    className="brut-btn bg-brut-lime text-black text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold cursor-pointer"
                    title="Download file CV ke perangkat"
                  >
                    <FaDownload className={isDownloading ? 'animate-bounce text-brut-red' : ''} />
                    <span className="hidden sm:inline">
                      {isDownloading ? 'Downloading...' : 'Download'}
                    </span>
                  </button>

                  <a
                    href={activeCvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brut-btn bg-brut-cyan text-black text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
                    title="Buka dokumen di tab baru browser"
                  >
                    <FaExternalLinkAlt /> <span className="hidden sm:inline">Tab Baru</span>
                  </a>

                  <button
                    onClick={() => setIsCvPreviewOpen(false)}
                    className="border-4 border-black bg-brut-red p-2 text-black shadow-brut-xs hover:bg-brut-yellow active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ml-1"
                    aria-label="Tutup Preview CV"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* PDF Preview Content Body */}
              <div className="flex-1 min-h-[500px] md:min-h-[620px] bg-neutral-900 relative overflow-hidden flex flex-col">
                <object
                  data={`${activeCvUrl}#toolbar=1&navpanes=0`}
                  type="application/pdf"
                  className="w-full h-full min-h-[500px] md:min-h-[620px] border-0 flex-1"
                >
                  <iframe
                    src={`${activeCvUrl}#toolbar=1&navpanes=0`}
                    className="w-full h-full min-h-[500px] md:min-h-[620px] border-0 flex-1"
                    title="Curriculum Vitae Document Preview"
                  >
                    <div className="flex flex-col items-center justify-center p-8 text-center text-white h-full gap-4">
                      <FaFilePdf className="text-5xl text-brut-red" />
                      <p className="font-bold text-sm text-neutral-300">
                        Browser tidak dapat menampilkan preview PDF langsung di dalam frame.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={handleDownloadCV}
                          className="brut-btn bg-brut-lime text-black font-bold py-2 px-4 text-xs"
                        >
                          Unduh Berkas CV
                        </button>
                        <a
                          href={activeCvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="brut-btn bg-brut-cyan text-black font-bold py-2 px-4 text-xs"
                        >
                          Buka di Tab Baru
                        </a>
                      </div>
                    </div>
                  </iframe>
                </object>
              </div>

              {/* Footer Note */}
              <div className="flex items-center justify-between border-t-4 border-black bg-brut-bg px-4 py-2 text-[10px] font-bold font-mono text-neutral-700 shrink-0">
                <span>💡 Tip: Gunakan tombol Download jika ingin menyimpan salinan offline.</span>
                <span className="hidden sm:inline">HMPoetra • Verified Curriculum Vitae</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
