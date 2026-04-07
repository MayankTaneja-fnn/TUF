import React, { useState, useEffect, useRef, useCallback } from 'react';
import { addMonths, subMonths, isBefore, format } from 'date-fns';
import type { NagerHoliday, UserTag, TagPopupState, SavedNote } from '../types/calendar';
import { getIndiaHolidayMap, COUNTRIES, COLOR_SWATCHES, monthThemes } from '../utils/calendarConstants';
import CalendarHero from './CalendarHero';
import NotesSidebar from './NotesSidebar';
import CalendarGrid from './CalendarGrid';
import TagPopup from './TagPopup';

const getInitialDatesFromHash = (): { s: Date | null, e: Date | null } => {
  if (typeof window === 'undefined') return { s: null, e: null };
  const hash = window.location.hash;
  if (!hash.includes('start=')) return { s: null, e: null };
  const params = new URLSearchParams(hash.replace('#?', ''));
  const startStr = params.get('start');
  const endStr = params.get('end');
  const s = startStr ? new Date(startStr + 'T00:00:00') : null;
  const e = endStr ? new Date(endStr + 'T00:00:00') : null;
  return { 
    s: s && !isNaN(s.getTime()) ? s : null, 
    e: e && !isNaN(e.getTime()) ? e : null 
  };
};

const safelyGetLocalItem = <T,>(key: string, defaultVal: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultVal;
  } catch { return defaultVal; }
};

