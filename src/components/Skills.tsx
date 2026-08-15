"use client";

import { useEffect, useState, memo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  FaJs, FaNodeJs, FaPython, FaGitAlt, FaDatabase,
  FaHtml5, FaCss3Alt, FaLaravel, FaBootstrap, FaReact, FaPhp,
  FaWindows, FaCode
} from 'react-icons/fa';
import {
  SiTypescript, SiTailwindcss, SiNextdotjs,
  SiFlutter, SiDart, SiMysql
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import { DiVisualstudio } from 'react-icons/di';
import { TbBrandCSharp } from 'react-icons/tb';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

export interface Skill {
  id?: string;
  name: string;
  icon_name: string;
  color: string;
  category: 'Frontend Engine' | 'Backend Core' | 'Utilities & Tools';
  sort_order?: number;
}

const ICON_REGISTRY: Record<string, React.ElementType> = {
  FaReact, FaJs, FaNodeJs, FaPython, FaGitAlt, FaDatabase,
  FaHtml5, FaCss3Alt, FaLaravel, FaBootstrap, FaPhp, FaWindows,
  SiTypescript, SiTailwindcss, SiNextdotjs, SiFlutter, SiDart, SiMysql,
  VscVscode, DiVisualstudio, TbBrandCSharp, FaCode
};

const DEFAULT_SKILLS: Skill[] = [
  { name: 'React.js', icon_name: 'FaReact', color: '#61DAFB', category: 'Frontend Engine' },
  { name: 'Next.js', icon_name: 'SiNextdotjs', color: '#000000', category: 'Frontend Engine' },
  { name: 'TypeScript', icon_name: 'SiTypescript', color: '#3178C6', category: 'Frontend Engine' },
  { name: 'JavaScript', icon_name: 'FaJs', color: '#F7DF1E', category: 'Frontend Engine' },
  { name: 'HTML5', icon_name: 'FaHtml5', color: '#E34F26', category: 'Frontend Engine' },
  { name: 'CSS3', icon_name: 'FaCss3Alt', color: '#1572B6', category: 'Frontend Engine' },
  { name: 'Tailwind', icon_name: 'SiTailwindcss', color: '#06B6D4', category: 'Frontend Engine' },
  { name: 'Bootstrap', icon_name: 'FaBootstrap', color: '#7952B3', category: 'Frontend Engine' },
  { name: 'Flutter Web', icon_name: 'SiFlutter', color: '#02569B', category: 'Frontend Engine' },
  { name: 'Dart', icon_name: 'SiDart', color: '#0175C2', category: 'Frontend Engine' },

  { name: 'PHP', icon_name: 'FaPhp', color: '#777BB4', category: 'Backend Core' },
  { name: 'Laravel', icon_name: 'FaLaravel', color: '#FF2D20', category: 'Backend Core' },
  { name: 'Node.js', icon_name: 'FaNodeJs', color: '#5FA04E', category: 'Backend Core' },
  { name: 'Python', icon_name: 'FaPython', color: '#3776AB', category: 'Backend Core' },
  { name: 'C#', icon_name: 'TbBrandCSharp', color: '#239120', category: 'Backend Core' },
  { name: 'MySQL', icon_name: 'SiMysql', color: '#4479A1', category: 'Backend Core' },

  { name: 'Git', icon_name: 'FaGitAlt', color: '#F05138', category: 'Utilities & Tools' },
  { name: 'VSC', icon_name: 'VscVscode', color: '#007ACC', category: 'Utilities & Tools' },
  { name: 'Visual Studio', icon_name: 'DiVisualstudio', color: '#5C2D91', category: 'Utilities & Tools' },
  { name: 'Windows', icon_name: 'FaWindows', color: '#0078D6', category: 'Utilities & Tools' },
  { name: 'Database', icon_name: 'FaDatabase', color: '#6366F1', category: 'Utilities & Tools' },
];

const CARD_COLORS = [
  'bg-brut-yellow',
  'bg-brut-cyan',
  'bg-brut-pink',
  'bg-brut-lime',
  'bg-brut-orange',
  'bg-brut-violet',
  'bg-brut-blue',
];

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  },
};

// Extracted and memoized outside parent component
const SkillCard = memo(({ skill, index }: { skill: Skill; index: number }) => {
  const Icon = ICON_REGISTRY[skill.icon_name] || FaCode;
  const accentClass = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, delay: (index % 8) * 0.03 }}
      whileHover={{ scale: 1.08, rotate: index % 2 === 0 ? 3 : -3 }}
      whileTap={{ scale: 0.9, rotate: -4 }}
      className="group relative flex aspect-square min-w-[92px] flex-col items-center justify-center gap-2.5 overflow-hidden border-4 border-black bg-brut-paper pt-4 pb-3 px-3 shadow-brut-sm transition-all duration-200 hover:shadow-brut cursor-pointer md:min-w-[112px]"
      aria-label={skill.name}
    >
      <div className={`absolute top-0 left-0 right-0 h-2.5 border-b-2 border-black ${accentClass}`} />
      <div className="flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
        <Icon className="text-3xl md:text-4xl" style={{ color: skill.color }} />
      </div>
      <span className="text-center font-display text-[10px] tracking-tight text-black md:text-[11px]">
        {skill.name}
      </span>
    </motion.div>
  );
});
SkillCard.displayName = 'SkillCard';

