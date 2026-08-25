import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { CalendarEvent } from '../../types';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  MapPin,
  FileSpreadsheet,
  Award,
  BookOpen,
  School
} from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const { isStaff } = useAuth();
  const { calendarEvents, addCalendarEvent, classes } = useApp();
  const { isKhmer, t } = useLanguage();

  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<CalendarEvent['eventType']>('class');
  const [newDate, setNewDate] = useState('2026-08-25');
  const [newStartTime, setNewStartTime] = useState('08:00');
  const [newEndTime, setNewEndTime] = useState('09:30');
  const [newLocation, setNewLocation] = useState('Lab 1 - Room 204');

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCalendarEvent({
      title: newTitle,
      description: newDesc,
      eventType: newType,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      location: newLocation
    });

    setShowAddEventModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const filteredEvents = calendarEvents.filter(e => {
    if (filterType === 'all') return true;
    return e.eventType === filterType;
  });

  const getEventBadge = (type: CalendarEvent['eventType']) => {
    switch (type) {
      case 'class':
        return <Badge variant="pink" size="sm">{isKhmer ? 'ម៉ោងរៀន' : 'Class Session'}</Badge>;
      case 'exam':
        return <Badge variant="purple" size="sm">{isKhmer ? 'ប្រឡងអនុវត្ត' : 'Practical Exam'}</Badge>;
      case 'assignment_deadline':
        return <Badge variant="amber" size="sm">{isKhmer ? 'ផុតកំណត់កិច្ចការ' : 'Deadline'}</Badge>;
      case 'meeting':
        return <Badge variant="blue" size="sm">{isKhmer ? 'ការប្រជុំ' : 'Meeting'}</Badge>;
      default:
        return <Badge variant="slate" size="sm">{isKhmer ? 'កម្មវិធី' : 'Event'}</Badge>;
    }
  };

  const filterOptions = [
    { id: 'all', label: isKhmer ? 'ទាំងអស់' : 'All' },
    { id: 'class', label: isKhmer ? 'ម៉ោងរៀន' : 'Class' },
    { id: 'exam', label: isKhmer ? 'ការប្រឡង' : 'Exams' },
    { id: 'assignment_deadline', label: isKhmer ? 'ថ្ងៃផុតកំណត់' : 'Deadlines' },
    { id: 'meeting', label: isKhmer ? 'ការប្រជុំ' : 'Meetings' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-zinc-900" />
            {t('title.calendar', undefined, 'School Calendar & Class Timetable')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isKhmer
              ? 'កាលវិភាគថ្នាក់រៀនកុំព្យូទ័រ កាលបរិច្ឆេទផុតកំណត់កិច្ចការ និងថ្ងៃប្រឡងអនុវត្ត។'
              : 'Schedule for computer classes, assignment submission deadlines, and practical exams.'}
          </p>
        </div>

        {isStaff && (
          <button
            onClick={() => setShowAddEventModal(true)}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-zinc-300" />
            <span>{isKhmer ? 'បន្ថែមព្រឹត្តិការណ៍ថ្មី' : 'Add Calendar Event'}</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setFilterType(opt.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              filterType === opt.id
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-white rounded-3xl p-5 border border-zinc-200 hover:border-zinc-300 shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-800 bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200">
                  {evt.date}
                </span>
                {getEventBadge(evt.eventType)}
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{evt.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{evt.description}</p>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-700" />
                <span>{evt.startTime} - {evt.endTime}</span>
              </div>
              {evt.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{evt.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