const WallCalendar = () => {
  const initDates = getInitialDatesFromHash();
  const [currentMonth, setCurrentMonth]       = useState(initDates.s || new Date(2026, 3, 1));
  const [startDate, setStartDate]             = useState<Date | null>(initDates.s);
  const [endDate, setEndDate]                 = useState<Date | null>(initDates.e);
  const [focusedDate, setFocusedDate]         = useState<Date | null>(initDates.s || new Date(2026, 3, 1));
  const [isDragging, setIsDragging]           = useState(false);
  const dragAnchorRef = useRef<Date | null>(null);
  const dragOccurredRef = useRef<boolean>(false);

  const [notes, setNotes]                     = useState('');
  const [savedNotes, setSavedNotes]           = useState<SavedNote[]>(() => safelyGetLocalItem('dsa_wall_notes', []));
  const [isAnimating, setIsAnimating]         = useState(false);
  const [animDirection, setAnimDirection]     = useState<'next'|'prev'|null>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [countryCode, setCountryCode]         = useState(() => safelyGetLocalItem('dsa_wall_country', 'IN'));
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [apiHolidays, setApiHolidays]         = useState<Record<string, string>>({});
  const [loadingHolidays, setLoadingHolidays] = useState(false);
  
  const holidayCache = useRef<Record<string, Record<string, string>>>({});
  
  const [userTags, setUserTags]       = useState<Record<string, UserTag[]>>(() => safelyGetLocalItem('dsa_wall_tags', {}));
  const [tagPopup, setTagPopup]       = useState<TagPopupState | null>(null);
  const [customLabel, setCustomLabel] = useState('');
  const [customColor, setCustomColor] = useState(COLOR_SWATCHES[4]);

  const theme       = monthThemes[currentMonth.getMonth()];
  const currentYear = currentMonth.getFullYear();

  useEffect(() => {
    const country = COUNTRIES.find(c => c.code === countryCode);
    if (!country?.apiSupported) {
      setTimeout(() => {
        setApiHolidays(getIndiaHolidayMap(currentYear));
        setLoadingHolidays(false);
      }, 0);
      return;
    }
    const cacheKey = `${currentYear}-${countryCode}`;
    if (holidayCache.current[cacheKey]) {
      setApiHolidays(holidayCache.current[cacheKey]);
      return;
    }
    setLoadingHolidays(true);
    fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/${countryCode}`)
      .then(r => r.ok ? r.json() : [])
      .then((data: NagerHoliday[]) => {
        const map: Record<string, string> = {};
        data.forEach(h => { map[h.date] = h.localName || h.name; });
        holidayCache.current[cacheKey] = map;
        setApiHolidays(map);
      })
      .catch(() => setApiHolidays({}))
      .finally(() => setLoadingHolidays(false));
  }, [currentYear, countryCode]);

  useEffect(() => {
    localStorage.setItem('dsa_wall_notes', JSON.stringify(savedNotes));
  }, [savedNotes]);

  useEffect(() => {
    localStorage.setItem('dsa_wall_country', JSON.stringify(countryCode));
  }, [countryCode]);

  useEffect(() => {
    localStorage.setItem('dsa_wall_tags', JSON.stringify(userTags));
  }, [userTags]);

  useEffect(() => {
    if (!startDate && !endDate) {
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }
    const params = new URLSearchParams();
    if (startDate) params.set('start', format(startDate, 'yyyy-MM-dd'));
    if (endDate) params.set('end', format(endDate, 'yyyy-MM-dd'));
    window.history.replaceState(null, '', `#?${params.toString()}`);
  }, [startDate, endDate]);

  const closePopup = useCallback(() => { 
    setTagPopup(null); 
    setCustomLabel(''); 
  }, []);

  const navigateMonth = useCallback((dir: 'next'|'prev') => {
    if (isAnimating) return;
    setAnimDirection(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentMonth(d => dir === 'next' ? addMonths(d, 1) : subMonths(d, 1));
      setTimeout(() => setIsAnimating(false), 50);
    }, 280);
  }, [isAnimating]);

  const goToMonth = useCallback((i: number) => { 
    setCurrentMonth(new Date(currentYear, i, 1)); 
    setShowMonthPicker(false); 
  }, [currentYear]);

  const changeYear = useCallback((d: number) => {
    setCurrentMonth(new Date(currentYear + d, currentMonth.getMonth(), 1));
  }, [currentYear, currentMonth]);

  const handleYearInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const y = parseInt(e.target.value);
    if (!isNaN(y) && y > 1900 && y < 2200) setCurrentMonth(new Date(y, currentMonth.getMonth(), 1));
  }, [currentMonth]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setTimeout(() => { dragOccurredRef.current = false; }, 0);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const onDateMouseDown = useCallback((day: Date) => {
    setIsDragging(true);
    dragAnchorRef.current = day;
    dragOccurredRef.current = false;
  }, []);

  const onDateMouseEnter = useCallback((day: Date) => {
    if (!isDragging || !dragAnchorRef.current) return;
    if (day.getTime() !== dragAnchorRef.current.getTime()) {
      dragOccurredRef.current = true;
      const anchor = dragAnchorRef.current;
      if (isBefore(day, anchor)) {
        setStartDate(day);
        setEndDate(anchor);
      } else {
        setStartDate(anchor);
        setEndDate(day);
      }
    }
  }, [isDragging]);

  const onDateClick = useCallback((day: Date) => {
    if (dragOccurredRef.current) return;
    if (!startDate)      { setStartDate(day); setEndDate(null); }
    else if (!endDate)   {
      if (isBefore(day, startDate)) {
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    }
    else                 { setStartDate(day); setEndDate(null); }
    setFocusedDate(day);
  }, [startDate, endDate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!focusedDate) return;
    const { key, shiftKey } = e;
    if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Enter'].includes(key)) {
      e.preventDefault();
    } else return;

    let nextDate = focusedDate;
    if (key === 'ArrowRight') nextDate = addMonths(focusedDate, 0 /* trick to clone */), nextDate.setDate(nextDate.getDate() + 1);
    else if (key === 'ArrowLeft') nextDate = addMonths(focusedDate, 0), nextDate.setDate(nextDate.getDate() - 1);
    else if (key === 'ArrowDown') nextDate = addMonths(focusedDate, 0), nextDate.setDate(nextDate.getDate() + 7);
    else if (key === 'ArrowUp') nextDate = addMonths(focusedDate, 0), nextDate.setDate(nextDate.getDate() - 7);
    else if (key === 'Enter') {
      if (shiftKey && startDate) {
         if (isBefore(focusedDate, startDate)) { setEndDate(startDate); setStartDate(focusedDate); }
         else setEndDate(focusedDate);
      } else {
        onDateClick(focusedDate);
      }
      return;
    }
    
    setFocusedDate(nextDate);
    if (nextDate.getMonth() !== currentMonth.getMonth() || nextDate.getFullYear() !== currentMonth.getFullYear()) {
      setCurrentMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
    }
  }, [focusedDate, currentMonth, onDateClick, startDate]);

  const openTagPopup = useCallback((e: React.MouseEvent, dayKey: string) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).closest('.cell')!.getBoundingClientRect();
    setTagPopup({ dayKey, anchorRect: rect });
    setCustomLabel('');
    setCustomColor(COLOR_SWATCHES[4]);
  }, []);

  const addTag = useCallback((dayKey: string, label: string, color: string, icon?: string) => {
    if (!label.trim()) return;
    setUserTags(prev => ({
      ...prev,
      [dayKey]: [...(prev[dayKey] || []), { id: crypto.randomUUID(), label: label.trim(), icon, color }],
    }));
  }, []);

  const removeTag = useCallback((dayKey: string, id: string) => {
    setUserTags(prev => ({ ...prev, [dayKey]: (prev[dayKey]||[]).filter(t => t.id !== id) }));
  }, []);

  const activeTags = tagPopup ? (userTags[tagPopup.dayKey] || []) : [];

  return (
    <div
      className="app-shell"
      style={{
        '--primary':       theme.primary,
        '--primary-dark':  theme.primaryDark,
        '--primary-light': theme.primaryLight,
        '--bg1': theme.bg1, '--bg2': theme.bg2, '--accent': theme.accent,
        '--weekend-color': theme.primary,
      } as React.CSSProperties}
    >
      <div className="app-bg">
        <div className="app-bg__orb app-bg__orb--1" />
        <div className="app-bg__orb app-bg__orb--2" />
      </div>

      <div className="calendar-card">
        <div className="bindings">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="binding"><div className="binding__wire" /></div>
          ))}
        </div>

        <CalendarHero 
          theme={theme}
          isAnimating={isAnimating}
          animDirection={animDirection}
          currentMonth={currentMonth}
          showMonthPicker={showMonthPicker}
          setShowMonthPicker={setShowMonthPicker}
          goToMonth={goToMonth}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          showCountryMenu={showCountryMenu}
          setShowCountryMenu={setShowCountryMenu}
          loadingHolidays={loadingHolidays}
        />

        <div className="cal-body">
          <NotesSidebar
            notes={notes}
            setNotes={setNotes}
            savedNotes={savedNotes}
            setSavedNotes={setSavedNotes}
            startDate={startDate}
            endDate={endDate}
          />

          <CalendarGrid
            currentMonth={currentMonth}
            currentYear={currentYear}
            isAnimating={isAnimating}
            animDirection={animDirection}
            startDate={startDate}
            endDate={endDate}
            focusedDate={focusedDate}
            apiHolidays={apiHolidays}
            userTags={userTags}
            loadingHolidays={loadingHolidays}
            navigateMonth={navigateMonth}
            changeYear={changeYear}
            handleYearInput={handleYearInput}
            onDateClick={onDateClick}
            onDateMouseDown={onDateMouseDown}
            onDateMouseEnter={onDateMouseEnter}
            handleKeyDown={handleKeyDown}
            openTagPopup={openTagPopup}
            removeTag={removeTag}
          />
        </div>
      </div>

      {tagPopup && (
        <TagPopup 
          tagPopup={tagPopup}
          closePopup={closePopup}
          activeTags={activeTags}
          removeTag={removeTag}
          addTag={addTag}
          customLabel={customLabel}
          setCustomLabel={setCustomLabel}
          customColor={customColor}
          setCustomColor={setCustomColor}
        />
      )}
    </div>
  );
};

export default WallCalendar;
