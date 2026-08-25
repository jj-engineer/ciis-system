// ====================================================================
// Component: LabAuditLogModal
// Immutable Security Audit Log Drawer for Computer Lab Commands
// ====================================================================

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Monitor
} from 'lucide-react';
import { LabAuditLog } from '../types/lab';
import { useLanguage } from '../../../context/LanguageContext';

interface LabAuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LabAuditLog[];
}

export const LabAuditLogModal: React.FC<LabAuditLogModalProps> = ({
  isOpen,
  onClose,
  logs
}) => {
  const { isKhmer } = useLanguage();
  const [search, setSearch] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const filteredLogs = logs.filter((log) => {
    const q = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.teacherName.toLowerCase().includes(q) ||
      (log.computerCode && log.computerCode.toLowerCase().includes(q)) ||
      log.details.toLowerCase().includes(q)
    );
  });

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh] my-auto"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shadow-xs">
              <ShieldCheck className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-950">
                {isKhmer ? 'កំណត់ត្រាសុវត្ថិភាពបញ្ជា (Security Audit Logs)' : 'Security Audit & Command Logs'}
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Immutable record of all teacher actions and agent dispatches
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-200/80 hover:bg-zinc-300 flex items-center justify-center text-zinc-600 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-zinc-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by teacher, action (LOCK, START_SESSION), or computer..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-pink-500 font-sans"
            />
          </div>
        </div>

        {/* Logs List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-zinc-100">
          {filteredLogs.length === 0 ? (
            <p className="text-xs text-zinc-400 italic text-center py-6">
              No audit records match your query.
            </p>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="pt-2.5 pb-2 text-xs space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-white font-mono text-[10px] font-bold">
                      {log.action}
                    </span>
                    <span className="font-bold text-zinc-900 font-mono">
                      {log.computerCode || 'GENERAL'}
                    </span>
                  </div>

                  <span className="text-[10px] text-zinc-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                <p className="text-zinc-600 text-[11px] leading-relaxed">{log.details}</p>
                <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-zinc-400" />
                    {log.teacherName}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">{log.status}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
          <span className="text-xs text-zinc-400 font-mono">
            {filteredLogs.length} audit entries
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
