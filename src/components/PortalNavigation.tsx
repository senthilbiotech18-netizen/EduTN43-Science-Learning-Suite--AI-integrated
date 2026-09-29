import React from 'react';
import { PortalMode } from '../types';
import { GraduationCap, BookOpen, FolderHeart, Database, School, Shield } from 'lucide-react';

interface PortalNavigationProps {
  currentPortal: PortalMode;
  onSelectPortal: (portal: PortalMode) => void;
  activeStudentId?: string;
  activeStudentName?: string;
  submissionsCount?: number;
  assignmentsCount?: number;
}

export const PortalNavigation: React.FC<PortalNavigationProps> = ({
  currentPortal,
  onSelectPortal,
  activeStudentId,
  activeStudentName,
  submissionsCount = 0,
  assignmentsCount = 0,
}) => {
  return (
    <header className="w-full max-w-6xl mx-auto mb-6 bg-[#0E1E38]/90 border border-blue-500/20 backdrop-blur-md rounded-2xl p-3 md:p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-900/30">
          <School className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-bold text-white tracking-wide font-sans">
              GSIS EduTN43 Learning Suite
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
              <Database className="w-2.5 h-2.5" />
              Firebase Cloud Live
            </span>
          </div>
          <p className="text-xs text-blue-200/70 font-sans">
            Scaffold Learning Paradigm • Dual Portal & Individual Student Portfolios
          </p>
        </div>
      </div>

      {/* Pathway Switcher Tabs */}
      <div className="flex items-center p-1 bg-[#091322] rounded-xl border border-blue-400/20 shadow-inner">
        <button
          onClick={() => onSelectPortal('teacher')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all cursor-pointer ${
            currentPortal === 'teacher'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
              : 'text-blue-300 hover:text-white hover:bg-blue-950/50'
          }`}
          title="Manage Scaffold Assignments, Student Links, and Submissions"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Teacher's Dashboard</span>
          {submissionsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-cyan-400 text-blue-950 text-[10px] font-bold">
              {submissionsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectPortal('student')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all cursor-pointer ${
            currentPortal === 'student'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/50'
              : 'text-blue-300 hover:text-white hover:bg-blue-950/50'
          }`}
          title="Enter Name, Class & ID to complete assigned Scaffold Learning tasks"
        >
          <BookOpen className="w-4 h-4" />
          <span>Student Dashboard</span>
          {activeStudentName && (
            <span className="hidden lg:inline text-[11px] opacity-80 max-w-[100px] truncate">
              ({activeStudentName.split(' ')[0]})
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectPortal('portfolio')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all cursor-pointer ${
            currentPortal === 'portfolio'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50'
              : 'text-blue-300 hover:text-white hover:bg-blue-950/50'
          }`}
          title="Separate link showing only this student's data and previous work"
        >
          <FolderHeart className="w-4 h-4" />
          <span>Student Individual Portfolio</span>
        </button>
      </div>
    </header>
  );
};
