import { Guest } from './types';

const STORAGE_KEY = 'campus_guest_registration_database';

// Helper to get raw guests
export function getGuests(): Guest[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return seedMockData();
  }
  try {
    return JSON.parse(data) as Guest[];
  } catch (error) {
    console.error('Failed to parse guests from localStorage', error);
    return [];
  }
}

// Save guests helper
export function saveGuests(guests: Guest[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
}

// Add a guest
export function addGuest(guestData: Partial<Guest> & { name: string; institution: string; institutionOption: 'none' | 'other' | 'partner' }): Guest {
  const guests = getGuests();
  const now = new Date();
  
  // Format visitor pass number like BOARDING PASS: campus code + sequential
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const passNum = `CP-${now.getFullYear() % 100}${String(now.getMonth() + 1).padStart(2, '0')}-${randNum}`;

  const newGuest: Guest = {
    phone: guestData.phone,
    email: guestData.email,
    purpose: guestData.purpose,
    ...guestData,
    id: guestData.id || (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11)),
    dateTime: guestData.dateTime || now.toISOString(),
    status: 'checked-in',
    visitorPassNumber: guestData.visitorPassNumber || passNum,
  };

  guests.unshift(newGuest); // Add new guest at the top
  saveGuests(guests);
  return newGuest;
}

// Edit/Update a guest
export function updateGuest(updatedGuest: Guest): void {
  const guests = getGuests();
  const index = guests.findIndex(g => g.id === updatedGuest.id);
  if (index !== -1) {
    guests[index] = updatedGuest;
    saveGuests(guests);
  }
}

// Check out a guest
export function checkoutGuest(id: string): Guest | null {
  const guests = getGuests();
  const index = guests.findIndex(g => g.id === id);
  if (index !== -1) {
    guests[index] = {
      ...guests[index],
      status: 'checked-out',
      checkoutTime: new Date().toISOString(),
    };
    saveGuests(guests);
    return guests[index];
  }
  return null;
}

// Delete a guest
export function deleteGuest(id: string): void {
  const guests = getGuests();
  const filtered = guests.filter(g => g.id !== id);
  saveGuests(filtered);
}

// Reset/Clear mock db
export function clearAllGuests(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Seed mock data with varied dates/times to make report charts look gorgeous!
export function seedMockData(): Guest[] {
  const now = new Date();
  const createPastDate = (daysAgo: number, hoursAgo: number, minutesAgo: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(d.getHours() - hoursAgo, d.getMinutes() - minutesAgo, 0, 0);
    return d.toISOString();
  };

  const sampleGuests: Guest[] = [
    {
      id: 'mock-1',
      name: 'Dr. Sarah Jenkins',
      institution: 'Massachusetts Institute of Technology',
      institutionOption: 'partner',
      dateTime: createPastDate(0, 1, 45), // checked in 1h 45m ago
      phone: '+1 (555) 019-2834',
      email: 'sjenkins@mit.edu',
      status: 'checked-in',
      visitorPassNumber: 'CP-2606-4821',
      purpose: 'Guest Lecture in CSE Department',
    },
    {
      id: 'mock-2',
      name: 'Michael Chen',
      institution: 'Google Research',
      institutionOption: 'partner',
      dateTime: createPastDate(0, 3, 10), // 3h 10m ago
      phone: '+1 (555) 014-9843',
      email: 'mchen@google.com',
      status: 'checked-in',
      visitorPassNumber: 'CP-2606-1184',
      purpose: 'Research Collaboration Meting',
    },
    {
      id: 'mock-3',
      name: 'Elena Rostova',
      institution: 'Stanford University',
      institutionOption: 'partner',
      dateTime: createPastDate(0, 4, 30), // 4h 30m ago, already checked out
      phone: '+1 (555) 018-4721',
      email: 'erostova@stanford.edu',
      status: 'checked-out',
      checkoutTime: createPastDate(0, 1, 15),
      visitorPassNumber: 'CP-2606-9932',
      purpose: 'Library Access & Archival Study',
    },
    {
      id: 'mock-4',
      name: 'John Miller',
      institution: 'None',
      institutionOption: 'none',
      dateTime: createPastDate(0, 5, 12),
      phone: '+1 (555) 012-3211',
      email: 'john.miller@live.com',
      status: 'checked-in',
      visitorPassNumber: 'CP-2606-2391',
      purpose: 'Campus Tour',
    },
    {
      id: 'mock-5',
      name: 'Professor David Sterling',
      institution: 'Harvard University',
      institutionOption: 'partner',
      dateTime: createPastDate(0, 6, 20),
      phone: '+1 (555) 015-8822',
      email: 'sterling@harvard.edu',
      status: 'checked-out',
      checkoutTime: createPastDate(0, 2, 50),
      visitorPassNumber: 'CP-2606-7740',
      purpose: 'External Thesis Examiner',
    },
    {
      id: 'mock-6',
      name: 'Samantha O\'Connor',
      institution: 'Quantum Bio-Labs Inc.',
      institutionOption: 'other',
      dateTime: createPastDate(0, 7, 5),
      phone: '+1 (555) 013-8495',
      email: 'samantha.oc@quantumbiolabs.io',
      status: 'checked-out',
      checkoutTime: createPastDate(0, 4, 10),
      visitorPassNumber: 'CP-2606-5591',
      purpose: 'Equipment Maintenance Check',
    },
    {
      id: 'mock-7',
      name: 'Robert Vance',
      institution: 'Vance Refrigeration',
      institutionOption: 'other',
      dateTime: createPastDate(1, 4, 15), // Yesterday check in
      phone: '+1 (555) 011-2233',
      email: 'rvance@vancerefrig.com',
      status: 'checked-out',
      checkoutTime: createPastDate(1, 0, 45), // Checked out yesterday
      visitorPassNumber: 'CP-2606-1212',
      purpose: 'HVAC Air conditioning Quote',
    },
    {
      id: 'mock-8',
      name: 'Dr. Alice Thorne',
      institution: 'University of California, Berkeley',
      institutionOption: 'partner',
      dateTime: createPastDate(1, 8, 30),
      phone: '+1 (555) 018-1111',
      email: 'athorne@berkeley.edu',
      status: 'checked-out',
      checkoutTime: createPastDate(1, 3, 15),
      visitorPassNumber: 'CP-2606-3829',
      purpose: 'Physics Lab Audit',
    },
  ];

  saveGuests(sampleGuests);
  return sampleGuests;
}
