'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { FaAward, FaExternalLinkAlt, FaCheckCircle, FaGraduationCap } from 'react-icons/fa';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

export interface Certification {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  link: string;
  tags: string[];
  bg: string;
  sort_order?: number;
}

const DEFAULT_CERTIFICATIONS: Certification[] = [
  {
    title: 'Junior Web Developer',
    issuer: 'BNSP (Badan Nasional Sertifikasi Profesi)',
    date: '2024',
    credentialId: 'REG.JWD.2024.08821',
    link: '#',
    tags: ['BNSP', 'WebDev', 'FullStack'],
    bg: 'bg-brut-yellow',
  },
  {
    title: 'Database Systems & SQL Specialist',
    issuer: 'Oracle Academy / Digital Talent',
    date: '2023',
    credentialId: 'ORCL-DB-774012',
    link: '#',
    tags: ['Database', 'MySQL', 'SQL'],
    bg: 'bg-brut-cyan',
  },
  {
    title: 'Linux System Administration Basic',
    issuer: 'Adinusa Digital Academy',
    date: '2023',
    credentialId: 'AD-LNX-2023-4410',
    link: '#',
    tags: ['Linux', 'SysAdmin', 'CLI'],
    bg: 'bg-brut-pink',
  },
  {
    title: 'Frontend Web Development Certification',
    issuer: 'Dicoding Academy',
    date: '2023',
    credentialId: 'DCD-FWD-99120',
    link: '#',
    tags: ['React.js', 'JavaScript', 'Frontend'],
    bg: 'bg-brut-lime',
  },
];

const Certifications = () => {
  const { t } = useLanguage();
  const [certList, setCertList] = useState<Certification[]>(DEFAULT_CERTIFICATIONS);

  useEffect(() => {
    const fetchCertifications = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('certifications')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          const mapped: Certification[] = data.map((c) => ({
            id: c.id,
            title: c.title,
            issuer: c.issuer,
            date: c.date,
            credentialId: c.credential_id,
            link: c.link || '#',
            tags: c.tags || [],
            bg: c.bg_color || 'bg-brut-yellow',
            sort_order: c.sort_order,
          }));
          setCertList(mapped);
        }
      } catch (err) {
        console.warn('Fallback to local certifications data:', err);
      }
    };

    fetchCertifications();
  }, []);

  const uniqueCertList = Array.from(
    new Map(
      (certList && certList.length > 0 ? certList : DEFAULT_CERTIFICATIONS)
        .filter((c) => c && c.title)
        .map((c) => [c.title.toLowerCase().trim(), c])
    ).values()
  );

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  /** Check whether a link is a real verifiable URL */
  const isValidLink = (link: string) =>
    link && link !== '#' && link.startsWith('http');

  return (
    <section id="certifications" className="flex min-h-screen items-center justify-center py-20">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 font-display text-4xl text-black md:text-6xl">
            {t.certifications.title}{' '}
            <span className="inline-block rotate-1 border-4 border-black bg-brut-yellow px-3 shadow-brut-sm">
              {t.certifications.highlight}
            </span>
          </h2>
          <span className="inline-block border-4 border-black bg-black px-4 py-1.5 font-display text-[11px] tracking-[0.3em] text-brut-cyan">
            {t.certifications.subtitle}
          </span>
        </motion.div>

        {/* Certifications Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2"
        >
          {uniqueCertList.map((cert, index) => (
            <motion.div
              key={cert.id || index}
              variants={itemVariants}
              className={`flex flex-col justify-between border-4 border-black p-6 shadow-brut-lg transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brut-xl ${cert.bg}`}
            >
              <div>
                {/* Header Badge */}
                <div className="mb-4 flex items-center justify-between gap-2 border-b-4 border-black pb-3">
                  <div className="flex items-center gap-2">
                    <FaAward className="text-xl text-black" />
                    <span className="font-display text-xs tracking-wider text-black">
                      {cert.issuer}
                    </span>
                  </div>
                  <span className="border-2 border-black bg-black px-2.5 py-0.5 font-mono text-xs font-bold text-brut-paper">
                    {cert.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-3 font-display text-xl leading-tight text-black md:text-2xl">
                  {cert.title}
                </h3>

                {/* Credential ID */}
                <div className="mb-5 flex items-center gap-2 border-2 border-black bg-brut-paper px-3 py-1.5 shadow-brut-xs">
                  <FaCheckCircle className="shrink-0 text-xs text-green-600" />
                  <span className="font-mono text-[11px] font-bold text-black break-all">
                    ID: {cert.credentialId}
                  </span>
                </div>

                {/* Tags */}
                <div className="mb-6 flex flex-wrap gap-1.5">
                  {cert.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="border-2 border-black bg-black px-2 py-0.5 font-mono text-[9px] font-bold tracking-wide text-brut-paper uppercase"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verify Button — only shown when a real URL exists */}
              {isValidLink(cert.link) ? (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brut-btn bg-brut-paper text-[11px] hover:bg-black hover:text-brut-yellow"
                >
                  {t.certifications.verifyBtn}
                  <FaExternalLinkAlt className="text-xs" />
                </a>
              ) : (
                <div className="border-4 border-black bg-brut-paper px-4 py-2 text-center">
                  <span className="font-mono text-[10px] font-bold tracking-widest text-black uppercase opacity-60">
                    {t.certifications.linkComingSoon}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Education & Academic Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 border-4 border-black bg-brut-paper p-6 shadow-brut md:p-8"
        >
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center border-4 border-black bg-brut-violet shadow-brut-xs">
                <FaGraduationCap className="text-2xl text-black" />
              </div>
              <div>
                <h4 className="font-display text-lg text-black">{t.certifications.academicTitle}</h4>
                <p className="text-xs font-semibold text-black">
                  {t.certifications.academicDesc}
                </p>
              </div>
            </div>

            <span className="border-4 border-black bg-brut-lime px-4 py-2 font-display text-[11px] tracking-widest text-black shadow-brut-xs">
              {t.certifications.verifiedBadge}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Certifications;
