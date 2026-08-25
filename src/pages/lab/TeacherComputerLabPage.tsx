// ====================================================================
// Page: TeacherComputerLabPage
// Realistic, Lightweight School Computer Lab Live Monitoring Dashboard
// ====================================================================

import React, { useState } from 'react';
import {
  Laptop,
  ShieldCheck,
  Radio,
  RefreshCw,
  Server,
  History,
  Building,
  KeyRound,
  Plus,
  Activity,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useLabComputers } from '../../features/computer-lab/hooks/useLabComputers';
import { useLabSession } from '../../features/computer-lab/hooks/useLabSession';
import { useLabRealtime } from '../../features/computer-lab/hooks/useLabRealtime';
import { LabStats } from '../../features/computer-lab/components/LabStats';
import { ComputerGrid } from '../../features/computer-lab/components/ComputerGrid';
import { ComputerDetailModal } from '../../features/computer-lab/components/ComputerDetailModal';
import { GenerateTokenModal } from '../../features/computer-lab/components/GenerateTokenModal';
import { LabAdminManagement } from '../../features/computer-lab/components/LabAdminManagement';
import { LabAuditLogModal } from '../../features/computer-lab/components/LabAuditLogModal';
import { ConnectionStatus } from '../../features/computer-lab/components/ConnectionStatus';
import { LabStorageService } from '../../features/computer-lab/services/labStorage';
import { ComputerWorkstation, LabCommandType } from '../../features/computer-lab/types/lab';

export const TeacherComputerLabPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { isKhmer } = useLanguage();

  const [activeTab, setActiveTab] = useState<'monitor' | 'admin'>('monitor');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [tokenModalComputer, setTokenModalComputer] = useState<ComputerWorkstation | null>(null);

  // Custom Hooks
  const {
    selectedLab,
    setSelectedLab,
    computers,
    filteredComputers,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    selectedComputerId,
    setSelectedComputerId,
    selectedComputer,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    dispatchCommand,
    refreshComputers
  } = useLabComputers('Lab A');

  const { isWsConnected, isDemoMode, toggleDemoMode, reconnect } = useLabRealtime();
  const auditLogs = LabStorageService.getAuditLogs();

  return (
    <div className="space-y-4 animate-fade-in pb-8">
      {/* Cloud Notice Banner (Only shown if on Vercel/Cloud) */}
      {typeof window !== 'undefined' && window.location.hostname.includes('vercel.app') && (
        <div className="p-3 rounded-2xl bg-zinc-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs border border-zinc-800">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-pink-400 shrink-0 animate-pulse" />
            <span className="text-zinc-300 font-medium">
              {isKhmer
                ? 'ដើម្បីមើលវត្តមាន Laptop សាលាផ្សាយផ្ទាល់ សូមបើកលើ Teacher PC (នៅលើ Wi-Fi សាលា):'
                : 'To view live laptop heartbeats, open the dashboard locally on the Teacher PC (School Wi-Fi):'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="http://192.168.0.114:5173/teacher/computer-lab"
              className="px-3 py-1 rounded-lg bg-pink-800 hover:bg-pink-700 text-white font-bold transition-all text-[11px] font-mono flex items-center gap-1 shadow-xs"
            >
              <span>192.168.0.114:5173</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="http://localhost:5173/teacher/computer-lab"
              className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold transition-all text-[11px] font-mono flex items-center gap-1"
            >
              <span>localhost:5173</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* 1. Header: Real Title, Connection Pill & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white flex items-center justify-center shadow-xs font-black">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-zinc-950 tracking-tight flex items-center gap-2">
              <span>{isKhmer ? 'បន្ទប់កុំព្យូទ័រ' : 'School Computer Lab'}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-mono font-bold border border-zinc-200">
                {isKhmer ? '៣០ Laptops' : '30 Laptops'}
              </span>
            </h1>
            <p className="text-xs text-zinc-500 font-medium">
              {isKhmer
                ? 'ត្រួតពិនិត្យវត្តមាន Online/Offline របស់ Laptop សាលា (០១ ដល់ ៣០)'
                : 'Live presence & online/offline monitoring for school laptops (01 – 30)'}
            </p>
          </div>
        </div>

        {/* Right Toolbar: Clean Minimalist Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <ConnectionStatus
            isWsConnected={isWsConnected}
            onReconnect={reconnect}
          />

          <button
            onClick={() => {
              // Open pair token for first unregistered or laptop 01
              const unreg = computers.find((c) => c.status === 'UNREGISTERED') || computers[0];
              setTokenModalComputer(unreg);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
          >
            <KeyRound className="w-3.5 h-3.5 text-zinc-300" />
            <span>{isKhmer ? 'ចុះឈ្មោះ Laptop' : 'Pair Laptop'}</span>
          </button>

          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
          >
            <History className="w-3.5 h-3.5 text-zinc-500" />
            <span>{isKhmer ? 'កំណត់ត្រា' : 'Logs'}</span>
          </button>
        </div>
      </div>

      {/* 2. Sleek Realtime Status Filter Bar */}
      <LabStats
        stats={stats}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      {/* 3. Computer Grid (Laptops 01 through 30) */}
      <ComputerGrid
        computers={filteredComputers}
        selectedLab={selectedLab}
        onSelectLab={setSelectedLab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
        onComputerClick={(pc) => setSelectedComputerId(pc.id)}
        onRefresh={refreshComputers}
        onGenerateToken={(pc) => setTokenModalComputer(pc)}
      />

      {/* 4. Modals & Drawers */}
      {/* Laptop Registration Token Generator Modal */}
      <GenerateTokenModal
        computer={tokenModalComputer}
        isOpen={Boolean(tokenModalComputer)}
        onClose={() => setTokenModalComputer(null)}
      />

      {/* Computer Detail Telemetry Drawer */}
      <ComputerDetailModal
        computer={selectedComputer}
        isOpen={Boolean(selectedComputerId)}
        onClose={() => setSelectedComputerId(null)}
        onDispatchCommand={(cmd, target, payload) => {
          if (cmd === 'GENERATE_TOKEN') {
            setTokenModalComputer(target);
            setSelectedComputerId(null);
          } else {
            dispatchCommand(cmd, target, payload);
            setSelectedComputerId(null);
          }
        }}
      />

      {/* Security Audit Logs Modal */}
      <LabAuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        logs={auditLogs}
      />
    </div>
  );
};
