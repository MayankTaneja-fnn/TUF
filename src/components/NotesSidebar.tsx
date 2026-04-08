import React from 'react';
import { format, isSameDay } from 'date-fns';
import { X, Save } from 'lucide-react';
import type { SavedNote } from '../types/calendar';

interface NotesSidebarProps {
  notes: string;
  setNotes: (val: string) => void;
  savedNotes: SavedNote[];
  setSavedNotes: React.Dispatch<React.SetStateAction<SavedNote[]>>;
  startDate: Date | null;
  endDate: Date | null;
}

const NotesSidebar: React.FC<NotesSidebarProps> = ({
  notes,
  setNotes,
  savedNotes,
  setSavedNotes,
  startDate,
  endDate,
}) => {
  const getDateLabel = () => {
    if (!startDate) return 'General Note';
    if (!endDate || isSameDay(startDate, endDate)) return format(startDate, 'MMM d, yyyy');
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  };

  const handleSaveNote = () => {
    if (!notes.trim()) return;
    const newNote: SavedNote = {
      id: crypto.randomUUID(),
      text: notes.trim(),
      dateLabel: getDateLabel(),
      createdAt: Date.now(),
    };
    setSavedNotes((prev) => [newNote, ...prev]);
    setNotes(''); 
  };

  const handleDeleteNote = (id: string) => {
    setSavedNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const renderMarkdown = (text: string) => {
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gm, '<li>$1</li>');
    
    if (html.includes('<li>')) {
      html = html.replace(/(<li>.*<\/li>)/gms, '<ul>$1</ul>');
    }
    
    return { __html: html.replace(/\n/g, '<br/>') };
  };

  return (
    <div className="notes">
      <div className="notes__draft">
        <div className="notes__header">
          <h3 className="notes__title">Notes &amp; Reminders</h3>
          <span className="notes__context-date">{getDateLabel()}</span>
        </div>
        <textarea
          className="notes__input"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Jot down your DSA goals or notes for the selected dates..."
          spellCheck={false}
        />
        <button
          className="notes__save-btn"
          onClick={handleSaveNote}
          disabled={!notes.trim()}
        >
          <Save size={14} /> Save Note
        </button>
      </div>

      {savedNotes.length > 0 && (
        <div className="notes__saved-list">
          <h4 className="notes__saved-title">Saved Notes</h4>
          <div className="notes__scroll-area">
            {savedNotes.map((note) => (
              <div key={note.id} className="saved-note">
                <div className="saved-note__header">
                  <span className="saved-note__date">{note.dateLabel}</span>
                  <button
                    className="saved-note__delete"
                    onClick={() => handleDeleteNote(note.id)}
                    title="Delete Note"
                  >
                    <X size={12} />
                  </button>
                </div>
                <div 
                  className="saved-note__text" 
                  dangerouslySetInnerHTML={renderMarkdown(note.text)} 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesSidebar;
