import React, { useRef, useEffect } from 'react';
import { Globe, Loader, Check } from 'lucide-react';
import { format } from 'date-fns';
import type { MonthTheme, CountryOption } from '../types/calendar';
import { MONTH_NAMES, COUNTRIES } from '../utils/calendarConstants';

interface CalendarHeroProps {
  theme: MonthTheme;
  isAnimating: boolean;
  animDirection: 'next' | 'prev' | null;
  currentMonth: Date;
  showMonthPicker: boolean;
  setShowMonthPicker: React.Dispatch<React.SetStateAction<boolean>>;
  goToMonth: (i: number) => void;
  countryCode: string;
  setCountryCode: (code: string) => void;
  showCountryMenu: boolean;
  setShowCountryMenu: React.Dispatch<React.SetStateAction<boolean>>;
  loadingHolidays: boolean;
}

const CalendarHero: React.FC<CalendarHeroProps> = ({
  theme,
  isAnimating,
  animDirection,
  currentMonth,
  showMonthPicker,
  setShowMonthPicker,
  goToMonth,
  countryCode,
  setCountryCode,
  showCountryMenu,
  setShowCountryMenu,
  loadingHolidays,
}) => {
  const countryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showCountryMenu) return;
    const h = (e: MouseEvent) => {
      if (countryMenuRef.current && !countryMenuRef.current.contains(e.target as Node))
        setShowCountryMenu(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [showCountryMenu]);

  return (
    <div className={`hero${isAnimating ? ` hero--flip-${animDirection}` : ''}`}>
      <img src={theme.image} alt={theme.name} className="hero__img" />
      <div className="hero__gradient" />
      <div className="hero__shape" />
      <div className="hero__label">
        <span className="hero__year">{format(currentMonth, 'yyyy')}</span>
        <span className="hero__month">{format(currentMonth, 'MMMM').toUpperCase()}</span>
        <span className="hero__theme-name">{theme.name}</span>
      </div>
      <button className="month-picker-btn" onClick={() => setShowMonthPicker(v => !v)}>
        {showMonthPicker ? 'Close ✕' : 'Pick Month ↓'}
      </button>
      <div className="country-selector" ref={countryMenuRef}>
        <button className="country-btn" onClick={() => setShowCountryMenu(v => !v)} title="Change holiday country">
          <Globe size={13} />
          <span>{COUNTRIES.find(c => c.code === countryCode)?.flag}</span>
          <span>{countryCode}</span>
          {loadingHolidays && <Loader size={11} className="spinning" />}
        </button>
        {showCountryMenu && (
          <div className="country-menu">
            <p className="country-menu__label">Holiday Region</p>
            {COUNTRIES.map((c: CountryOption) => (
              <button
                key={c.code}
                className={`country-menu__item${countryCode === c.code ? ' country-menu__item--active' : ''}`}
                onClick={() => { setCountryCode(c.code); setShowCountryMenu(false); }}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
                {countryCode === c.code && <Check size={12} />}
              </button>
            ))}
          </div>
        )}
      </div>
      {showMonthPicker && (
        <div className="month-picker">
          {MONTH_NAMES.map((m, i) => (
            <button
              key={m}
              className={`month-picker__item${currentMonth.getMonth() === i ? ' month-picker__item--active' : ''}`}
              onClick={() => goToMonth(i)}
            >{m.slice(0,3)}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarHero;
