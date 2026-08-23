import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../../components/common/Badge';
import { StudentDeviceSession } from '../../types';
import {
  Monitor,
  Laptop,
  Smartphone,
  Tablet,
  CheckCircle2,
  Clock,
  Search,
  Users,
  Activity,
  Wifi,
  RefreshCw
} from 'lucide-react';

export const ComputerLabPage: React.FC = () => {
  const { isStaff, currentUser } = useAuth();
  const { deviceSessions, registerDeviceSession } = useApp();
  const { isKhmer, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredSessions = deviceSessions.filter(s => {
    const matchesSearch = s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.className.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'mobile') return matchesSearch && s.deviceType === 'Mobile Phone';
    if (filterType === 'pc') return matchesSearch && (s.deviceType === 'Desktop PC' || s.deviceType === 'Laptop');
    return matchesSearch;
  });

  const getDeviceIcon = (type: StudentDeviceSession['deviceType']) => {
    switch (type) {
      case 'Mobile Phone':
        return <Smartphone className="w-5 h-5 text-pink-700" />;
      case 'Tablet':
        return <Tablet className="w-5 h-5 text-pink-700" />;
      case 'Laptop':
        return <Laptop className="w-5 h-5 text-pink-700" />;
      default:
        return <Monitor className="w-5 h-5 text-pink-700" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Monitor className="w-6 h-6 text-pink-700" />
            {t('title.lab', undefined, 'Computer Lab & Active Student Devices')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isKhmer
              ? 'ការរកឃើញវត្តមានឧបករណ៍កុំព្យូទ័រ និងទូរស័ព្ទរបស់សិស្សក្នុងថ្នាក់ជាក់ស្តែង។'
              : 'Real-time detection of active student sessions on school computers, laptops, and mobile devices.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-950/10 text-pink-900 text-xs font-bold border border-pink-200">
            <span className="w-2 h-2 rounded-full bg-pink-800 animate-pulse"></span>
            <span>{isKhmer ? 'ប្រព័ន្ធតាមដានឧបករណ៍ផ្សាយផ្ទាល់' : 'Live Session Monitor'}</span>
          </span>
        </div>
      </div>

      {/* Requirement 18: Clean Empty State when no devices are connected */}
      {deviceSessions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm text-center max-w-2xl mx-auto space-y-4 my-8">
          <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-700 flex items-center justify-center mx-auto border border-pink-100 shadow-sm">
            <Wifi className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-black text-slate-900">
              {t('empty.devices_title', undefined, 'No active devices')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              {t('empty.devices_desc', undefined, 'Students will appear here when they open the school system on a computer, laptop, tablet, or mobile device.')}
            </p>
          </div>

          <div className="pt-2">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{isKhmer ? 'កំពុងរង់ចាំសិស្សភ្ជាប់ឧបករណ៍ចូលក្នុងប្រព័ន្ធ...' : 'Waiting for connected student devices...'}</span>
            </span>
          </div>
        </div>
      ) : (
        /* Live Devices View when devices are active */
        <div className="space-y-5">
          {/* Summary & Search Filter */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="p-3 bg-pink-50 rounded-2xl border border-pink-100 flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-pink-700" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-pink-800 block">
                    {isKhmer ? 'ឧបករណ៍កំពុងភ្ជាប់' : 'Active Connected Sessions'}
                  </span>
                  <span className="text-base font-black text-pink-900 font-mono">
                    {deviceSessions.length} {isKhmer ? 'ឧបករណ៍' : 'Devices'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isKhmer ? 'ស្វែងរកសិស្ស ឬអត្តលេខម៉ាស៊ីន...' : 'Search student or station (e.g. LAB-01)...'}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterType === 'all' ? 'bg-pink-700 text-white' : 'bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  {isKhmer ? 'ទាំងអស់' : 'All'}
                </button>
                <button
                  onClick={() => setFilterType('pc')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterType === 'pc' ? 'bg-pink-700 text-white' : 'bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  {isKhmer ? 'កុំព្យូទ័រ Lab' : 'Lab PCs'}
                </button>
                <button
                  onClick={() => setFilterType('mobile')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterType === 'mobile' ? 'bg-pink-700 text-white' : 'bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  {isKhmer ? 'ទូរស័ព្ទដៃ' : 'Mobile'}
                </button>
              </div>
            </div>
          </div>

          {/* Active Devices Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-pink-300 shadow-sm transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-700 font-mono font-black text-xs flex items-center justify-center border border-pink-100">
                        {session.deviceId}
                      </div>
                      <Badge variant="green" size="sm">
                        {session.status === 'active' ? (isKhmer ? 'កំពុងប្រើ' : 'Active') : session.status}
                      </Badge>
                    </div>

                    {getDeviceIcon(session.deviceType)}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {isKhmer ? 'សិស្សកំពុងភ្ជាប់' : 'Connected Student'}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">{session.studentName}</h3>
                    <span className="text-xs text-slate-500 font-mono">{session.className}</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/60 text-[11px] text-slate-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>OS:</span>
                      <span className="font-bold text-slate-800">{session.operatingSystem}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Browser:</span>
                      <span className="font-bold text-slate-800">{session.browser}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{isKhmer ? 'ប្រភេទ៖' : 'Type:'}</span>
                      <span className="font-medium text-slate-700">{session.deviceType}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{isKhmer ? 'សកម្មចុងក្រោយ៖' : 'Last Active:'}</span>
                  <span>{new Date(session.lastActiveTime).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
