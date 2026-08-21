'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaDatabase,
  FaCode,
  FaFolderOpen,
  FaAward,
  FaEnvelope,
  FaUser,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaCloudUploadAlt,
  FaImage,
  FaJs,
  FaNodeJs,
  FaPython,
  FaGitAlt,
  FaHtml5,
  FaCss3Alt,
  FaLaravel,
  FaBootstrap,
  FaReact,
  FaPhp,
  FaWindows,
  FaSignOutAlt,
  FaLock,
  FaFilePdf,
  FaDownload,
  FaCheck,
  FaExternalLinkAlt,
  FaSyncAlt,
  FaBriefcase,
  FaUniversity,
  FaEye,
  FaEyeSlash,
  FaArrowUp,
  FaArrowDown,
  FaSortAmountDown,
  FaClock,
} from 'react-icons/fa';
import {
  SiTypescript,
  SiTailwindcss,
  SiNextdotjs,
  SiFlutter,
  SiDart,
  SiMysql,
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import { DiVisualstudio } from 'react-icons/di';
import { TbBrandCSharp } from 'react-icons/tb';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Skill } from '@/components/Skills';
import { Project } from '@/components/Projects';
import { Certification } from '@/components/Certifications';

const ICON_REGISTRY: Record<string, React.ElementType> = {
  FaReact,
  FaJs,
  FaNodeJs,
  FaPython,
  FaGitAlt,
  FaDatabase,
  FaHtml5,
  FaCss3Alt,
  FaLaravel,
  FaBootstrap,
  FaPhp,
  FaWindows,
  SiTypescript,
  SiTailwindcss,
  SiNextdotjs,
  SiFlutter,
  SiDart,
  SiMysql,
  VscVscode,
  DiVisualstudio,
  TbBrandCSharp,
  FaCode,
};

const uploadImageFile = async (file: File): Promise<string> => {
  if (isSupabaseConfigured()) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage.from('portfolio').upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from('portfolio').getPublicUrl(filePath);
        return publicUrlData.publicUrl;
      }
    } catch (e) {
      console.warn('Storage upload error, fallback to data URL:', e);
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const ImageDropzone = ({
  value,
  onChange,
  label = 'Gambar Thumbnail',
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar (JPG, PNG, WebP, GIF)');
      return;
    }
    setIsUploading(true);
    try {
      const url = await uploadImageFile(file);
      onChange(url);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Gagal mengunggah gambar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold">{label}</label>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = (e: any) => {
            if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
          };
          input.click();
        }}
        className={`relative flex flex-col items-center justify-center p-6 border-4 border-dashed border-black cursor-pointer transition-all duration-150 ${
          isDragging ? 'bg-brut-yellow shadow-brut' : 'bg-brut-paper hover:bg-amber-50 shadow-brut-xs'
        }`}
      >
        {isUploading ? (
          <div className="font-display text-xs text-black animate-pulse">Mengunggah gambar...</div>
        ) : value ? (
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="relative h-32 w-full max-w-xs overflow-hidden border-2 border-black bg-white">
              <img src={value} alt="Preview" className="h-full w-full object-cover" />
            </div>
            <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 border border-black">
              ✓ Gambar Siap (Klik atau Drop untuk ganti)
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-2">
            <FaCloudUploadAlt className="text-3xl text-black" />
            <p className="font-display text-xs text-black">Drag & Drop gambar ke sini</p>
            <span className="border-2 border-black bg-brut-cyan px-3 py-1 text-[10px] font-bold text-black shadow-brut-xs">
              Atau Klik untuk Pilih File Gambar
            </span>
          </div>
        )}
      </div>

      {/* Direct URL Input */}
      <div className="pt-1">
        <span className="text-[10px] font-bold text-neutral-600 block mb-1">
          Atau Masukkan Link/Path Gambar Manual:
        </span>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="brut-input text-xs"
          placeholder="/projects/porto.png atau https://..."
        />
      </div>
    </div>
  );
};

const MultiImageDropzone = ({
  values = [],
  onChange,
  label = 'Galeri Foto Projek (Bisa Pilih Banyak)',
}: {
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  const handleMultipleFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      alert('Harap pilih berkas gambar valid (JPG, PNG, WebP, GIF)');
      return;
    }
    setIsUploading(true);
    try {
      const uploadedUrls = await Promise.all(validFiles.map((file) => uploadImageFile(file)));
      const newUrls = [...values, ...uploadedUrls.filter(Boolean)];
      onChange(newUrls);
    } catch (err) {
      console.error('Multi upload failed:', err);
      alert('Gagal mengunggah sebagian gambar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const updated = values.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleAddManual = () => {
    if (!manualUrl.trim()) return;
    onChange([...values, manualUrl.trim()]);
    setManualUrl('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-black">{label}</label>
        <span className="text-[10px] font-mono font-bold bg-brut-yellow border border-black px-2 py-0.5 shadow-brut-xs">
          {values.length} Foto Terpilih
        </span>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleMultipleFiles(e.dataTransfer.files);
          }
        }}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.multiple = true;
          input.onchange = (e: any) => {
            if (e.target.files && e.target.files.length > 0) {
              handleMultipleFiles(e.target.files);
            }
          };
          input.click();
        }}
        className={`relative flex flex-col items-center justify-center p-5 border-4 border-dashed border-black cursor-pointer transition-all duration-150 ${
          isDragging ? 'bg-brut-yellow shadow-brut' : 'bg-brut-paper hover:bg-amber-50 shadow-brut-xs'
        }`}
      >
        {isUploading ? (
          <div className="flex items-center gap-2 font-display text-xs text-black animate-pulse py-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
            Mengunggah foto-foto ke Supabase Storage...
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-1.5 py-1">
            <FaCloudUploadAlt className="text-2xl text-black" />
            <p className="font-display text-xs text-black font-bold">
              Tarik & Lepaskan 1 atau Lebih Foto di Sini
            </p>
            <span className="border-2 border-black bg-brut-lime px-2.5 py-0.5 text-[10px] font-bold text-black shadow-brut-xs">
              + Klik untuk Pilih Banyak Foto Sekaligus (Multi-upload)
            </span>
          </div>
        )}
      </div>

      {/* Grid of uploaded images */}
      {values.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {values.map((url, idx) => (
            <div key={idx} className="relative aspect-video border-2 border-black bg-white overflow-hidden group shadow-brut-xs">
              <img src={url} alt={`Gallery ${idx + 1}`} className="h-full w-full object-cover" />
              <div className="absolute top-1 left-1 bg-black text-white text-[9px] font-mono px-1 py-0.2">
                #{idx + 1}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(idx);
                }}
                className="absolute top-1 right-1 bg-brut-red text-white p-1 border border-black text-xs hover:bg-black transition-colors cursor-pointer"
                title="Hapus foto ini"
              >
                <FaTrash className="text-[10px]" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Manual URL entry */}
      <div className="flex gap-2 pt-1">
        <input
          type="text"
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          placeholder="Atau masukkan URL foto tambahan manual..."
          className="brut-input text-xs flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddManual();
            }
          }}
        />
        <button
          type="button"
          onClick={handleAddManual}
          className="brut-btn bg-brut-cyan text-xs py-1 px-3 whitespace-nowrap cursor-pointer font-bold"
        >
          + Tambah URL
        </button>
      </div>
    </div>
  );
};

