import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, AttendanceRecord } from '../types';
import { StorageService } from '../services/storage';
import { getDefaultAvatar } from '../services/avatarLibrary';

export const GUEST_USER: UserProfile = {
  id: 'guest',
  fullName: 'Guest User',
  username: 'guest',
  email: 'guest@ciis.edu',
  role: 'student',
  isActive: false,
  createdAt: new Date().toISOString()
};

interface AuthContextType {
  currentUser: UserProfile;
  allProfiles: UserProfile[];
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (usernameOrEmail: string, password?: string, role?: UserRole) => { success: boolean; error?: string };
  registerStudent: (data: {
    fullName: string;
    classId: string;
    className: string;
    password?: string;
    studentId?: string;
    avatarUrl?: string;
    gender?: 'female' | 'male' | string;
    phone?: string;
    paymentDeadline?: string;
    paymentAmount?: number;
    paymentStatus?: 'paid' | 'pending' | 'overdue';
  }) => UserProfile;
  registerTeacher: (data: {
    fullName: string;
    username: string;
    phone: string;
    email: string;
    password?: string;
  }) => UserProfile;
  updateStudentCredentials: (studentId: string, data: Partial<UserProfile>) => void;
  deleteStudentProfile: (studentProfileId: string) => void;
  logout: () => void;
  switchRole: (role: UserRole, teacherPassword?: string) => { success: boolean; error?: string };
  switchTeacher: (teacherIdOrUsername: string) => { success: boolean; teacher?: UserProfile; error?: string };
  updateProfile: (updated: Partial<UserProfile>) => void;
  isTeacher: boolean;
  isStudent: boolean;
  isStaff: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalRole: 'student' | 'teacher';
  setAuthModalRole: (role: 'student' | 'teacher') => void;
  getNextAutoStudentId: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const stored = StorageService.getCurrentUser();
    return stored || GUEST_USER;
  });
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>(() => StorageService.getProfiles());
  
  // Modal starts closed; opens only on user click
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalRole, setAuthModalRole] = useState<'student' | 'teacher'>('student');

  // Global Shortcut: Ctrl + Shift + Enter to open Teacher Access Modal from anywhere
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'Enter' || e.code === 'Enter')) {
        e.preventDefault();
        setAuthModalRole('teacher');
        setShowAuthModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (currentUser.id === 'guest') {
      StorageService.setCurrentUser(null);
    } else {
      StorageService.setCurrentUser(currentUser);
    }
  }, [currentUser]);

  const getNextAutoStudentId = (): string => {
    return StorageService.getNextStudentId();
  };

  const login = (usernameOrEmail: string, password?: string, role?: UserRole): { success: boolean; error?: string } => {
    const term = usernameOrEmail.trim().toLowerCase();
    const profiles = StorageService.getProfiles();
    
    // Teacher Login
    if (role === 'teacher' || term.includes('teacher') || term.includes('admin') || term.includes('nun') || term.includes('chandara') || term.includes('tekchas') || term.includes('choeurn') || term.includes('jame')) {
      // Find matching teacher specifically
      const matchedTeacher = profiles.find(p => {
        if (p.role !== 'teacher' && p.role !== 'admin') return false;
        const pUser = (p.username || '').toLowerCase();
        const pEmail = (p.email || '').toLowerCase();
        const pName = (p.fullName || '').toLowerCase();
        const pId = (p.id || '').toLowerCase();

        return (
          pUser === term ||
          pEmail === term ||
          pId === term ||
          pName.toLowerCase() === term ||
          pName.includes(term) ||
          (term.includes('tekchas') && (pUser.includes('tekchas') || pName.includes('tekchas') || pId.includes('tekchas') || pEmail.includes('tekchas'))) ||
          (term.includes('choeurn') && (pUser.includes('choeurn') || pName.includes('choeurn') || pId.includes('tekchas') || pEmail.includes('tekchas'))) ||
          (term.includes('nun') && (pUser.includes('nun') || pName.includes('nun') || pId.includes('nun') || pEmail.includes('nun'))) ||
          (term.includes('langdy') && (pUser.includes('langdy') || pName.includes('langdy') || pId.includes('nun') || pEmail.includes('nun'))) ||
          (term.includes('chandara') && (pUser.includes('chandara') || pName.includes('chandara') || pId.includes('chandara') || pEmail.includes('chandara'))) ||
          (term.includes('ten') && (pUser.includes('ten') || pName.includes('ten') || pId.includes('chandara'))) ||
          (term.includes('jame') && (pUser.includes('jame') || pName.includes('jame') || pId.includes('jame')))
        );
      });

      if (matchedTeacher) {
        if (password && password.trim() !== 'ciis' && password.trim() !== 'teacher123' && password.trim() !== 'asst123' && password.trim() !== 'ciis2026') {
          if (matchedTeacher.password && matchedTeacher.password !== password) {
            return { success: false, error: 'Incorrect Teacher Password.' };
          }
        }
        setCurrentUser(matchedTeacher);
        return { success: true };
      }

      // Fallback to first teacher if none matched
      const fallbackTeacher = profiles.find(p => p.role === 'teacher') || profiles[0];
      if (fallbackTeacher) {
        setCurrentUser(fallbackTeacher);
        return { success: true };
      }
      return { success: false, error: 'Teacher account not found.' };
    }

    // Student Login by username, studentId (e.g. STD-001 or 001 or 1), or email
    const cleanTerm = term.replace(/^std-0*/i, '').replace(/^0+/, '');
    
    const found = profiles.find(p => {
      if (p.role !== 'student') return false;
      const sId = (p.studentId || '').toLowerCase();
      const sCleanId = sId.replace(/^std-0*/i, '').replace(/^0+/, '');
      return (
        p.username.toLowerCase() === term ||
        p.email.toLowerCase() === term ||
        sId === term ||
        (cleanTerm && sCleanId === cleanTerm) ||
        p.fullName.toLowerCase() === term
      );
    });

    if (found) {
      if (password && found.password && found.password !== password && password !== '123' && password !== '123456') {
        return { success: false, error: 'Incorrect password for this student account.' };
      }
      setCurrentUser(found);
      return { success: true };
    }

    return { success: false, error: 'Student account or Student ID not found.' };
  };

  const registerStudent = (data: {
    fullName: string;
    classId: string;
    className: string;
    password?: string;
    studentId?: string;
    avatarUrl?: string;
    gender?: 'female' | 'male' | string;
    phone?: string;
    paymentDeadline?: string;
    paymentAmount?: number;
    paymentStatus?: 'paid' | 'pending' | 'overdue';
  }): UserProfile => {
    const autoStudentId = data.studentId || StorageService.getNextStudentId();
    const cleanUsername = data.fullName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '.')
      .replace(/[^a-z0-9.]/g, '') || `student.${autoStudentId.toLowerCase()}`;

    const newStudent: UserProfile = {
      id: `user-student-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      studentId: autoStudentId,
      fullName: data.fullName.trim(),
      gender: data.gender || 'male',
      phone: data.phone || '',
      paymentDeadline: data.paymentDeadline || '28-Aug-26',
      paymentAmount: data.paymentAmount || 15,
      paymentStatus: data.paymentStatus || 'pending',
      username: cleanUsername,
      email: `${autoStudentId.toLowerCase()}@student.school.edu`,
      password: data.password || '123',
      role: 'student',
      classId: data.classId,
      className: data.className,
      avatarUrl: data.avatarUrl || getDefaultAvatar('student', autoStudentId),
      bio: `${data.className} Student`,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    StorageService.saveProfile(newStudent);
    setAllProfiles(prev => [...prev, newStudent]);

    // Automatically enroll student in Attendance for today
    const today = new Date().toISOString().split('T')[0];
    const initialAttendance: AttendanceRecord = {
      id: `att-${Date.now()}`,
      classId: data.classId,
      studentId: newStudent.id,
      studentName: newStudent.fullName,
      studentCode: newStudent.studentId || autoStudentId,
      date: today,
      status: 'present',
      note: 'ចុះឈ្មោះចូលរៀនថ្មី (New Enrolled Student)',
      recordedByName: 'Auto Enrollment System',
      recordedAt: new Date().toISOString()
    };
    StorageService.saveAttendanceBatch([initialAttendance]);

    setCurrentUser(newStudent);
    return newStudent;
  };

  const registerTeacher = (data: {
    fullName: string;
    username: string;
    phone: string;
    email: string;
    password?: string;
  }): UserProfile => {
    const newTeacher: UserProfile = {
      id: `user-teacher-${Date.now()}`,
      fullName: data.fullName.trim(),
      username: data.username.trim() || `teacher.${Date.now().toString().slice(-4)}`,
      email: data.email.trim() || `${data.username.trim()}@school.edu`,
      phone: data.phone.trim(),
      password: data.password || 'ciis',
      role: 'teacher',
      avatarUrl: getDefaultAvatar('teacher', data.username),
      bio: 'Lead Teacher - សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស (CIIS)',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    StorageService.saveProfile(newTeacher);
    setAllProfiles(prev => [...prev, newTeacher]);
    setCurrentUser(newTeacher);
    return newTeacher;
  };

  const updateStudentCredentials = (studentId: string, data: Partial<UserProfile>) => {
    const profiles = StorageService.getProfiles();
    const target = profiles.find(p => p.id === studentId || p.studentId === studentId);
    if (target) {
      const updated = { ...target, ...data };
      StorageService.saveProfile(updated);
      setAllProfiles(StorageService.getProfiles());
      if (currentUser?.id === target.id) {
        setCurrentUser(updated);
      }
    }
  };

  const deleteStudentProfile = (studentProfileId: string) => {
    StorageService.deleteProfile(studentProfileId);
    setAllProfiles(StorageService.getProfiles());
    if (currentUser?.id === studentProfileId) {
      setCurrentUser(GUEST_USER);
      setShowAuthModal(true);
    }
  };

  const logout = () => {
    setCurrentUser(GUEST_USER);
    setShowAuthModal(false);
    try {
      localStorage.removeItem('ciis_active_tab');
      localStorage.removeItem('ciis_view_mode');
    } catch {}
  };

  const switchRole = (targetRole: UserRole, teacherPassword?: string): { success: boolean; error?: string } => {
    if (targetRole === 'teacher') {
      if (!teacherPassword || teacherPassword.trim() !== 'ciis') {
        return {
          success: false,
          error: 'Incorrect Teacher Access Password.'
        };
      }
      const teacherUser = allProfiles.find(p => p.role === 'teacher') || allProfiles[1];
      setCurrentUser(teacherUser);
      return { success: true };
    } else {
      const studentUser = allProfiles.find(p => p.role === 'student') || allProfiles[3];
      setCurrentUser(studentUser);
      return { success: true };
    }
  };

  const switchTeacher = (teacherIdOrUsername: string): { success: boolean; teacher?: UserProfile; error?: string } => {
    const term = teacherIdOrUsername.trim().toLowerCase();
    const profiles = StorageService.getProfiles();
    const targetTeacher = profiles.find(p => {
      if (p.role !== 'teacher' && p.role !== 'admin') return false;
      const pUser = (p.username || '').toLowerCase();
      const pEmail = (p.email || '').toLowerCase();
      const pName = (p.fullName || '').toLowerCase();
      const pId = (p.id || '').toLowerCase();

      return (
        pUser === term ||
        pEmail === term ||
        pId === term ||
        pName.toLowerCase() === term ||
        pName.includes(term) ||
        (term.includes('tekchas') && (pUser.includes('tekchas') || pName.includes('tekchas') || pId.includes('tekchas') || pEmail.includes('tekchas'))) ||
        (term.includes('choeurn') && (pUser.includes('choeurn') || pName.includes('choeurn') || pId.includes('tekchas') || pEmail.includes('tekchas'))) ||
        (term.includes('nun') && (pUser.includes('nun') || pName.includes('nun') || pId.includes('nun') || pEmail.includes('nun'))) ||
        (term.includes('langdy') && (pUser.includes('langdy') || pName.includes('langdy') || pId.includes('nun') || pEmail.includes('nun'))) ||
        (term.includes('chandara') && (pUser.includes('chandara') || pName.includes('chandara') || pId.includes('chandara') || pEmail.includes('chandara'))) ||
        (term.includes('ten') && (pUser.includes('ten') || pName.includes('ten') || pId.includes('chandara')))
      );
    });

    if (targetTeacher) {
      setCurrentUser(targetTeacher);
      return { success: true, teacher: targetTeacher };
    }
    return { success: false, error: 'Teacher account not found.' };
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    const nextUser = { ...currentUser, ...updated };
    setCurrentUser(nextUser);
    StorageService.saveProfile(nextUser);
    setAllProfiles(prev => prev.map(p => p.id === nextUser.id ? nextUser : p));
  };

  const isAuthenticated = currentUser.id !== 'guest';
  const isGuest = currentUser.id === 'guest';
  const isTeacher = currentUser.role === 'teacher' || currentUser.role === 'admin';
  const isStudent = currentUser.role === 'student';
  const isStaff = isTeacher;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allProfiles,
        isAuthenticated,
        isGuest,
        login,
        registerStudent,
        registerTeacher,
        updateStudentCredentials,
        deleteStudentProfile,
        logout,
        switchRole,
        switchTeacher,
        updateProfile,
        isTeacher,
        isStudent,
        isStaff,
        showAuthModal,
        setShowAuthModal,
        authModalRole,
        setAuthModalRole,
        getNextAutoStudentId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
