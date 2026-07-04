import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, CheckCircle, User, Phone, Mail, Landmark, HelpingHand,
  Check, ArrowRight, CornerDownLeft, Calendar
} from 'lucide-react';
import { Guest } from '../types';

interface CheckInFlowProps {
  onCancel: () => void;
  onCompleteCheckIn: (guestData: any) => Guest;
  onCompleteCheckOut?: (passNumber: string) => Guest | null;
  activeGuests?: Guest[];
  mode?: 'check-in' | 'check-out';
}

export default function CheckInFlow({
  onCancel,
  onCompleteCheckIn,
}: CheckInFlowProps) {
  // Form State in Indonesian
  const [nama, setNama] = useState('');
  const [telepon, setTelepon] = useState('');
  const [email, setEmail] = useState('');
  const [instansi, setInstansi] = useState('');
  const [tujuan, setTujuan] = useState('');

  // Flow State: 'form' | 'success'
  const [statusFlow, setStatusFlow] = useState<'form' | 'success'>('form');
  const [registeredPass, setRegisteredPass] = useState<Guest | null>(null);

  // Timer for Auto return home on success
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (statusFlow === 'success') {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            onCancel(); // return to home
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [statusFlow, onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    // Map Indonesian inputs to database model attributes
    const guestPayload = {
      name: nama.trim(),
      phone: telepon.trim() || undefined,
      email: email.trim() || undefined,
      institution: instansi.trim() || 'Umum / Mandiri',
      institutionOption: instansi.trim() ? 'other' : 'none',
      purpose: tujuan || 'Kunjungan Umum',
    };

    const createdGuest = onCompleteCheckIn(guestPayload);
    setRegisteredPass(createdGuest);
    setStatusFlow('success');
  };

  const isFormValid = () => {
    return nama.trim().length >= 2;
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 flex-1 flex flex-col justify-center">
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: REGISTRATION FORM */}
        {statusFlow === 'form' && (
          <motion.div
            key="visitor-form-view"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden"
          >
            {/* Header Form */}
            <div className="bg-slate-900 text-white p-6 md:p-8 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-indigo-400 font-bold uppercase">SEGMENT CATAT KEDATANGAN</span>
                <h3 className="text-xl md:text-2xl font-black tracking-tight font-display">Pencatatan Kehadiran Tamu</h3>
                <p className="text-xs text-slate-400 font-medium">Lengkapi isi formulir di bawah ini dengan mengetuk layar sentuh Anda.</p>
              </div>
              <button 
                type="button"
                onClick={onCancel}
                className="bg-slate-800 hover:bg-slate-700 text-slate-305 text-slate-300 p-3 rounded-xl transition-colors cursor-pointer flex items-center gap-2 font-mono text-xs font-bold"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">BATAL</span>
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
              
              {/* Field 1: Nama Lengkap */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 tracking-wide">
                  Nama Lengkap Anda <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-5 top-4.5 w-6 h-6 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Andi Wijaya"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    id="indonesian-name-input"
                    className="w-full bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-indigo-650 focus:border-indigo-600 focus:bg-white rounded-2xl py-4.5 pl-14 pr-6 font-sans text-lg md:text-xl text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-semibold shadow-xs"
                  />
                </div>
              </div>

              {/* Grid block for details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Field 2: Nomor WhatsApp / Telepon */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 tracking-wide">
                    Nomor WhatsApp / Hp <span className="text-slate-450 text-slate-400 text-xs font-medium">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-4.5 w-6 h-6 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="Contoh: 08123456789"
                      value={telepon}
                      onChange={(e) => setTelepon(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:bg-white rounded-2xl py-4.5 pl-14 pr-6 font-sans text-lg text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-semibold shadow-xs"
                    />
                  </div>
                </div>

                {/* Field 3: Alamat Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 tracking-wide">
                    Alamat Email <span className="text-slate-400 text-xs font-medium">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-4.5 w-6 h-6 text-slate-400" />
                    <input
                      type="email"
                      placeholder="Contoh: andi@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:bg-white rounded-2xl py-4.5 pl-14 pr-6 font-sans text-lg text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-semibold shadow-xs"
                    />
                  </div>
                </div>

              </div>

              {/* Field 4: Instansi */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 tracking-wide">
                  Instansi / Sekolah / Perusahaan Asal
                </label>
                <div className="relative">
                  <Landmark className="absolute left-5 top-4.5 w-6 h-6 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Contoh: PT. Teknologi Bangsa, Universitas Indonesia, dsb."
                    value={instansi}
                    onChange={(e) => setInstansi(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:bg-white rounded-2xl py-4.5 pl-14 pr-6 font-sans text-lg md:text-xl text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-semibold shadow-xs"
                  />
                </div>
              </div>

              {/* Field 5: Tujuan Kunjungan Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 tracking-wide">
                  Tujuan Kedatangan
                </label>
                <div className="relative">
                  <HelpingHand className="absolute left-5 top-4.5 w-6 h-6 text-slate-400 pointer-events-none" />
                  <select
                    value={tujuan}
                    onChange={(e) => setTujuan(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-700 rounded-2xl py-4.5 pl-14 pr-10 font-sans text-base md:text-lg focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-semibold shadow-xs appearance-none cursor-pointer"
                  >
                    <option value="">-- Pilih Tujuan --</option>
                    <option value="Pertemuan Staf / Dosen">Pertemuan Resmi / Rapat Dosen</option>
                    <option value="Kuliah Tamu / Seminar">Kuliah Tamu / Kerjasama Akademik</option>
                    <option value="Kunjungan Kampus / Study Tour">Kunjungan Kampus / Study Tour</option>
                    <option value="Urusan Administratif / Dokumen">Keperluan Berkas / Layanan Administrasi</option>
                    <option value="Lainnya">Urusan Lainnya</option>
                  </select>
                  <div className="absolute right-5 top-6 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 w-0 h-0"></div>
                </div>
              </div>

              {/* Active Actions Block */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-4.5 px-6 border-2 border-slate-200 hover:border-slate-400 text-slate-700 rounded-2xl text-base font-bold transition-all active:scale-95 text-center flex items-center justify-center gap-2 cursor-pointer bg-white"
                >
                  Batal & Kembali
                </button>

                <button
                  type="submit"
                  disabled={!isFormValid()}
                  id="submit-indonesian-form-btn"
                  className="flex-[2] py-4.5 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl text-lg font-extrabold shadow-lg hover:shadow-indigo-150 transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer disabled:pointer-events-none"
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>Kirim & Catat Kedatangan</span>
                </button>
              </div>

            </form>
          </motion.div>
        )}

        {/* VIEW 2: DONE (SUCCESS) CONFIRMATION */}
        {statusFlow === 'success' && (
          <motion.div
            key="success-done-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-905 rounded-3xl p-8 md:p-12 shadow-2xl text-center space-y-8 max-w-xl mx-auto"
          >
            {/* Massive Green Pulse Circle */}
            <div className="relative w-28 h-28 mx-auto bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-inner">
              <CheckCircle className="w-16 h-16" />
              <span className="absolute inset-0 rounded-full border-4 border-emerald-400/30 animate-ping"></span>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-mono font-bold tracking-widest bg-emerald-105 bg-emerald-105 bg-emerald-200 text-emerald-800 px-4 py-1.5 rounded-full uppercase">
                PENCATATAN SELESAI • DONE
              </span>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 leading-none">
                Selesai
              </h2>
              <p className="text-slate-650 text-slate-600 text-base md:text-lg max-w-md mx-auto leading-relaxed">
                Halo <span className="font-bold text-slate-900">{nama}</span>, data kunjungan Anda telah disimpan secara aman ke dalam sistem buku tamu Universitas Anak Bangsa (UNABA).
              </p>
            </div>

            {/* Custom Boarding Pass Receipt Mock Card */}
            {registeredPass && (
              <div className="bg-white border-2 border-emerald-100 rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto shadow-sm relative overflow-hidden font-mono mt-2">
                <div className="absolute right-[-25px] top-[15px] bg-slate-900 text-white text-[7px] font-bold tracking-widest rotate-45 py-1 px-8 uppercase">
                  UNABA
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-dashed border-slate-100">
                  <span className="text-[10px] text-slate-400">NOMOR REFERENSI:</span>
                  <span className="text-sm font-bold text-indigo-600">{registeredPass.visitorPassNumber}</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-450 text-slate-400">Instansi:</span>
                    <span className="text-slate-800 font-bold max-w-[200px] truncate text-right">{registeredPass.institution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tujuan Kunjungan:</span>
                    <span className="text-slate-800 font-bold max-w-[200px] truncate text-right">{registeredPass.purpose}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Waktu Masuk:</span>
                    <span className="text-slate-850 text-slate-800 font-bold">
                      {new Date(registeredPass.dateTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
                    </span>
                  </div>
                </div>

                {/* Clean Barcode */}
                <div className="pt-2 border-t border-slate-100 flex flex-col items-center">
                  <div className="flex gap-0.5 justify-center h-8 w-full">
                    {[1,2,3,1,4,1,2,1,3,2,1,4,2,1,3,1,2,2,4,1,3,1,4].map((bar, id) => (
                      <div 
                        key={id} 
                        style={{ width: `${bar * 1.5}px` }} 
                        className="bg-black h-full"
                      />
                    ))}
                  </div>
                  <span className="text-[8px] text-slate-400 mt-1">SELAmat DATAng di UNAba</span>
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4 max-w-md mx-auto">
              <button
                onClick={onCancel}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-sans text-base font-bold py-4 px-6 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <CornerDownLeft className="w-5 h-5" />
                <span>Selesai & Kembali ke Beranda ({countdown}s)</span>
              </button>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kartu akses digital Anda telah aktif. Silakan hubungi meja informasi untuk panduan arah gedung rujukan Anda.
              </p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
