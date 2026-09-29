import React, { useState } from 'react';
import { TeacherAssignment } from '../types';
import { Target, CheckCircle2, ChevronDown, ChevronUp, Lock, Shield, AlertTriangle, UserCheck, School } from 'lucide-react';

interface AssignedTaskBannerProps {
  assignment: TeacherAssignment;
  currentSlide: number;
  totalSlides: number;
  tabSwitchCount: number;
  copyPasteAttemptCount: number;
  onExitAssignment?: () => void;
  isTeacherView?: boolean;
}

export const AssignedTaskBanner: React.FC<AssignedTaskBannerProps> = ({
  assignment,
  currentSlide,
  totalSlides,
  tabSwitchCount,
  copyPasteAttemptCount,
  onExitAssignment,
  isTeacherView = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Approximate learning outcome progress based on completed slide proportion
  const progressPercent = Math.min(100, Math.round((currentSlide / totalSlides) * 100));

  return (
    <section 
      aria-label="Teacher Assigned Task and Learning Outcomes"
      className="mb-6 rounded-2xl bg-gradient-to-r from-[#0C1A2E] via-[#162D4A] to-[#0E223D] border-2 border-amber-400/80 shadow-2xl overflow-hidden transition-all text-white"
    >
      {/* Top Bar with Class Badge, Code, and Quick Status */}
      <div className="px-4 py-3 bg-[#0A1626]/90 border-b border-amber-400/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1 rounded-md bg-amber-500 text-blue-950 font-mono-custom text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
            <Lock className="w-3.5 h-3.5" />
            CLASS TASK #{assignment.code}
          </span>

          <span className="px-2.5 py-1 rounded bg-blue-900/80 border border-blue-400/40 text-blue-200 font-mono-custom text-xs font-bold flex items-center gap-1.5">
            <School className="w-3.5 h-3.5 text-amber-300" />
            {assignment.className}
          </span>

          <span className="text-xs text-blue-200/90 font-serif-custom">
            Assigned by <strong className="text-white">{assignment.teacherName}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Integrity Monitoring Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded text-[11px] font-mono-custom font-bold flex items-center gap-1 border ${
                tabSwitchCount === 0 && copyPasteAttemptCount === 0
                  ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300'
                  : 'bg-rose-950/80 border-rose-500/60 text-rose-300'
              }`}
              title="Monitored assessment integrity: tab switching and copy-paste detection active"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>
                Integrity:{' '}
                {tabSwitchCount === 0 && copyPasteAttemptCount === 0 ? (
                  'Verified 100%'
                ) : (
                  `${tabSwitchCount} Tab Sw. / ${copyPasteAttemptCount} Paste`
                )}
              </span>
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded text-blue-200 hover:text-white hover:bg-blue-800/50 transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono-custom"
            title={isExpanded ? 'Collapse Learning Outcomes' : 'Expand Learning Outcomes'}
          >
            <span className="hidden sm:inline">{isExpanded ? 'Hide Outcomes' : 'Show Outcomes'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {onExitAssignment && (
            <button
              onClick={onExitAssignment}
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-rose-900/60 text-blue-200 hover:text-white border border-white/20 hover:border-rose-400 transition-colors text-[11px] font-mono-custom cursor-pointer"
              title="Exit assigned task mode and return to open library"
            >
              Exit Task
            </button>
          )}
        </div>
      </div>

      {/* Main Task Title & Progress Header */}
      <div className="p-4 md:px-6 md:py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-custom text-amber-300 font-bold uppercase tracking-wider mb-1">
              <Target className="w-4 h-4 text-amber-400 inline" />
              Assigned Focus &amp; Mandatory Learning Outcomes
            </div>
            <h2 className="text-lg md:text-xl font-mono-custom font-bold text-white tracking-tight">
              {assignment.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[11px] font-mono-custom text-blue-200">
                Slide Progress: <span className="text-amber-300 font-bold">{currentSlide} of {totalSlides}</span>
              </div>
              <div className="w-36 h-2 bg-blue-950 rounded-full overflow-hidden border border-blue-400/30 mt-1">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Learning Outcomes Checklist */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-blue-400/20 grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {assignment.learningOutcomes.map((outcome, idx) => {
              // Calculate if this outcome is approximately mastered based on progress
              const isAchieved = currentSlide > Math.floor(((idx + 1) * totalSlides) / assignment.learningOutcomes.length);

              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border transition-all flex items-start gap-2.5 text-xs ${
                    isAchieved
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100 shadow-2xs'
                      : 'bg-[#11243B]/80 border-blue-400/30 text-blue-100'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isAchieved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-amber-400/80 bg-amber-400/20 text-amber-300 flex items-center justify-center font-mono-custom font-bold text-[10px]">
                        {idx + 1}
                      </span>
                    )}
                  </div>
                  <div className="leading-relaxed">
                    <span className="font-mono-custom font-bold text-amber-300 mr-1.5">
                      LO{idx + 1}:
                    </span>
                    <span className="font-serif-custom text-sm">{outcome}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Instructions & Anti-Cheat Notice */}
        {isExpanded && (
          <div className="mt-3 pt-2.5 border-t border-blue-400/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-custom text-blue-200/90">
            <div className="flex items-center gap-2">
              <span className="text-amber-300 font-bold">🔒 Scaffolding Lock:</span>
              <span>Topics are locked to this class assignment. All students complete this exact sequence.</span>
            </div>

            <div className="flex items-center gap-3 text-amber-200">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-amber-400" />
                Tab Switching Disabled
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                Copy &amp; Paste Disabled
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
