'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaPaperPlane,
  FaChevronUp,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('contact_messages').insert([
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          },
        ]);
        if (error) throw error;
      }
      // Only show success if no error was thrown
      const customSuccess = t.contact.successMsg.replace('{name}', formData.name);
      setSuccessMsg(customSuccess);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccessMsg(null), 7000);
    } catch (err: unknown) {
      console.error('Error sending message:', err);
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      setErrorMsg(`${t.contact.errorMsg} (${errMsg})`);
      setTimeout(() => setErrorMsg(null), 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const socialLinks = [
    { Icon: FaGithub, href: 'https://github.com/HMPoetra', label: 'GitHub', bg: 'bg-brut-yellow' },
    { Icon: FaLinkedin, href: 'https://www.linkedin.com/in/hapsoro-mahendra-poetra-086100235/', label: 'LinkedIn', bg: 'bg-brut-cyan' },
    { Icon: FaInstagram, href: 'https://www.instagram.com/hapsoro._/', label: 'Instagram', bg: 'bg-brut-pink' },
  ];

  const contactItems = [
    {
      icon: SiGmail,
      val: 'hapsoromahendrap@gmail.com',
      link: 'https://mail.google.com/mail/?view=cm&fs=1&to=hapsoromahendrap@gmail.com',
      bg: 'bg-brut-red',
    },
    { icon: FaMapMarkerAlt, val: 'Bandung, Indonesia', link: '#', bg: 'bg-brut-lime' },
  ];

  const inputs = [
    { name: 'name', placeholder: t.contact.namePlaceholder, type: 'text', col: 'col-span-2 md:col-span-1' },
    { name: 'email', placeholder: t.contact.emailPlaceholder, type: 'email', col: 'col-span-2 md:col-span-1' },
    { name: 'subject', placeholder: t.contact.subjectPlaceholder, type: 'text', col: 'col-span-2' },
  ] as const;

  return (
    <section
      id="contact"
      className="relative flex min-h-[90vh] flex-col items-center justify-center py-20"
    >
      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed right-6 bottom-6 z-[99] cursor-pointer border-4 border-black bg-brut-yellow p-3 text-black shadow-brut transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-brut-pink hover:shadow-brut-lg active:translate-x-1 active:translate-y-1 active:shadow-none"
            aria-label={t.contact.backToTop}
            title={t.contact.backToTop}
          >
            <FaChevronUp className="text-lg" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        className="container mx-auto max-w-5xl px-4 md:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-12 text-center">
          <h2 className="mb-4 font-display text-4xl text-black md:text-6xl">
            {t.contact.title}{' '}
            <span className="inline-block rotate-1 border-4 border-black bg-brut-lime px-3 shadow-brut-sm">
              {t.contact.highlight}
            </span>
          </h2>
          <span className="inline-block border-4 border-black bg-black px-4 py-1.5 font-display text-[11px] tracking-[0.3em] text-brut-cyan">
            {t.contact.subtitle}
          </span>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="border-4 border-black bg-brut-paper p-6 shadow-brut-xl md:p-10"
        >
          <div className="grid gap-10 md:grid-cols-5">
            {/* Contact Info */}
            <div className="space-y-8 md:col-span-2">
              <motion.div variants={itemVariants}>
                <h3 className="mb-4 inline-block border-4 border-black bg-brut-violet px-3 py-1.5 font-display text-xs tracking-widest text-black shadow-brut-xs">
                  {t.contact.contactInfo}
                </h3>
                <div className="space-y-3">
                  {contactItems.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={i}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 border-4 border-black bg-brut-paper p-2 shadow-brut-xs transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut-sm"
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black ${item.bg}`}
                        >
                          <Icon className="text-sm text-black" />
                        </span>
                        <span className="text-[11px] font-bold break-all text-black">
                          {item.val}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="mb-4 inline-block border-4 border-black bg-brut-orange px-3 py-1.5 font-display text-xs tracking-widest text-black shadow-brut-xs">
                  {t.contact.socials}
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social, i) => {
                    const Icon = social.Icon;
                    return (
                      <a
                        key={i}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className={`border-4 border-black p-2.5 text-black shadow-brut-xs transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut-sm active:translate-x-1 active:translate-y-1 active:shadow-none ${social.bg}`}
                      >
                        <Icon className="text-lg" />
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div className="md:col-span-3" variants={itemVariants}>
              {/* Success Alert */}
              <AnimatePresence>
                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-4 border-4 border-black bg-brut-lime p-3 text-xs font-bold text-black flex items-center gap-3 shadow-brut-sm"
                  >
                    <div className="bg-black text-brut-lime p-1.5 border-2 border-black shrink-0">
                      <FaCheckCircle className="text-base text-brut-lime" />
                    </div>
                    <span className="font-display text-xs uppercase tracking-tight">{successMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Alert */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-4 border-4 border-black bg-brut-red p-3 text-xs font-bold text-black flex items-start gap-3 shadow-brut-sm"
                  >
                    <div className="bg-black p-1.5 border-2 border-black shrink-0">
                      <FaExclamationTriangle className="text-base text-brut-red" />
                    </div>
                    <div>
                      <span className="block font-display text-xs uppercase tracking-tight text-black mb-1">
                        Failed to Send
                      </span>
                      <span className="text-[10px] font-semibold text-black">{errorMsg}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                {inputs.map((input, i) => (
                  <div key={i} className={input.col}>
                    <input
                      type={input.type}
                      name={input.name}
                      placeholder={input.placeholder}
                      value={formData[input.name as keyof typeof formData]}
                      onChange={handleChange}
                      required
                      className="brut-input"
                    />
                  </div>
                ))}

                <div className="col-span-2">
                  <textarea
                    name="message"
                    placeholder={t.contact.messagePlaceholder}
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="brut-input resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="brut-btn col-span-2 bg-brut-pink text-[11px]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t.contact.transmittingBtn}
                    </span>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>{t.contact.transmitBtn}</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Contact;
