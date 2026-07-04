import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, UserCheck, ShieldAlert, FileDown, Search, ArrowUpDown, Filter, 
  Trash2, ShieldOff, RefreshCw, PlusCircle, CheckCircle, Clock, Landmark, User, Phone, Mail, Building,
  Pencil, Plus, X
} from 'lucide-react';
import { Guest, POPULAR_PARTNERS } from '../types';

interface DashboardProps {
  guests: Guest[];
  onCheckOut: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onSeedData: () => void;
  onAddManualGuest: (guestData: any) => void;
  onUpdateGuest: (updatedGuest: Guest) => void;
}

export default function Dashboard({
  guests,
  onCheckOut,
  onDelete,
  onClearAll,
  onSeedData,
  onAddManualGuest,
  onUpdateGuest,
}: DashboardProps) {
  // Tabs: 'ledger' (Guest List), 'analytics' (Reports & Charts), 'register' (Manual Add)
  const [activeTab, setActiveTab] = useState<'ledger' | 'analytics' | 'register'>('ledger');

  // Modal CRUD states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  // Confirmation and toast states
  const [deleteConfirmGuest, setDeleteConfirmGuest] = useState<Guest | null>(null);
  const [isClearAllConfirmOpen, setIsClearAllConfirmOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev && prev.message === message ? null : prev));
    }, 4000);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmGuest) {
      onDelete(deleteConfirmGuest.id);
      showToast(`Data pengunjung "${deleteConfirmGuest.name}" berhasil dihapus permanen!`, 'success');
      setDeleteConfirmGuest(null);
    }
  };

  const handleConfirmClearAll = () => {
    onClearAll();
    showToast('Semua catatan data pengunjung berhasil dibersihkan permanen!', 'success');
    setIsClearAllConfirmOpen(false);
  };

  // States for Add/Edit Modal Forms
  const [modalName, setModalName] = useState('');
  const [modalPhone, setModalPhone] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalPurpose, setModalPurpose] = useState('');
  const [modalOption, setModalOption] = useState<'partner' | 'none' | 'other'>('partner');
  const [modalPartner, setModalPartner] = useState('');
  const [modalOtherInst, setModalOtherInst] = useState('');
  const [modalDateTime, setModalDateTime] = useState('');
  const [modalPassNumber, setModalPassNumber] = useState('');

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked-in' | 'checked-out'>('all');
  const [affiliationFilter, setAffiliationFilter] = useState<'all' | 'partner' | 'none' | 'other'>('all');

  // Sort Fields
  const [sortField, setSortField] = useState<'dateTime' | 'name' | 'institution'>('dateTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Manual Register form state
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualPurpose, setManualPurpose] = useState('');
  const [manualOption, setManualOption] = useState<'partner' | 'none' | 'other'>('partner');
  const [manualPartner, setManualPartner] = useState('');
  const [manualOtherInst, setManualOtherInst] = useState('');
  const [manualSuccessMessage, setManualSuccessMessage] = useState('');

  // COLORS for pie chart segments
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#3B82F6'];

  // Toggle Sorting helper
  const handleSort = (field: 'dateTime' | 'name' | 'institution') => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to descending for new sort
    }
  };

  // --- CSV Export Helper ---
  const handleExportCSV = () => {
    if (guests.length === 0) return;
    
    // Headers list
    const headers = ['Visitor Pass Code', 'Full Name', 'Institution / University', 'Phone Number', 'Email Address', 'Check-In Timestamp', 'Check-Out Timestamp', 'Purpose', 'Status'];
    
    // Rows
    const rows = guests.map(g => [
      g.visitorPassNumber,
      `"${g.name.replace(/"/g, '""')}"`,
      `"${g.institution.replace(/"/g, '""')}"`,
      g.phone || 'N/A',
      g.email || 'N/A',
      g.dateTime,
      g.checkoutTime || 'N/A',
      `"${(g.purpose || 'General Visit').replace(/"/g, '""')}"`,
      g.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    // Create download link element
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `campus_visitors_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- MANUAL VISIT SUBMUT ---
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    const institutionName = 
      manualOption === 'none' 
        ? 'None' 
        : manualOption === 'other' 
          ? (manualOtherInst || 'Other') 
          : (manualPartner || POPULAR_PARTNERS[0]);

    onAddManualGuest({
      name: manualName,
      institution: institutionName,
      institutionOption: manualOption,
      phone: manualPhone || undefined,
      email: manualEmail || undefined,
      purpose: manualPurpose || 'Manual Staff Register',
    });

    const registeredName = manualName;
    setManualName('');
    setManualPhone('');
    setManualEmail('');
    setManualPurpose('');
    setManualOtherInst('');
    showToast(`Data pengunjung "${registeredName}" berhasil ditambahkan via Staff Register!`, 'success');
    setManualSuccessMessage('Staff registered guest successfully!');
    setTimeout(() => setManualSuccessMessage(''), 4000);
  };

  // --- STATISTICS COMPUTING ---
  const statistics = useMemo(() => {
    const total = guests.length;
    
    // Count partner institutions check-ins vs none vs other
    const counts = guests.reduce((acc, current) => {
      acc[current.institutionOption] = (acc[current.institutionOption] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      partnerCount: counts.partner || 0,
      noneCount: counts.none || 0,
      otherCount: counts.other || 0,
    };
  }, [guests]);

  // --- FILTERED & SORTED LEGDGER LIST ---
  const filteredGuests = useMemo(() => {
    let result = [...guests];

    // Search query constraint
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(g => 
        g.name.toLowerCase().includes(q) || 
        g.institution.toLowerCase().includes(q) || 
        g.visitorPassNumber.toLowerCase().includes(q) ||
        (g.purpose && g.purpose.toLowerCase().includes(q))
      );
    }

    // Affiliation category constraint Method
    if (affiliationFilter !== 'all') {
      result = result.filter(g => g.institutionOption === affiliationFilter);
    }

    // Sort operations
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'dateTime') {
        comparison = new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
      } else {
        const valA = a[sortField]?.toLowerCase() || '';
        const valB = b[sortField]?.toLowerCase() || '';
        comparison = valA.localeCompare(valB);
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [guests, searchQuery, affiliationFilter, sortField, sortDirection]);

  // --- MODAL CRUD OPERATIONS ---
  const startAdd = () => {
    setEditingGuest(null);
    setModalName('');
    setModalPhone('');
    setModalEmail('');
    setModalPurpose('');
    setModalOption('none');
    setModalPartner('');
    setModalOtherInst('');
    const now = new Date();
    const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setModalDateTime(localISO);
    
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const passNum = `CP-${now.getFullYear() % 100}${String(now.getMonth() + 1).padStart(2, '0')}-${randNum}`;
    setModalPassNumber(passNum);
    setIsAddModalOpen(true);
  };

  const startEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setModalName(guest.name);
    setModalPhone(guest.phone || '');
    setModalEmail(guest.email || '');
    setModalPurpose(guest.purpose || '');
    setModalOption(guest.institutionOption || 'none');
    if (guest.institutionOption === 'partner') {
      setModalPartner(guest.institution);
      setModalOtherInst('');
    } else if (guest.institutionOption === 'other') {
      setModalPartner('');
      setModalOtherInst(guest.institution);
    } else {
      setModalPartner('');
      setModalOtherInst('');
    }
    
    try {
      const d = new Date(guest.dateTime);
      const localISO = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setModalDateTime(localISO);
    } catch (e) {
      setModalDateTime('');
    }
    setModalPassNumber(guest.visitorPassNumber);
    setIsAddModalOpen(true); // Re-use the same modal window for simplicity
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalName.trim()) return;

    const institutionName = 
      modalOption === 'none' 
        ? 'Umum / Mandiri' 
        : modalOption === 'other' 
          ? (modalOtherInst || 'Lainnya') 
          : (modalPartner || POPULAR_PARTNERS[0]);

    const isoDateTime = modalDateTime ? new Date(modalDateTime).toISOString() : new Date().toISOString();

    if (editingGuest) {
      const updated: Guest = {
        ...editingGuest,
        name: modalName.trim(),
        institution: institutionName,
        institutionOption: modalOption,
        phone: modalPhone.trim() || undefined,
        email: modalEmail.trim() || undefined,
        purpose: modalPurpose.trim() || 'Kunjungan',
        dateTime: isoDateTime,
        visitorPassNumber: modalPassNumber,
      };
      onUpdateGuest(updated);
      showToast(`Data pengunjung "${updated.name}" berhasil diubah!`, 'success');
      setEditingGuest(null);
      setIsAddModalOpen(false);
    } else {
      const newGuestData = {
        name: modalName.trim(),
        institution: institutionName,
        institutionOption: modalOption,
        phone: modalPhone.trim() || undefined,
        email: modalEmail.trim() || undefined,
        purpose: modalPurpose.trim() || 'Tambah Manual Staf',
        dateTime: isoDateTime,
        visitorPassNumber: modalPassNumber,
      };
      onAddManualGuest(newGuestData);
      showToast(`Data pengunjung "${newGuestData.name}" berhasil ditambahkan!`, 'success');
      setIsAddModalOpen(false);
    }
  };

  // --- CHARTS CALCULATIONS ---
  // 1. Hourly checkin density
  const hourlyChartData = useMemo(() => {
    const hours = Array.from({ length: 12 }, (_, i) => {
      const hourVal = 8 + i; // 8:00 AM to 7:00 PM
      const label = hourVal > 12 ? `${hourVal - 12} PM` : hourVal === 12 ? '12 PM' : `${hourVal} AM`;
      return { hour: hourVal, label, checkins: 0, checkouts: 0 };
    });

    guests.forEach((g) => {
      // Calculate check in hour
      const dIn = new Date(g.dateTime);
      const hIn = dIn.getHours();
      const machIn = hours.find(h => h.hour === hIn);
      if (machIn) machIn.checkins += 1;

      // Calculate check out hour
      if (g.checkoutTime) {
        const dOut = new Date(g.checkoutTime);
        const hOut = dOut.getHours();
        const machOut = hours.find(h => h.hour === hOut);
        if (machOut) machOut.checkouts += 1;
      }
    });

    return hours;
  }, [guests]);

  // 2. Affiliation Distribution percentage pie
  const distributionChartData = useMemo(() => {
    const map: Record<string, number> = {};
    guests.forEach(g => {
      const label = g.institutionOption === 'none' 
        ? 'Public (None)' 
        : g.institutionOption === 'other' 
          ? 'External (Other)' 
          : g.institution;
      map[label] = (map[label] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [guests]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-6 space-y-8">
      {/* Overview stats panels card decks */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total stats */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block font-display">Total Kedatangan</span>
            <div className="text-3xl font-extrabold text-indigo-400">{statistics.total}</div>
            <span className="text-[10px] text-slate-500 font-mono block">SEMUA CATATAN KEDATANGAN</span>
          </div>
          <div className="bg-slate-800 p-3.5 rounded-xl text-indigo-400 shadow">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Mitra Akademik */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">Mitra Akademik</span>
            <div className="text-3xl font-extrabold text-indigo-600">{statistics.partnerCount}</div>
            <span className="text-[10px] text-indigo-500 font-mono font-bold block">MAHASISWA / DOSEN MITRA</span>
          </div>
          <div className="bg-indigo-50 p-3.5 rounded-xl text-indigo-600 shadow-inner">
            <Landmark className="w-6 h-6" />
          </div>
        </div>

        {/* Umum / Mandiri */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">Umum / Mandiri</span>
            <div className="text-3xl font-extrabold text-emerald-600">{statistics.noneCount}</div>
            <span className="text-[10px] text-emerald-500 font-mono font-bold block">PENGUNJUNG UMUM</span>
          </div>
          <div className="bg-emerald-50 p-3.5 rounded-xl text-emerald-600 shadow-inner">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Organisasi Lain */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">Instansi Lainnya</span>
            <div className="text-3xl font-extrabold text-amber-600">{statistics.otherCount}</div>
            <span className="text-[10px] text-amber-500 font-mono font-bold block">SWASTA / SEKOLAH LAIN</span>
          </div>
          <div className="bg-amber-50 p-3.5 rounded-xl text-amber-600 shadow-inner">
            <Building className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Board tabs and Actions */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg">
        {/* Navigation layout tab deck */}
        <div className="bg-slate-900 px-6 py-1 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2 py-3 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-4.5 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'ledger'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📖 Real-time Guest Ledger
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4.5 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📊 Metrics & Visual Reports
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`px-4.5 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'register'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ➕ Staff Quick Register
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pb-3 sm:pb-0 justify-end w-full sm:w-auto">
            <button
              onClick={startAdd}
              id="toolbar-add-guest-btn"
              className="bg-indigo-600 hover:bg-indigo-750 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pengunjung</span>
            </button>
            <button
              onClick={handleExportCSV}
              disabled={guests.length === 0}
              className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 text-slate-200 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export CSV Invoice Log</span>
            </button>
          </div>
        </div>

        {/* Content body based on active tab */}
        <div className="p-6">
          
          {/* TAB 1: LEDGER TABLE */}
          {activeTab === 'ledger' && (
            <div className="space-y-6">
              {/* Search, Filter bar row layout */}
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-slate-50 p-4 rounded-2xl border border-slate-250">
                {/* Search query box */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama pengunjung, kode pass, instansi, atau tujuan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-xl py-2 pl-10 pr-4 font-sans text-xs focus:outline-none transition-all font-semibold"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-650 text-xs px-1 hover:bg-slate-100 rounded"
                    >
                      BERSIHKAN
                    </button>
                  )}
                </div>

                {/* Filters select block */}
                <div className="flex flex-wrap gap-2 items-center">
                  {/* Affiliation category selector */}
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
                    <Landmark className="w-3.5 h-3.5 text-slate-450 text-slate-400" />
                    <select
                      value={affiliationFilter}
                      onChange={(e: any) => setAffiliationFilter(e.target.value)}
                      className="text-xs bg-transparent border-none text-slate-700 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="all">Semua Kategori</option>
                      <option value="partner">Mitra Akademik</option>
                      <option value="none">Umum (Tidak Ada)</option>
                      <option value="other">Instansi Lain</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table Data list */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-300 font-mono text-[10px] tracking-widest uppercase">
                        <th className="py-3 px-4">Kode Pass #</th>
                        <th className="py-3 px-4 hover:bg-slate-850 cursor-pointer" onClick={() => handleSort('name')}>
                          <div className="flex items-center gap-1">
                            <span>Nama / Kontak</span>
                            <ArrowUpDown className="w-3 h-3 text-slate-500" />
                          </div>
                        </th>
                        <th className="py-3 px-4 hover:bg-slate-850 cursor-pointer" onClick={() => handleSort('institution')}>
                          <div className="flex items-center gap-1">
                            <span>Instansi / Kelompok</span>
                            <ArrowUpDown className="w-3 h-3 text-slate-500" />
                          </div>
                        </th>
                        <th className="py-3 px-4 hover:bg-slate-850 cursor-pointer" onClick={() => handleSort('dateTime')}>
                          <div className="flex items-center gap-1">
                            <span>Waktu Kedatangan</span>
                            <ArrowUpDown className="w-3 h-3 text-slate-500" />
                          </div>
                        </th>
                        <th className="py-3 px-4">Tujuan Kunjungan</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredGuests.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                            Tidak ada catatan pengunjung yang cocok dengan filter saat ini.
                          </td>
                        </tr>
                      ) : (
                        filteredGuests.map((visitor) => (
                          <tr key={visitor.id} className="hover:bg-slate-50/50 transition-colors text-xs">
                            {/* Pass Number */}
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">
                              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[10.5px]">
                                {visitor.visitorPassNumber}
                              </span>
                            </td>

                            {/* Name & details */}
                            <td className="py-3 px-4">
                              <div className="space-y-0.5">
                                <div className="font-bold text-slate-805 text-slate-800 text-sm">{visitor.name}</div>
                                <div className="text-slate-400 font-mono text-[9px] flex flex-wrap gap-1 md:gap-2">
                                  {visitor.phone && <span className="flex items-center gap-0.5 text-slate-500">📞 {visitor.phone}</span>}
                                  {visitor.email && <span className="flex items-center gap-0.5 text-slate-500">✉️ {visitor.email}</span>}
                                  {!visitor.phone && !visitor.email && <span className="text-slate-400 font-medium">Tidak ada kontak</span>}
                                </div>
                              </div>
                            </td>

                            {/* Institution */}
                            <td className="py-3 px-4">
                              <div className="space-y-0.5">
                                <p className="font-semibold text-slate-800 leading-tight">{visitor.institution}</p>
                                <span className={`text-[9px] font-mono font-bold uppercase ${
                                  visitor.institutionOption === 'partner' 
                                    ? 'text-indigo-600' 
                                    : visitor.institutionOption === 'none' 
                                      ? 'text-slate-400' 
                                      : 'text-amber-600'
                                }`}>
                                  Kategori: {visitor.institutionOption === 'partner' ? 'Mitra' : visitor.institutionOption === 'none' ? 'Umum' : 'Lainnya'}
                                </span>
                              </div>
                            </td>

                            {/* DateTime check-in only */}
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                                <span>
                                  {new Date(visitor.dateTime).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })} pukul {new Date(visitor.dateTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                </span>
                              </div>
                            </td>

                            {/* Purpose */}
                            <td className="py-3 px-4 text-slate-500">
                              <p className="truncate max-w-40 font-medium leading-none" title={visitor.purpose}>
                                {visitor.purpose || 'Kunjungan'}
                              </p>
                            </td>

                            {/* Actions Column */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => startEdit(visitor)}
                                  className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 hover:text-indigo-850 text-[10px] uppercase font-mono font-bold py-1 px-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <Pencil className="w-3 h-3" />
                                  <span>Ubah</span>
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmGuest(visitor)}
                                  className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                                  title="Hapus data pengunjung"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ledger Admin Utilities Panel */}
              <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-250 gap-4">
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] text-slate-400 font-bold uppercase block tracking-wider leading-none">DATABASE HARD RESET TOOLS</span>
                  <span className="text-slate-500 text-xs mt-1">Easily clear local database, restore seed template records, or reset the kiosk testing framework.</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onSeedData}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset & Seed Samples</span>
                  </button>
                  <button
                    onClick={() => setIsClearAllConfirmOpen(true)}
                    className="bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 px-4.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1"
                  >
                    <ShieldOff className="w-3.5 h-3.5" />
                    <span>Purge Ledger Tables</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REPORTS & CHARTS */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 py-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 1. Bar Chart: Check-ins by Hour */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 md:p-6 space-y-4 shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-widest block font-display">KEPADATAN KEDATANGAN</span>
                    <h4 className="text-base font-extrabold text-slate-900 leading-none font-display">Grafik Arus Kedatangan per Jam</h4>
                  </div>
                  <p className="text-xs text-slate-500">Analisis frekuensi kedatangan pengunjung berdasarkan waktu penerbitan kartu pass selama jam kerja.</p>
                  
                  {guests.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
                      Tidak ada data untuk ditampilkan. Silakan generate sampel pengunjung terlebih dahulu.
                    </div>
                  ) : (
                    <div className="h-72 w-full pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                           data={hourlyChartData}
                          margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="label" stroke="#94A3B8" fontSize={10} fontStyle="mono" />
                          <YAxis stroke="#94A3B8" fontSize={10} fontStyle="mono" allowDecimals={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '12px', border: 'none', fontFamily: 'mono', fontSize: '11px' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '10.5px' }} />
                          <Bar dataKey="checkins" name="Kedatangan (Check-In)" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* 2. Pie Chart: Affiliation Breakdowns */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 md:p-6 space-y-4 shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-widest block">DISTRIBUSI DEMOGRAFIS</span>
                    <h4 className="text-base font-extrabold text-slate-900 leading-none">Pangsa Segmen Pengunjung</h4>
                  </div>
                  <p className="text-xs text-slate-500">Persentase distribusi pengunjung berdasarkan kategori instansi afiliasi akademik atau kunjungan umum.</p>

                  {guests.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
                      Tidak ada data untuk menampilkan grafik. Silakan generate sampel pengunjung terlebih dahulu.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {/* Pie Visualizer */}
                      <div className="h-60 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={distributionChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {distributionChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '12px', border: 'none', fontFamily: 'mono', fontSize: '11px' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        {/* Centered overall indicator text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-3xl font-black text-slate-800">{guests.length}</span>
                          <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">KARTU LOG</span>
                        </div>
                      </div>

                      {/* Legend detail panel */}
                      <div className="flex flex-col justify-center space-y-2 max-h-60 overflow-y-auto pr-1">
                        {distributionChartData.map((item, index) => {
                          const percentage = Math.round((item.value / guests.length) * 100);
                          return (
                            <div key={item.name} className="flex items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-1.5 truncate">
                                <span 
                                  className="w-2.5 h-2.5 rounded-full inline-block shrink-0" 
                                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="font-medium text-slate-700 truncate" title={item.name}>
                                  {item.name}
                                </span>
                              </div>
                              <span className="font-mono font-bold text-slate-500 whitespace-nowrap">
                                {item.value} ({percentage}%)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Informative advice message footer */}
              <div className="bg-indigo-50 border border-indigo-150 p-4.5 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-indigo-605 text-indigo-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="font-bold text-indigo-900 text-xs">Catatan Audit Analisis Log Meja Depan</h5>
                  <p className="text-indigo-700 text-xs leading-relaxed">
                    Periode arus lalu lintas puncak menunjukkan waktu kuliah akademik yang padat dan simposium penelitian. Pastikan persediaan kartu fisik yang cukup pada printer printer kiosk selama jam check-in yang padat, khususnya antara pukul <strong>08:00 WIB - 11:30 WIB</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANUAL QUICK REGISTER */}
          {activeTab === 'register' && (
            <div className="max-w-xl mx-auto py-4">
              <form onSubmit={handleManualSubmit} className="space-y-6 bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200">
                <div className="space-y-1.5 border-b border-slate-205 border-slate-200 pb-4">
                  <h4 className="text-lg font-extrabold text-slate-900">Front-Desk Manual Check-In</h4>
                  <p className="text-slate-500 text-xs">Register walk-in guests manually on behalf of the visitor if they bypass the kiosk touchscreen terminal.</p>
                </div>

                {manualSuccessMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-50 border border-emerald-250 text-emerald-850 text-xs py-3 px-4 rounded-xl font-semibold flex items-center gap-2 text-emerald-900"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{manualSuccessMessage}</span>
                  </motion.div>
                )}

                {/* Form Fields */}
                <div className="space-y-4">
                  
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                      Visitor Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Jane Smith"
                        required
                        value={manualName}
                        onChange={(e) => setManualName(e.target.value)}
                        className="w-full bg-white border border-slate-200 hover:border-slate-350 focus:border-indigo-600 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 font-sans text-xs focus:outline-none transition-all font-semibold"
                      />
                    </div>
                  </div>

                  {/* Institution Options Tri-Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                      Affiliation Type
                    </label>
                    <div className="flex gap-2 p-1 bg-slate-200/60 rounded-xl">
                      {(['partner', 'none', 'other'] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setManualOption(opt)}
                          className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg uppercase tracking-wide transition-all cursor-pointer ${
                            manualOption === opt
                              ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sub-inputs based on selection */}
                  {manualOption === 'partner' && (
                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Select Academic Partner
                      </label>
                      <select
                        value={manualPartner}
                        onChange={(e) => setManualPartner(e.target.value)}
                        required
                        className="w-full bg-white border border-slate-250 text-slate-700 rounded-xl py-2.5 px-4 font-sans text-xs focus:outline-none focus:border-indigo-600 transition-all font-semibold"
                      >
                        <option value="">-- Choose Partner --</option>
                        {POPULAR_PARTNERS.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {manualOption === 'other' && (
                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Specify Organization Name
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g. Oracle Lab, CERN Corporation"
                          required
                          value={manualOtherInst}
                          onChange={(e) => setManualOtherInst(e.target.value)}
                          className="w-full bg-white border border-slate-200 hover:border-slate-350 focus:border-indigo-600 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 font-sans text-xs focus:outline-none transition-all font-semibold"
                        />
                      </div>
                    </div>
                  )}

                  {/* Phone & Email contacts in 2 grid layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Phone (Optional)
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={manualPhone}
                          onChange={(e) => setManualPhone(e.target.value)}
                          className="w-full bg-white border border-slate-200 hover:border-slate-350 focus:border-indigo-600 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 font-sans text-xs focus:outline-none transition-all font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Email (Optional)
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          placeholder="visitor@mail.com"
                          value={manualEmail}
                          onChange={(e) => setManualEmail(e.target.value)}
                          className="w-full bg-white border border-slate-200 hover:border-slate-350 focus:border-indigo-600 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 font-sans text-xs focus:outline-none transition-all font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Visit Purpose selection */}
                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                      Visitor Purpose
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Audit meeting, Interview or lecture..."
                      value={manualPurpose}
                      onChange={(e) => setManualPurpose(e.target.value)}
                      className="w-full bg-white border border-slate-200 hover:border-slate-350 focus:border-indigo-600 focus:bg-white rounded-xl py-2.5 px-4 font-sans text-xs focus:outline-none transition-all font-semibold"
                    />
                  </div>

                </div>

                {/* Confirm Register submission */}
                <div className="pt-2 border-t border-slate-200 flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono uppercase text-xs font-bold tracking-wider py-3.5 px-6 rounded-xl shadow transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Register Walk-in Guest</span>
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>
      </div>

      {/* 4. CRUD Modals for Add & Edit Guests */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 shadow-2xl rounded-3xl max-w-lg w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-extrabold font-mono uppercase tracking-wider">
                  {editingGuest ? 'Ubah Data Pengunjung' : 'Tambah Pengunjung Baru'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingGuest(null);
                }}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form content */}
            <form onSubmit={handleModalSubmit} className="p-6 space-y-4">
              {/* Pass Number (read-only for Edit) */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                  KODE PASS PENGUNJUNG
                </label>
                <input 
                  type="text"
                  readOnly
                  value={modalPassNumber}
                  className="w-full bg-slate-100 border border-slate-200 text-slate-600 rounded-xl py-2.5 px-4 font-mono text-xs font-bold focus:outline-none"
                />
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Nama Lengkap *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap"
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    className="w-full bg-white border border-slate-200 hover:border-slate-350 focus:border-indigo-600 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 font-sans text-xs focus:outline-none transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Affiliation / Institution selection */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Kategori Instansi / Kelompok
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOption('partner')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                      modalOption === 'partner'
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Mitra Akademik
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOption('none')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                      modalOption === 'none'
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Umum / None
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOption('other')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                      modalOption === 'other'
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Instansi Lain
                  </button>
                </div>
              </div>

              {/* Conditional Inputs */}
              {modalOption === 'partner' && (
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                    PILIH KAMPUS MITRA
                  </label>
                  <select
                    value={modalPartner}
                    onChange={(e) => setModalPartner(e.target.value)}
                    className="w-full bg-white border border-slate-200 hover:border-slate-350 focus:border-indigo-600 focus:bg-white rounded-xl py-2.5 px-3 font-sans text-xs font-semibold focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="">-- Pilih Kampus Mitra --</option>
                    {POPULAR_PARTNERS.map((partner) => (
                      <option key={partner} value={partner}>{partner}</option>
                    ))}
                  </select>
                </div>
              )}

              {modalOption === 'other' && (
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                    Nama Instansi Kustom
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: PT Anak Bangsa Tbk, Univ Terbuka"
                      value={modalOtherInst}
                      onChange={(e) => setModalOtherInst(e.target.value)}
                      className="w-full bg-white border border-slate-200 hover:border-slate-350 focus:border-indigo-600 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 font-sans text-xs focus:outline-none transition-all font-semibold"
                    />
                  </div>
                </div>
              )}

              {/* Phone & Email contacts in 2 grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                    Nomor Telepon (Opsional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="0812xxxxxx"
                      value={modalPhone}
                      onChange={(e) => setModalPhone(e.target.value)}
                      className="w-full bg-white border border-slate-200 hover:border-slate-350 focus:border-indigo-600 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 font-sans text-xs focus:outline-none transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                    Email (Opsional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="pengunjung@mail.com"
                      value={modalEmail}
                      onChange={(e) => setModalEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 hover:border-slate-350 focus:border-indigo-600 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 font-sans text-xs focus:outline-none transition-all font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Visit Purpose selection */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Tujuan Kunjungan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Rapat Koordinasi, Kuliah Umum, dsb"
                  value={modalPurpose}
                  onChange={(e) => setModalPurpose(e.target.value)}
                  className="w-full bg-white border border-slate-200 hover:border-slate-350 focus:border-indigo-600 focus:bg-white rounded-xl py-2.5 px-4 font-sans text-xs focus:outline-none transition-all font-semibold"
                />
              </div>

              {/* Date & Time selection */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Waktu Kedatangan
                </label>
                <input
                  type="datetime-local"
                  required
                  value={modalDateTime}
                  onChange={(e) => setModalDateTime(e.target.value)}
                  className="w-full bg-white border border-slate-200 hover:border-slate-350 focus:border-indigo-600 focus:bg-white rounded-xl py-2.5 px-4 font-mono text-xs focus:outline-none transition-all font-semibold cursor-pointer"
                />
              </div>

              {/* Submission buttons */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingGuest(null);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono uppercase text-xs font-bold tracking-wider py-2.5 px-5 rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono uppercase text-xs font-bold tracking-wider py-2.5 px-5 rounded-xl shadow transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <span>Simpan Perubahan</span>
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}

      {/* 5. Custom Deletion Confirmation Modal */}
      {deleteConfirmGuest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 shadow-2xl rounded-3xl max-w-md w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-rose-950 px-6 py-4 flex items-center justify-between border-b border-rose-900">
              <div className="flex items-center gap-2 text-rose-200">
                <Trash2 className="w-5 h-5 text-rose-400" />
                <h3 className="text-xs font-extrabold font-mono uppercase tracking-wider">
                  Konfirmasi Hapus Data
                </h3>
              </div>
              <button
                onClick={() => setDeleteConfirmGuest(null)}
                className="text-rose-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="font-bold text-rose-900 text-xs">Tindakan ini tidak dapat dibatalkan!</h5>
                  <p className="text-rose-700 text-xs leading-relaxed">
                    Apakah Anda yakin ingin menghapus data kunjungan untuk <strong>{deleteConfirmGuest.name}</strong> ({deleteConfirmGuest.visitorPassNumber}) secara permanen? Semua log riwayat kunjungan yang bersangkutan akan terhapus selamanya dari sistem.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmGuest(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono uppercase text-xs font-bold tracking-wider py-2.5 px-5 rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-mono uppercase text-xs font-bold tracking-wider py-2.5 px-5 rounded-xl shadow transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Permanen</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 6. Custom Clear All Confirmation Modal */}
      {isClearAllConfirmOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 shadow-2xl rounded-3xl max-w-md w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-rose-950 px-6 py-4 flex items-center justify-between border-b border-rose-900">
              <div className="flex items-center gap-2 text-rose-200">
                <ShieldOff className="w-5 h-5 text-rose-400" />
                <h3 className="text-xs font-extrabold font-mono uppercase tracking-wider">
                  Bersihkan Seluruh Database
                </h3>
              </div>
              <button
                onClick={() => setIsClearAllConfirmOpen(false)}
                className="text-rose-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="font-bold text-rose-900 text-xs">PERINGATAN KERAS!</h5>
                  <p className="text-rose-700 text-xs leading-relaxed">
                    Tindakan ini akan <strong>menghapus seluruh database pengunjung</strong> secara permanen. Semua data akan hilang tanpa ada opsi pemulihan. Silakan lakukan ekspor CSV terlebih dahulu jika Anda memerlukan cadangan data.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsClearAllConfirmOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono uppercase text-xs font-bold tracking-wider py-2.5 px-5 rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClearAll}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-mono uppercase text-xs font-bold tracking-wider py-2.5 px-5 rounded-xl shadow transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <ShieldOff className="w-4 h-4" />
                  <span>Bersihkan Semua</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 text-xs font-semibold ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-emerald-100'
                : toast.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-900 shadow-rose-100'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-900 shadow-indigo-100'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : toast.type === 'error' ? (
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            ) : (
              <Clock className="w-5 h-5 text-indigo-600 shrink-0" />
            )}
            <div className="flex-1 space-y-1">
              <p className="leading-normal">{toast.message}</p>
            </div>
            <button 
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
}
