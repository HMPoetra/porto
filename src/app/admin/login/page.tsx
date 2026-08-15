'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUserShield,
} from 'react-icons/fa';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [dbConfigured, setDbConfigured] = useState(false);

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setDbConfigured(configured);

    // Jika Supabase terkonfigurasi, cek apakah sudah login sebelumnya
    if (configured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          router.replace('/admin');
        }
      });
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Harap masukkan Email dan Password.');
      return;
    }

    setLoading(true);

    try {
      if (!dbConfigured) {
        // Fallback untuk mode lokal / tanpa Supabase credentials
        if (email.trim() && password.length >= 4) {
          setSuccessMsg('Mode Lokal: Berhasil login simulasi admin!');
          // Simpan session dummy di cookie & localStorage untuk mode dev tanpa env
          document.cookie = 'local_admin_session=true; path=/; max-age=86400; SameSite=Lax';
          localStorage.setItem('local_admin_session', 'true');
          setTimeout(() => {
            router.push('/admin');
          }, 800);
        } else {
          setErrorMsg('Password minimal 4 karakter untuk mode lokal demo.');
        }
        setLoading(false);
        return;
      }

      // Supabase Authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setSuccessMsg('Login berhasil! Mengalihkan ke Dashboard Admin...');
        setTimeout(() => {
          router.push('/admin');
        }, 800);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      let message = err.message || 'Gagal login. Periksa kembali email dan password Anda.';
      if (err.message?.includes('Invalid login credentials')) {
        message = 'Email atau Password yang Anda masukkan tidak cocok.';
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-brut-bg flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Graphic Elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-brut-yellow border-4 border-black shadow-brut-xl rotate-12 pointer-events-none opacity-40 md:opacity-100" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-brut-cyan border-4 border-black shadow-brut-xl -rotate-12 pointer-events-none opacity-40 md:opacity-100" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md z-10"
      >
        {/* Main Box Login */}
        <div className="brut-box bg-brut-paper p-6 md:p-8 relative">
          {/* Tag Top Header */}
          <div className="mb-6 flex justify-between items-center border-b-4 border-black pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-brut-pink text-black p-2 border-2 border-black shadow-brut-xs">
                <FaUserShield className="text-xl" />
              </span>
              <div>
                <h1 className="font-display text-xl leading-tight">ADMIN LOGIN</h1>
                <p className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
                  Restricted Area
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="brut-tag bg-brut-lime hover:bg-brut-yellow transition-colors flex items-center gap-1 py-1 px-2 text-xs"
              title="Kembali ke Portofolio"
            >
              <FaArrowLeft /> Home
            </Link>
          </div>

          {/* Alert Warning if Supabase ENV not configured */}
          {!dbConfigured && (
            <div className="mb-6 border-4 border-black bg-brut-yellow p-4 shadow-brut">
              <div className="flex items-start gap-3">
                <div className="bg-black text-brut-yellow p-2 border-2 border-black shrink-0">
                  <FaExclamationTriangle className="text-lg" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-display text-[10px] bg-black text-brut-yellow px-2 py-0.5 tracking-wider">
                      WARNING
                    </span>
                    <span className="font-display text-xs uppercase tracking-tight text-black">
                      MODE LOKAL (NO SUPABASE ENV)
                    </span>
                  </div>
                  <p className="font-bold text-xs text-black leading-snug">
                    Variabel Supabase belum diisi di <code className="bg-black text-brut-yellow px-1 py-0.5 font-mono text-[11px]">.env.local</code>.
                    Anda dapat mengetikkan email & password sembarang untuk mencoba login demo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message Alert */}
          {successMsg && (
            <div className="mb-6 border-4 border-black bg-brut-lime p-4 shadow-brut">
              <div className="flex items-center gap-3">
                <div className="bg-black text-brut-lime p-2 border-2 border-black shrink-0">
                  <FaCheckCircle className="text-lg" />
                </div>
                <div>
                  <span className="font-display text-[10px] bg-black text-brut-lime px-2 py-0.5 tracking-wider mr-2">
                    SUCCESS
                  </span>
                  <span className="font-display text-xs uppercase text-black font-black">
                    {successMsg}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="mb-6 border-4 border-black bg-brut-red p-4 shadow-brut text-white">
              <div className="flex items-start gap-3">
                <div className="bg-black text-brut-red p-2 border-2 border-black shrink-0">
                  <FaExclamationTriangle className="text-lg text-yellow-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-display text-[10px] bg-yellow-300 text-black px-2 py-0.5 tracking-wider font-black">
                      ERROR
                    </span>
                    <span className="font-display text-xs uppercase tracking-tight text-white font-black">
                      OTENTIKASI GAGAL
                    </span>
                  </div>
                  <p className="font-bold text-xs text-white leading-snug">
                    {errorMsg}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Login */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Field Email */}
            <div>
              <label className="block font-display text-xs uppercase mb-2 text-black">
                Email Address
              </label>
              <div className="flex border-4 border-black bg-brut-paper shadow-brut-xs focus-within:ring-2 focus-within:ring-black">
                <div className="bg-brut-yellow border-r-4 border-black px-3.5 flex items-center justify-center text-black shrink-0">
                  <FaEnvelope className="text-base" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full bg-brut-paper px-4 py-3 text-sm font-semibold text-black outline-none placeholder:font-bold placeholder:uppercase placeholder:text-neutral-400"
                />
              </div>
            </div>

            {/* Field Password */}
            <div>
              <label className="block font-display text-xs uppercase mb-2 text-black">
                Password
              </label>
              <div className="flex border-4 border-black bg-brut-paper shadow-brut-xs focus-within:ring-2 focus-within:ring-black">
                <div className="bg-brut-yellow border-r-4 border-black px-3.5 flex items-center justify-center text-black shrink-0">
                  <FaLock className="text-base" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-brut-paper px-4 py-3 text-sm font-semibold text-black outline-none placeholder:font-bold placeholder:uppercase placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="border-l-4 border-black bg-brut-paper px-3.5 flex items-center justify-center text-black hover:bg-brut-pink transition-colors cursor-pointer shrink-0"
                  title={showPassword ? "Sembunyikan Password" : "Tampilkan Password"}
                >
                  {showPassword ? <FaEyeSlash className="text-base" /> : <FaEye className="text-base" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="brut-btn w-full bg-brut-yellow text-black hover:bg-brut-cyan transition-all mt-2 py-3.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2 font-mono text-sm font-bold">
                  <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  MEMPROSES...
                </span>
              ) : (
                <>
                  <FaShieldAlt /> MASUK DASHBOARD
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 border-t-2 border-black pt-4 text-center">
            <p className="font-mono text-[10px] text-neutral-600 font-bold uppercase">
              HMPoetra CMS Admin • Strictly Authorized Only
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
