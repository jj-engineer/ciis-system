import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { AuthModal } from './components/auth/AuthModal';

// Landing Page for Unauthenticated / Guest Users
import { GuestLandingPage } from './pages/landing/GuestLandingPage';

// Dashboards
import { TeacherDashboard } from './pages/dashboard/TeacherDashboard';
import { StudentDashboard } from './pages/dashboard/StudentDashboard';

// Module Pages
import { TeacherWorkspacePage } from './pages/workspace/TeacherWorkspacePage';
import { AttendancePage } from './pages/attendance/AttendancePage';
import { LessonsPage } from './pages/lessons/LessonsPage';
import { AssignmentsPage } from './pages/assignments/AssignmentsPage';
import { TypingTestPage } from './pages/typing/TypingTestPage';
import { StudentWorkUploadPage } from './pages/submissions/StudentWorkUploadPage';
import { StudentsPage } from './pages/students/StudentsPage';
import { StudentCredentialsPage } from './pages/students/StudentCredentialsPage';
import { ComputerLabPage } from './pages/lab/ComputerLabPage';
import { CalendarPage } from './pages/calendar/CalendarPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { AIAssistantPage } from './pages/ai/AIAssistantPage';
import { ClassesPage } from './pages/classes/ClassesPage';
import { StudentProgressPage } from './pages/progress/StudentProgressPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { TeacherProfilePage } from './pages/teachers/TeacherProfilePage';
import { SettingsPage } from './pages/settings/SettingsPage';

const AppContent: React.FC = () => {
  const { currentUser, isGuest, isAuthenticated, isStudent, isTeacher, showAuthModal, setShowAuthModal, authModalRole } = useAuth();
  const { t, isKhmer } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [viewMode, setViewMode] = useState<'portal' | 'website'>('portal');

  // If user signed out or is not logged in / guest, or switched to Public Website view mode:
  if (isGuest || !isAuthenticated || !currentUser || currentUser.id === 'guest' || viewMode === 'website') {
    return (
      <>
        <GuestLandingPage onReturnToPortal={() => setViewMode('portal')} />
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            initialRole={authModalRole}
            skipSplash={true}
          />
        )}
      </>
    );
  }

  const getPageTitle = (tab: string) => {
    if (isKhmer) {
      switch (tab) {
        case 'dashboard':
          return 'ទំព័រដើម';
        case 'workspace':
          return 'កន្លែងធ្វើការគ្រូ';
        case 'attendance':
          return 'ស្រង់វត្តមាន';
        case 'students':
          return 'បញ្ជីសិស្ស';
        case 'student-credentials':
          return 'គណនីសិស្ស';
        case 'classes':
          return 'ថ្នាក់រៀន';
        case 'lessons':
          return 'មេរៀន';
        case 'assignments':
          return 'កិច្ចការ & ប្រឡង';
        case 'typing':
          return 'ហ្វឹកហាត់វាយអក្សរ';
        case 'submissions':
          return 'ផ្ញើកិច្ចការ';
        case 'lab':
          return 'បន្ទប់កុំព្យូទ័រ';
        case 'calendar':
          return 'កាលវិភាគ';
        case 'reports':
          return 'របាយការណ៍';
        case 'ai-assistant':
          return 'ជំនួយការ AI';
        case 'progress':
          return 'វឌ្ឍនភាពសិក្សា';
        case 'teacher-profile':
          return 'ប្រវត្តិរូបគ្រូ';
        case 'profile':
          return 'គណនីផ្ទាល់ខ្លួន';
        case 'settings':
          return 'ការកំណត់';
        default:
          return 'សាលារៀន CIIS';
      }
    } else {
      switch (tab) {
        case 'dashboard':
          return 'Home';
        case 'workspace':
          return 'Workspace';
        case 'attendance':
          return 'Attendance';
        case 'students':
          return 'Students';
        case 'student-credentials':
          return 'Student Accounts';
        case 'classes':
          return 'Classes';
        case 'lessons':
          return 'Lessons';
        case 'assignments':
          return 'Assignments';
        case 'typing':
          return 'Typing Lab';
        case 'submissions':
          return 'Upload Work';
        case 'lab':
          return 'Computer Lab';
        case 'calendar':
          return 'Schedule';
        case 'reports':
          return 'Reports';
        case 'ai-assistant':
          return 'AI Assistant';
        case 'progress':
          return 'Learning Progress';
        case 'teacher-profile':
          return 'Teacher Profiles';
        case 'profile':
          return 'My Profile';
        case 'settings':
          return 'Settings';
        default:
          return 'CIIS School';
      }
    }
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        if (isStudent) return <StudentDashboard setActiveTab={setActiveTab} />;
        return <TeacherDashboard setActiveTab={setActiveTab} />;

      case 'workspace':
        return <TeacherWorkspacePage setActiveTab={setActiveTab} />;

      case 'teacher-profile':
        return <TeacherProfilePage />;

      case 'attendance':
        return <AttendancePage />;

      case 'students':
        return <StudentsPage />;

      case 'student-credentials':
        return <StudentCredentialsPage />;

      case 'classes':
        return <ClassesPage setActiveTab={setActiveTab} />;

      case 'lessons':
        return <LessonsPage />;

      case 'assignments':
        return <AssignmentsPage />;

      case 'typing':
        return <TypingTestPage />;

      case 'submissions':
        return <StudentWorkUploadPage />;

      case 'lab':
        return <ComputerLabPage />;

      case 'calendar':
        return <CalendarPage />;

      case 'reports':
        return <ReportsPage />;

      case 'ai-assistant':
        return <AIAssistantPage setActiveTab={setActiveTab} />;

      case 'profile':
        return <ProfilePage />;

      case 'settings':
        if (isStudent) return <StudentDashboard setActiveTab={setActiveTab} />;
        return <SettingsPage />;

      default:
        if (isStudent) return <StudentDashboard setActiveTab={setActiveTab} />;
        return <TeacherDashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      <AppLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeTabTitle={getPageTitle(activeTab)}
        onVisitWebsite={() => setViewMode('website')}
      >
        {renderActivePage()}
      </AppLayout>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialRole={authModalRole}
        />
      )}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
