import React, { useState, useEffect } from 'react';
import { ShieldCheck, LogIn, Lock, Monitor, Clock } from 'lucide-react';

interface KioskHeaderProps {
  onAdminLoginClick: () => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
  currentStep?: string;
}

export default function KioskHeader({
  onAdminLoginClick,
  isAdminLoggedIn,
  onLogout,
  currentStep,
}: KioskHeaderProps) {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <header className="bg-white border-b border-slate-200 text-slate-800 py-5 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-40 shadow-xs">
      {/* Brand & Kiosk Identifier */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-700 text-white p-2.5 rounded-xl font-mono tracking-wider font-bold text-lg flex items-center gap-1 shadow-sm">
            <Monitor className="w-5.5 h-5.5 text-indigo-100" />
            <span className="text-sm font-semibold tracking-widest">K-PASS</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-indigo-950 leading-none">Universitas Anak Bangsa</h1>
            <p className="text-[11px] text-slate-500 font-mono tracking-widest uppercase mt-0.5">UNABA Campus Terminal</p>
          </div>
        </div>

        {/* Small Active Indicator for Status */}
        <div className="md:ml-6 flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 font-normal"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-mono tracking-wide text-slate-600 font-semibold whitespace-nowrap uppercase">PORTAL AMAN ONLINE</span>
        </div>
      </div>

      {/* Real-time Clock widget */}
      <div className="flex items-center gap-4 bg-slate-50 px-5 py-2 rounded-xl border border-slate-200 text-center font-mono">
        <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>{formatDate(time)}</span>
        </div>
        <div className="w-px h-5 bg-slate-200"></div>
        <div className="text-indigo-650 text-indigo-600 text-xs font-bold tracking-wider">
          {formatTime(time)}
        </div>
      </div>

      {/* Staff Administration Button */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        {isAdminLoggedIn ? (
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-xl">
            <ShieldCheck className="w-4.5 h-4.5 text-indigo-600" />
            <span className="text-sm font-mono font-bold text-indigo-800">Staf Resepsionis</span>
            <button
              onClick={onLogout}
              className="ml-3 bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 text-xs px-3 py-1 rounded-lg font-mono transition-all font-bold uppercase cursor-pointer"
            >
              Keluar Dasbor
            </button>
          </div>
        ) : (
          <button
            onClick={onAdminLoginClick}
            id="staff-login-button"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-mono transition-all uppercase tracking-wide cursor-pointer font-bold"
          >
            <Lock className="w-4 h-4 text-slate-400" />
            <span>Login Staf</span>
          </button>
        )}
      </div>
    </header>
  );
}
