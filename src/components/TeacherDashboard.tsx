import React, { useState, useEffect } from 'react';
import {
  StudentRecord,
  TeacherAssignment,
  StudentSubmission,
  ScaffoldStage,
  Topic,
} from '../types';
import { TOPICS } from '../data/topics';
import {
  saveAssignment,
  saveStudent,
  updateStudent,
  deleteStudent,
  bulkSaveStudents,
  updateSubmissionTeacherFeedback,
} from '../utils/firebaseService';
import { OFFICIAL_VERCEL_URL, getAppBaseUrl } from '../utils/assignmentManager';
import {
  GraduationCap,
  Users,
  PlusCircle,
  Link,
  Copy,
  Check,
  ExternalLink,
  Eye,
  MessageSquare,
  FileCheck,
  Award,
  Layers,
  Search,
  Filter,
  Download,
  Clock,
  ShieldAlert,
  Database,
  Calendar,
  Sparkles,
  UserPlus,
  Send,
  BookOpen,
  Globe,
  Share2,
  Pencil,
  Trash2,
  AlertTriangle,
  X,
} from 'lucide-react';

interface TeacherDashboardProps {
  assignments: TeacherAssignment[];
  students: StudentRecord[];
  submissions: StudentSubmission[];
  onOpenStudentWork: (studentId: string) => void;
  onOpenStudentPortfolio: (studentId: string) => void;
  onDeleteStudent?: (student: StudentRecord) => void;
}

