// ====================================================================
// Component: LabAdminManagement
// PC Registration, Lab Group Assignment, & Agent Token Management
// ====================================================================

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus,
  Monitor,
  Building,
  KeyRound,
  Trash2,
  Edit2,
  CheckCircle2,
  ShieldAlert,
  Server,
  RefreshCw,
  X
} from 'lucide-react';
import { ComputerWorkstation, LabGroup } from '../types/lab';
import { LabApiService } from '../services/labApi';
import { useLanguage } from '../../../context/LanguageContext';

interface LabAdminManagementProps {
  computers: ComputerWorkstation[];
  selectedLab: LabGroup;
  onRefresh: () => void;
}

export const LabAdminManagement: React.FC<LabAdminManagementProps> = ({
  computers,
  selectedLab,
  onRefresh
}) => {
  const { isKhmer } = useLanguage();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newHostname, setNewHostname] = useState('');
  const [newGroup, setNewGroup] = useState<LabGroup>(selectedLab);
  const [newIp, setNewIp] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsRegisterOpen(false);
      }
    };
    if (isRegisterOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRegisterOpen]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newHostname.trim()) return;

    LabApiService.registerComputer({
      computerCode: newCode.trim(),
      hostname: newHostname.trim(),
      labGroup: newGroup,
      ipAddress: newIp.trim() || undefined
    });

    setNewCode('');
    setNewHostname('');
    setNewIp('');
    setIsRegisterOpen(false);
    onRefresh();
  };

  const handleDelete = (id: string, code: string) => {
    if (window.confirm(`Are you sure you want to remove ${code} from the Lab system?`)) {
      LabApiService.deleteComputer(id, selectedLab);
      onRefresh();
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header with Add PC Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
        <div>
          <h3 className="text-base font-black text-zinc-950 flex items-center gap-2">
            <Server className="w-5 h-5 text-pink-800" />
            {isKhmer ? 'ការគ្រប់គ្រងកុំព្យូទ័រ និង Agent' : 'Workstation & Agent Registry'}
          </h3>
          <p className="text-xs text-zinc-500">
            {isKhmer
              ? 'ចុះឈ្មោះកុំព្យូទ័រថ្មី កំណត់ទីតាំងបន្ទប់ និងគ្រប់គ្រងសោសុវត្ថិភាព Windows Agent'
              : 'Register new lab PCs, assign lab rooms, and manage Windows Agent credentials'}
          </p>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="px-4 py-2 rounded-xl bg-pink-800 hover:bg-pink-700 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>{isKhmer ? 'ចុះឈ្មោះកុំព្យូទ័រថ្មី' : 'Register New PC'}</span>
        </button>
      </div>

      {/* Register PC Modal */}
      {isRegisterOpen && typeof document !== 'undefined' && createPortal(
        <div
          onClick={() => setIsRegisterOpen(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm overflow-y-auto animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-md w-full p-6 space-y-4 my-auto"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-black text-zinc-950">
                {isKhmer ? 'ចុះឈ្មោះកុំព្យូទ័រថ្មីចូលក្នុងប្រព័ន្ធ' : 'Register New Workstation'}
              </h4>
              <button
                type="button"
                onClick={() => setIsRegisterOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Computer Code (e.g. LAB-31)
                </label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="LAB-31"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl font-mono uppercase font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Hostname (Windows PC Name)
                </label>
                <input
                  type="text"
                  required
                  value={newHostname}
                  onChange={(e) => setNewHostname(e.target.value)}
                  placeholder="DESKTOP-CIIS-31"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Lab Room Group
                </label>
                <select
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value as LabGroup)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl font-bold"
                >
                  <option value="Lab A">Lab A (Room 101)</option>
                  <option value="Lab B">Lab B (Room 102)</option>
                  <option value="Lab C">Lab C (Room 103)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Static IP Address (Optional)
                </label>
                <input
                  type="text"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="192.168.10.131"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-800 hover:bg-pink-700 text-white text-xs font-black shadow-xs cursor-pointer active:scale-98"
                >
                  Save & Register
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Table of Registered Computers */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-mono uppercase text-[10.5px]">
              <tr>
                <th className="p-3.5 pl-4">Computer Code</th>
                <th className="p-3.5">Hostname</th>
                <th className="p-3.5">IP / MAC Address</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Agent Version</th>
                <th className="p-3.5">Assigned Student</th>
                <th className="p-3.5 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium text-zinc-800">
              {computers.map((pc) => (
                <tr key={pc.id} className="hover:bg-pink-50/20 transition-colors">
                  <td className="p-3.5 pl-4 font-black font-mono text-zinc-950 flex items-center gap-2">
                    <Monitor className="w-3.5 h-3.5 text-pink-800" />
                    {pc.computerCode}
                  </td>
                  <td className="p-3.5 font-mono text-zinc-600">{pc.hostname}</td>
                  <td className="p-3.5 font-mono text-zinc-500 text-[11px]">
                    {pc.ipAddress || '192.168.10.x'}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono border ${
                        pc.status === 'IN_USE'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : pc.status === 'LOCKED'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : pc.status === 'AVAILABLE'
                          ? 'bg-purple-100 text-purple-900 border-purple-300'
                          : 'bg-zinc-100 text-zinc-600 border-zinc-300'
                      }`}
                    >
                      {pc.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-emerald-700 font-bold">{pc.agentVersion}</td>
                  <td className="p-3.5 font-bold text-zinc-900">{pc.studentName || '—'}</td>
                  <td className="p-3.5 text-right pr-4">
                    <button
                      onClick={() => handleDelete(pc.id, pc.computerCode)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      title="Remove PC"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
