import React from 'react';
import { motion } from 'motion/react';
import { FilePlus, Landmark, ShieldCheck, HeartHandshake, MapPin } from 'lucide-react';

interface WelcomeScreenProps {
  onStartRegistration: () => void;
  onStartCheckOut?: () => void; // kept for interface compatibility
}

export default function WelcomeScreen({ onStartRegistration }: WelcomeScreenProps) {
  // Indonesian region welcome phrases
  const greetings = [
    { lang: 'ID', text: 'Selamat Datang' },
    { lang: 'EN', text: 'Welcome Guest' },
    { lang: 'SU', text: 'Wilujeng Sumping' },
    { lang: 'JV', text: 'Sugeng Rawuh' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 flex flex-col justify-between min-h-[calc(100vh-160px)]">
      {/* Visual Animation Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col justify-center items-center text-center space-y-8"
      >
        {/* Indonesian welcome ticker */}
        <div className="flex gap-3 bg-indigo-50 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-indigo-700 uppercase tracking-wider mb-2 border border-indigo-100">
          {greetings.map((g, idx) => (
            <React.Fragment key={g.lang}>
              <span>{g.text}</span>
              {idx < greetings.length - 1 && <span className="text-indigo-200">•</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-3xl">
            Selamat Datang di <br />
            <span className="text-indigo-650 text-indigo-650 bg-linear-to-r from-indigo-650 text-indigo-650 bg-clip-text text-indigo-700 font-black">
              Universitas Anak Bangsa (UNABA)
            </span>
          </h2>
          <p className="text-slate-650 text-slate-500 max-w-xl text-lg md:text-xl leading-relaxed mx-auto font-medium">
            Terminal Mandiri Pencatatan Pengunjung Kampus. Silakan lakukan registrasi kedatangan di bawah ini untuk mengonfirmasi kunjungan Anda.
          </p>
        </div>

        {/* Action Kiosk Selection Blocks - Resembles Airline Ticket Checkout Panels */}
        <div className="w-full max-w-2xl mt-6">
          {/* Main Action - Record Arrival (Catat Kedatangan) */}
          <button
            onClick={onStartRegistration}
            id="start-registration-btn"
            className="w-full group relative flex flex-col md:flex-row items-center gap-6 text-left bg-gradient-to-br from-indigo-650 via-indigo-600 to-indigo-700 text-white p-8 md:p-10 rounded-3xl shadow-xl transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-200"
          >
            <div className="bg-white/15 text-white p-5 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-md">
              <FilePlus className="w-12 h-12" />
            </div>
            
            <div className="flex-1 space-y-2">
              <span className="text-[11px] font-mono tracking-widest text-indigo-200 font-bold uppercase">PENDAFTARAN CEPAT • TOUCHSCREEN</span>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-1">Catat Kedatangan</h3>
              <p className="text-sm text-indigo-100 font-medium leading-relaxed">
                Isi data diri singkat, tujuan kunjungan, dan langsung dapatkan konfirmasi tanda masuk universitas.
              </p>
            </div>
            
            <div className="hidden md:block text-right pr-4 text-white opacity-40 group-hover:opacity-100 transition-opacity font-mono font-bold text-base tracking-widest">
              MULAI →
            </div>
          </button>
        </div>

        {/* Informative Touch Friendly Instruction Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-2xl bg-slate-50/80 border border-slate-200/60 p-5 rounded-2xl text-center text-slate-600 text-sm mt-6">
          <div className="flex flex-col items-center p-2">
            <MapPin className="w-5 h-5 text-indigo-500 mb-1.5" />
            <span className="font-mono text-[10px] text-slate-400 block tracking-widest uppercase font-bold">LOKASI</span>
            <span className="font-bold text-slate-800 mt-0.5">Lobi Utama Rektorat</span>
          </div>
          <div className="flex flex-col items-center border-y sm:border-y-0 sm:border-x border-slate-200 p-2">
            <Landmark className="w-5 h-5 text-indigo-500 mb-1.5" />
            <span className="font-mono text-[10px] text-slate-400 block tracking-widest uppercase font-bold">OTORITAS</span>
            <span className="font-bold text-slate-800 mt-0.5">Pusat Informasi UNABA</span>
          </div>
          <div className="flex flex-col items-center p-2">
            <ShieldCheck className="w-5 h-5 text-indigo-500 mb-1.5" />
            <span className="font-mono text-[10px] text-slate-400 block tracking-widest uppercase font-bold">KEAMANAN</span>
            <span className="font-bold text-slate-800 mt-0.5">Teregistrasi & Aman</span>
          </div>
        </div>
      </motion.div>

      {/* Footer Support Coordinates */}
      <footer className="text-center py-6 text-sm text-slate-400 border-t border-slate-100 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 font-medium">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-slate-400" />
          <span>Butuh bantuan? Silakan hubungi petugas resepsionis di samping Anda.</span>
        </div>
        <div className="font-mono text-[11px] tracking-wide bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200/50 font-bold">
          PUSAT INFORMASI EXT. 1102
        </div>
      </footer>
    </div>
  );
}
