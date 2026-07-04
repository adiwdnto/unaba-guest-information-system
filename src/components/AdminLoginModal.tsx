import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, X, Eye, EyeOff, Lock, UserCheck } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      if (response.ok) {
        onLoginSuccess();
        setUsername('');
        setPassword('');
        onClose();
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || 'Akses Ditolak. Nama Pengguna atau Kata Sandi Salah.');
      }
    } catch (err) {
      setError('Gagal menghubungkan ke server verifikasi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
        {/* Animated modal container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden w-full max-w-md relative animate-in"
        >
          {/* Header Banner */}
          <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base tracking-tight text-white m-0 font-display">GERBANG ADMINISTRASI</h3>
                <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">AUDITOR BUKU TAMU STAF</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-4 py-3 rounded-xl font-bold flex items-center gap-2"
              >
                <ShieldAlert className="w-4.5 h-4.5 text-rose-600 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wide">
                  ID Pengguna Staf
                </label>
                <input
                  type="text"
                  placeholder="admin"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  id="admin-username-input"
                  className="w-full bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:bg-white rounded-xl py-3 px-4 font-sans text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-semibold"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wide">
                  Kata Sandi Keamanan
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="admin-password-input"
                    className="w-full bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:bg-white rounded-xl py-3 pl-4 pr-11 font-sans text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-605 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* CTA action triggers */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-303 text-white font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>VERIFIKASI SISTEM...</span>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Konfirmasi Masuk Dasbor</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-mono text-[10px] font-bold py-3 rounded-xl transition-all uppercase cursor-pointer"
              >
                Batalkan
              </button>
            </div>
          </form>

          {/* Secure disclaimer brand footer */}
          <div className="bg-slate-50 text-[10px] font-mono text-slate-400 border-t border-slate-100 text-center py-3.5">
            SALURAN AMAN TERENKRIPSI SHA-256
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
