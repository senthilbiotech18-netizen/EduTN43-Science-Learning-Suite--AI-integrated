import React, { useState, useEffect } from 'react';
import {
  StudentRecord,
  TeacherAssignment,
  ScaffoldStage,
  Topic,
  SlideAnswerState,
  StudentSubmission,
} from '../types';
import { TOPICS } from '../data/topics';
import {
  BookOpen,
  UserCheck,
  Award,
  Download,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  ExternalLink,
  FolderHeart,
  School,
  FileCheck,
  Send,
  HelpCircle,
} from 'lucide-react';

interface StudentDashboardProps {
  students: StudentRecord[];
  assignments: TeacherAssignment[];
  currentStudentId: string;
  currentStudentName: string;
  currentClassName: string;
  onUpdateStudentCredentials: (name: string, className: string, studentId: string) => void;
  onStartScaffoldTask: (
    assignment: TeacherAssignment,
    scaffold: ScaffoldStage,
    topic: Topic
  ) => void;
  onOpenPortfolio: (studentId: string) => void;
  studentSubmissions: StudentSubmission[];
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  students,
  assignments,
  currentStudentId,
  currentStudentName,
  currentClassName,
  onUpdateStudentCredentials,
  onStartScaffoldTask,
  onOpenPortfolio,
  studentSubmissions,
}) => {
  const [nameInput, setNameInput] = useState(currentStudentName || '');
  const [classInput, setClassInput] = useState(currentClassName || 'MYP 2C');
  const [idInput, setIdInput] = useState(currentStudentId || '');
  const [hasEnteredPathway, setHasEnteredPathway] = useState<boolean>(
    Boolean(currentStudentId && currentStudentName && currentClassName)
  );

  // Sync state if incoming props change (e.g. from URL deep link)
  useEffect(() => {
    if (currentStudentId) {
      setIdInput(currentStudentId);
    }
    if (currentStudentName) {
      setNameInput(currentStudentName);
    }
    if (currentClassName) {
      setClassInput(currentClassName);
    }
    if (currentStudentId && currentStudentName && currentClassName) {
      setHasEnteredPathway(true);
    }
  }, [currentStudentId, currentStudentName, currentClassName]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !idInput.trim() || !classInput.trim()) {
      alert('Please enter your full Name, Class, and Student ID Number to enter your assigned work.');
      return;
    }
    onUpdateStudentCredentials(nameInput.trim(), classInput.trim(), idInput.trim());
    setHasEnteredPathway(true);
  };

  const handleQuickSelectStudent = (student: StudentRecord) => {
    setNameInput(student.name);
    setClassInput(student.className);
    setIdInput(student.studentId);
    onUpdateStudentCredentials(student.name, student.className, student.studentId);
    setHasEnteredPathway(true);
  };

  // Find assignments for this student's class
  const classAssignments = assignments.filter(
    (a) =>
      !classInput ||
      a.className.trim().toLowerCase() === classInput.trim().toLowerCase() ||
      a.className.trim().toLowerCase() === 'all'
  );

  // Fallback to all assignments if none matched
  const activeAssignmentsList = classAssignments.length > 0 ? classAssignments : assignments;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {!hasEnteredPathway ? (
        /* Student Entrance Pathway Form */
        <div className="max-w-xl mx-auto bg-[#0E1E36]/95 border-2 border-cyan-500/40 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md text-white">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-cyan-900/40">
              <School className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold font-sans">Student Learning Pathway</h2>
            <p className="text-xs md:text-sm text-blue-200/80 mt-1 font-sans">
              Enter your student details to proceed directly to your assigned Scaffold Learning work.
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-blue-200 mb-1 font-sans">
                Full Name <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                required
                className="w-full bg-[#081324] border border-blue-400/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-blue-200 mb-1 font-sans">
                  Class / Section <span className="text-cyan-400">*</span>
                </label>
                <select
                  value={classInput}
                  onChange={(e) => setClassInput(e.target.value)}
                  className="w-full bg-[#081324] border border-blue-400/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="MYP 2C">MYP 2C</option>
                  <option value="MYP 4A">MYP 4A</option>
                  <option value="MYP 4C">MYP 4C</option>
                  <option value="MYP 5 Bio">MYP 5 Bio</option>
                  <option value="Grade 8A">Grade 8A</option>
                  <option value="Grade 8B">Grade 8B</option>
                  <option value="Grade 7A">Grade 7A</option>
                  <option value="MYP 3">MYP 3</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-200 mb-1 font-sans">
                  Student ID Number <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={idInput}
                  onChange={(e) => setIdInput(e.target.value)}
                  placeholder="e.g. GSIS-2024-001"
                  required
                  className="w-full bg-[#081324] border border-blue-400/40 rounded-xl px-4 py-2.5 text-sm font-mono text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-cyan-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Access Assigned Scaffold Work</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Roster picker */}
          {students.length > 0 && (
            <div className="mt-6 pt-5 border-t border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-cyan-300/90 font-mono">
                  {classInput ? `${classInput} Students (Click your name/roll number):` : 'Classroom Roster:'}
                </span>
                <span className="text-[10px] text-blue-300/70 font-mono">
                  {students.filter((s) => !classInput || s.className.toLowerCase() === classInput.toLowerCase()).length} students
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {students
                  .filter((s) => !classInput || s.className.toLowerCase() === classInput.toLowerCase())
                  .map((s, idx) => (
                    <button
                      key={s.id || `${s.className}-${s.studentId}-${idx}`}
                      type="button"
                      onClick={() => handleQuickSelectStudent(s)}
                      className="px-2.5 py-1 rounded-lg bg-blue-950/70 hover:bg-cyan-900/60 border border-blue-400/30 hover:border-cyan-400/50 text-[11px] text-blue-100 hover:text-white transition-all cursor-pointer font-sans flex items-center gap-1.5"
                    >
                      <span className="font-mono text-cyan-300 font-bold">[{s.studentId}]</span>
                      <span>{s.name}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Authenticated Student Dashboard & Scaffold Tasks */
        <div className="space-y-6">
          {/* Student Status Header */}
          <div className="bg-[#0F223D] border border-blue-400/30 rounded-2xl p-5 md:p-6 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-cyan-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <UserCheck className="w-6 h-6 text-cyan-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg md:text-xl font-bold font-sans">{currentStudentName}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 text-xs font-mono font-semibold">
                    ID: {currentStudentId}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-sans">
                    {currentClassName}
                  </span>
                </div>
                <p className="text-xs text-blue-200/70 font-sans mt-0.5">
                  Direct Student Pathway Active • Cloud submissions saved to your personal portfolio
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onOpenPortfolio(currentStudentId)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 hover:text-white border border-indigo-400/40 text-xs font-medium transition-all cursor-pointer shadow-sm"
              >
                <FolderHeart className="w-4 h-4 text-indigo-400" />
                <span>My Separate Portfolio Link</span>
              </button>

              <button
                onClick={() => setHasEnteredPathway(false)}
                className="px-3 py-2 rounded-xl bg-blue-950/60 hover:bg-blue-900 text-blue-300 hover:text-white border border-blue-400/30 text-xs transition-all cursor-pointer"
              >
                Switch Student
              </button>
            </div>
          </div>

          {/* Assigned Scaffold Learning Work */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <span>Assigned Work: Scaffold Learning Pathways</span>
                </h3>
                <p className="text-xs text-blue-200/70 font-sans">
                  The teacher assigned these structured learning tasks. Complete each scaffold stage in order, download your verified PDF, and submit your work.
                </p>
              </div>
            </div>

            {activeAssignmentsList.map((assignment) => {
              const matchedTopic = TOPICS.find((t) => t.id === assignment.topicId) || TOPICS[0];
              const scaffolds = assignment.scaffolds && assignment.scaffolds.length > 0
                ? assignment.scaffolds
                : [
                    {
                      scaffoldNumber: 1,
                      title: 'Scaffold Learning 1: Core Definitions & Recall',
                      description: 'Master foundational organelle morphology and cellular boundaries.',
                      targetOutcome: 'Criterion A (Strand i): State and outline scientific concepts accurately.',
                      questionIds: [1, 2, 3],
                    },
                    {
                      scaffoldNumber: 2,
                      title: 'Scaffold Learning 2: Structural Analysis & Physiological Linkage',
                      description: 'Examine cellular energy transformations and organelle interdependence.',
                      targetOutcome: 'Criterion A (Strand ii): Apply scientific understanding to solve problems.',
                      questionIds: [4, 5, 6],
                    },
                  ];

              return (
                <div
                  key={assignment.id}
                  className="bg-[#0C1B33]/95 border-2 border-blue-500/30 rounded-2xl p-5 md:p-6 shadow-xl space-y-4"
                >
                  {/* Assignment Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-blue-500/20 pb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/40 text-xs font-mono font-bold">
                          {assignment.code}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-900/50 text-cyan-200 border border-cyan-400/30 text-xs font-sans">
                          {assignment.className}
                        </span>
                        <span className="text-xs text-blue-300 font-sans">
                          Assigned by: {assignment.teacherName}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-white font-sans tracking-tight">
                        {assignment.title}
                      </h4>
                      <p className="text-xs text-blue-200/70 font-sans mt-0.5">
                        Curriculum Topic: {assignment.topicTitle} • Level: {assignment.level}
                      </p>
                    </div>

                    {assignment.dueDate && (
                      <div className="text-right text-xs text-blue-300 font-mono">
                        Target Date: <span className="text-amber-300 font-bold">{assignment.dueDate}</span>
                      </div>
                    )}
                  </div>

                  {assignment.instructions && (
                    <div className="bg-blue-950/40 border border-blue-400/20 rounded-xl p-3 text-xs text-blue-200 font-sans">
                      <span className="font-bold text-cyan-300">Teacher's Instructions: </span>
                      <span>{assignment.instructions}</span>
                    </div>
                  )}

                  {/* Scaffold Learning Stages Grid */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-blue-300 uppercase tracking-wider font-sans">
                      Scaffolded Learning Sequence:
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {scaffolds.map((scaffold, sIdx) => {
                        // Check if student has already completed this scaffold
                        const existingSub = studentSubmissions.find(
                          (sub) =>
                            sub.studentId.trim().toLowerCase() === currentStudentId.trim().toLowerCase() &&
                            (sub.assignmentId === assignment.id || sub.assignmentCode === assignment.code) &&
                            sub.scaffoldNumber === scaffold.scaffoldNumber
                        );

                        const isCompleted = Boolean(existingSub);
                        // Check if previous scaffold completed (or first scaffold)
                        const isUnlocked =
                          sIdx === 0 ||
                          studentSubmissions.some(
                            (sub) =>
                              sub.studentId.trim().toLowerCase() === currentStudentId.trim().toLowerCase() &&
                              (sub.assignmentId === assignment.id || sub.assignmentCode === assignment.code) &&
                              sub.scaffoldNumber === scaffolds[sIdx - 1].scaffoldNumber
                          );

                        return (
                          <div
                            key={scaffold.scaffoldNumber}
                            className={`rounded-xl p-4 border transition-all flex flex-col justify-between ${
                              isCompleted
                                ? 'bg-emerald-950/20 border-emerald-500/40'
                                : isUnlocked
                                ? 'bg-[#0E203B] border-cyan-500/40 shadow-md hover:border-cyan-400'
                                : 'bg-[#081424]/60 border-blue-900/30 opacity-70'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-sans ${
                                    isCompleted
                                      ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                                      : 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40'
                                  }`}
                                >
                                  Scaffold Learning {scaffold.scaffoldNumber}
                                </span>

                                {isCompleted ? (
                                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Completed ({existingSub.criterionAGrade}/8)</span>
                                  </span>
                                ) : isUnlocked ? (
                                  <span className="text-xs text-cyan-300 font-medium">Ready to Start</span>
                                ) : (
                                  <span className="flex items-center gap-1 text-xs text-blue-400/70 font-medium">
                                    <Lock className="w-3.5 h-3.5" />
                                    <span>Locked</span>
                                  </span>
                                )}
                              </div>

                              <h5 className="text-base font-bold text-white font-sans">
                                {scaffold.title}
                              </h5>

                              <p className="text-xs text-blue-200/80 font-sans">
                                {scaffold.description}
                              </p>

                              <div className="p-2 rounded bg-[#071120] border border-blue-500/20 text-[11px] text-blue-300/90 font-mono">
                                <span className="font-bold text-cyan-300">Target: </span>
                                {scaffold.targetOutcome}
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-blue-500/20 flex items-center justify-between">
                              <span className="text-[11px] text-blue-300/70">
                                {scaffold.questionIds?.length || 3} practice questions
                              </span>

                              <button
                                onClick={() => onStartScaffoldTask(assignment, scaffold, matchedTopic)}
                                disabled={!isUnlocked}
                                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                  isCompleted
                                    ? 'bg-emerald-800 hover:bg-emerald-700 text-white'
                                    : isUnlocked
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md'
                                    : 'bg-blue-950 text-blue-500 cursor-not-allowed'
                                }`}
                              >
                                <span>{isCompleted ? 'Review / Redo' : 'Enter Scaffold Task'}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
