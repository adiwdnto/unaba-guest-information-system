import React, { useState, useEffect } from 'react';
import KioskHeader from './components/KioskHeader';
import WelcomeScreen from './components/WelcomeScreen';
import CheckInFlow from './components/CheckInFlow';
import AdminLoginModal from './components/AdminLoginModal';
import Dashboard from './components/Dashboard';
import { Guest } from './types';
import { 
  getGuests, 
  addGuest, 
  checkoutGuest, 
  deleteGuest, 
  clearAllGuests, 
  seedMockData,
  updateGuest
} from './dbMock';

export default function App() {
  // Screens: 'welcome' | 'check-in' | 'check-out'
  const [screen, setScreen] = useState<'welcome' | 'check-in' | 'check-out'>('welcome');
  
  // Administrative Login States
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Guest list synchronized in local state from localStorage database on startup
  const [guests, setGuests] = useState<Guest[]>([]);

  // Synchronize on startup
  useEffect(() => {
    const records = getGuests();
    setGuests(records);
  }, []);

  // Update State Refresher helper
  const refreshLedger = () => {
    setGuests(getGuests());
  };

  // --- KIOSK GUEST LIFECYCLE CALLBACKS ---
  const handleCompleteCheckIn = (guestData: Omit<Guest, 'id' | 'visitorPassNumber' | 'dateTime' | 'status'>) => {
    const created = addGuest(guestData);
    refreshLedger();
    return created;
  };

  const handleCompleteCheckOut = (passNumber: string) => {
    // Look up guest by pass number in current list
    const found = guests.find(
      g => g.visitorPassNumber.trim().toUpperCase() === passNumber.trim().toUpperCase() && g.status === 'checked-in'
    );
    if (!found) return null;

    const result = checkoutGuest(found.id);
    refreshLedger();
    return result;
  };

  // --- ADMIN PANEL CALLBACKS ---
  const handleCheckOutAdmin = (id: string) => {
    checkoutGuest(id);
    refreshLedger();
  };

  const handleDeleteAdmin = (id: string) => {
    deleteGuest(id);
    refreshLedger();
  };

  const handleClearAllAdmin = () => {
    clearAllGuests();
    setGuests([]);
  };

  const handleSeedDataAdmin = () => {
    const seeded = seedMockData();
    setGuests(seeded);
  };

  const handleAddManualGuestAdmin = (guestData: any) => {
    addGuest(guestData);
    refreshLedger();
  };

  const handleUpdateGuestAdmin = (updatedGuest: Guest) => {
    updateGuest(updatedGuest);
    refreshLedger();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans select-none antialiased">
      {/* 1. Global Touchscreen Kiosk Header */}
      <KioskHeader 
        onAdminLoginClick={() => setIsLoginModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={() => setIsAdminLoggedIn(false)}
      />

      {/* 2. Main Workspace Layout */}
      <main className="flex-1">
        {isAdminLoggedIn ? (
          /* Staff Administration Panel View Port */
          <Dashboard
            guests={guests}
            onCheckOut={handleCheckOutAdmin}
            onDelete={handleDeleteAdmin}
            onClearAll={handleClearAllAdmin}
            onSeedData={handleSeedDataAdmin}
            onAddManualGuest={handleAddManualGuestAdmin}
            onUpdateGuest={handleUpdateGuestAdmin}
          />
        ) : (
          /* Public Touchscreen Self-Service Kiosk Terminal */
          <>
            {screen === 'welcome' && (
              <WelcomeScreen
                onStartRegistration={() => setScreen('check-in')}
                onStartCheckOut={() => setScreen('check-out')}
              />
            )}

            {(screen === 'check-in' || screen === 'check-out') && (
              <CheckInFlow
                mode={screen === 'check-out' ? 'check-out' : 'check-in'}
                onCancel={() => setScreen('welcome')}
                onCompleteCheckIn={handleCompleteCheckIn}
                onCompleteCheckOut={handleCompleteCheckOut}
                activeGuests={guests.filter(g => g.status === 'checked-in')}
              />
            )}
          </>
        )}
      </main>

      {/* 3. Secure Administrative Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => setIsAdminLoggedIn(true)}
      />
    </div>
  );
}
