export interface Guest {
  id: string;
  name: string;
  institution: string;
  institutionOption: 'none' | 'other' | 'partner';
  dateTime: string; // ISO String format
  phone?: string;
  email?: string;
  status?: 'checked-in' | 'checked-out';
  checkoutTime?: string;
  visitorPassNumber: string; // e.g., REG-2026-0041
  purpose?: string;
}

export type RegistrationStep = 'welcome' | 'identity' | 'affiliation' | 'review' | 'printing' | 'ticket';

export const POPULAR_PARTNERS = [
  'Massachusetts Institute of Technology',
  'Stanford University',
  'Harvard University',
  'University of California, Berkeley',
  'Google Research',
  'Microsoft Corporation',
  'National Science Foundation',
  'State Department of Education',
];
