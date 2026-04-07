import type { MonthTheme, CountryOption } from '../types/calendar';

export const monthThemes: MonthTheme[] = [
  { name:'Winter Peaks',  image:'/hero.png', primary:'#0ea5e9', primaryDark:'#0369a1', primaryLight:'#e0f2fe', bg1:'#0c1a2e', bg2:'#0369a1', accent:'#38bdf8' },
  { name:'Alpine Ascent', image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80', primary:'#6366f1', primaryDark:'#4338ca', primaryLight:'#eef2ff', bg1:'#0f0c29', bg2:'#302b63', accent:'#818cf8' },
  { name:'Spring Bloom',  image:'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?auto=format&fit=crop&w=1600&q=80', primary:'#10b981', primaryDark:'#059669', primaryLight:'#d1fae5', bg1:'#052e16', bg2:'#064e3b', accent:'#34d399' },
  { name:'Desert Dunes',  image:'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1600&q=80', primary:'#f59e0b', primaryDark:'#d97706', primaryLight:'#fef3c7', bg1:'#2d1b00', bg2:'#78350f', accent:'#fbbf24' },
  { name:'Ocean Depths',  image:'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1600&q=80', primary:'#06b6d4', primaryDark:'#0891b2', primaryLight:'#cffafe', bg1:'#042c3f', bg2:'#0e7490', accent:'#22d3ee' },
  { name:'Golden Fields', image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80', primary:'#eab308', primaryDark:'#ca8a04', primaryLight:'#fef9c3', bg1:'#1c1506', bg2:'#713f12', accent:'#facc15' },
  { name:'Forest Trails', image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80', primary:'#22c55e', primaryDark:'#16a34a', primaryLight:'#dcfce7', bg1:'#052e16', bg2:'#14532d', accent:'#4ade80' },
  { name:'Canyon Glow',   image:'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80', primary:'#f97316', primaryDark:'#ea580c', primaryLight:'#ffedd5', bg1:'#2c120a', bg2:'#9a3412', accent:'#fb923c' },
  { name:'Autumn Woods',  image:'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?auto=format&fit=crop&w=1600&q=80', primary:'#dc2626', primaryDark:'#b91c1c', primaryLight:'#fee2e2', bg1:'#2d0808', bg2:'#7f1d1d', accent:'#f87171' },
  { name:'Purple Dusk',   image:'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?auto=format&fit=crop&w=1600&q=80', primary:'#a855f7', primaryDark:'#9333ea', primaryLight:'#f3e8ff', bg1:'#1a0533', bg2:'#6b21a8', accent:'#c084fc' },
  { name:'Frosty Peaks',  image:'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=80', primary:'#64748b', primaryDark:'#475569', primaryLight:'#f1f5f9', bg1:'#0f172a', bg2:'#334155', accent:'#94a3b8' },
  { name:'Midnight Snow', image:'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80', primary:'#db2777', primaryDark:'#be185d', primaryLight:'#fce7f3', bg1:'#1a0323', bg2:'#831843', accent:'#f472b6' },
];

export const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export const PRESET_TAGS = [
  { label:'Study Session',  icon:'📚', color:'#3b82f6' },
  { label:'Contest Day',    icon:'🏆', color:'#f97316' },
  { label:'Revision',       icon:'🔁', color:'#22c55e' },
  { label:'Mock Interview', icon:'🧠', color:'#a855f7' },
  { label:'Problem Set',    icon:'⚡', color:'#eab308' },
  { label:'Assessment',     icon:'📝', color:'#ec4899' },
  { label:'Goal',           icon:'🎯', color:'#14b8a6' },
  { label:'Break',          icon:'🏖️', color:'#94a3b8' },
];

export const COLOR_SWATCHES = [
  '#ef4444','#f97316','#eab308','#22c55e','#14b8a6',
  '#3b82f6','#6366f1','#a855f7','#ec4899','#64748b',
];

export const DSA_EVENTS: Record<string, { title: string; type: 'contest' }> = {
  '2026-04-12': { title: 'LeetCode Weekly Contest', type: 'contest' },
  '2026-04-25': { title: 'Codeforces Round',         type: 'contest' },
  '2026-06-01': { title: '100 Days of Code Starts',  type: 'contest' },
  '2026-07-19': { title: 'AtCoder Beginner Contest', type: 'contest' },
};

const INDIA_HOLIDAYS: Record<number, Array<{ date: string; name: string }>> = {
  2024: [
    { date: '2024-01-14', name: 'Makar Sankranti' },
    { date: '2024-01-26', name: 'Republic Day' },
    { date: '2024-03-25', name: 'Holi' },
    { date: '2024-03-29', name: 'Good Friday' },
    { date: '2024-04-11', name: 'Eid ul-Fitr' },
    { date: '2024-04-14', name: 'Dr. Ambedkar Jayanti' },
    { date: '2024-04-17', name: 'Ram Navami' },
    { date: '2024-05-01', name: 'Labour Day' },
    { date: '2024-05-23', name: 'Buddha Purnima' },
    { date: '2024-06-17', name: 'Eid ul-Adha' },
    { date: '2024-07-17', name: 'Muharram' },
    { date: '2024-08-15', name: 'Independence Day' },
    { date: '2024-09-16', name: 'Milad-un-Nabi' },
    { date: '2024-10-02', name: 'Gandhi Jayanti' },
    { date: '2024-10-13', name: 'Dussehra' },
    { date: '2024-11-01', name: 'Diwali' },
    { date: '2024-11-15', name: 'Guru Nanak Jayanti' },
    { date: '2024-12-25', name: 'Christmas' },
  ],
  2025: [
    { date: '2025-01-14', name: 'Makar Sankranti' },
    { date: '2025-01-26', name: 'Republic Day' },
    { date: '2025-02-26', name: 'Maha Shivaratri' },
    { date: '2025-03-14', name: 'Holi' },
    { date: '2025-03-31', name: 'Eid ul-Fitr' },
    { date: '2025-04-06', name: 'Ram Navami' },
    { date: '2025-04-14', name: 'Dr. Ambedkar Jayanti' },
    { date: '2025-04-18', name: 'Good Friday' },
    { date: '2025-05-01', name: 'Labour Day' },
    { date: '2025-05-12', name: 'Buddha Purnima' },
    { date: '2025-06-07', name: 'Eid ul-Adha' },
    { date: '2025-07-06', name: 'Muharram' },
    { date: '2025-08-15', name: 'Independence Day' },
    { date: '2025-09-05', name: 'Milad-un-Nabi' },
    { date: '2025-10-02', name: 'Gandhi Jayanti' },
    { date: '2025-10-20', name: 'Diwali' },
    { date: '2025-11-05', name: 'Guru Nanak Jayanti' },
    { date: '2025-12-25', name: 'Christmas' },
  ],
  2026: [
    { date: '2026-01-14', name: 'Makar Sankranti' },
    { date: '2026-01-26', name: 'Republic Day' },
    { date: '2026-02-15', name: 'Maha Shivaratri' },
    { date: '2026-03-03', name: 'Holi' },
    { date: '2026-03-20', name: 'Ugadi / Gudi Padwa' },
    { date: '2026-04-02', name: 'Ram Navami' },
    { date: '2026-04-03', name: 'Good Friday' },
    { date: '2026-04-14', name: 'Dr. Ambedkar Jayanti' },
    { date: '2026-05-01', name: 'Labour Day' },
    { date: '2026-05-31', name: 'Buddha Purnima' },
    { date: '2026-08-15', name: 'Independence Day' },
    { date: '2026-10-02', name: 'Gandhi Jayanti' },
    { date: '2026-10-18', name: 'Dussehra' },
    { date: '2026-11-08', name: 'Diwali' },
    { date: '2026-11-25', name: 'Guru Nanak Jayanti' },
    { date: '2026-12-25', name: 'Christmas' },
  ],
  2027: [
    { date: '2027-01-14', name: 'Makar Sankranti' },
    { date: '2027-01-26', name: 'Republic Day' },
    { date: '2027-03-22', name: 'Holi' },
    { date: '2027-04-02', name: 'Good Friday' },
    { date: '2027-04-14', name: 'Dr. Ambedkar Jayanti' },
    { date: '2027-05-01', name: 'Labour Day' },
    { date: '2027-08-15', name: 'Independence Day' },
    { date: '2027-10-02', name: 'Gandhi Jayanti' },
    { date: '2027-10-28', name: 'Diwali' },
    { date: '2027-12-25', name: 'Christmas' },
  ],
  2028: [
    { date: '2028-01-14', name: 'Makar Sankranti' },
    { date: '2028-01-26', name: 'Republic Day' },
    { date: '2028-03-11', name: 'Holi' },
    { date: '2028-04-14', name: 'Dr. Ambedkar Jayanti' },
    { date: '2028-04-14', name: 'Good Friday' },
    { date: '2028-05-01', name: 'Labour Day' },
    { date: '2028-08-15', name: 'Independence Day' },
    { date: '2028-10-02', name: 'Gandhi Jayanti' },
    { date: '2028-11-05', name: 'Diwali' },
    { date: '2028-12-25', name: 'Christmas' },
  ],
  2029: [
    { date: '2029-01-14', name: 'Makar Sankranti' },
    { date: '2029-01-26', name: 'Republic Day' },
    { date: '2029-03-01', name: 'Holi' },
    { date: '2029-03-30', name: 'Good Friday' },
    { date: '2029-04-14', name: 'Dr. Ambedkar Jayanti' },
    { date: '2029-05-01', name: 'Labour Day' },
    { date: '2029-08-15', name: 'Independence Day' },
    { date: '2029-10-02', name: 'Gandhi Jayanti' },
    { date: '2029-10-24', name: 'Diwali' },
    { date: '2029-12-25', name: 'Christmas' },
  ],
  2030: [
    { date: '2030-01-14', name: 'Makar Sankranti' },
    { date: '2030-01-26', name: 'Republic Day' },
    { date: '2030-03-19', name: 'Holi' },
    { date: '2030-04-14', name: 'Dr. Ambedkar Jayanti' },
    { date: '2030-04-19', name: 'Good Friday' },
    { date: '2030-05-01', name: 'Labour Day' },
    { date: '2030-08-15', name: 'Independence Day' },
    { date: '2030-10-02', name: 'Gandhi Jayanti' },
    { date: '2030-11-13', name: 'Diwali' },
    { date: '2030-12-25', name: 'Christmas' },
  ],
};

export const getIndiaHolidayMap = (year: number): Record<string, string> => {
  const map: Record<string, string> = {};
  (INDIA_HOLIDAYS[year] || []).forEach(h => { map[h.date] = h.name; });
  return map;
};

export const COUNTRIES: CountryOption[] = [
  { code: 'IN', flag: '🇮🇳', name: 'India',          apiSupported: false },
  { code: 'US', flag: '🇺🇸', name: 'United States',  apiSupported: true  },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom', apiSupported: true  },
  { code: 'CA', flag: '🇨🇦', name: 'Canada',         apiSupported: true  },
  { code: 'AU', flag: '🇦🇺', name: 'Australia',      apiSupported: true  },
  { code: 'DE', flag: '🇩🇪', name: 'Germany',        apiSupported: true  },
  { code: 'FR', flag: '🇫🇷', name: 'France',         apiSupported: true  },
  { code: 'JP', flag: '🇯🇵', name: 'Japan',          apiSupported: true  },
];

export const eventTypeColors: Record<string, string> = {
  contest: '#f97316',
  holiday: '#e11d48',
};
