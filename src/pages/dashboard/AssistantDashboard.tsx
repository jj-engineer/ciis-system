import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import {
  CheckSquare,
  Users,
  ClipboardList,
  Monitor,
  ArrowRight,
  Clock
} from 'lucide-react';

interface AssistantDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const AssistantDashboard: React.FC<AssistantDashboardProps> = ({ setActiveTab }) => {
  const { currentUser } = useAuth();
  const {
    selectedClass,
    attendance,
    submissions,
    deviceSessions,
    studentNotes
  } = useApp();

  const totalStudents = selectedClass?.studentCount || 35;
  const presentCount = attendance.filter(a => a.status === 'present').length || 32;
  const pendingSubmissions = submissions.filter(s => s.status === 'submitted').length;
  const activeDevicesCount = deviceSessions.length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-pink-700 via-pink-800 to-pink-900 rounded-3xl p-6 sm:p-8 text-white shadow-md shadow-pink-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-pink-100 text-xs font-semibold backdrop-blur-sm">
            <CheckSquare className="w-3.5 h-3.5 text-pink-200" />
            <span>Assistant Teacher Control Workspace • Computer Lab 1</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {currentUser.fullName}
          </h1>
          <p className="text-pink-100/90 text-sm max-w-xl">
            You are assisting <strong className="text-white">Nun Langdy (នុន លាងឌី)</strong> with <strong className="text-white">{selectedClass?.name || 'CIIS Computer {5:30-6:30}'}</strong>. You can record daily attendance, check homework submissions, and monitor active student computer sessions.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('attendance')}
          className="px-4 py-2.5 bg-white text-pink-800 hover:bg-pink-50 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 shrink-0"
        >
          <CheckSquare className="w-4 h-4 text-pink-700" />
          <span>Record Attendance Now</span>
        </button>
      </div>

      {/* Assistant KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attendance Recorded"
          value={`${presentCount} / ${totalStudents}`}
          subtitle={`${selectedClass?.name || 'Grade 10A'} Session`}
          icon={CheckSquare}
          onClick={() => setActiveTab('attendance')}
        />
        <StatCard
          title="Submissions to Check"
          value={pendingSubmissions}
          subtitle="Waiting for teacher review"
          icon={ClipboardList}
          onClick={() => setActiveTab('assignments')}
        />
        <StatCard
          title="Live Student Devices"
          value={`${activeDevicesCount} Active`}
          subtitle="Computer Lab Sessions"
          icon={Monitor}
          onClick={() => setActiveTab('lab')}
        />
        <StatCard
          title="Student Notes Added"
          value={studentNotes.length}
          subtitle="Behavioral & Academic logs"
          icon={Users}
          onClick={() => setActiveTab('students')}
        />
      </div>

      {/* Assistant Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Attendance Launcher */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-pink-700" />
                Daily Attendance Verification
              </h3>
              <Badge variant="pink" size="sm">Quick Task</Badge>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verify student seating in Computer Lab 1. Use the 1-click "Select All as Present" button to mark the whole class in less than 30 seconds, then toggle any late or absent students.
            </p>
            <button
              onClick={() => setActiveTab('attendance')}
              className="px-4 py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              Open Fast Attendance Tool
            </button>
          </div>

          {/* Submissions Checking Queue */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-pink-700" />
                Student Homework Queue
              </h3>
              <button
                onClick={() => setActiveTab('assignments')}
                className="text-xs font-bold text-pink-700 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {submissions.slice(0, 4).map((sub) => (
                <div key={sub.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-700 font-bold text-xs flex items-center justify-center">
                      {sub.studentName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{sub.studentName}</p>
                      <p className="text-[10px] text-slate-500">{sub.fileName}</p>
                    </div>
                  </div>
                  <Badge variant={sub.status === 'checked' ? 'green' : 'pink'} size="sm">
                    {sub.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Student Observation Logs */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-pink-700" />
                Private Student Notes
              </h3>
              <button
                onClick={() => setActiveTab('students')}
                className="text-xs font-bold text-pink-700 hover:underline"
              >
                Directory
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {studentNotes.map((note) => (
                <div key={note.id} className="py-2.5 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{note.studentName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{note.category}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