type TeacherTab = 'submissions' | 'assign' | 'roster' | 'dossier';

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  assignments,
  students,
  submissions,
  onOpenStudentWork,
  onOpenStudentPortfolio,
  onDeleteStudent,
}) => {
  const [activeTab, setActiveTab] = useState<TeacherTab>('submissions');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAllLinks, setCopiedAllLinks] = useState(false);

  // Filters for submissions
  const [classFilter, setClassFilter] = useState<string>('All');
  const [scaffoldFilter, setScaffoldFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal state for inspecting a student submission
  const [inspectingSub, setInspectingSub] = useState<StudentSubmission | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Form state for creating a new scaffold assignment
  const [newTitle, setNewTitle] = useState('Cell Energy & Respiration');
  const [newCode, setNewCode] = useState(`BIO-SC-0${assignments.length + 1}`);
  const [newClass, setNewClass] = useState('Grade 8A');
  const [newTeacher, setNewTeacher] = useState('Mr. Senthilkumar');
  const [newTopicId, setNewTopicId] = useState(TOPICS[0].id);
  const [newDueDate, setNewDueDate] = useState('2026-09-25');
  const [newInstructions, setNewInstructions] = useState(
    'Complete Scaffold Learning 1 (Concept Acquisition) followed by Scaffold Learning 2 (Reasoning & Evaluation). Download your verified PDF and submit your answers to the cloud.'
  );
  const [scaffold1Title, setScaffold1Title] = useState('Scaffold Learning 1: Fundamental Recall & Definitions');
  const [scaffold1Desc, setScaffold1Desc] = useState('Build core comprehension of key biological terms and structural roles.');
  const [scaffold1Outcome, setScaffold1Outcome] = useState('Criterion A (Strand i): State and outline scientific concepts.');
  const [scaffold2Title, setScaffold2Title] = useState('Scaffold Learning 2: Structural Analysis & Physiological Linkage');
  const [scaffold2Desc, setScaffold2Desc] = useState('Synthesize cause-and-effect cellular processes and organelle interdependence.');
  const [scaffold2Outcome, setScaffold2Outcome] = useState('Criterion A (Strand ii): Apply scientific understanding to solve problems.');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Form state for adding / importing students
  const [singleName, setSingleName] = useState('');
  const [singleClass, setSingleClass] = useState('MYP 2C');
  const [singleId, setSingleId] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [rosterClassFilter, setRosterClassFilter] = useState<string>('MYP 2C');
  const [rosterSearch, setRosterSearch] = useState<string>('');

  // Student Dossier selected student
  const [dossierStudentId, setDossierStudentId] = useState<string>(
    students[0]?.studentId || 'GSIS-2024-001'
  );

  // Filter submissions
  const filteredSubmissions = submissions.filter((sub) => {
    if (classFilter !== 'All' && sub.className.toLowerCase() !== classFilter.toLowerCase()) return false;
    if (scaffoldFilter !== 'All' && sub.scaffoldNumber.toString() !== scaffoldFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sub.studentName.toLowerCase().includes(q);
      const matchId = sub.studentId.toLowerCase().includes(q);
      const matchCode = sub.assignmentCode.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchCode) return false;
    }
    return true;
  });

  // Calculate high-level stats
  const totalSubmissions = submissions.length;
  const uniqueStudentsSubmitted = new Set(submissions.map((s) => s.studentId)).size;
  const avgCriterionA =
    totalSubmissions > 0
      ? (submissions.reduce((sum, s) => sum + s.criterionAGrade, 0) / totalSubmissions).toFixed(1)
      : '0.0';

  // Base domain for student share links (defaults to official Vercel app URL)
  const [targetBaseUrl, setTargetBaseUrl] = useState<string>(() => getAppBaseUrl());
  const [showShareHubModal, setShowShareHubModal] = useState<boolean>(false);
  const [showDomainSettings, setShowDomainSettings] = useState<boolean>(false);
  const [customDomainInput, setCustomDomainInput] = useState<string>(targetBaseUrl);

  // Edit & Delete student state
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [editName, setEditName] = useState('');
  const [editRollNo, setEditRollNo] = useState('');
  const [editClass, setEditClass] = useState('MYP 5 Bio');
  const [editEmail, setEditEmail] = useState('');
  const [isSavingStudent, setIsSavingStudent] = useState(false);

  const [deletingStudent, setDeletingStudent] = useState<StudentRecord | null>(null);
  const [isDeletingStudent, setIsDeletingStudent] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenEditStudent = (student: StudentRecord) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditRollNo(student.studentId);
    setEditClass(student.className);
    setEditEmail(student.email || `${student.studentId}@gsis.ac.in`);
  };

  const handleSaveEditedStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !editName.trim() || !editRollNo.trim() || !editClass.trim()) return;
    setIsSavingStudent(true);
    try {
      const updated: StudentRecord = {
        ...editingStudent,
        name: editName.trim(),
        studentId: editRollNo.trim(),
        className: editClass.trim(),
        email: editEmail.trim() || `${editRollNo.trim()}@gsis.ac.in`,
        updatedAt: new Date().toISOString(),
      };
      await updateStudent(editingStudent, updated);
      showToast(`Updated "${updated.name}" (${updated.studentId} • ${updated.className}) in Firebase!`);
      setEditingStudent(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to update student details. Please try again.');
    } finally {
      setIsSavingStudent(false);
    }
  };

  const handleConfirmDeleteStudent = async () => {
    if (!deletingStudent) return;
    const target = deletingStudent;
    setDeletingStudent(null);
    setIsDeletingStudent(true);
    try {
      if (onDeleteStudent) {
        onDeleteStudent(target);
      }
      await deleteStudent(target);
      showToast(`Removed "${target.name}" (${target.studentId}) from Firebase.`);
    } catch (err) {
      console.error(err);
      showToast('Failed to delete student.');
    } finally {
      setIsDeletingStudent(false);
    }
  };

  const handleUpdateTargetBaseUrl = (newUrl: string) => {
    const cleaned = newUrl.trim().replace(/\/+$/, '');
    setTargetBaseUrl(cleaned);
    try {
      localStorage.setItem('gsis_target_base_url', cleaned);
    } catch (e) {
      // ignore
    }
  };

  const handleCopyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getDirectWorkUrl = (student: StudentRecord, customBase?: string) => {
    const base = (customBase || targetBaseUrl || OFFICIAL_VERCEL_URL).replace(/\/+$/, '');
    const params = new URLSearchParams();
    params.set('portal', 'student');
    params.set('studentId', student.studentId);
    params.set('class', student.className);
    params.set('name', student.name);
    return `${base}?${params.toString()}`;
  };

  const getPortfolioUrl = (student: StudentRecord, customBase?: string) => {
    const base = (customBase || targetBaseUrl || OFFICIAL_VERCEL_URL).replace(/\/+$/, '');
    const params = new URLSearchParams();
    params.set('portal', 'portfolio');
    params.set('studentId', student.studentId);
    return `${base}?${params.toString()}`;
  };

  const filteredRosterStudents = students.filter((s) => {
    if (
      rosterClassFilter !== 'All' &&
      s.className.trim().toLowerCase() !== rosterClassFilter.trim().toLowerCase()
    ) {
      return false;
    }
    if (rosterSearch.trim()) {
      const q = rosterSearch.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchId = s.studentId.toLowerCase().includes(q);
      if (!matchName && !matchId) return false;
    }
    return true;
  });

  const handleCopyAllStudentLinks = () => {
    const targetStudents = filteredRosterStudents.length > 0 ? filteredRosterStudents : students;
    const header = `🎓 GSIS SCIENCE LEARNING SUITE - STUDENT ACCESS DIRECT LINKS (${rosterClassFilter})\nBase Portal: ${targetBaseUrl}\n\n`;
    const rows = targetStudents.map((s) => {
      const workLink = getDirectWorkUrl(s);
      const portLink = getPortfolioUrl(s);
      return `👤 ${s.name} (Roll: ${s.studentId} | ${s.className})\n📝 Work Link: ${workLink}\n📁 Portfolio: ${portLink}\n`;
    });
    navigator.clipboard.writeText(header + rows.join('\n----------------------------------------\n'));
    setCopiedAllLinks(true);
    setTimeout(() => setCopiedAllLinks(false), 2500);
  };

  const handleExportCsv = () => {
    const targetStudents = filteredRosterStudents.length > 0 ? filteredRosterStudents : students;
    const headers = ['Roll No', 'Full Name', 'Class', 'Email', 'Direct Task Link (Auto-login)', 'Student Portfolio Link'];
    const rows = targetStudents.map((s) => [
      `"${s.studentId}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.className}"`,
      `"${s.email || `${s.studentId}@gsis.ac.in`}"`,
      `"${getDirectWorkUrl(s)}"`,
      `"${getPortfolioUrl(s)}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const cleanClassName = rosterClassFilter.replace(/[^a-zA-Z0-9_-]/g, '_');
    link.setAttribute('download', `GSIS_${cleanClassName}_Student_Access_Links.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveSingleStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleName.trim() || !singleId.trim()) return;
    const newStu: StudentRecord = {
      id: `stu-${Date.now()}`,
      studentId: singleId.trim(),
      name: singleName.trim(),
      className: singleClass.trim(),
      email: `${singleId.trim()}@gsis.ac.in`,
      createdAt: new Date().toISOString(),
    };
    await saveStudent(newStu);
    setSingleName('');
    setSingleId('');
    showToast(`Added "${newStu.name}" (${newStu.studentId} • ${newStu.className}) to Firebase!`);
  };

  const handleBulkImportStudents = async () => {
    if (!bulkText.trim()) return;
    const lines = bulkText.split('\n').filter((l) => l.trim().length > 0);
    const parsed: StudentRecord[] = [];

    lines.forEach((line, idx) => {
      // support formats: "ID, Name, Class" or "ID - Name - Class" or tab separated
      const parts = line.split(/[,;\t\-]+/).map((p) => p.trim());
      if (parts.length >= 2) {
        const id = parts[0];
        const name = parts[1];
        const cls = parts[2] || 'Grade 8A';
        parsed.push({
          id: `stu-bulk-${Date.now()}-${idx}`,
          studentId: id,
          name: name,
          className: cls,
          createdAt: new Date().toISOString(),
        });
      }
    });

    if (parsed.length > 0) {
      await bulkSaveStudents(parsed);
      setBulkText('');
      setShowBulkModal(false);
      alert(`Successfully imported and provisioned ${parsed.length} students to Firebase with individual direct links!`);
    } else {
      alert('Could not parse student lines. Please format as: StudentID, FullName, Class');
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    const chosenTopic = TOPICS.find((t) => t.id === newTopicId) || TOPICS[0];

    const scaffolds: ScaffoldStage[] = [
      {
        scaffoldNumber: 1,
        title: scaffold1Title,
        description: scaffold1Desc,
        targetOutcome: scaffold1Outcome,
        questionIds: [1, 2, 3],
      },
      {
        scaffoldNumber: 2,
        title: scaffold2Title,
        description: scaffold2Desc,
        targetOutcome: scaffold2Outcome,
        questionIds: [4, 5, 6],
      },
    ];

    const newAssignment: TeacherAssignment = {
      id: `asg-${Date.now()}`,
      code: newCode.trim(),
      title: newTitle.trim(),
      className: newClass,
      teacherName: newTeacher.trim(),
      topicId: chosenTopic.id,
      topicTitle: chosenTopic.title,
      level: chosenTopic.level,
      slideCount: 6,
      learningOutcomes: [
        'Recall and state fundamental scientific definitions accurately (Strand i)',
        'Synthesize and analyze biological interactions and organelle dynamics (Strand ii)',
      ],
      instructions: newInstructions,
      scaffolds: scaffolds,
      antiCheat: {
        disableCopyPaste: true,
        disableTabSwitch: true,
        maxViolationsAllowed: 3,
      },
      createdAt: new Date().toISOString(),
      dueDate: newDueDate,
    };

    await saveAssignment(newAssignment);
    setIsPublishing(false);
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3000);
    alert(`Scaffold Learning Assignment "${newAssignment.title}" published successfully to ${newAssignment.className}!`);
  };

  const handleOpenInspect = (sub: StudentSubmission) => {
    setInspectingSub(sub);
    setFeedbackText(sub.teacherFeedback || '');
    setFeedbackSuccess(false);
  };

  const handleSaveTeacherFeedback = async () => {
    if (!inspectingSub) return;
    setIsSavingFeedback(true);
    await updateSubmissionTeacherFeedback(inspectingSub.id, feedbackText);
    setIsSavingFeedback(false);
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 2500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Teacher Portal Top Banner */}
      <div className="bg-gradient-to-r from-[#0C1E3A] via-[#122B52] to-[#0A1A33] border-2 border-blue-500/40 rounded-2xl p-6 shadow-2xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-blue-300 shadow-inner">
              <GraduationCap className="w-8 h-8 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl md:text-2xl font-bold font-sans tracking-tight">
                  Teacher's Command Dashboard
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
                  Cloud Live
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-sans">
                  Teacher: Mr. Senthilkumar
                </span>
              </div>
              <p className="text-xs md:text-sm text-blue-200/80 mt-1 font-sans">
                Assign Scaffold Learning tasks, generate individual student links, and monitor live submissions in Firebase Firestore.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onOpenStudentWork(students[0]?.studentId || 'GSIS-2024-001')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-all shadow-md cursor-pointer"
              title="Preview Student Pathway"
            >
              <BookOpen className="w-4 h-4" />
              <span>Preview Student Pathway</span>
            </button>

            <button
              onClick={handleCopyAllStudentLinks}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-950/80 hover:bg-blue-900 text-blue-200 hover:text-white border border-blue-400/40 text-xs font-medium transition-all cursor-pointer"
              title="Copy all student direct links to clipboard"
            >
              {copiedAllLinks ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAllLinks ? 'All Links Copied!' : 'Export All Student Links'}</span>
            </button>
          </div>
        </div>

        {/* Dashboard Sub-navigation Tabs */}
        <div className="mt-6 pt-4 border-t border-blue-500/30 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'submissions'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-blue-300 hover:bg-blue-900/50 hover:text-white'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Live Submissions & Scores</span>
            <span className="px-2 py-0.2 rounded-full bg-blue-950 text-cyan-300 text-xs font-mono font-bold">
              {totalSubmissions}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('assign')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'assign'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-blue-300 hover:bg-blue-900/50 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Assign Scaffold Learning</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'roster'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-blue-300 hover:bg-blue-900/50 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Roster & Links</span>
            <span className="px-2 py-0.2 rounded-full bg-blue-950 text-cyan-300 text-xs font-mono font-bold">
              {students.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dossier')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'dossier'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-blue-300 hover:bg-blue-900/50 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Historical Work Dossier</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#0F223D]/90 border border-blue-500/20 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-blue-300 text-xs mb-1">
            <span>Total Submissions</span>
            <FileCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white font-sans">{totalSubmissions}</div>
          <p className="text-[11px] text-blue-300/70 mt-0.5">Scaffold tasks received</p>
        </div>

        <div className="bg-[#0F223D]/90 border border-blue-500/20 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-blue-300 text-xs mb-1">
            <span>Students Active</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-emerald-300 font-sans">
            {uniqueStudentsSubmitted} <span className="text-xs text-blue-200/70 font-normal">/ {students.length}</span>
          </div>
          <p className="text-[11px] text-blue-300/70 mt-0.5">Roster participation</p>
        </div>

        <div className="bg-[#0F223D]/90 border border-blue-500/20 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-blue-300 text-xs mb-1">
            <span>Average Criterion A</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-amber-300 font-sans">
            {avgCriterionA} <span className="text-xs text-blue-200/70 font-normal">/ 8</span>
          </div>
          <p className="text-[11px] text-blue-300/70 mt-0.5">IB Science Standard</p>
        </div>

        <div className="bg-[#0F223D]/90 border border-blue-500/20 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-blue-300 text-xs mb-1">
            <span>Active Assignments</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-purple-300 font-sans">{assignments.length}</div>
          <p className="text-[11px] text-blue-300/70 mt-0.5">Scaffolded curricula</p>
        </div>
      </div>

      {/* Tab 1: Live Submissions Feed */}
      {activeTab === 'submissions' && (
        <div className="bg-[#0C1B33]/95 border border-blue-500/30 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-cyan-400" />
                <span>Live Student Submissions in Firebase Cloud</span>
              </h3>
              <p className="text-xs text-blue-200/70 font-sans">
                Real-time stream of completed Scaffold Learning tasks, grades, transcripts, and integrity logs.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-blue-400" />
                <input
                  type="text"
                  placeholder="Search student or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#071322] border border-blue-400/30 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-blue-300/50 focus:outline-none focus:ring-1 focus:ring-cyan-400 w-40 md:w-48"
                />
              </div>

              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="bg-[#071322] border border-blue-400/30 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="All">All Classes</option>
                <option value="MYP 2C">MYP 2C</option>
                <option value="MYP 4A">MYP 4A</option>
                <option value="MYP 4C">MYP 4C</option>
                <option value="MYP 5 Bio">MYP 5 Bio</option>
                <option value="Grade 8A">Grade 8A</option>
                <option value="Grade 8B">Grade 8B</option>
                <option value="Grade 7A">Grade 7A</option>
              </select>

              <select
                value={scaffoldFilter}
                onChange={(e) => setScaffoldFilter(e.target.value)}
                className="bg-[#071322] border border-blue-400/30 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="All">All Scaffolds</option>
                <option value="1">Scaffold Learning 1</option>
                <option value="2">Scaffold Learning 2</option>
                <option value="3">Scaffold Learning 3</option>
              </select>
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="py-12 text-center rounded-xl bg-[#081424]/60 border border-dashed border-blue-500/30 text-blue-300">
              <p className="text-sm font-sans">No student submissions matching current filters.</p>
              <p className="text-xs text-blue-400/70 mt-1 font-sans">
                Students can complete their assigned work on the Student Dashboard to populate this feed.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-blue-500/20">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#081324] text-blue-300 border-b border-blue-500/30 uppercase text-[10px] tracking-wider font-mono">
                  <tr>
                    <th className="py-3 px-4">Student & ID</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Scaffold Task</th>
                    <th className="py-3 px-4">Criterion A Grade</th>
                    <th className="py-3 px-4">Extending</th>
                    <th className="py-3 px-4">Integrity Check</th>
                    <th className="py-3 px-4">Submitted At</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-500/10 text-blue-100">
                  {filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-blue-950/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{sub.studentName}</div>
                        <div className="text-[11px] text-cyan-300 font-mono">{sub.studentId}</div>
                      </td>
                      <td className="py-3 px-4 text-blue-200">{sub.className}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 font-semibold text-[11px]">
                          Scaffold {sub.scaffoldNumber}
                        </span>
                        <div className="text-[11px] text-blue-300/70 mt-0.5 truncate max-w-[160px]">
                          {sub.scaffoldTitle || sub.topicTitle}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-amber-300 text-sm">
                          Level {sub.criterionAGrade}
                        </span>
                        <span className="text-[10px] text-blue-300/70 font-normal"> / 8</span>
                      </td>
                      <td className="py-3 px-4 text-emerald-400 font-semibold">
                        {sub.exceedingCount} slides
                      </td>
                      <td className="py-3 px-4">
                        {sub.tabSwitchCount > 0 ? (
                          <span className="text-amber-400 font-mono text-[11px] flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            {sub.tabSwitchCount} tab focus
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-mono text-[11px]">Clean</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-blue-300/80 text-[11px]">
                        {new Date(sub.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                        {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => handleOpenInspect(sub)}
                          className="px-2.5 py-1 rounded bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-400/40 text-[11px] transition-all cursor-pointer font-medium"
                          title="Inspect answers & leave teacher feedback"
                        >
                          Inspect Work
                        </button>

                        <button
                          onClick={() => onOpenStudentPortfolio(sub.studentId)}
                          className="px-2 py-1 rounded bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-400/30 text-[11px] transition-all cursor-pointer"
                          title="View student individual portfolio link"
                        >
                          Portfolio
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Assign Scaffold Learning Work */}
      {activeTab === 'assign' && (
        <div className="bg-[#0C1B33]/95 border border-blue-500/30 rounded-2xl p-5 md:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white font-sans flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-blue-400" />
              <span>Publish New Scaffold Learning Assignment</span>
            </h3>
            <p className="text-xs text-blue-200/70 font-sans mt-0.5">
              Create and assign structured, multi-stage Scaffold Learning tasks (Scaffold Learning 1, 2, etc.) to your classes.
            </p>
          </div>

          <form onSubmit={handleCreateAssignment} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-blue-200 mb-1 font-sans">
                  Assignment Title <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-[#071322] border border-blue-400/40 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-200 mb-1 font-sans">
                  Assignment Code <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  required
                  className="w-full bg-[#071322] border border-blue-400/40 rounded-xl px-3.5 py-2 text-sm font-mono text-cyan-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-200 mb-1 font-sans">
                  Target Class <span className="text-cyan-400">*</span>
                </label>
                <select
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  className="w-full bg-[#071322] border border-blue-400/40 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-blue-200 mb-1 font-sans">
                  Science Curriculum Topic <span className="text-cyan-400">*</span>
                </label>
                <select
                  value={newTopicId}
                  onChange={(e) => setNewTopicId(e.target.value)}
                  className="w-full bg-[#071322] border border-blue-400/40 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {TOPICS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-200 mb-1 font-sans">
                  Teacher Name
                </label>
                <input
                  type="text"
                  value={newTeacher}
                  onChange={(e) => setNewTeacher(e.target.value)}
                  className="w-full bg-[#071322] border border-blue-400/40 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-200 mb-1 font-sans">
                  Due / Target Date
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full bg-[#071322] border border-blue-400/40 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Scaffold Learning Stages Configuration */}
            <div className="space-y-4 pt-4 border-t border-blue-500/20">
              <h4 className="text-sm font-bold text-cyan-300 font-sans uppercase tracking-wider">
                Configured Scaffold Learning Sequence:
              </h4>

              {/* Scaffold 1 */}
              <div className="p-4 rounded-xl bg-[#091527] border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-bold font-sans">
                    Scaffold Learning 1
                  </span>
                  <span className="text-[11px] text-blue-300/70 font-mono">Stage 1 of 2</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-blue-300 block mb-1">Stage Title</label>
                    <input
                      type="text"
                      value={scaffold1Title}
                      onChange={(e) => setScaffold1Title(e.target.value)}
                      className="w-full bg-[#071120] border border-blue-400/30 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-blue-300 block mb-1">Target Outcome</label>
                    <input
                      type="text"
                      value={scaffold1Outcome}
                      onChange={(e) => setScaffold1Outcome(e.target.value)}
                      className="w-full bg-[#071120] border border-blue-400/30 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-blue-300 block mb-1">Description</label>
                  <input
                    type="text"
                    value={scaffold1Desc}
                    onChange={(e) => setScaffold1Desc(e.target.value)}
                    className="w-full bg-[#071120] border border-blue-400/30 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Scaffold 2 */}
              <div className="p-4 rounded-xl bg-[#091527] border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 text-xs font-bold font-sans">
                    Scaffold Learning 2
                  </span>
                  <span className="text-[11px] text-blue-300/70 font-mono">Stage 2 of 2</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-blue-300 block mb-1">Stage Title</label>
                    <input
                      type="text"
                      value={scaffold2Title}
                      onChange={(e) => setScaffold2Title(e.target.value)}
                      className="w-full bg-[#071120] border border-blue-400/30 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-blue-300 block mb-1">Target Outcome</label>
                    <input
                      type="text"
                      value={scaffold2Outcome}
                      onChange={(e) => setScaffold2Outcome(e.target.value)}
                      className="w-full bg-[#071120] border border-blue-400/30 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-blue-300 block mb-1">Description</label>
                  <input
                    type="text"
                    value={scaffold2Desc}
                    onChange={(e) => setScaffold2Desc(e.target.value)}
                    className="w-full bg-[#071120] border border-blue-400/30 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-blue-200 mb-1 font-sans">
                Instructions for Students
              </label>
              <textarea
                value={newInstructions}
                onChange={(e) => setNewInstructions(e.target.value)}
                rows={2}
                className="w-full bg-[#071322] border border-blue-400/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              disabled={isPublishing}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl text-sm shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isPublishing ? 'Publishing to Firebase Cloud...' : 'Publish Assignment to Class'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Student Roster & Individual Direct Links */}
      {activeTab === 'roster' && (
        <div className="bg-[#0C1B33]/95 border border-blue-500/30 rounded-2xl p-5 md:p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <span>Student Roster & Personalized Direct Links</span>
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-mono text-emerald-300">
                  <Globe className="w-3 h-3 text-emerald-400" />
                  <span>Vercel Domain:</span>
                  <strong className="text-white underline decoration-emerald-500/40">{targetBaseUrl.replace(/^https?:\/\//, '')}</strong>
                </span>
              </div>
              <p className="text-xs text-blue-200/70 font-sans mt-0.5">
                Every student receives a direct auto-login link to their assigned tasks and their private digital portfolio.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setShowDomainSettings(!showDomainSettings)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#09182E] hover:bg-blue-900/60 text-blue-200 rounded-lg border border-blue-400/30 text-xs font-medium cursor-pointer"
                title="Change deployment base domain for student links"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Base Domain</span>
              </button>

              <button
                type="button"
                onClick={() => setShowShareHubModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg text-xs font-bold shadow cursor-pointer"
                title="Open Student Link Share Hub"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-950" />
                <span>Share Hub</span>
              </button>

              <button
                type="button"
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/80 hover:bg-blue-800 text-blue-100 rounded-lg border border-blue-400/40 text-xs font-medium cursor-pointer"
                title="Download CSV spreadsheet of all student links"
              >
                <Download className="w-3.5 h-3.5 text-cyan-300" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setShowBulkModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/80 hover:bg-blue-800 text-blue-100 rounded-lg border border-blue-400/40 text-xs font-medium cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Bulk Import</span>
              </button>

              <button
                type="button"
                onClick={handleCopyAllStudentLinks}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow cursor-pointer"
                title="Copy formatted list for WhatsApp or Google Classroom"
              >
                {copiedAllLinks ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAllLinks ? 'Copied All!' : 'Copy All Links'}</span>
              </button>
            </div>
          </div>

          {/* Collapsible Base Domain Settings */}
          {showDomainSettings && (
            <div className="p-3.5 rounded-xl bg-[#071322] border border-cyan-400/30 text-xs text-blue-100 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>Configure Student Links Base Domain</span>
                  </div>
                  <p className="text-[11px] text-blue-300">
                    Links generated for students will prepend this URL. By default, it uses your live production Vercel deployment.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdateTargetBaseUrl(OFFICIAL_VERCEL_URL);
                      setCustomDomainInput(OFFICIAL_VERCEL_URL);
                    }}
                    className="px-2.5 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-400/40 text-[11px] cursor-pointer"
                  >
                    Reset to Vercel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = window.location.origin;
                      handleUpdateTargetBaseUrl(cur);
                      setCustomDomainInput(cur);
                    }}
                    className="px-2.5 py-1 rounded bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-400/40 text-[11px] cursor-pointer"
                  >
                    Use Current Origin
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={customDomainInput}
                  onChange={(e) => setCustomDomainInput(e.target.value)}
                  placeholder="https://edu-tn-43-science-learning-suite-ai.vercel.app"
                  className="flex-1 bg-[#040C16] border border-cyan-400/40 rounded-lg px-3 py-1.5 font-mono text-cyan-300 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateTargetBaseUrl(customDomainInput)}
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow"
                >
                  Save Domain
                </button>
              </div>
            </div>
          )}

          {/* Quick Single Student Add Form */}
          <form
            onSubmit={handleSaveSingleStudent}
            className="p-3.5 rounded-xl bg-[#081324] border border-blue-500/20 flex flex-col md:flex-row items-end gap-3 text-xs"
          >
            <div className="flex-1 w-full">
              <label className="text-[11px] text-blue-300 block mb-1">Student Name</label>
              <input
                type="text"
                placeholder="e.g. Maya Singh"
                value={singleName}
                onChange={(e) => setSingleName(e.target.value)}
                required
                className="w-full bg-[#060F1C] border border-blue-400/30 rounded-lg px-3 py-1.5 text-white"
              />
            </div>

            <div className="w-full md:w-36">
              <label className="text-[11px] text-blue-300 block mb-1">Class</label>
              <input
                type="text"
                value={singleClass}
                onChange={(e) => setSingleClass(e.target.value)}
                required
                className="w-full bg-[#060F1C] border border-blue-400/30 rounded-lg px-3 py-1.5 text-white"
              />
            </div>

            <div className="w-full md:w-44">
              <label className="text-[11px] text-blue-300 block mb-1">Student ID</label>
              <input
                type="text"
                placeholder="e.g. GSIS-2024-009"
                value={singleId}
                onChange={(e) => setSingleId(e.target.value)}
                required
                className="w-full bg-[#060F1C] border border-blue-400/30 rounded-lg px-3 py-1.5 font-mono text-cyan-300"
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs cursor-pointer shadow whitespace-nowrap"
            >
              + Add Student
            </button>
          </form>

          {/* Roster Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-blue-300 font-mono mr-1">Class Filter:</span>
              {['All', ...Array.from(new Set(['MYP 2C', 'MYP 4A', 'MYP 4C', 'MYP 5 Bio', 'MYP 5A', 'MYP 5B', 'Grade 8A', 'Grade 8B', ...students.map((s) => s.className).filter(Boolean)]))].map((cls) => (
                <button
                  key={cls}
                  onClick={() => setRosterClassFilter(cls)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    rosterClassFilter === cls
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                      : 'bg-[#091629] text-blue-200 hover:text-white hover:bg-blue-900/60 border border-blue-500/20'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search name or roll no..."
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                className="w-full bg-[#071322] border border-blue-400/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto rounded-xl border border-blue-500/20">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#081324] text-blue-300 border-b border-blue-500/30 uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Roll No / Student ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Class / Section</th>
                  <th className="py-3 px-4">Direct Work Pathway Link</th>
                  <th className="py-3 px-4">Individual Portfolio Link</th>
                  <th className="py-3 px-4 text-center">Submissions</th>
                  <th className="py-3 px-4 text-center">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-500/10 text-blue-100">
                {filteredRosterStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-blue-300/60">
                      No students found matching current filter.
                    </td>
                  </tr>
                ) : (
                  filteredRosterStudents.map((student, idx) => {
                  const workUrl = getDirectWorkUrl(student);
                  const portUrl = getPortfolioUrl(student);
                  const subCount = submissions.filter(
                    (s) => s.studentId.trim().toLowerCase() === student.studentId.trim().toLowerCase()
                  ).length;

                  return (
                    <tr key={student.id || `${student.className}-${student.studentId}-${idx}`} className="hover:bg-blue-950/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-cyan-300">{student.studentId}</td>
                      <td className="py-3 px-4 font-semibold text-white">{student.name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-900/40 text-blue-200 border border-blue-500/30">
                          {student.className}
                        </span>
                      </td>

                      {/* Direct Work Link */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyLink(workUrl, `work-${student.studentId}`)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white border border-blue-400/30 text-[11px] cursor-pointer"
                            title="Copy student's direct assigned work pathway URL"
                          >
                            {copiedId === `work-${student.studentId}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedId === `work-${student.studentId}` ? 'Copied' : 'Copy Link'}</span>
                          </button>

                          <button
                            onClick={() => onOpenStudentWork(student.studentId)}
                            className="p-1 rounded bg-blue-950 hover:bg-blue-900 text-blue-300 hover:text-white border border-blue-400/20 text-xs"
                            title="Launch as this student"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Individual Portfolio Link */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyLink(portUrl, `port-${student.studentId}`)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 hover:text-white border border-indigo-400/30 text-[11px] cursor-pointer"
                            title="Copy link to private student portfolio with historical records"
                          >
                            {copiedId === `port-${student.studentId}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedId === `port-${student.studentId}` ? 'Copied' : 'Copy Portfolio'}</span>
                          </button>

                          <button
                            onClick={() => onOpenStudentPortfolio(student.studentId)}
                            className="p-1 rounded bg-indigo-950 hover:bg-indigo-900 text-indigo-300 hover:text-white border border-indigo-400/20 text-xs"
                            title="Open student portfolio"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                            subCount > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {subCount}
                        </span>
                      </td>

                      {/* Manage / Edit / Delete */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditStudent(student)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 hover:text-cyan-100 border border-cyan-500/40 text-[11px] font-semibold cursor-pointer transition-colors shadow-sm"
                            title={`Edit details for ${student.name} (Section, Roll No, Name, Email)`}
                          >
                            <Pencil className="w-3 h-3 text-cyan-400" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingStudent(student)}
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-rose-100 border border-rose-500/30 text-xs cursor-pointer transition-colors shadow-sm"
                            title={`Delete ${student.name} from roster`}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Student Historical Records Dossier */}
      {activeTab === 'dossier' && (
        <div className="bg-[#0C1B33]/95 border border-blue-500/30 rounded-2xl p-5 md:p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>Student Historical Work Dossier</span>
              </h3>
              <p className="text-xs text-blue-200/70 font-sans">
                Review complete chronological records of previous scaffold learning work for any student in your classes.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-300 font-mono">Select Student:</span>
              <select
                value={dossierStudentId}
                onChange={(e) => setDossierStudentId(e.target.value)}
                className="bg-[#071322] border border-blue-400/40 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
              >
                {students.map((s, idx) => (
                  <option key={s.id || `${s.className}-${s.studentId}-${idx}`} value={s.studentId}>
                    {s.name} ({s.studentId}) - {s.className}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected student summary */}
          {(() => {
            const selectedStudent = students.find((s) => s.studentId === dossierStudentId);
            const studentSubs = submissions.filter(
              (s) => s.studentId.trim().toLowerCase() === dossierStudentId.trim().toLowerCase()
            );

            return (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#081528] border border-blue-400/30 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h4 className="text-base font-bold text-white font-sans">
                      {selectedStudent?.name || 'Selected Student'}
                    </h4>
                    <p className="text-xs text-blue-300 font-mono">
                      ID: {dossierStudentId} • Class: {selectedStudent?.className || 'Class'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onOpenStudentPortfolio(dossierStudentId)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-400/30 text-xs font-medium cursor-pointer"
                    >
                      Open Private Portfolio View
                    </button>
                    <div className="text-right">
                      <div className="text-xs text-blue-300 font-sans">Total Scaffolds Completed</div>
                      <div className="text-lg font-bold text-cyan-300 font-sans">{studentSubs.length}</div>
                    </div>
                  </div>
                </div>

                {studentSubs.length === 0 ? (
                  <div className="py-8 text-center rounded-xl bg-[#081424]/40 border border-dashed border-blue-500/20 text-blue-300 text-xs">
                    No completed scaffold learning tasks recorded for this student yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {studentSubs.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-4 rounded-xl bg-[#081528] border border-blue-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[11px]">
                              Scaffold Learning {sub.scaffoldNumber}
                            </span>
                            <span className="font-bold text-white text-sm">
                              {sub.scaffoldTitle || sub.topicTitle}
                            </span>
                          </div>
                          <p className="text-blue-300/70 text-[11px]">
                            Code: {sub.assignmentCode} • Submitted on {new Date(sub.submittedAt).toLocaleString()}
                          </p>
                          {sub.teacherFeedback && (
                            <p className="text-emerald-300 mt-1 italic">
                              Teacher Feedback: "{sub.teacherFeedback}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-base font-bold text-amber-300">
                              Level {sub.criterionAGrade} / 8
                            </div>
                            <div className="text-[10px] text-blue-300/70">
                              {sub.exceedingCount} extending answers
                            </div>
                          </div>

                          <button
                            onClick={() => handleOpenInspect(sub)}
                            className="px-3 py-1.5 rounded-lg bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-400/40 text-xs cursor-pointer"
                          >
                            Inspect & Grade
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Bulk Roster Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D203C] border-2 border-cyan-500/40 rounded-2xl p-6 max-w-lg w-full shadow-2xl text-white space-y-4">
            <h3 className="text-lg font-bold font-sans">Bulk Import / Populate Student List</h3>
            <p className="text-xs text-blue-200/80 font-sans">
              Paste lines of student information in format: <code className="text-cyan-300">StudentID, Full Name, Class</code>
            </p>

            <textarea
              rows={8}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={`GSIS-2024-009, Arjun Rao, Grade 8A\nGSIS-2024-010, Priya Gupta, Grade 8A\nGSIS-2024-011, Kenji Tanaka, Grade 8B`}
              className="w-full bg-[#071322] border border-blue-400/40 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-blue-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkImportStudents}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow"
              >
                Import & Generate Individual Links
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Inspection Modal with Teacher Endorsement */}
      {inspectingSub && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B1B33] border-2 border-blue-500/50 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-white space-y-5">
            <div className="flex items-center justify-between border-b border-blue-500/30 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs">
                  Scaffold Learning {inspectingSub.scaffoldNumber}
                </span>
                <h3 className="text-lg font-bold font-sans mt-1">
                  {inspectingSub.studentName} ({inspectingSub.studentId})
                </h3>
                <p className="text-xs text-blue-300/80">
                  {inspectingSub.className} • Assignment {inspectingSub.assignmentCode}
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-amber-300 font-sans">
                  Level {inspectingSub.criterionAGrade} / 8
                </div>
                <div className="text-[11px] text-emerald-400">
                  {inspectingSub.exceedingCount} extending responses
                </div>
              </div>
            </div>

            {/* Answer transcript */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider font-sans">
                Student Answers & Dialogue Transcript:
              </h4>
              {inspectingSub.answers?.map((ans, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#071120] border border-blue-500/20 text-xs space-y-1"
                >
                  <div className="flex justify-between font-semibold text-blue-300">
                    <span>Q{idx + 1}: {ans.prompt}</span>
                    <span className="text-cyan-300 uppercase font-mono">{ans.highestDepth}</span>
                  </div>
                  <div className="text-white italic pl-2 border-l-2 border-cyan-400 bg-blue-950/30 p-1.5 rounded">
                    "{ans.studentAnswer}"
                  </div>
                  {ans.feedback?.praise && (
                    <div className="text-[11px] text-blue-200/80 pl-2">
                      💡 AI Feedback: {ans.feedback.praise}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Teacher Feedback / Endorsement Input */}
            <div className="pt-3 border-t border-blue-500/20 space-y-2">
              <label className="block text-xs font-bold text-cyan-300 font-sans">
                Teacher's Remarks / Feedback (saves to student's portfolio & PDF record):
              </label>
              <textarea
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="e.g. Excellent explanation of mitochondrial energy transfer. Consider specifying ATP synthesis pathway next time."
                className="w-full bg-[#071322] border border-blue-400/40 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <div className="flex items-center justify-between">
                {feedbackSuccess ? (
                  <span className="text-xs text-emerald-400 font-medium">Feedback saved to Firebase!</span>
                ) : (
                  <span className="text-[11px] text-blue-300/60 font-mono">Syncs live to student's view</span>
                )}
                <button
                  type="button"
                  onClick={handleSaveTeacherFeedback}
                  disabled={isSavingFeedback}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                >
                  {isSavingFeedback ? 'Saving...' : 'Save Feedback'}
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectingSub(null)}
                className="px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-blue-300 text-xs cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Link Share Hub Modal */}
      {showShareHubModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B1A2E] border-2 border-cyan-400/50 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl text-white overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-blue-500/30 flex items-start justify-between gap-4 bg-[#081324]">
              <div>
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold font-sans">Student Direct Link Share Hub</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono">
                    Vercel Public App
                  </span>
                </div>
                <p className="text-xs text-blue-200/80 mt-1">
                  Share these direct links with your students on Google Classroom, WhatsApp, or email. Each link automatically logs in the student with their name and roll number.
                </p>
                <div className="text-[11px] font-mono text-cyan-300/80 mt-1">
                  Target URL: <span className="underline">{targetBaseUrl}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShareHubModal(false)}
                className="text-blue-300 hover:text-white p-1 rounded-lg bg-blue-950 hover:bg-blue-900 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Controls */}
            <div className="p-4 bg-[#0A1628] border-b border-blue-500/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-blue-300 font-mono mr-1">Class:</span>
                {['All', 'MYP 5 Bio', 'MYP 2C', 'MYP 4A', 'MYP 4C', 'Grade 8A'].map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setRosterClassFilter(cls)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      rosterClassFilter === cls
                        ? 'bg-cyan-400 text-slate-950 font-bold'
                        : 'bg-[#060F1A] text-blue-200 hover:text-white border border-blue-500/20'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/80 hover:bg-blue-800 text-blue-100 rounded-lg border border-blue-400/40 text-xs font-medium cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Download CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyAllStudentLinks}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow cursor-pointer"
                >
                  {copiedAllLinks ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAllLinks ? 'Copied Full Class Links!' : 'Copy All for WhatsApp/Classroom'}</span>
                </button>
              </div>
            </div>

            {/* Modal Body: Student List Table */}
            <div className="p-4 overflow-y-auto flex-1 space-y-2">
              {filteredRosterStudents.length === 0 ? (
                <div className="text-center py-12 text-blue-300/60 text-xs">
                  No students found for class {rosterClassFilter}.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredRosterStudents.map((student) => {
                    const workUrl = getDirectWorkUrl(student);
                    const portUrl = getPortfolioUrl(student);

                    return (
                      <div
                        key={student.id || student.studentId}
                        className="p-3 rounded-xl bg-[#071322] border border-blue-500/30 hover:border-cyan-400/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded text-[11px]">
                              {student.studentId}
                            </span>
                            <span className="font-bold text-white text-sm">{student.name}</span>
                            <span className="text-[11px] text-blue-300/80 bg-blue-900/40 px-2 py-0.5 rounded">
                              {student.className}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleOpenEditStudent(student)}
                              className="px-2 py-0.5 rounded bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 hover:text-cyan-100 border border-cyan-500/30 text-[10px] cursor-pointer inline-flex items-center gap-1 font-semibold"
                              title="Edit this student's section or roll number"
                            >
                              <Pencil className="w-2.5 h-2.5 text-cyan-400" />
                              <span>Edit Info</span>
                            </button>
                          </div>
                          <div className="text-[11px] text-blue-300/70 font-mono">
                            {student.email || `${student.studentId}@gsis.ac.in`}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                          {/* Direct Task Link Button */}
                          <button
                            type="button"
                            onClick={() => handleCopyLink(workUrl, `hub-work-${student.studentId}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white border border-blue-400/40 text-xs cursor-pointer font-medium"
                            title="Copy student auto-login link"
                          >
                            {copiedId === `hub-work-${student.studentId}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-cyan-300" />
                            )}
                            <span>{copiedId === `hub-work-${student.studentId}` ? 'Task Link Copied!' : 'Copy Task Link'}</span>
                          </button>

                          {/* Portfolio Link Button */}
                          <button
                            type="button"
                            onClick={() => handleCopyLink(portUrl, `hub-port-${student.studentId}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 hover:text-white border border-indigo-400/40 text-xs cursor-pointer font-medium"
                            title="Copy student private portfolio link"
                          >
                            {copiedId === `hub-port-${student.studentId}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-indigo-300" />
                            )}
                            <span>{copiedId === `hub-port-${student.studentId}` ? 'Portfolio Copied!' : 'Copy Portfolio'}</span>
                          </button>

                          {/* Open link directly in new tab or viewer */}
                          <a
                            href={workUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-300 hover:text-white border border-blue-400/30 text-xs"
                            title="Test open student link in new tab"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#081324] border-t border-blue-500/30 flex items-center justify-between text-xs text-blue-300/80">
              <span>Showing {filteredRosterStudents.length} students</span>
              <button
                type="button"
                onClick={() => setShowShareHubModal(false)}
                className="px-4 py-1.5 bg-blue-950 hover:bg-blue-900 text-blue-200 rounded-lg border border-blue-400/30 text-xs cursor-pointer"
              >
                Close Hub
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Details Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0A1628] border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-blue-500/30 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Edit Student Details</h3>
                </div>
                <p className="text-xs text-blue-300">
                  Update name, section, roll number, or email. Changes sync directly to Firebase Firestore.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedStudent} className="space-y-4 text-xs">
              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">Full Student Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  placeholder="e.g. Maya Singh"
                  className="w-full bg-[#060F1C] border border-blue-400/30 rounded-xl px-3.5 py-2 text-white font-medium focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-blue-200 block mb-1">Roll No / Student ID</label>
                  <input
                    type="text"
                    value={editRollNo}
                    onChange={(e) => setEditRollNo(e.target.value)}
                    required
                    placeholder="e.g. 8046"
                    className="w-full bg-[#060F1C] border border-blue-400/30 rounded-xl px-3.5 py-2 font-mono text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                  <span className="text-[10px] text-blue-300/70 block mt-1 font-mono">
                    Unique roll identifier used in direct links
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-blue-200 block mb-1">Class / Section</label>
                  <input
                    type="text"
                    value={editClass}
                    onChange={(e) => setEditClass(e.target.value)}
                    required
                    placeholder="e.g. MYP 5 Bio"
                    className="w-full bg-[#060F1C] border border-blue-400/30 rounded-xl px-3.5 py-2 text-white font-medium focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>

              {/* Section Quick Selector Chips */}
              <div>
                <label className="text-[11px] text-blue-300 block mb-1.5 font-mono">Quick Section Select:</label>
                <div className="flex flex-wrap gap-1.5">
                  {['MYP 5 Bio', 'MYP 5A', 'MYP 5B', 'MYP 4A', 'MYP 4C', 'MYP 2C', 'Grade 8A', 'Grade 8B'].map((sec) => (
                    <button
                      type="button"
                      key={sec}
                      onClick={() => setEditClass(sec)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium cursor-pointer transition-all ${
                        editClass === sec
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                          : 'bg-[#081324] text-blue-300 border border-blue-500/20 hover:bg-blue-900/50 hover:text-white'
                      }`}
                    >
                      {sec}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">School Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="e.g. 8046@gsis.ac.in"
                  className="w-full bg-[#060F1C] border border-blue-400/30 rounded-xl px-3.5 py-2 font-mono text-blue-200 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-blue-500/20">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingStudent}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {isSavingStudent ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Changes to Firebase</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Student Modal */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0D1829] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Confirm Student Deletion</h3>
                <p className="text-xs text-blue-200/80">
                  Are you sure you want to remove <span className="text-white font-semibold">{deletingStudent.name}</span> from the active roster?
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#07111E] border border-rose-500/20 text-xs space-y-1 font-mono text-blue-200">
              <div><span className="text-slate-400">Roll No:</span> <span className="text-cyan-300 font-bold">{deletingStudent.studentId}</span></div>
              <div><span className="text-slate-400">Section:</span> <span className="text-white">{deletingStudent.className}</span></div>
              <div><span className="text-slate-400">Email:</span> <span className="text-blue-300">{deletingStudent.email || `${deletingStudent.studentId}@gsis.ac.in`}</span></div>
            </div>

            <p className="text-[11px] text-amber-300/90 leading-relaxed">
              ⚠️ This will remove the student record from Firebase Firestore and the roster tables. Any previously graded submissions will remain safe in the submissions database.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-blue-500/20">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                disabled={isDeletingStudent}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteStudent}
                disabled={isDeletingStudent}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg cursor-pointer disabled:opacity-50"
              >
                {isDeletingStudent ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete from Firebase</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900/95 border border-cyan-400/60 shadow-2xl text-cyan-200 text-xs font-semibold backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