export interface CVRecord {
  id?: string;
  title: string;
  file_url: string;
  file_name: string;
  file_size?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ExperienceRecord {
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
  created_at?: string;
}

const uploadCVFile = async (file: File): Promise<{ url: string; fileName: string; fileSize: number }> => {
  if (isSupabaseConfigured()) {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `cv/${Date.now()}_${sanitizedName}`;

      let { data, error } = await supabase.storage.from('cv_files').upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

      let bucketName = 'cv_files';
      if (error && error.message?.includes('Bucket not found')) {
        bucketName = 'portfolio';
        const res = await supabase.storage.from('portfolio').upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });
        data = res.data;
        error = res.error;
      }

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
        return {
          url: publicUrlData.publicUrl,
          fileName: file.name,
          fileSize: file.size,
        };
      }
    } catch (e) {
      console.warn('Storage CV upload error, fallback to data URL:', e);
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        url: reader.result as string,
        fileName: file.name,
        fileSize: file.size,
      });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const CVDropzone = ({
  onUploadSuccess,
}: {
  onUploadSuccess: (cv: { url: string; fileName: string; fileSize: number; title: string; isActive: boolean }) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [cvTitle, setCvTitle] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleProcessFile = async (file: File) => {
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExts = ['pdf', 'doc', 'docx'];
    if (!validExts.includes(ext || '')) {
      alert('Format file tidak didukung! Harap upload file PDF (.pdf) atau Word (.docx/.doc)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file melebihi batas 10MB!');
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadCVFile(file);
      const title = cvTitle.trim() || `CV - ${file.name.replace(/\.[^/.]+$/, '')}`;
      onUploadSuccess({
        url: res.url,
        fileName: res.fileName,
        fileSize: res.fileSize,
        title,
        isActive,
      });
      setCvTitle('');
    } catch (err: any) {
      alert('Gagal mengupload file: ' + (err.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border-4 border-black bg-brut-paper p-6 shadow-brut-sm space-y-4">
      <div className="flex items-center gap-3 border-b-4 border-black pb-3">
        <div className="border-2 border-black bg-brut-yellow p-2 shadow-brut-xs">
          <FaFilePdf className="text-xl text-black" />
        </div>
        <div>
          <h4 className="font-display text-base text-black uppercase">UPLOAD CV BARU (DRAG & DROP)</h4>
          <p className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
            Format: PDF, DOC, DOCX • Maks. 10MB • Otomatis sinkron ke Supabase Storage
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block font-display text-xs uppercase mb-1 text-black">
            Judul / Versi CV
          </label>
          <input
            type="text"
            value={cvTitle}
            onChange={(e) => setCvTitle(e.target.value)}
            placeholder="Contoh: CV Hapsoro Mahendra - Web Developer 2026"
            className="brut-input text-xs"
          />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer border-2 border-black bg-brut-bg p-2.5 shadow-brut-xs w-full">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 accent-black cursor-pointer"
            />
            <span className="font-display text-xs uppercase text-black font-bold">Jadikan CV Aktif</span>
          </label>
        </div>
      </div>

      {/* Drag & Drop Dropzone Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleProcessFile(e.dataTransfer.files[0]);
          }
        }}
        onClick={() => {
          const input = document.getElementById('cv-file-upload-input');
          if (input) input.click();
        }}
        className={`relative border-4 border-dashed p-8 text-center transition-all duration-150 cursor-pointer ${
          isDragging
            ? 'border-black bg-brut-yellow shadow-brut scale-[0.99]'
            : 'border-black bg-brut-bg hover:bg-neutral-100 shadow-brut-xs'
        }`}
      >
        <input
          id="cv-file-upload-input"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleProcessFile(e.target.files[0]);
            }
          }}
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent mb-2" />
            <p className="font-display text-xs uppercase tracking-wider text-black font-bold">
              MENGUPLOAD FILE KE SUPABASE STORAGE...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="mb-3 border-2 border-black bg-brut-lime p-3 shadow-brut-xs">
              <FaCloudUploadAlt className="text-3xl text-black" />
            </div>
            <p className="font-display text-sm uppercase text-black mb-1 font-bold">
              TARIK & LEPASKAN FILE CV DI SINI
            </p>
            <p className="font-mono text-xs font-bold text-neutral-600 mb-3">
              atau klik untuk memilih file dari komputer
            </p>
            <span className="border-2 border-black bg-black px-3 py-1 font-display text-[10px] uppercase text-brut-paper shadow-brut-xs font-bold">
              PILIH FILE CV (.PDF / .DOCX)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

type TabType = 'skills' | 'projects' | 'certifications' | 'experiences' | 'cv' | 'profile' | 'messages';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

interface ProfileInfo {
  id?: string;
  full_name: string;
  headline: string;
  bio: string;
  status: string;
  available: boolean;
  profile_image: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('skills');
  const [adminSkillCategory, setAdminSkillCategory] = useState<string>('ALL');
  const [dbConnected, setDbConnected] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [tableStatus, setTableStatus] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // States for CRUD
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [experiences, setExperiences] = useState<ExperienceRecord[]>([]);
  const [cvList, setCvList] = useState<CVRecord[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [profile, setProfile] = useState<ProfileInfo>({
    full_name: 'Hapsoro Mahendra Poetra',
    headline: 'System.out.println("Web Developer Here!");',
    bio: 'HI Selamat datang di dunia saya, saya Hapsoro Mahendra Poetra dari Bogor...',
    status: 'Ready for Internship / Web Projects.',
    available: true,
    profile_image: '/profile.jpg',
  });

  // Edit State Modals / Forms
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingCert, setEditingCert] = useState<Partial<Certification> | null>(null);
  const [editingExp, setEditingExp] = useState<Partial<ExperienceRecord> | null>(null);
  const [projectSortOrder, setProjectSortOrder] = useState<'custom' | 'newest' | 'oldest' | 'title'>('custom');

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const askConfirmation = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadAllData = useCallback(async () => {
    setIsRefreshing(true);
    const statusMap: Record<string, boolean> = {};

    try {
      // 1. Skills
      try {
        const { data, error } = await supabase.from('skills').select('*').order('sort_order', { ascending: true });
        if (!error && data) {
          const validSk = data.filter((s) => s && s.name);
          const uniqueSk = Array.from(new Map(validSk.map((s) => [s.name.toLowerCase().trim(), s])).values());
          setSkills(uniqueSk);
          statusMap['skills'] = true;
        } else {
          statusMap['skills'] = false;
        }
      } catch {
        statusMap['skills'] = false;
      }

      // 2. Projects
      try {
        const { data, error } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
        if (!error && data) {
          const mapped: Project[] = data
            .filter((p) => p && p.title)
            .map((p) => {
              const gallery = Array.isArray(p.gallery_images)
                ? p.gallery_images
                : typeof p.gallery_images === 'string'
                ? (p.gallery_images as string).split(',').map((s: string) => s.trim()).filter(Boolean)
                : [];
              return {
                id: p.id,
                title: p.title,
                description: p.description || '',
                detail_description: p.detail_description || '',
                image: p.image_url || (gallery.length > 0 ? gallery[0] : ''),
                gallery_images: gallery,
                github: p.github_url || '',
                demo: p.demo_url || '',
                tags: Array.isArray(p.tags) ? p.tags : [],
                sort_order: p.sort_order,
              };
            });
          const uniquePr = Array.from(new Map(mapped.map((p) => [p.title.toLowerCase().trim(), p])).values());
          setProjects(uniquePr);
          statusMap['projects'] = true;
        } else {
          statusMap['projects'] = false;
        }
      } catch {
        statusMap['projects'] = false;
      }

      // 3. Certifications
      try {
        const { data, error } = await supabase.from('certifications').select('*').order('sort_order', { ascending: true });
        if (!error && data) {
          const mapped: Certification[] = data
            .filter((c) => c && c.title)
            .map((c) => ({
              id: c.id,
              title: c.title,
              issuer: c.issuer || '',
              date: c.date || '',
              credentialId: c.credential_id || '',
              link: c.link || '#',
              tags: c.tags || [],
              bg: c.bg_color || 'bg-brut-yellow',
              sort_order: c.sort_order,
            }));
          const uniqueCr = Array.from(new Map(mapped.map((c) => [c.title.toLowerCase().trim(), c])).values());
          setCertifications(uniqueCr);
          statusMap['certifications'] = true;
        } else {
          statusMap['certifications'] = false;
        }
      } catch {
        statusMap['certifications'] = false;
      }

      // 4. Experiences
      try {
        const { data, error } = await supabase.from('experiences').select('*').order('sort_order', { ascending: true });
        if (!error && data) {
          setExperiences(data as ExperienceRecord[]);
          statusMap['experiences'] = true;
        } else {
          statusMap['experiences'] = false;
        }
      } catch {
        statusMap['experiences'] = false;
      }

      // 5. CV
      try {
        const { data, error } = await supabase.from('curriculum_vitae').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          setCvList(data);
          statusMap['curriculum_vitae'] = true;
        } else {
          statusMap['curriculum_vitae'] = false;
        }
      } catch {
        statusMap['curriculum_vitae'] = false;
      }

      // 6. Messages
      try {
        const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          setMessages(data);
          statusMap['contact_messages'] = true;
        } else {
          statusMap['contact_messages'] = false;
        }
      } catch {
        statusMap['contact_messages'] = false;
      }

      // 7. Profile Info
      try {
        const { data, error } = await supabase.from('profile_info').select('*').limit(1);
        if (!error && data && data.length > 0) {
          setProfile(data[0]);
          statusMap['profile_info'] = true;
        } else {
          statusMap['profile_info'] = false;
        }
      } catch {
        statusMap['profile_info'] = false;
      }

      setTableStatus(statusMap);
    } catch (err: any) {
      console.error('Failed to load Supabase data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setDbConnected(configured);

    if (configured) {
      // Periksa session Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        const localSession = typeof window !== 'undefined' ? localStorage.getItem('local_admin_session') : null;
        if (!session && !localSession) {
          router.replace('/admin/login');
        } else {
          setAuthChecking(false);
          loadAllData();
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        const localSession = typeof window !== 'undefined' ? localStorage.getItem('local_admin_session') : null;
        if (!session && !localSession) {
          router.replace('/admin/login');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      const localSession = typeof window !== 'undefined' ? localStorage.getItem('local_admin_session') : null;
      if (!localSession) {
        router.replace('/admin/login');
      } else {
        setAuthChecking(false);
      }
    }
  }, [router, loadAllData]);

  const handleSignOut = async () => {
    if (dbConnected) {
      await supabase.auth.signOut();
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('local_admin_session');
      document.cookie = 'local_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    }
    router.replace('/admin/login');
  };

  // --- SKILLS CRUD ---
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name) return;

    try {
      if (dbConnected) {
        if (editingSkill.id) {
          const { error } = await supabase
            .from('skills')
            .update({
              name: editingSkill.name,
              icon_name: editingSkill.icon_name || 'FaCode',
              color: editingSkill.color || '#000000',
              category: editingSkill.category || 'Frontend Engine',
              sort_order: editingSkill.sort_order || 0,
            })
            .eq('id', editingSkill.id);
          if (error) throw error;
          showToast('Skill berhasil diperbarui di Supabase!');
        } else {
          const { error } = await supabase.from('skills').insert([
            {
              name: editingSkill.name,
              icon_name: editingSkill.icon_name || 'FaCode',
              color: editingSkill.color || '#000000',
              category: editingSkill.category || 'Frontend Engine',
              sort_order: editingSkill.sort_order || 0,
            },
          ]);
          if (error) throw error;
          showToast('Skill baru berhasil ditambahkan ke Supabase!');
        }
        loadAllData();
      } else {
        showToast('Skill berhasil disimpan di mode lokal!', 'success');
      }
      setEditingSkill(null);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan skill', 'error');
    }
  };

  const handleDeleteSkill = (skillToDelete: Skill) => {
    askConfirmation(
      'HAPUS SKILL',
      `Apakah Anda yakin ingin menghapus skill "${skillToDelete.name}"? Data yang dihapus dari Supabase tidak dapat dikembalikan.`,
      async () => {
        try {
          if (dbConnected) {
            const { error } = await supabase.from('skills').delete().eq('name', skillToDelete.name);
            if (error) throw error;
          }
          showToast(`Skill "${skillToDelete.name}" berhasil dihapus!`);
          setSkills(skills.filter((s) => s.name.toLowerCase().trim() !== skillToDelete.name.toLowerCase().trim()));
        } catch (err: any) {
          showToast(err.message || 'Gagal menghapus skill', 'error');
        }
      }
    );
  };

  // --- PROJECTS CRUD ---
  const handleStartEditProject = (projectToEdit: Partial<Project>) => {
    setEditingProject(projectToEdit as any);
    setTimeout(() => {
      const formEl = document.getElementById('project-form-section');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 60);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title) return;

    const gallery = Array.isArray(editingProject.gallery_images)
      ? editingProject.gallery_images
      : typeof editingProject.gallery_images === 'string'
      ? (editingProject.gallery_images as string).split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const primaryImage = editingProject.image || (gallery.length > 0 ? gallery[0] : '');

    const payload = {
      title: editingProject.title,
      description: editingProject.description || '',
      detail_description: editingProject.detail_description || '',
      image_url: primaryImage,
      gallery_images: gallery.length > 0 ? gallery : (primaryImage ? [primaryImage] : []),
      github_url: editingProject.github || '',
      demo_url: editingProject.demo || '',
      tags: typeof editingProject.tags === 'string'
        ? (editingProject.tags as string).split(',').map((t) => t.trim()).filter(Boolean)
        : editingProject.tags || [],
      sort_order: editingProject.sort_order || 0,
    };

    try {
      if (dbConnected) {
        if (editingProject.id) {
          const { error } = await supabase.from('projects').update(payload).eq('id', editingProject.id);
          if (error) throw error;
          showToast('Project berhasil diperbarui di Supabase!');
        } else {
          const { error } = await supabase.from('projects').insert([payload]);
          if (error) throw error;
          showToast('Project baru berhasil ditambahkan ke Supabase!');
        }
        loadAllData();
      } else {
        showToast('Project berhasil disimpan di mode lokal!', 'success');
      }
      setEditingProject(null);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan project', 'error');
    }
  };

  // --- PROJECT VISIBILITY & SORTING HELPERS ---
  const handleToggleProjectVisibility = async (project: Project) => {
    const newVisibility = project.is_visible === false ? true : false;
    try {
      if (dbConnected && project.id) {
        const { error } = await supabase
          .from('projects')
          .update({ is_visible: newVisibility })
          .eq('id', project.id);
        if (error) throw error;
        showToast(
          newVisibility
            ? `Project "${project.title}" sekarang DITAMPILKAN di portofolio publik!`
            : `Project "${project.title}" DISEMBUNYIKAN dari portofolio publik.`
        );
      } else {
        showToast(`Visibilitas project "${project.title}" diubah (mode lokal)`);
      }
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, is_visible: newVisibility } : p))
      );
    } catch (err: any) {
      showToast(err.message || 'Gagal mengubah visibilitas project', 'error');
    }
  };

  const handleMoveProjectOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedProjects.length) return;

    const currentProj = sortedProjects[index];
    const targetProj = sortedProjects[targetIndex];

    const currentOrder = currentProj.sort_order ?? index + 1;
    const targetOrder = targetProj.sort_order ?? targetIndex + 1;

    let newCurrentOrder = targetOrder;
    let newTargetOrder = currentOrder;

    if (newCurrentOrder === newTargetOrder) {
      newCurrentOrder = direction === 'up' ? targetOrder - 1 : targetOrder + 1;
    }

    try {
      if (dbConnected && currentProj.id && targetProj.id) {
        await supabase.from('projects').update({ sort_order: newCurrentOrder }).eq('id', currentProj.id);
        await supabase.from('projects').update({ sort_order: newTargetOrder }).eq('id', targetProj.id);
        showToast('Urutan project berhasil diperbarui!');
      }
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === currentProj.id) return { ...p, sort_order: newCurrentOrder };
          if (p.id === targetProj.id) return { ...p, sort_order: newTargetOrder };
          return p;
        })
      );
    } catch (err: any) {
      showToast(err.message || 'Gagal mengubah urutan project', 'error');
    }
  };

  const sortedProjects = useMemo(() => {
    const list = [...projects];
    if (projectSortOrder === 'newest') {
      return list.sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        if (timeA && timeB) return timeB - timeA;
        return (b.sort_order ?? 0) - (a.sort_order ?? 0);
      });
    }
    if (projectSortOrder === 'oldest') {
      return list.sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        if (timeA && timeB) return timeA - timeB;
        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      });
    }
    if (projectSortOrder === 'title') {
      return list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [projects, projectSortOrder]);

  const handleDeleteProject = (id: string, title?: string) => {
    askConfirmation(
      'HAPUS PROJECT',
      `Apakah Anda yakin ingin menghapus project ${title ? `"${title}"` : 'ini'}? Data yang dihapus dari Supabase tidak dapat dikembalikan.`,
      async () => {
        try {
          if (dbConnected) {
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (error) throw error;
          }
          showToast('Project berhasil dihapus!');
          setProjects(projects.filter((p) => p.id !== id));
        } catch (err: any) {
          showToast(err.message || 'Gagal menghapus project', 'error');
        }
      }
    );
  };

  // --- CERTIFICATIONS CRUD ---
  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert || !editingCert.title) return;

    const payload = {
      title: editingCert.title,
      issuer: editingCert.issuer || '',
      date: editingCert.date || '',
      credential_id: editingCert.credentialId || '',
      link: editingCert.link || '',
      bg_color: editingCert.bg || 'bg-brut-yellow',
      tags: typeof editingCert.tags === 'string'
        ? (editingCert.tags as string).split(',').map((t) => t.trim())
        : editingCert.tags || [],
      sort_order: editingCert.sort_order || 0,
    };

    try {
      if (dbConnected) {
        if (editingCert.id) {
          const { error } = await supabase.from('certifications').update(payload).eq('id', editingCert.id);
          if (error) throw error;
          showToast('Sertifikat berhasil diperbarui di Supabase!');
        } else {
          const { error } = await supabase.from('certifications').insert([payload]);
          if (error) throw error;
          showToast('Sertifikat baru berhasil ditambahkan ke Supabase!');
        }
        loadAllData();
      } else {
        showToast('Sertifikat berhasil disimpan di mode lokal!', 'success');
      }
      setEditingCert(null);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan sertifikat', 'error');
    }
  };

  const handleDeleteCert = (id: string, title?: string) => {
    askConfirmation(
      'HAPUS SERTIFIKAT',
      `Apakah Anda yakin ingin menghapus sertifikat ${title ? `"${title}"` : 'ini'}? Data yang dihapus dari Supabase tidak dapat dikembalikan.`,
      async () => {
        try {
          if (dbConnected) {
            const { error } = await supabase.from('certifications').delete().eq('id', id);
            if (error) throw error;
          }
          showToast('Sertifikat berhasil dihapus!');
          setCertifications(certifications.filter((c) => c.id !== id));
        } catch (err: any) {
          showToast(err.message || 'Gagal menghapus sertifikat', 'error');
        }
      }
    );
  };

  // --- EXPERIENCES CRUD ---
  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp || !editingExp.role || !editingExp.company) return;

    const payload = {
      role: editingExp.role,
      company: editingExp.company,
      type: editingExp.type || 'Work',
      location: editingExp.location || 'Indonesia',
      start_date: editingExp.start_date || '2023',
      end_date: editingExp.end_date || 'Present',
      description: editingExp.description || '',
      tags: typeof editingExp.tags === 'string'
        ? (editingExp.tags as string).split(',').map((t) => t.trim())
        : editingExp.tags || [],
      sort_order: editingExp.sort_order || 0,
    };

    try {
      if (dbConnected) {
        if (editingExp.id) {
          const { error } = await supabase.from('experiences').update(payload).eq('id', editingExp.id);
          if (error) throw error;
          showToast('Experience berhasil diperbarui di Supabase!');
        } else {
          const { error } = await supabase.from('experiences').insert([payload]);
          if (error) throw error;
          showToast('Experience baru berhasil ditambahkan ke Supabase!');
        }
        loadAllData();
      } else {
        showToast('Experience berhasil disimpan di mode lokal!', 'success');
      }
      setEditingExp(null);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan data experience. Pastikan tabel experiences sudah dibuat di Supabase.', 'error');
    }
  };

  const handleDeleteExp = (id: string, role?: string) => {
    askConfirmation(
      'HAPUS EXPERIENCE',
      `Apakah Anda yakin ingin menghapus pengalaman ${role ? `"${role}"` : 'ini'}? Data yang dihapus tidak dapat dikembalikan.`,
      async () => {
        try {
          if (dbConnected) {
            const { error } = await supabase.from('experiences').delete().eq('id', id);
            if (error) throw error;
          }
          showToast('Experience berhasil dihapus!');
          setExperiences(experiences.filter((e) => e.id !== id));
        } catch (err: any) {
          showToast(err.message || 'Gagal menghapus experience', 'error');
        }
      }
    );
  };

  // --- PROFILE UPDATE ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (dbConnected) {
        if (profile.id) {
          const { error } = await supabase.from('profile_info').update(profile).eq('id', profile.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('profile_info').insert([profile]);
          if (error) throw error;
        }
      }
      showToast('Profile berhasil diperbarui di Supabase!');
    } catch (err: any) {
      showToast(err.message || 'Gagal memperbarui profile', 'error');
    }
  };

  // --- DELETE MESSAGE ---
  const handleDeleteMessage = (id: string) => {
    askConfirmation(
      'HAPUS PESAN KONTAK',
      'Apakah Anda yakin ingin menghapus pesan kontak ini? Data yang dihapus tidak dapat dikembalikan.',
      async () => {
        try {
          if (dbConnected) {
            const { error } = await supabase.from('contact_messages').delete().eq('id', id);
            if (error) throw error;
          }
          showToast('Pesan berhasil dihapus!');
          setMessages(messages.filter((m) => m.id !== id));
        } catch (err: any) {
          showToast(err.message || 'Gagal menghapus pesan', 'error');
        }
      }
    );
  };

  // --- CV CRUD HANDLERS ---
  const handleSaveCV = async (cvData: {
    url: string;
    fileName: string;
    fileSize: number;
    title: string;
    isActive: boolean;
  }) => {
    try {
      if (dbConnected) {
        if (cvData.isActive) {
          await supabase.from('curriculum_vitae').update({ is_active: false }).not('id', 'is', null);
        }

        const { data, error } = await supabase
          .from('curriculum_vitae')
          .insert([
            {
              title: cvData.title,
              file_url: cvData.url,
              file_name: cvData.fileName,
              file_size: cvData.fileSize,
              is_active: cvData.isActive,
            },
          ])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          setCvList((prev) => [data[0], ...prev.map((c) => (cvData.isActive ? { ...c, is_active: false } : c))]);
        }
      } else {
        const newCV: CVRecord = {
          id: 'cv_' + Date.now(),
          title: cvData.title,
          file_url: cvData.url,
          file_name: cvData.fileName,
          file_size: cvData.fileSize,
          is_active: cvData.isActive,
          created_at: new Date().toISOString(),
        };
        setCvList((prev) => [newCV, ...prev.map((c) => (cvData.isActive ? { ...c, is_active: false } : c))]);
      }
      showToast('File CV berhasil diupload & disimpan ke Supabase!');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan file CV', 'error');
    }
  };

  const handleSetActiveCV = async (id?: string) => {
    if (!id) return;
    try {
      if (dbConnected) {
        await supabase.from('curriculum_vitae').update({ is_active: false }).not('id', 'is', null);
        const { error } = await supabase.from('curriculum_vitae').update({ is_active: true }).eq('id', id);
        if (error) throw error;
      }
      setCvList((prev) => prev.map((c) => ({ ...c, is_active: c.id === id })));
      showToast('CV aktif untuk publik berhasil diperbarui di Supabase!');
    } catch (err: any) {
      showToast(err.message || 'Gagal memperbarui status CV', 'error');
    }
  };

  const handleDeleteCV = (id?: string, title?: string) => {
    if (!id) return;
    askConfirmation(
      'HAPUS FILE CV',
      `Apakah Anda yakin ingin menghapus CV "${title || 'ini'}"? Data yang dihapus tidak dapat dikembalikan.`,
      async () => {
        try {
          if (dbConnected) {
            const { error } = await supabase.from('curriculum_vitae').delete().eq('id', id);
            if (error) throw error;
          }
          setCvList((prev) => prev.filter((c) => c.id !== id));
          showToast('File CV berhasil dihapus dari Supabase!');
        } catch (err: any) {
          showToast(err.message || 'Gagal menghapus file CV', 'error');
        }
      }
    );
  };

  if (authChecking) {
    return (
      <main className="min-h-screen bg-brut-bg flex items-center justify-center p-4">
        <div className="brut-box bg-brut-paper p-8 text-center max-w-sm">
          <div className="inline-block bg-brut-yellow p-4 border-4 border-black mb-4 shadow-brut-sm animate-bounce">
            <FaLock className="text-3xl text-black" />
          </div>
          <h2 className="font-display text-lg mb-2 text-black">MEMERIKSA HAK AKSES...</h2>
          <p className="text-xs text-neutral-600 font-bold uppercase tracking-wider">
            Verifikasi Otentikasi Supabase Admin
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brut-bg p-4 md:p-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-[9999] border-4 border-black p-4 font-display text-xs tracking-wider shadow-brut-xl flex items-center gap-3 animate-bounce ${
            notification.type === 'success' ? 'bg-brut-lime text-black' : 'bg-brut-red text-white'
          }`}
        >
          <div className="bg-black p-1.5 border-2 border-black shrink-0">
            {notification.type === 'success' ? (
              <FaCheckCircle className="text-base text-brut-lime" />
            ) : (
              <FaExclamationTriangle className="text-base text-yellow-300" />
            )}
          </div>
          <span className="font-bold uppercase tracking-tight">{notification.msg}</span>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        {/* Header Dashboard */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 border-4 border-black bg-brut-paper p-6 shadow-brut-lg md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="border-4 border-black bg-brut-yellow px-3 py-1 font-display text-2xl tracking-tighter text-black">
                CMS CONTROL
              </span>
              <span className="border-2 border-black bg-black px-3 py-1 font-mono text-xs font-bold text-brut-paper">
                ADMIN PANEL
              </span>
            </div>
            <p className="text-xs font-bold text-black">
              Kelola Konten Portofolio Real-Time via Supabase (Skills, Projects, Certifications, Experience, CV, Profile, Messages)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Koneksi Supabase */}
            <div
              className={`flex items-center gap-2 border-4 border-black px-3 py-2 text-xs font-bold ${
                dbConnected ? 'bg-brut-lime text-black' : 'bg-brut-orange text-black'
              }`}
            >
              {dbConnected ? (
                <>
                  <FaCheckCircle /> Supabase Connected
                </>
              ) : (
                <>
                  <FaExclamationTriangle /> Local Mode (No ENV)
                </>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={loadAllData}
              disabled={isRefreshing}
              className="brut-btn bg-brut-yellow text-xs flex items-center gap-1.5"
              title="Muat ulang seluruh data dari Supabase"
            >
              <FaSyncAlt className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Sinkronisasi...' : 'Sinkron Supabase'}
            </button>

            <Link href="/" className="brut-btn bg-brut-cyan text-xs">
              <FaArrowLeft /> View Portfolio
            </Link>

            <button
              onClick={handleSignOut}
              className="brut-btn bg-brut-red text-white text-xs hover:bg-red-600 transition-colors"
              title="Keluar dari sesi Admin"
            >
              <FaSignOutAlt /> Keluar
            </button>
          </div>
        </div>

        {/* Database Tables Health Banner if any missing table */}
        {tableStatus['experiences'] === false && (
          <div className="mb-6 border-4 border-black bg-brut-yellow p-4 shadow-brut">
            <div className="flex items-start gap-3">
              <div className="bg-black text-brut-yellow p-2 border-2 border-black shrink-0">
                <FaExclamationTriangle className="text-lg" />
              </div>
              <div className="flex-1">
                <span className="font-display text-[10px] bg-black text-brut-yellow px-2 py-0.5 tracking-wider font-bold">
                  DATABASE SETUP NOTICE
                </span>
                <h4 className="font-display text-sm text-black mt-1 uppercase font-black">
                  Tabel `experiences` belum ada di Supabase
                </h4>
                <p className="font-bold text-xs text-black mt-1 leading-snug">
                  Jalankan skrip SQL <code className="bg-black text-brut-yellow px-1 py-0.5 font-mono">supabase_experience_schema.sql</code> atau <code className="bg-black text-brut-yellow px-1 py-0.5 font-mono">supabase_schema.sql</code> di <b>Supabase SQL Editor</b> agar data experience tersimpan permanen di cloud.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-2 border-4 border-black px-5 py-3 font-display text-xs tracking-wider transition-all duration-150 shadow-brut-xs hover:-translate-x-0.5 hover:-translate-y-0.5 ${
              activeTab === 'skills' ? 'bg-brut-pink text-black font-bold' : 'bg-brut-paper text-black'
            }`}
          >
            <FaCode /> Skills ({skills.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 border-4 border-black px-5 py-3 font-display text-xs tracking-wider transition-all duration-150 shadow-brut-xs hover:-translate-x-0.5 hover:-translate-y-0.5 ${
              activeTab === 'projects' ? 'bg-brut-pink text-black font-bold' : 'bg-brut-paper text-black'
            }`}
          >
            <FaFolderOpen /> Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`flex items-center gap-2 border-4 border-black px-5 py-3 font-display text-xs tracking-wider transition-all duration-150 shadow-brut-xs hover:-translate-x-0.5 hover:-translate-y-0.5 ${
              activeTab === 'certifications' ? 'bg-brut-pink text-black font-bold' : 'bg-brut-paper text-black'
            }`}
          >
            <FaAward /> Certifications ({certifications.length})
          </button>
          <button
            onClick={() => setActiveTab('experiences')}
            className={`flex items-center gap-2 border-4 border-black px-5 py-3 font-display text-xs tracking-wider transition-all duration-150 shadow-brut-xs hover:-translate-x-0.5 hover:-translate-y-0.5 ${
              activeTab === 'experiences' ? 'bg-brut-pink text-black font-bold' : 'bg-brut-paper text-black'
            }`}
          >
            <FaBriefcase /> Experience ({experiences.length})
          </button>
          <button
            onClick={() => setActiveTab('cv')}
            className={`flex items-center gap-2 border-4 border-black px-5 py-3 font-display text-xs tracking-wider transition-all duration-150 shadow-brut-xs hover:-translate-x-0.5 hover:-translate-y-0.5 ${
              activeTab === 'cv' ? 'bg-brut-pink text-black font-bold' : 'bg-brut-paper text-black'
            }`}
          >
            <FaFilePdf /> Curriculum Vitae ({cvList.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 border-4 border-black px-5 py-3 font-display text-xs tracking-wider transition-all duration-150 shadow-brut-xs hover:-translate-x-0.5 hover:-translate-y-0.5 ${
              activeTab === 'profile' ? 'bg-brut-pink text-black font-bold' : 'bg-brut-paper text-black'
            }`}
          >
            <FaUser /> Profile Info
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 border-4 border-black px-5 py-3 font-display text-xs tracking-wider transition-all duration-150 shadow-brut-xs hover:-translate-x-0.5 hover:-translate-y-0.5 ${
              activeTab === 'messages' ? 'bg-brut-pink text-black font-bold' : 'bg-brut-paper text-black'
            }`}
          >
            <FaEnvelope /> Inbox ({messages.length})
          </button>
        </div>

        {/* TAB 1: SKILLS CRUD */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-4 border-black bg-brut-yellow p-4 shadow-brut-sm">
              <h3 className="font-display text-lg text-black">SKILLS MANAGEMENT (SUPABASE)</h3>
              <button
                onClick={() =>
                  setEditingSkill({
                    name: '',
                    icon_name: 'FaCode',
                    color: '#61DAFB',
                    category: 'Frontend Engine',
                    sort_order: skills.length + 1,
                  })
                }
                className="brut-btn bg-brut-cyan text-xs"
              >
                <FaPlus /> Add New Skill
              </button>
            </div>

            {/* Modal / Form Edit Skill */}
            {editingSkill && (
              <form onSubmit={handleSaveSkill} className="border-4 border-black bg-brut-paper p-6 shadow-brut-lg space-y-4">
                <h4 className="font-display text-md text-black border-b-2 border-black pb-2">
                  {editingSkill.id ? 'Edit Skill' : 'Tambah Skill Baru'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Nama Skill</label>
                    <input
                      type="text"
                      required
                      value={editingSkill.name || ''}
                      onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                      className="brut-input"
                      placeholder="React.js"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Nama Icon (React-Icons)</label>
                    <input
                      type="text"
                      required
                      value={editingSkill.icon_name || ''}
                      onChange={(e) => setEditingSkill({ ...editingSkill, icon_name: e.target.value })}
                      className="brut-input"
                      placeholder="FaReact / SiNextdotjs / FaPhp"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Kode Warna Hex</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editingSkill.color?.startsWith('#') ? editingSkill.color : '#61DAFB'}
                        onChange={(e) => setEditingSkill({ ...editingSkill, color: e.target.value })}
                        className="h-10 w-12 border-2 border-black cursor-pointer bg-white"
                      />
                      <input
                        type="text"
                        required
                        value={editingSkill.color || ''}
                        onChange={(e) => setEditingSkill({ ...editingSkill, color: e.target.value })}
                        className="brut-input flex-1"
                        placeholder="#61DAFB"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Kategori</label>
                    <select
                      value={editingSkill.category || 'Frontend Engine'}
                      onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                      className="brut-input font-bold"
                    >
                      <option value="Frontend Engine">Frontend Engine</option>
                      <option value="Backend Core">Backend Core</option>
                      <option value="Utilities & Tools">Utilities & Tools</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="brut-btn bg-brut-lime text-xs">
                    <FaSave /> Simpan Skill
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingSkill(null)}
                    className="brut-btn bg-brut-red text-xs text-white"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}

            {/* Category Filter for Admin */}
            {(() => {
              const uniqueSkills = Array.from(
                new Map(skills.map((s) => [s.name.toLowerCase().trim(), s])).values()
              );
              return (
                <>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {[
                      { label: `SEMUA (${uniqueSkills.length})`, val: 'ALL', bg: 'bg-brut-yellow' },
                      {
                        label: `FRONTEND (${uniqueSkills.filter((s) => s.category === 'Frontend Engine').length})`,
                        val: 'Frontend Engine',
                        bg: 'bg-brut-pink',
                      },
                      {
                        label: `BACKEND (${uniqueSkills.filter((s) => s.category === 'Backend Core').length})`,
                        val: 'Backend Core',
                        bg: 'bg-brut-lime',
                      },
                      {
                        label: `TOOLS (${uniqueSkills.filter((s) => s.category === 'Utilities & Tools').length})`,
                        val: 'Utilities & Tools',
                        bg: 'bg-brut-cyan',
                      },
                    ].map((c) => (
                      <button
                        key={c.val}
                        onClick={() => setAdminSkillCategory(c.val)}
                        className={`border-2 border-black px-3 py-1 font-display text-[10px] tracking-wider transition-all ${
                          adminSkillCategory === c.val ? `${c.bg} font-bold shadow-brut-xs` : 'bg-brut-paper text-black'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>

                  {/* List Skills */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {uniqueSkills
                      .filter((s) => adminSkillCategory === 'ALL' || s.category === adminSkillCategory)
                      .map((skill, index) => {
                        const SkillIcon = ICON_REGISTRY[skill.icon_name] || FaCode;
                        return (
                          <div
                            key={skill.id || index}
                            className="border-4 border-black bg-brut-paper p-4 shadow-brut-sm flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 border-2 border-black flex items-center justify-center bg-brut-paper shadow-brut-xs">
                                <SkillIcon className="text-2xl" style={{ color: skill.color }} />
                              </div>
                              <div>
                                <h4 className="font-display text-sm text-black">{skill.name}</h4>
                                <p className="text-[10px] font-bold text-neutral-600">{skill.category}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingSkill(skill)}
                                className="p-2 border-2 border-black bg-brut-cyan text-xs"
                                title="Edit Skill"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteSkill(skill)}
                                className="p-2 border-2 border-black bg-brut-red text-xs text-white"
                                title="Hapus Skill"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* TAB 2: PROJECTS CRUD */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div
              id="project-form-section"
              className="flex items-center justify-between border-4 border-black bg-brut-cyan p-4 md:p-5 shadow-brut"
            >
              <div>
                <h3 className="font-display text-lg md:text-xl text-black">PROJECTS MANAGEMENT (SUPABASE)</h3>
                <p className="font-mono text-xs font-bold text-neutral-800">
                  Kelola showcase portofolio, detail lengkap, dan galeri multi-foto
                </p>
              </div>
              <button
                onClick={() =>
                  handleStartEditProject({
                    title: '',
                    description: '',
                    detail_description: '',
                    image: '',
                    gallery_images: [],
                    github: '',
                    demo: '',
                    tags: [],
                    sort_order: projects.length + 1,
                  })
                }
                className="brut-btn bg-brut-yellow text-xs py-2 px-4 shadow-brut-xs cursor-pointer font-bold flex items-center gap-2"
              >
                <FaPlus /> Tambah Project Baru
              </button>
            </div>

            {tableStatus['projects'] === false && (               <div className="border-4 border-black bg-brut-yellow p-4 shadow-brut">                 <div className="flex items-start gap-3">                   <div className="bg-black text-brut-yellow p-2 border-2 border-black shrink-0">                     <FaExclamationTriangle className="text-lg" />                   </div>                   <div className="flex-1">                     <span className="font-display text-[10px] bg-black text-brut-yellow px-2 py-0.5 tracking-wider font-bold">                       DATABASE PERMISSION / TABLE NOTICE                     </span>                     <h4 className="font-display text-sm text-black mt-1 uppercase font-black">                       Tabel Projects di Supabase Butuh Izin Akses (RLS)                     </h4>                     <p className="font-bold text-xs text-black mt-1 leading-snug">                       Jalankan skrip SQL <code className="bg-black text-brut-yellow px-1 py-0.5 font-mono">supabase_fix_projects.sql</code> di <b>Supabase SQL Editor</b> untuk mengaktifkan izin Read & Write agar project tersambung ke database.                     </p>                   </div>                 </div>               </div>             )}

            {/* Form Edit Project (ENLARGED & SPACIOUS) */}
            {editingProject && (
              <form
                onSubmit={handleSaveProject}
                className="border-4 border-black bg-brut-paper p-6 md:p-8 shadow-brut-xl space-y-6"
              >
                {/* Form Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-black pb-4 bg-brut-yellow -mx-6 md:-mx-8 -mt-6 md:-mt-8 p-4 md:p-6">
                  <div className="flex items-center gap-3">
                    <span className="bg-black text-brut-yellow p-2 border-2 border-black font-display text-base">
                      {editingProject.id ? '✏️' : '🚀'}
                    </span>
                    <div>
                      <h4 className="font-display text-lg md:text-2xl text-black uppercase leading-tight">
                        {editingProject.id ? `EDIT PROJEK: ${editingProject.title || ''}` : 'TAMBAH PROJEK BARU'}
                      </h4>
                      <p className="font-mono text-xs font-bold text-neutral-700">
                        {editingProject.id ? 'Perbarui data spesifikasi dan galeri foto projek' : 'Isi data lengkap untuk mempublikasikan karya baru'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="border-2 border-black bg-brut-red text-white px-3 py-1 text-xs font-display uppercase shadow-brut-xs hover:bg-black transition-colors cursor-pointer"
                  >
                    ✕ Batal
                  </button>
                </div>

                <div className="space-y-5 pt-2">
                  {/* Field 1: Judul Project */}
                  <div>
                    <label className="block font-display text-xs md:text-sm uppercase mb-1.5 text-black font-bold">
                      1. Judul Project <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProject.title || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="brut-input text-sm md:text-base font-bold py-3 px-4"
                      placeholder="Contoh: MicroVest Platform, Website Portofolio, Toko Sepatu..."
                    />
                  </div>

                  {/* Field 2: Deskripsi Singkat */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-display text-xs md:text-sm uppercase text-black font-bold">
                        2. Deskripsi Singkat (Tampil di Kartu Depan) <span className="text-red-600">*</span>
                      </label>
                      <span className="text-[10px] font-mono text-neutral-600 font-bold">
                        Maks. 2-3 baris ringkas
                      </span>
                    </div>
                    <textarea
                      required
                      rows={3}
                      value={editingProject.description || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      className="brut-input text-xs md:text-sm font-semibold leading-relaxed"
                      placeholder="Ringkasan singkat mengenai tujuan utama dan fungsionalitas proyek untuk kartu portofolio..."
                    />
                  </div>

                  {/* Field 3: Detail Projek Lengkap */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-display text-xs md:text-sm uppercase text-black font-bold">
                        3. Detail Projek Lengkap (Tampil di Pop-Up Modal Detail)
                      </label>
                      <span className="text-[10px] font-mono bg-brut-pink border border-black px-2 py-0.5 font-bold">
                        Mendukung Paragraf & Penjelasan Lengkap
                      </span>
                    </div>
                    <textarea
                      rows={8}
                      value={editingProject.detail_description || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, detail_description: e.target.value })}
                      className="brut-input text-xs md:text-sm font-medium leading-relaxed"
                      placeholder="Tuliskan spesifikasi teknis mendalam, arsitektur yang digunakan, fitur-fitur unggulan, tantangan teknis, serta solusi implementasi yang diterapkan pada proyek ini..."
                    />
                  </div>

                  {/* Field 4 & 5: Upload Foto & Galeri */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6 border-4 border-black bg-neutral-50 shadow-brut-sm">
                    <div>
                      <ImageDropzone
                        label="Gambar Thumbnail Utama (Cover Project)"
                        value={editingProject.image || ''}
                        onChange={(url) => setEditingProject({ ...editingProject, image: url })}
                      />
                    </div>
                    <div>
                      <MultiImageDropzone
                        label="Galeri Foto Tambahan (Bisa Multi-Upload)"
                        values={editingProject.gallery_images || []}
                        onChange={(urls) => setEditingProject({ ...editingProject, gallery_images: urls })}
                      />
                    </div>
                  </div>

                  {/* Field 6: Links & Meta */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block font-display text-xs uppercase mb-1 text-black font-bold">
                        Tags (Pisahkan koma)
                      </label>
                      <input
                        type="text"
                        value={
                          Array.isArray(editingProject.tags)
                            ? editingProject.tags.join(', ')
                            : editingProject.tags || ''
                        }
                        onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value as any })}
                        className="brut-input text-xs"
                        placeholder="Next.js, TypeScript, Supabase"
                      />
                    </div>
                    <div>
                      <label className="block font-display text-xs uppercase mb-1 text-black font-bold">
                        URL GitHub Repository
                      </label>
                      <input
                        type="text"
                        value={editingProject.github || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, github: e.target.value })}
                        className="brut-input text-xs"
                        placeholder="https://github.com/HMPoetra/..."
                      />
                    </div>
                    <div>
                      <label className="block font-display text-xs uppercase mb-1 text-black font-bold">
                        URL Live Demo
                      </label>
                      <input
                        type="text"
                        value={editingProject.demo || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, demo: e.target.value })}
                        className="brut-input text-xs"
                        placeholder="https://my-project.vercel.app"
                      />
                    </div>
                  </div>

                  {/* Field 7: Urutan Tampil & Status Visibilitas Publik */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-4 border-black bg-neutral-100 shadow-brut-xs">
                    <div>
                      <label className="block font-display text-xs uppercase mb-1 text-black font-bold">
                        Urutan Tampil (Sort Order)
                      </label>
                      <input
                        type="number"
                        value={editingProject.sort_order ?? 1}
                        onChange={(e) => setEditingProject({ ...editingProject, sort_order: parseInt(e.target.value) || 0 })}
                        className="brut-input text-xs bg-white font-bold"
                        placeholder="1, 2, 3..."
                      />
                      <span className="text-[10px] text-neutral-600 font-mono">
                        Angka lebih kecil tampil lebih awal pada mode custom
                      </span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <label className="flex items-center gap-3 cursor-pointer p-2.5 border-2 border-black bg-white shadow-brut-xs hover:bg-neutral-50">
                        <input
                          type="checkbox"
                          checked={editingProject.is_visible !== false}
                          onChange={(e) => setEditingProject({ ...editingProject, is_visible: e.target.checked })}
                          className="w-5 h-5 accent-black cursor-pointer"
                        />
                        <div>
                          <span className="font-display text-xs font-bold text-black uppercase block">
                            Tampilkan di Portofolio Publik
                          </span>
                          <span className="text-[10px] font-mono text-neutral-600">
                            {editingProject.is_visible !== false ? '✅ Status: VISIBLE (Tampil di Website)' : '🚫 Status: DISEMBUNYIKAN (Draft/Hidden)'}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex flex-wrap gap-4 pt-4 border-t-4 border-black">
                  <button
                    type="submit"
                    className="brut-btn bg-brut-lime hover:bg-brut-yellow text-black text-sm py-3.5 px-6 flex items-center gap-2 font-bold shadow-brut cursor-pointer"
                  >
                    <FaSave className="text-base" /> SIMPAN PERUBAHAN PROJECT
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="brut-btn bg-brut-red hover:bg-black text-white text-sm py-3.5 px-6 font-bold shadow-brut cursor-pointer"
                  >
                    ✕ BATAL
                  </button>
                </div>
              </form>
            )}

            {/* Projects Control & Sort Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-4 border-black bg-white shadow-brut-sm">
              <div className="flex items-center gap-2">
                <span className="font-display text-xs uppercase font-bold text-black flex items-center gap-1.5">
                  <FaSortAmountDown /> Urutkan Berdasarkan:
                </span>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => setProjectSortOrder('custom')}
                    className={`border-2 border-black px-2.5 py-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
                      projectSortOrder === 'custom' ? 'bg-black text-white shadow-brut-xs' : 'bg-brut-paper text-black hover:bg-neutral-100'
                    }`}
                  >
                    ⚡ Urutan Kustom (#1, #2..)
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectSortOrder('newest')}
                    className={`border-2 border-black px-2.5 py-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
                      projectSortOrder === 'newest' ? 'bg-black text-white shadow-brut-xs' : 'bg-brut-paper text-black hover:bg-neutral-100'
                    }`}
                  >
                    🕒 Terbaru
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectSortOrder('oldest')}
                    className={`border-2 border-black px-2.5 py-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
                      projectSortOrder === 'oldest' ? 'bg-black text-white shadow-brut-xs' : 'bg-brut-paper text-black hover:bg-neutral-100'
                    }`}
                  >
                    ⏳ Terlama
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectSortOrder('title')}
                    className={`border-2 border-black px-2.5 py-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
                      projectSortOrder === 'title' ? 'bg-black text-white shadow-brut-xs' : 'bg-brut-paper text-black hover:bg-neutral-100'
                    }`}
                  >
                    🔤 Nama (A-Z)
                  </button>
                </div>
              </div>

              {/* Status Counters */}
              <div className="flex items-center gap-2 text-xs font-mono font-bold">
                <span className="bg-brut-lime border-2 border-black px-2 py-0.5">
                  Tampil: {projects.filter((p) => p.is_visible !== false).length}
                </span>
                <span className="bg-neutral-200 border-2 border-black px-2 py-0.5 text-neutral-700">
                  Hidden: {projects.filter((p) => p.is_visible === false).length}
                </span>
              </div>
            </div>

            {/* List Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedProjects.map((project, index) => {
                const galleryCount = (project.gallery_images && project.gallery_images.length > 0)
                  ? project.gallery_images.length
                  : project.image ? 1 : 0;

                return (
                  <div
                    key={project.id || index}
                    className="border-4 border-black bg-brut-paper p-5 shadow-brut-sm flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Status & Reorder Bar */}
                      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b-2 border-black">
                        <div className="flex items-center gap-2">
                          <span className="border-2 border-black bg-black text-white px-2 py-0.5 text-[10px] font-mono font-bold">
                            #{project.sort_order ?? index + 1}
                          </span>
                          {project.is_visible !== false ? (
                            <span className="border-2 border-black bg-brut-lime text-black px-2 py-0.5 text-[10px] font-mono font-bold flex items-center gap-1">
                              <FaEye className="text-xs" /> PUBLIK
                            </span>
                          ) : (
                            <span className="border-2 border-black bg-neutral-300 text-neutral-800 px-2 py-0.5 text-[10px] font-mono font-bold flex items-center gap-1">
                              <FaEyeSlash className="text-xs" /> DISEMBUNYIKAN
                            </span>
                          )}
                        </div>

                        {/* Reorder Buttons (Active in custom sort mode) */}
                        {projectSortOrder === 'custom' && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMoveProjectOrder(index, 'up')}
                              className="p-1 border border-black bg-white hover:bg-brut-yellow disabled:opacity-30 text-[10px] cursor-pointer"
                              title="Geser Naik"
                            >
                              <FaArrowUp />
                            </button>
                            <button
                              type="button"
                              disabled={index === sortedProjects.length - 1}
                              onClick={() => handleMoveProjectOrder(index, 'down')}
                              className="p-1 border border-black bg-white hover:bg-brut-yellow disabled:opacity-30 text-[10px] cursor-pointer"
                              title="Geser Turun"
                            >
                              <FaArrowDown />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Thumbnail Image Preview */}
                      <div className="relative mb-4 flex aspect-video w-full items-center justify-center overflow-hidden border-2 border-black bg-brut-paper">
                        {project.image && (project.image.includes('/') || project.image.includes('.')) ? (
                          <>
                            <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                            {galleryCount > 1 && (
                              <span className="absolute top-2 right-2 border border-black bg-brut-yellow px-2 py-0.5 text-[10px] font-mono font-bold">
                                {galleryCount} Foto
                              </span>
                            )}
                          </>
                        ) : (
                          <div
                            className="flex h-full w-full flex-col items-center justify-center text-center p-4"
                            style={{
                              backgroundImage: 'repeating-linear-gradient(45deg, #000 0 6px, transparent 6px 18px)',
                            }}
                          >
                            <span className="border-2 border-black bg-brut-paper px-3 py-1 font-display text-xs text-black shadow-brut-xs">
                              No Image / Coming Soon
                            </span>
                          </div>
                        )}
                      </div>

                      <h4 className="font-display text-lg text-black mb-2">{project.title}</h4>
                      <p className="text-xs font-semibold text-black mb-2">{project.description}</p>
                      {project.detail_description && (
                        <p className="text-[11px] text-neutral-600 whitespace-pre-line leading-relaxed mb-3 bg-neutral-100 p-2 border border-black font-mono">
                          ℹ️ {project.detail_description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.tags.map((t, i) => (
                          <span key={i} className="border border-black bg-black text-white px-2 py-0.5 text-[9px] font-mono">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-3 border-t-2 border-black">
                      <button
                        type="button"
                        onClick={() => handleToggleProjectVisibility(project)}
                        className={`flex-1 p-2 border-2 border-black font-display text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-brut-xs ${
                          project.is_visible !== false
                            ? 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800'
                            : 'bg-brut-lime hover:bg-emerald-400 text-black'
                        }`}
                        title={project.is_visible !== false ? 'Klik untuk sembunyikan dari pengunjung' : 'Klik untuk tampilkan ke pengunjung'}
                      >
                        {project.is_visible !== false ? (
                          <>
                            <FaEyeSlash className="text-xs" /> Sembunyikan
                          </>
                        ) : (
                          <>
                            <FaEye className="text-xs" /> Tampilkan
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleStartEditProject(project)}
                        className="flex-1 brut-btn bg-brut-yellow text-xs font-bold py-2"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => project.id && handleDeleteProject(project.id, project.title)}
                        className="p-2 brut-btn bg-brut-red text-xs text-white font-bold"
                        title="Hapus Project"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CERTIFICATIONS CRUD */}
        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-4 border-black bg-brut-pink p-4 shadow-brut-sm">
              <h3 className="font-display text-lg text-black">CERTIFICATIONS MANAGEMENT (SUPABASE)</h3>
              <button
                onClick={() =>
                  setEditingCert({
                    title: '',
                    issuer: '',
                    date: '2024',
                    credentialId: '',
                    link: '',
                    tags: [],
                    bg: 'bg-brut-yellow',
                  })
                }
                className="brut-btn bg-brut-lime text-xs"
              >
                <FaPlus /> Add New Certificate
              </button>
            </div>

            {/* Form Edit Cert */}
            {editingCert && (
              <form
                onSubmit={handleSaveCert}
                className="border-4 border-black bg-brut-paper p-6 shadow-brut-lg space-y-4"
              >
                <h4 className="font-display text-md text-black border-b-2 border-black pb-2">
                  {editingCert.id ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Judul Sertifikat</label>
                    <input
                      type="text"
                      required
                      value={editingCert.title || ''}
                      onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                      className="brut-input"
                      placeholder="Junior Web Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Penerbit / Lembaga</label>
                    <input
                      type="text"
                      required
                      value={editingCert.issuer || ''}
                      onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                      className="brut-input"
                      placeholder="BNSP / Dicoding"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Tahun / Tanggal</label>
                    <input
                      type="text"
                      required
                      value={editingCert.date || ''}
                      onChange={(e) => setEditingCert({ ...editingCert, date: e.target.value })}
                      className="brut-input"
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Credential ID</label>
                    <input
                      type="text"
                      required
                      value={editingCert.credentialId || ''}
                      onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })}
                      className="brut-input"
                      placeholder="REG.JWD.2024.08821"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">URL Verifikasi Badge</label>
                    <input
                      type="text"
                      value={editingCert.link || ''}
                      onChange={(e) => setEditingCert({ ...editingCert, link: e.target.value })}
                      className="brut-input"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Tags (Pisahkan dengan koma)</label>
                    <input
                      type="text"
                      value={
                        Array.isArray(editingCert.tags)
                          ? editingCert.tags.join(', ')
                          : editingCert.tags || ''
                      }
                      onChange={(e) => setEditingCert({ ...editingCert, tags: e.target.value as any })}
                      className="brut-input"
                      placeholder="BNSP, WebDev, FullStack"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="brut-btn bg-brut-lime text-xs">
                    <FaSave /> Simpan Sertifikat
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCert(null)}
                    className="brut-btn bg-brut-red text-xs text-white"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}

            {/* List Certifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <div
                  key={cert.id || index}
                  className="border-4 border-black bg-brut-paper p-5 shadow-brut-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display text-xs">{cert.issuer}</span>
                      <span className="font-mono text-xs border border-black bg-black text-white px-2">
                        {cert.date}
                      </span>
                    </div>
                    <h4 className="font-display text-lg text-black mb-2">{cert.title}</h4>
                    <p className="font-mono text-xs text-neutral-700 mb-3">ID: {cert.credentialId}</p>
                  </div>
                  <div className="flex gap-3 pt-3 border-t-2 border-black">
                    <button
                      onClick={() => setEditingCert(cert)}
                      className="flex-1 brut-btn bg-brut-cyan text-xs"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => cert.id && handleDeleteCert(cert.id, cert.title)}
                      className="flex-1 brut-btn bg-brut-red text-xs text-white"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: EXPERIENCES CRUD */}
        {activeTab === 'experiences' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-4 border-black bg-brut-orange p-4 shadow-brut-sm">
              <div>
                <h3 className="font-display text-lg text-black">EXPERIENCE MANAGEMENT (SUPABASE)</h3>
                <p className="text-[11px] font-bold text-black uppercase">
                  Kelola Riwayat Pekerjaan, Magang, Organisasi & Akademik
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingExp({
                    role: '',
                    company: '',
                    type: 'Work',
                    location: 'Bandung, Indonesia',
                    start_date: '2024',
                    end_date: 'Present',
                    description: '',
                    tags: [],
                    sort_order: experiences.length + 1,
                  })
                }
                className="brut-btn bg-brut-yellow text-xs"
              >
                <FaPlus /> Add New Experience
              </button>
            </div>

            {/* Modal / Form Edit Experience */}
            {editingExp && (
              <form
                onSubmit={handleSaveExp}
                className="border-4 border-black bg-brut-paper p-6 shadow-brut-lg space-y-4"
              >
                <h4 className="font-display text-md text-black border-b-2 border-black pb-2">
                  {editingExp.id ? 'Edit Experience' : 'Tambah Experience Baru'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Posisi / Role</label>
                    <input
                      type="text"
                      required
                      value={editingExp.role || ''}
                      onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                      className="brut-input"
                      placeholder="Fullstack Web Developer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Perusahaan / Institusi</label>
                    <input
                      type="text"
                      required
                      value={editingExp.company || ''}
                      onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                      className="brut-input"
                      placeholder="Self-Employed / ULBI"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Tipe Kategori</label>
                    <select
                      value={editingExp.type || 'Work'}
                      onChange={(e) => setEditingExp({ ...editingExp, type: e.target.value as any })}
                      className="brut-input font-bold"
                    >
                      <option value="Work">Work (Pekerjaan / Profesional)</option>
                      <option value="Internship">Internship (Magang / PKL)</option>
                      <option value="Organization">Organization (Organisasi / Komunitas)</option>
                      <option value="Academic">Academic (Studi Akademik / Proyek Kampus)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Lokasi</label>
                    <input
                      type="text"
                      required
                      value={editingExp.location || ''}
                      onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                      className="brut-input"
                      placeholder="Bandung, Indonesia / Remote"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Tahun Mulai</label>
                    <input
                      type="text"
                      required
                      value={editingExp.start_date || ''}
                      onChange={(e) => setEditingExp({ ...editingExp, start_date: e.target.value })}
                      className="brut-input"
                      placeholder="2023"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Tahun Selesai</label>
                    <input
                      type="text"
                      required
                      value={editingExp.end_date || ''}
                      onChange={(e) => setEditingExp({ ...editingExp, end_date: e.target.value })}
                      className="brut-input"
                      placeholder="Present / Sekarang / 2024"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold">Deskripsi Pengalaman</label>
                      {editingExp.type === 'Academic' ? (
                        <span className="font-mono text-[10px] text-neutral-600 font-bold bg-neutral-200 px-2 py-0.5 border border-black shadow-brut-xs">
                          OPSIONAL (Tidak wajib diisi)
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-red-600 font-bold">
                          * Wajib diisi
                        </span>
                      )}
                    </div>
                    <textarea
                      rows={3}
                      required={editingExp.type !== 'Academic'}
                      value={editingExp.description || ''}
                      onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                      className="brut-input resize-none"
                      placeholder={
                        editingExp.type === 'Academic'
                          ? 'Opsional: Jelaskan fokus studi atau deskripsi proyek jika ada...'
                          : 'Jelaskan peran, tanggung jawab, dan pencapaian...'
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold mb-1">Tags Keahlian (Pisahkan dengan koma)</label>
                    <input
                      type="text"
                      value={
                        Array.isArray(editingExp.tags)
                          ? editingExp.tags.join(', ')
                          : editingExp.tags || ''
                      }
                      onChange={(e) => setEditingExp({ ...editingExp, tags: e.target.value as any })}
                      className="brut-input"
                      placeholder="Next.js, TypeScript, Supabase, Tailwind CSS"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="brut-btn bg-brut-lime text-xs">
                    <FaSave /> Simpan Experience
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingExp(null)}
                    className="brut-btn bg-brut-red text-xs text-white"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}

            {/* List Experiences */}
            {experiences.length === 0 ? (
              <div className="border-4 border-black bg-brut-paper p-8 text-center shadow-brut-sm font-bold text-neutral-600">
                Belum ada data pengalaman di Supabase. Klik "Add New Experience" di atas untuk menambahkan.
              </div>
            ) : (
              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <div key={exp.id || index} className="border-4 border-black bg-brut-paper p-5 shadow-brut-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className={`border-2 border-black px-2 py-0.5 font-display text-[10px] tracking-widest text-black ${
                              exp.type === 'Academic' ? 'bg-brut-violet' : 'bg-brut-cyan'
                            }`}
                          >
                            {exp.type}
                          </span>
                          <span className="font-mono text-xs text-neutral-600 font-bold">
                            {exp.start_date} — {exp.end_date}
                          </span>
                          <span className="font-mono text-xs text-neutral-500 font-bold">
                            • {exp.location}
                          </span>
                        </div>
                        <h4 className="font-display text-lg text-black">{exp.role}</h4>
                        <p className="font-display text-sm text-black opacity-75 font-bold">{exp.company}</p>
                        {exp.description && (
                          <p className="mt-2 text-xs font-semibold text-black leading-relaxed">{exp.description}</p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-1">
                          {(exp.tags || []).map((tag: string, i: number) => (
                            <span key={i} className="border border-black bg-black px-2 py-0.5 font-mono text-[9px] text-white">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => setEditingExp(exp)}
                          className="p-2 border-2 border-black bg-brut-yellow text-xs"
                          title="Edit Experience"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => exp.id && handleDeleteExp(exp.id, exp.role)}
                          className="p-2 border-2 border-black bg-brut-red text-xs text-white"
                          title="Hapus Experience"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CURRICULUM VITAE (CV) */}
        {activeTab === 'cv' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-4 border-black bg-brut-yellow p-4 shadow-brut-sm">
              <div className="flex items-center gap-3">
                <div className="border-2 border-black bg-black p-2 text-brut-yellow">
                  <FaFilePdf className="text-xl" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-black">CURRICULUM VITAE (CV) MANAGEMENT</h3>
                  <p className="text-[11px] font-bold text-neutral-700 uppercase">
                    Upload & Kelola File CV untuk Tombol "Download CV" di Hero Section via Supabase Storage
                  </p>
                </div>
              </div>
              <span className="border-2 border-black bg-black px-3 py-1 font-mono text-xs font-bold text-brut-paper">
                {cvList.length} FILE CV
              </span>
            </div>

            {/* Drag & Drop Upload Component */}
            <CVDropzone onUploadSuccess={handleSaveCV} />

            {/* List Uploaded CV Files */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-base text-black uppercase">DAFTAR FILE CV TERSIMPAN</h4>
                <span className="font-mono text-xs font-bold text-neutral-600">Total: {cvList.length} File</span>
              </div>

              {cvList.length === 0 ? (
                <div className="border-4 border-black bg-brut-paper p-8 text-center shadow-brut-sm font-bold text-neutral-600">
                  Belum ada file CV yang diupload ke Supabase Storage.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cvList.map((cv) => (
                    <div
                      key={cv.id}
                      className={`border-4 border-black bg-brut-paper p-5 shadow-brut-sm flex flex-col justify-between transition-all duration-150 ${
                        cv.is_active ? 'ring-4 ring-black bg-amber-50/50' : ''
                      }`}
                    >
                      <div>
                        {/* Status Badge */}
                        <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-2">
                          {cv.is_active ? (
                            <span className="flex items-center gap-1 border-2 border-black bg-brut-lime px-2 py-0.5 font-display text-[10px] uppercase text-black font-black">
                              <FaCheck /> CV AKTIF DI HERO
                            </span>
                          ) : (
                            <span className="border border-black bg-neutral-200 px-2 py-0.5 font-display text-[10px] uppercase text-neutral-600">
                              ARSIP (TIDAK AKTIF)
                            </span>
                          )}

                          {cv.created_at && (
                            <span className="font-mono text-[10px] font-bold text-neutral-600">
                              {new Date(cv.created_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {/* Title & Filename */}
                        <h4 className="font-display text-base text-black mb-1">{cv.title}</h4>
                        <p className="font-mono text-xs text-neutral-600 flex items-center gap-1 mb-2 break-all">
                          <FaFilePdf className="text-brut-red shrink-0" />
                          <span>{cv.file_name}</span>
                        </p>

                        {cv.file_size ? (
                          <span className="inline-block border border-black bg-brut-bg px-2 py-0.5 font-mono text-[10px] font-bold text-neutral-700 mb-4">
                            Ukuran: {(cv.file_size / 1024).toFixed(1)} KB
                          </span>
                        ) : null}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-3 border-t-2 border-black">
                        {!cv.is_active && (
                          <button
                            onClick={() => handleSetActiveCV(cv.id)}
                            className="flex-1 brut-btn bg-brut-yellow text-xs py-2"
                            title="Jadikan file ini sebagai CV aktif yang diunduh pengunjung"
                          >
                            <FaCheck /> Set Aktif
                          </button>
                        )}

                        <a
                          href={cv.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 brut-btn bg-brut-cyan text-xs py-2 text-center"
                          title="Lihat / Buka file CV di tab baru"
                        >
                          <FaExternalLinkAlt /> Buka
                        </a>

                        <a
                          href={cv.file_url}
                          download={cv.file_name || 'CV.pdf'}
                          className="flex-1 brut-btn bg-brut-lime text-xs py-2 text-center"
                          title="Download file CV ke komputer"
                        >
                          <FaDownload /> Unduh
                        </a>

                        <button
                          onClick={() => handleDeleteCV(cv.id, cv.title)}
                          className="brut-btn bg-brut-red text-xs text-white py-2 px-3 hover:bg-red-700"
                          title="Hapus file CV ini"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: PROFILE UPDATE */}
        {activeTab === 'profile' && (
          <form
            onSubmit={handleSaveProfile}
            className="border-4 border-black bg-brut-paper p-6 shadow-brut-lg space-y-4"
          >
            <h3 className="font-display text-lg text-black border-b-4 border-black pb-3">
              EDIT PROFILE & HERO INFORMATION (SUPABASE)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="brut-input"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Headline Code</label>
                <input
                  type="text"
                  value={profile.headline}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  className="brut-input"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Biografi Lengkap</label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="brut-input resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Status Ketersediaan</label>
                  <input
                    type="text"
                    value={profile.status}
                    onChange={(e) => setProfile({ ...profile, status: e.target.value })}
                    className="brut-input"
                  />
                </div>
                <div>
                  <ImageDropzone
                    label="Foto Profil (Drag & Drop / Upload / Link)"
                    value={profile.profile_image || ''}
                    onChange={(url) => setProfile({ ...profile, profile_image: url })}
                  />
                </div>
              </div>
            </div>
            <div className="pt-4">
              <button type="submit" className="brut-btn bg-brut-lime text-xs">
                <FaSave /> Update Profile Data di Supabase
              </button>
            </div>
          </form>
        )}

        {/* TAB 7: MESSAGES INBOX */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="border-4 border-black bg-brut-yellow p-4 shadow-brut-sm flex items-center justify-between">
              <h3 className="font-display text-lg text-black">CONTACT FORM MESSAGES INBOX</h3>
              <span className="font-mono text-xs font-bold text-black">{messages.length} Pesan Masuk</span>
            </div>

            {messages.length === 0 ? (
              <div className="border-4 border-black bg-brut-paper p-8 text-center shadow-brut-sm font-bold text-neutral-600">
                Belum ada pesan yang masuk di Supabase database.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="border-4 border-black bg-brut-paper p-5 shadow-brut-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                        <div>
                          <span className="font-display text-md text-black">{msg.name}</span>
                          <span className="ml-3 font-mono text-xs text-neutral-600">&lt;{msg.email}&gt;</span>
                        </div>
                        <span className="font-mono text-xs bg-black text-white px-2 py-1">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {msg.subject && <h4 className="font-display text-xs text-black mb-2">Subject: {msg.subject}</h4>}
                      <p className="text-xs font-medium text-black leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="brut-btn bg-brut-red text-xs text-white"
                      >
                        <FaTrash /> Hapus Pesan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Custom Neo-Brutalist Confirmation Modal */}
        {confirmModal?.isOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="brut-box bg-brut-paper p-6 max-w-md w-full shadow-brut-xl relative animate-in fade-in zoom-in duration-150">
              {/* Header Modal */}
              <div className="flex items-center gap-3 border-b-4 border-black pb-3 mb-4">
                <div className="bg-brut-red text-white p-2.5 border-2 border-black shrink-0 shadow-brut-xs">
                  <FaExclamationTriangle className="text-xl text-yellow-300" />
                </div>
                <div>
                  <span className="bg-brut-red text-white text-[10px] font-display px-2 py-0.5 tracking-wider uppercase font-black">
                    KONFIRMASI HAPUS
                  </span>
                  <h3 className="font-display text-base uppercase mt-1 text-black leading-tight">
                    {confirmModal.title}
                  </h3>
                </div>
              </div>

              {/* Message */}
              <p className="text-xs font-bold text-black mb-6 leading-relaxed bg-brut-bg p-3 border-2 border-black">
                {confirmModal.message}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t-4 border-black pt-4">
                <button
                  type="button"
                  onClick={() => setConfirmModal(null)}
                  className="brut-btn bg-brut-paper text-black text-xs hover:bg-neutral-200"
                >
                  BATAL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    confirmModal.onConfirm();
                    setConfirmModal(null);
                  }}
                  className="brut-btn bg-brut-red text-white text-xs hover:bg-red-700"
                >
                  <FaTrash /> YA, HAPUS DARI SUPABASE!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
