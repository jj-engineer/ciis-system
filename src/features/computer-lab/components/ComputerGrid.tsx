// ====================================================================
// Component: ComputerGrid
// Clean, Realistic School Lab Workstation Grid
// ====================================================================

import React from 'react';
import {
  Search,
  Building,
  RefreshCw,
  Radio,
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import { ComputerWorkstation, LabGroup } from '../types/lab';
import { ComputerCard } from './ComputerCard';
import { StatusFilterOption } from '../hooks/useLabComputers';
import { useLanguage } from '../../../context/LanguageContext';

interface ComputerGridProps {
  computers: ComputerWorkstation[];
  selectedLab: LabGroup;
  onSelectLab: (group: LabGroup) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: StatusFilterOption;
  onStatusFilterChange: (f: StatusFilterOption) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onComputerClick: (computer: ComputerWorkstation) => void;
  onRefresh: () => void;
  onGenerateToken?: (computer: ComputerWorkstation) => void;
}

export const ComputerGrid: React.FC<ComputerGridProps> = ({
  computers,
  selectedLab,
  onSelectLab,
  searchQuery,
  onSearchChange,
  statusFilter,
  selectedIds,
  onToggleSelect,
  onComputerClick,
  onRefresh,
  onGenerateToken
}) => {
  const { isKhmer } = useLanguage();

  const labRooms: { id: LabGroup; label: string; count: number }[] = [
    { id: 'Lab A', label: isKhmer ? 'បន្ទប់ Lab A (៣០ Laptops)' : 'Lab A (Room 101 • 30 Laptops)', count: 30 },
    { id: 'Lab B', label: isKhmer ? 'បន្ទប់ Lab B (២៥ Laptops)' : 'Lab B (Room 102 • 25 Laptops)', count: 25 },
    { id: 'Lab C', label: isKhmer ? 'បន្ទប់ Lab C (២០ Laptops)' : 'Lab C (Room 103 • 20 Laptops)', count: 20 }
  ];

  return (
    <div className="space-y-4">
      {/* 1. Clean Toolbar: Lab Room Switcher & Instant Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
        {/* Lab Room Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100/90 border border-zinc-200/80">
          {labRooms.map((room) => {
            const isActive = selectedLab === room.id;
            return (
              <button
                key={room.id}
                onClick={() => onSelectLab(room.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-zinc-950 shadow-2xs font-black'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <Building className="w-3.5 h-3.5 text-pink-800" />
                <span>{room.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar & Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isKhmer ? 'ស្វែងរក Laptop 01-30, IP...' : 'Search Laptop 01-30, IP...'}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-pink-500 focus:bg-white transition-all font-sans"
            />
          </div>

          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 transition-all cursor-pointer shrink-0"
            title="Refresh Status"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Grid of School Laptops */}
      {computers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200 space-y-2">
          <p className="text-sm font-bold text-zinc-700">
            {isKhmer ? 'មិនមាន Laptop ត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ' : 'No laptops match this filter or search query.'}
          </p>
          <p className="text-xs text-zinc-400">
            {isKhmer ? 'សូមសាកល្បងសម្អាតពាក្យស្វែងរក។' : 'Try clearing your search query or selecting another status filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {computers.map((pc) => (
            <ComputerCard
              key={pc.id}
              computer={pc}
              isSelected={selectedIds.has(pc.id)}
              onSelect={onToggleSelect}
              onClick={onComputerClick}
              onGenerateToken={onGenerateToken}
            />
          ))}
        </div>
      )}
    </div>
  );
};
