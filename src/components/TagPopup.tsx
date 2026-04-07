import React, { useEffect, useRef } from 'react';
import { Tag, X, Check } from 'lucide-react';
import { format } from 'date-fns';
import type { UserTag, TagPopupState } from '../types/calendar';
import { PRESET_TAGS, COLOR_SWATCHES } from '../utils/calendarConstants';

interface TagPopupProps {
  tagPopup: TagPopupState;
  closePopup: () => void;
  activeTags: UserTag[];
  removeTag: (dayKey: string, id: string) => void;
  addTag: (dayKey: string, label: string, color: string, icon?: string) => void;
  customLabel: string;
  setCustomLabel: (val: string) => void;
  customColor: string;
  setCustomColor: (val: string) => void;
}

const TagPopup: React.FC<TagPopupProps> = ({
  tagPopup,
  closePopup,
  activeTags,
  removeTag,
  addTag,
  customLabel,
  setCustomLabel,
  customColor,
  setCustomColor,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const customInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        closePopup();
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [closePopup]);

  useEffect(() => {
    setTimeout(() => customInput.current?.focus(), 80);
  }, []);

  const popupPos = {
    position: 'fixed' as const,
    top: Math.min(tagPopup.anchorRect.bottom + 8, window.innerHeight - 380),
    left: Math.max(12, Math.min(tagPopup.anchorRect.left - 40, window.innerWidth - 300)),
    zIndex: 999,
  };

  return (
    <div ref={popupRef} className="tag-popup" style={popupPos}>
      <div className="tp-header">
        <div className="tp-header__left">
          <Tag size={15} />
          <div>
            <div className="tp-header__title">Add Tag</div>
            <div className="tp-header__date">{format(new Date(tagPopup.dayKey), 'EEEE, MMMM d yyyy')}</div>
          </div>
        </div>
        <button className="tp-close" onClick={closePopup}><X size={15}/></button>
      </div>

      {activeTags.length > 0 && (
        <div className="tp-applied">
          {activeTags.map(t => (
            <span
              key={t.id}
              className="tag-chip tag-chip--applied"
              style={{ '--chip-color': t.color } as React.CSSProperties}
              onClick={() => removeTag(tagPopup.dayKey, t.id)}
              title="Click to remove"
            >
              {t.icon} {t.label}
              <X size={9} className="tag-chip__x" />
            </span>
          ))}
        </div>
      )}

      <p className="tp-section-label">Quick Tags</p>
      <div className="tp-presets">
        {PRESET_TAGS.map(pt => {
          const already = activeTags.some(t => t.label === pt.label);
          return (
            <button
              key={pt.label}
              className={`tp-preset${already ? ' tp-preset--applied' : ''}`}
              style={{ '--btn-color': pt.color } as React.CSSProperties}
              onClick={() => already
                ? removeTag(tagPopup.dayKey, activeTags.find(t=>t.label===pt.label)!.id)
                : addTag(tagPopup.dayKey, pt.label, pt.color, pt.icon)
              }
            >
              <span className="tp-preset__icon">{pt.icon}</span>
              <span className="tp-preset__label">{pt.label}</span>
              {already && <Check size={10} className="tp-preset__check" />}
            </button>
          );
        })}
      </div>

      <p className="tp-section-label">Custom Tag</p>
      <div className="tp-custom">
        <div className="tp-swatches">
          {COLOR_SWATCHES.map(c => (
            <button
              key={c}
              className={`tp-swatch${customColor === c ? ' tp-swatch--active' : ''}`}
              style={{ background: c }}
              onClick={() => setCustomColor(c)}
              title={c}
            />
          ))}
        </div>
        <div className="tp-input-row">
          <input
            ref={customInput}
            className="tp-input"
            placeholder="Type a label and press Enter…"
            value={customLabel}
            onChange={e => setCustomLabel(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && customLabel.trim()) {
                addTag(tagPopup.dayKey, customLabel, customColor);
                setCustomLabel('');
              }
            }}
            maxLength={28}
          />
          <button
            className="tp-add-btn"
            style={{ background: customColor }}
            onClick={() => { if (customLabel.trim()) { addTag(tagPopup.dayKey, customLabel, customColor); setCustomLabel(''); } }}
          >Add</button>
        </div>
      </div>
    </div>
  );
};

export default TagPopup;
