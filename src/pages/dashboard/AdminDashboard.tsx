import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { getDefaultAvatar } from '../../services/avatarLibrary';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import {
  Users,
  School,
  Monitor,
  ShieldCheck,
  HardDrive,
  Database,
  ArrowRight,
  UserCheck,
  GraduationCap
} from 'lucide-react';

interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveTab }) => {
  const { allProfiles } = useAuth();
  const { classes, deviceSessions, studentAnalytics } = useApp();

  const totalTeachers = allProfiles.filter(p => p.role === 'teacher').length;
  const totalAssistants = allProfiles.filter(p => p.role === 'assistant_teacher').length;
  const totalStudents = allProfiles.filter(p => p.role === 'student').length;
  const totalClasses = classes.length;
  const activeSessionsCount = deviceSessions.length;

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-pink-700 via-pink-800 to-pink-900 rounded-3xl p-6 sm:p-8 text-white shadow-md shadow-pink-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-pink-100 text-xs font-semibold backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-pink-200" />
            <span>School Administration & IT Master Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            School System Overview
          </h1>
          <p className="text-pink-100/90 text-sm max-w-xl">
            Manage users, classrooms, computer lab workstations, curriculum resources, and generate administrative school reports.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('reports')}
            className="px-4 py-2.5 bg-white text-pink-800 hover:bg-pink-50 font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            Export All School Reports
          </button>
        </div>
      </div>

      {/* Admin KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Students"
          value={totalStudents}
          subtitle="Enrolled across all grades"
          icon={UserCheck}
          onClick={() => setActiveTab('students')}
        />
        <StatCard
          title="Teaching Staff"
          value={`${totalTeachers} Lead / ${totalAssistants} Asst`}
          subtitle="Computer Department"
          icon={GraduationCap}
          onClick={() => setActiveTab('classes')}
        />
        <StatCard
          title="Classes & Labs"
          value={totalClasses}
          subtitle="Grade 10A, 10B, 11A"
          icon={School}
          onClick={() => setActiveTab('classes')}
        />
        <StatCard
          title="Active Lab Devices"
          value={`${activeSessionsCount} Active`}
          subtitle="Live Connected Sessions"
          icon={Monitor}
          onClick={() => setActiveTab('lab')}
        />
      </div>

      {/* System Infrastructure & User Management Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: User Roster & Class Distribution */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-pink-700" />
                User Accounts & Role Distribution
              </h3>
              <button
                onClick={() => setActiveTab('students')}
                className="text-xs font-bold text-pink-700 hover:underline"
              >
                Manage All Users
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {allProfiles.slice(0, 6).map((user) => (
                <div key={user.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl || getDefaultAvatar(user.role, user.studentId || user.fullName)}
                      alt={user.fullName}
                      className="w-9 h-9 rounded-xl object-cover ring-1 ring-pink-100"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500">{user.email || user.studentId}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      user.role === 'admin' ? 'pink' :
                      user.role === 'teacher' ? 'blue' :
                      user.role === 'assistant_teacher' ? 'purple' : 'slate'
                    }
                    size="sm"
                  >
                    {user.role.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: System Health */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-pink-700" />
              System Architecture & Health
            </h3>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Database Engine</span>
                <span className="text-xs font-bold text-emerald-700">PostgreSQL / Supabase</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">PWA Offline Mode</span>
                <span className="text-xs font-bold text-emerald-700">Enabled (Service Worker)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Security / RLS</span>
                <span className="text-xs font-bold text-emerald-700">Role-Based (Active)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Student Phone Requirement</span>
                <span className="text-xs font-bold text-pink-700">None (Full Direct Access)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
