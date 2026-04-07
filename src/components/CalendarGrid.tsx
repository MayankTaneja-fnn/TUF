import React from 'react';
import { ChevronLeft, ChevronRight, Tag, Plus, Loader } from 'lucide-react';
import { format, isSameMonth, isSameDay, isWithinInterval, addDays, startOfMonth, startOfWeek, endOfMonth, endOfWeek } from 'date-fns';
import type { UserTag } from '../types/calendar';
import { DSA_EVENTS, eventTypeColors } from '../utils/calendarConstants';

interface CalendarGridProps {
  currentMonth: Date;
  currentYear: number;
  isAnimating: boolean;
  animDirection: 'next' | 'prev' | null;
  startDate: Date | null;
  endDate: Date | null;
  focusedDate: Date | null;
  apiHolidays: Record<string, string>;
  userTags: Record<string, UserTag[]>;
  loadingHolidays: boolean;
  navigateMonth: (dir: 'next' | 'prev') => void;
  changeYear: (d: number) => void;
  handleYearInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateClick: (day: Date) => void;
  onDateMouseDown: (day: Date) => void;
  onDateMouseEnter: (day: Date) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  openTagPopup: (e: React.MouseEvent, dayKey: string) => void;
  removeTag: (dayKey: string, id: string) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  currentYear,
  isAnimating,
  animDirection,
  startDate,
  endDate,
  focusedDate,
  apiHolidays,
  userTags,
  loadingHolidays,
  navigateMonth,
  changeYear,
  handleYearInput,
  onDateClick,
  onDateMouseDown,
  onDateMouseEnter,
  handleKeyDown,
  openTagPopup,
  removeTag,
}) => {
  const monthStart = startOfMonth(currentMonth);
  const weekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 });

  const renderCells = () => {
    const rows: React.ReactNode[] = [];
    let cells: React.ReactNode[] = [];
    let day = weekStart;

    while (day <= weekEnd) {
      for (let i = 0; i < 7; i++) {
        const clone = day;
        const dayKey = format(day, 'yyyy-MM-dd');
        const isCurrent = isSameMonth(day, monthStart);
        const isStart = !!(startDate && isSameDay(day, startDate));
        const isEnd = !!(endDate && isSameDay(day, endDate));
        const isMiddle = !!(startDate && endDate && isWithinInterval(day, { start: startDate, end: endDate }));
        const isWeekend = i >= 5;
        const dsaEvent = isCurrent ? DSA_EVENTS[dayKey] : null;
        const holidayName = isCurrent ? apiHolidays[dayKey] : null;
        const event: { title: string; type: 'contest' | 'holiday' } | null =
          holidayName ? { title: `🗓️ ${holidayName}`, type: 'holiday' } : dsaEvent ?? null;
        const tags = isCurrent ? (userTags[dayKey] || []) : [];

        const isFocused = !!(focusedDate && isSameDay(day, focusedDate));

        let cls = `cell${!isCurrent ? ' cell--disabled' : ''}`;
        if (isStart) cls += ' cell--start';
        else if (isEnd) cls += ' cell--end';
        else if (isMiddle) cls += ' cell--middle';
        else if (isCurrent && isWeekend) cls += ' cell--weekend';
        if (isFocused) cls += ' cell--focused';
        if (event?.type === 'holiday') cls += ' cell--holiday';

        cells.push(
          <div 
            className={cls} 
            key={day.toString()} 
            onMouseDown={() => isCurrent && onDateMouseDown(clone)}
            onMouseEnter={() => isCurrent && onDateMouseEnter(clone)}
            onClick={() => isCurrent && onDateClick(clone)}
            onDoubleClick={(e) => isCurrent && openTagPopup(e, dayKey)}
          >
            <span className="cell__number">{format(day, 'd')}</span>
            {isCurrent && (
              <button className="cell__tag-btn" title="Add tag" onClick={e => openTagPopup(e, dayKey)}>
                <Plus size={9} strokeWidth={3} />
              </button>
            )}
            {event && (
              <div className={`event-badge-wrap event-badge-wrap--${event.type}`}>
                <span className="event-badge-dot" style={{ background: eventTypeColors[event.type] }} />
                <span className="event-badge-label">{event.title}</span>
              </div>
            )}
            {tags.length > 0 && (
              <div className="cell__tags">
                {tags.slice(0, 2).map(tag => (
                  <span
                    key={tag.id}
                    className="tag-chip"
                    style={{ '--chip-color': tag.color } as React.CSSProperties}
                    onClick={e => { e.stopPropagation(); removeTag(dayKey, tag.id); }}
                    title={`${tag.icon ?? ''} ${tag.label} — click to remove`}
                  >
                    {tag.icon && <span className="tag-chip__icon">{tag.icon}</span>}
                    <span className="tag-chip__label">{tag.label}</span>
                  </span>
                ))}
                {tags.length > 2 && (
                  <span className="tag-chip tag-chip--more">+{tags.length - 2}</span>
                )}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className={`cal-row${isAnimating ? ` cal-row--${animDirection}` : ''}`} key={day.toString()}>
          {cells}
        </div>
      );
      cells = [];
    }
    return <>{rows}</>;
  };

  return (
    <div className="grid-section">
      <div className="controls">
        <button className="control-btn" onClick={() => navigateMonth('prev')}><ChevronLeft size={20} /></button>
        <div className="controls__center">
          <div className="year-control">
            <button className="year-btn" onClick={() => changeYear(-1)}>‹</button>
            <input type="number" className="year-input" value={currentYear} onChange={handleYearInput} min={1900} max={2199} />
            <button className="year-btn" onClick={() => changeYear(1)}>›</button>
          </div>
          <span className="controls__month-name">{format(currentMonth, 'MMMM')}</span>
        </div>
        <button className="control-btn" onClick={() => navigateMonth('next')}><ChevronRight size={20} /></button>
      </div>

      <div className="day-headers">
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d, i) => (
          <div key={d} className={`day-header${i >= 5 ? ' day-header--weekend' : ''}`}>{d}</div>
        ))}
      </div>

      <div 
        className="date-grid" 
        tabIndex={0} 
        onKeyDown={handleKeyDown} 
        style={{ outline: 'none' }}
      >
        {renderCells()}
      </div>

      <div className="legend">
        <div className="legend__item"><span className="legend__dot" style={{ background: eventTypeColors.contest }} /> Contest</div>
        <div className="legend__item"><span className="legend__dot" style={{ background: eventTypeColors.holiday }} /> Holiday {loadingHolidays && <Loader size={10} className="spinning" />}</div>
        <div className="legend__sep" />
        <div className="legend__item"><Tag size={10} />&nbsp;Hover date → add tag</div>
      </div>
    </div>
  );
};

export default CalendarGrid;