// Extracted and memoized outside parent component
const SkillGroup = memo(({
  title,
  labelBg,
  skills,
  offset = 0,
  maxWidth,
}: {
  title: string;
  labelBg: string;
  skills: Skill[];
  offset?: number;
  maxWidth?: string;
}) => (
  <div className="flex flex-col items-center">
    <h3
      className={`mb-6 border-4 border-black px-4 py-2 font-display text-xs tracking-widest text-black shadow-brut-sm ${labelBg}`}
    >
      {title}
    </h3>
    <div className={`flex w-full flex-wrap justify-center gap-4 ${maxWidth ?? ''}`}>
      {skills.map((skill, i) => (
        <SkillCard key={skill.id || skill.name} skill={skill} index={i + offset} />
      ))}
    </div>
  </div>
));
SkillGroup.displayName = 'SkillGroup';

const Skills = () => {
  const { t } = useLanguage();
  const [skillsList, setSkillsList] = useState<Skill[]>(DEFAULT_SKILLS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    const fetchSkills = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setSkillsList(data as Skill[]);
        }
      } catch (err) {
        console.warn('Fallback to local skills data:', err);
      }
    };

    fetchSkills();
  }, []);

  const uniqueSkillsList = Array.from(
    new Map(
      (skillsList && skillsList.length > 0 ? skillsList : DEFAULT_SKILLS)
        .filter((s) => s && s.name)
        .map((s) => [s.name.toLowerCase().trim(), s])
    ).values()
  );

  const frontendSkills = uniqueSkillsList.filter((s) => s.category === 'Frontend Engine');
  const backendSkills = uniqueSkillsList.filter((s) => s.category === 'Backend Core');
  const toolsSkills = uniqueSkillsList.filter((s) => s.category === 'Utilities & Tools');

  const filteredSkills = selectedCategory === 'ALL'
    ? uniqueSkillsList
    : uniqueSkillsList.filter((s) => s.category === selectedCategory);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const categories = [
    { label: t.skills.allSkills, value: 'ALL', bg: 'bg-brut-yellow' },
    { label: t.skills.frontend, value: 'Frontend Engine', bg: 'bg-brut-pink' },
    { label: t.skills.backend, value: 'Backend Core', bg: 'bg-brut-lime' },
    { label: t.skills.tools, value: 'Utilities & Tools', bg: 'bg-brut-cyan' },
  ];

  return (
    <section id="skills" className="flex min-h-screen items-center justify-center py-20">
      <motion.div
        className="container mx-auto max-w-6xl px-4 md:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-10 text-center">
          <h2 className="mb-4 font-display text-4xl text-black md:text-6xl">
            {t.skills.title}{' '}
            <span className="inline-block rotate-1 border-4 border-black bg-brut-cyan px-3 shadow-brut-sm">
              {t.skills.highlight}
            </span>
          </h2>
          <span className="inline-block border-4 border-black bg-black px-4 py-1.5 font-display text-[11px] tracking-[0.3em] text-brut-yellow">
            {t.skills.subtitle}
          </span>
        </motion.div>

        {/* Category Filter Buttons */}
        <motion.div variants={itemVariants} className="mb-14 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              aria-pressed={selectedCategory === cat.value}
              className={`border-4 border-black px-4 py-2 font-display text-[11px] tracking-wider text-black shadow-brut-xs transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                selectedCategory === cat.value ? `${cat.bg} shadow-brut` : 'bg-brut-paper'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Filtered Skills Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {selectedCategory === 'ALL' ? (
              <div className="flex flex-col gap-y-16">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                  <SkillGroup title={t.skills.frontend} labelBg="bg-brut-pink" skills={frontendSkills} />
                  <SkillGroup
                    title={t.skills.backend}
                    labelBg="bg-brut-lime"
                    skills={backendSkills}
                    offset={3}
                  />
                </div>

                <SkillGroup
                  title={t.skills.tools}
                  labelBg="bg-brut-yellow"
                  skills={toolsSkills}
                  offset={5}
                  maxWidth="max-w-2xl mx-auto"
                />
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-5 max-w-4xl mx-auto">
                {filteredSkills.map((skill, i) => (
                  <SkillCard key={skill.id || skill.name} skill={skill} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Skills;
