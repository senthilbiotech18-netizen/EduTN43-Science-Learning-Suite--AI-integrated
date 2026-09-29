import React, { useState, useEffect, useRef } from 'react';
import { StudentRecord, StudentSubmission } from '../types';
import { listenToStudentSubmissions } from '../utils/firebaseService';
import {
  FolderHeart,
  CheckCircle2,
  Calendar,
  Download,
  ExternalLink,
  Award,
  BookOpen,
  ArrowRight,
  Search,
  Copy,
  Check,
  GraduationCap,
  MessageSquare,
  ShieldCheck,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface StudentPortfolioProps {
  initialStudentId?: string;
  students: StudentRecord[];
  onGoToWork: () => void;
  onSelectStudentId?: (id: string) => void;
}

export const StudentPortfolio: React.FC<StudentPortfolioProps> = ({
  initialStudentId = '',
  students,
  onGoToWork,
  onSelectStudentId,
}) => {
  const [activeId, setActiveId] = useState<string>(initialStudentId || 'GSIS-2024-001');
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [expandedSubmissionId, setExpandedSubmissionId] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const pdfPrintRef = useRef<HTMLDivElement>(null);
  const [activePdfSub, setActivePdfSub] = useState<StudentSubmission | null>(null);

  // Sync activeId with initialStudentId if prop changes
  useEffect(() => {
    if (initialStudentId) {
      setActiveId(initialStudentId);
    }
  }, [initialStudentId]);

  // Listen to Firestore submissions for this specific student only!
  useEffect(() => {
    if (!activeId) return;
    const unsubscribe = listenToStudentSubmissions(activeId, (subs) => {
      setSubmissions(subs);
    });
    return () => unsubscribe();
  }, [activeId]);

  const currentStudentRecord = students.find(
    (s) => s.studentId.trim().toLowerCase() === activeId.trim().toLowerCase()
  );

  const studentDisplayName = currentStudentRecord?.name || submissions[0]?.studentName || 'Student';
  const studentDisplayClass = currentStudentRecord?.className || submissions[0]?.className || 'Science Class';

  // Calculate statistics
  const totalSubmissions = submissions.length;
  const avgGrade =
    totalSubmissions > 0
      ? (submissions.reduce((sum, s) => sum + s.criterionAGrade, 0) / totalSubmissions).toFixed(1)
      : '0.0';
  const totalTurns = submissions.reduce((sum, s) => sum + s.totalTurns, 0);
  const extendingCountTotal = submissions.reduce((sum, s) => sum + s.exceedingCount, 0);

  const handleCopyDirectLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('portal', 'portfolio');
    url.searchParams.set('studentId', activeId);
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadSubmissionPdf = async (sub: StudentSubmission) => {
    setActivePdfSub(sub);
    setIsGeneratingPdf(true);

    setTimeout(async () => {
      if (!pdfPrintRef.current) {
        setIsGeneratingPdf(false);
        return;
      }
      try {
        const canvas = await html2canvas(pdfPrintRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#FFFFFF',
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`${sub.studentName.replace(/\s+/g, '_')}_Scaffold_${sub.scaffoldNumber}_Verified_Record.pdf`);
      } catch (err) {
        console.error('PDF export error:', err);
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 400);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Portfolio Header Banner */}
      <div className="bg-gradient-to-r from-[#0F284E] via-[#163868] to-[#0D2242] border-2 border-indigo-500/40 rounded-2xl p-6 shadow-2xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center text-indigo-300 shadow-inner">
              <FolderHeart className="w-7 h-7 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl md:text-2xl font-bold font-sans tracking-tight">
                  {studentDisplayName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 text-xs font-mono font-semibold">
                  ID: {activeId}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-sans">
                  {studentDisplayClass}
                </span>
              </div>
              <p className="text-xs md:text-sm text-indigo-200/80 mt-1 font-sans">
                Official Student Learning Portfolio • Private Cloud Record of Scaffold Learning Submissions
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyDirectLink}
              className="flex items-center gap-2 px-3.5 py-2 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 hover:text-white rounded-xl border border-indigo-400/40 text-xs font-medium transition-all shadow-sm cursor-pointer"
              title="Copy your personal direct portfolio link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy My Portfolio Link'}</span>
            </button>

            <button
              onClick={onGoToWork}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-medium text-xs md:text-sm shadow-md transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Go to Assigned Work</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Student Switcher / ID selector (helpful for classroom testing or multi-student devices) */}
        <div className="mt-5 pt-4 border-t border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-indigo-300 font-mono">Viewing Account:</span>
            <select
              value={activeId}
              onChange={(e) => {
                setActiveId(e.target.value);
                if (onSelectStudentId) onSelectStudentId(e.target.value);
              }}
              className="bg-[#091528] text-indigo-100 border border-indigo-400/40 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
            >
              {students.map((s, idx) => (
                <option key={s.id || `${s.className}-${s.studentId}-${idx}`} value={s.studentId}>
                  {s.studentId} - {s.name} ({s.className})
                </option>
              ))}
            </select>
          </div>

          <div className="text-[11px] text-indigo-300/80 font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Only data linked to ID "{activeId}" is accessible on this URL.</span>
          </div>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#112340]/90 border border-blue-500/20 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-blue-300 text-xs mb-1">
            <span>Completed Scaffolds</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white font-sans">
            {totalSubmissions}
          </div>
          <p className="text-[11px] text-blue-300/70 mt-0.5">Scaffold learning tasks</p>
        </div>

        <div className="bg-[#112340]/90 border border-blue-500/20 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-indigo-300 text-xs mb-1">
            <span>Avg Criterion A</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-amber-300 font-sans">
            {avgGrade} <span className="text-xs text-blue-200/70 font-normal">/ 8</span>
          </div>
          <p className="text-[11px] text-blue-300/70 mt-0.5">IB MYP Rubric Standard</p>
        </div>

        <div className="bg-[#112340]/90 border border-blue-500/20 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-cyan-300 text-xs mb-1">
            <span>Extending Achievements</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-cyan-300 font-sans">
            {extendingCountTotal}
          </div>
          <p className="text-[11px] text-blue-300/70 mt-0.5">Highest cognitive level</p>
        </div>

        <div className="bg-[#112340]/90 border border-blue-500/20 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-emerald-300 text-xs mb-1">
            <span>Socratic Turns</span>
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white font-sans">
            {totalTurns}
          </div>
          <p className="text-[11px] text-blue-300/70 mt-0.5">Dialogue iterations</p>
        </div>
      </div>

      {/* Submissions & Historical Work Records */}
      <div className="bg-[#0F223D]/95 border border-blue-500/30 rounded-2xl p-5 md:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Historical Work Records & Scaffold Submissions</span>
            </h3>
            <p className="text-xs text-blue-200/70 font-sans">
              Each completed scaffold assignment is permanently documented with rubric grades, transcripts, and downloadable verified PDFs.
            </p>
          </div>

          <div className="px-3 py-1 rounded-full bg-blue-900/40 border border-blue-400/30 text-xs text-blue-200 font-mono">
            {totalSubmissions} Record{totalSubmissions === 1 ? '' : 's'} in Cloud
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-xl bg-[#091527]/70 border border-dashed border-blue-500/30">
            <div className="w-12 h-12 rounded-full bg-blue-950/80 border border-blue-400/30 flex items-center justify-center text-blue-300 mx-auto mb-3">
              <FolderHeart className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="text-base font-semibold text-white font-sans">No Submissions Recorded Yet</h4>
            <p className="text-xs text-blue-200/70 max-w-md mx-auto mt-1 font-sans">
              You haven't completed any scaffold learning tasks under Student ID <span className="font-mono text-cyan-300">{activeId}</span> yet.
            </p>
            <button
              onClick={onGoToWork}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-xs font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Start Assigned Scaffold Learning Now</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => {
              const isExpanded = expandedSubmissionId === sub.id;
              return (
                <div
                  key={sub.id}
                  className="rounded-xl bg-[#0A182E] border border-blue-400/25 p-4 md:p-5 hover:border-blue-400/50 transition-all shadow-md"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-xs font-bold font-sans">
                          Scaffold Learning {sub.scaffoldNumber}
                        </span>
                        <h4 className="text-base font-bold text-white font-sans">
                          {sub.scaffoldTitle || `Scaffold Stage ${sub.scaffoldNumber}`}
                        </h4>
                        <span className="text-xs text-blue-300/70 font-mono">
                          [{sub.assignmentCode || 'ASSIGNMENT'}]
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-blue-200/70 font-sans flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          {new Date(sub.submittedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })} at {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                          Topic: {sub.topicTitle}
                        </span>
                        {sub.tabSwitchCount > 0 && (
                          <span className="text-amber-400 font-mono text-[11px]">
                            ⚠️ {sub.tabSwitchCount} tab focus warnings
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Grade & Actions */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xl font-bold text-amber-300 font-sans">
                          {sub.criterionAGrade} <span className="text-xs text-blue-200/70 font-normal">/ 8</span>
                        </div>
                        <div className="text-[10px] text-emerald-400 font-medium">
                          {sub.exceedingCount} extending answers
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownloadSubmissionPdf(sub)}
                        disabled={isGeneratingPdf}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 hover:text-white border border-indigo-400/40 text-xs font-medium transition-all cursor-pointer"
                        title="Download official PDF report for this completed work"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF Report</span>
                      </button>

                      <button
                        onClick={() => setExpandedSubmissionId(isExpanded ? null : sub.id)}
                        className="p-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900 text-blue-300 hover:text-white border border-blue-400/30 text-xs transition-all cursor-pointer"
                        title="Expand or collapse detailed student answers and teacher feedback"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Teacher Feedback Note if present */}
                  {sub.teacherFeedback && (
                    <div className="mt-3 p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-100 font-sans flex items-start gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold text-emerald-300">Teacher Remarks: </span>
                        <span>{sub.teacherFeedback}</span>
                      </div>
                    </div>
                  )}

                  {/* Expanded Q&A Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-blue-400/20 space-y-3">
                      <h5 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-sans">
                        Submitted Question & Answer Dialogue Transcript:
                      </h5>
                      {sub.answers && sub.answers.length > 0 ? (
                        sub.answers.map((ans, qIdx) => (
                          <div
                            key={qIdx}
                            className="p-3 rounded-lg bg-[#071120] border border-blue-500/20 text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-blue-300 font-medium">
                              <span>Question {qIdx + 1}: {ans.prompt}</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  ans.highestDepth === 'extending'
                                    ? 'bg-purple-900 text-purple-200'
                                    : ans.highestDepth === 'secure'
                                    ? 'bg-emerald-900 text-emerald-200'
                                    : 'bg-blue-900 text-blue-200'
                                }`}
                              >
                                {ans.highestDepth || 'evaluated'}
                              </span>
                            </div>
                            <div className="text-white font-serif-custom pl-2 border-l-2 border-cyan-400 bg-blue-950/30 p-1.5 rounded-r">
                              "{ans.studentAnswer}"
                            </div>
                            {ans.feedback?.praise && (
                              <p className="text-[11px] text-blue-200/80 italic pl-2">
                                💡 Feedback: {ans.feedback.praise}
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-blue-300/70 italic">Full dialogue captured in verified cloud log.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Hidden Printable PDF Container */}
      <div className="hidden">
        {activePdfSub && (
          <div
            ref={pdfPrintRef}
            className="w-[800px] p-8 bg-white text-slate-900 font-sans space-y-6"
            style={{ minHeight: '1100px' }}
          >
            {/* Header with School Branding */}
            <div className="border-b-2 border-blue-900 pb-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-blue-950 tracking-tight">
                  GSIS EduTN43 Science Learning Suite
                </h1>
                <p className="text-sm font-semibold text-blue-800">
                  Scaffold Learning Verified Assessment & Completion Record
                </p>
              </div>
              <div className="text-right text-xs text-slate-600 font-mono">
                <div>Date: {new Date(activePdfSub.submittedAt).toLocaleDateString()}</div>
                <div>Code: {activePdfSub.assignmentCode}</div>
                <div className="text-emerald-700 font-bold">Status: Officially Submitted</div>
              </div>
            </div>

            {/* Student Info Card */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-4 grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-medium block">Student Name:</span>
                <span className="text-sm font-bold text-slate-900">{activePdfSub.studentName}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Student ID Number:</span>
                <span className="text-sm font-bold text-indigo-900 font-mono">{activePdfSub.studentId}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Class:</span>
                <span className="text-sm font-bold text-slate-900">{activePdfSub.className}</span>
              </div>
            </div>

            {/* Scaffold Learning Task Overview */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                Completed Task
              </span>
              <h2 className="text-lg font-bold text-blue-950">
                Scaffold Learning {activePdfSub.scaffoldNumber}: {activePdfSub.scaffoldTitle}
              </h2>
              <p className="text-xs text-slate-700 mt-1">
                Topic: {activePdfSub.topicTitle} • Total Space Inquiries Completed: {activePdfSub.totalSlides}
              </p>
            </div>

            {/* Criterion A Rubric Performance */}
            <div className="border border-slate-300 rounded-lg p-4 flex items-center justify-between bg-white">
              <div>
                <div className="text-xs font-semibold text-slate-500">IB Criterion A Science Grade</div>
                <div className="text-3xl font-extrabold text-blue-900">
                  Level {activePdfSub.criterionAGrade} / 8
                </div>
              </div>
              <div className="text-right text-xs text-slate-600">
                <div>Extending Responses: <span className="font-bold text-purple-800">{activePdfSub.exceedingCount}</span></div>
                <div>Dialogue Iterations: <span className="font-bold text-slate-800">{activePdfSub.totalTurns}</span></div>
                <div>Integrity Check: <span className="font-bold text-emerald-700">Verified Authentic</span></div>
              </div>
            </div>

            {/* Answer Transcripts */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-300 pb-1">
                Student Answers & Socratic Depth Evaluation
              </h3>
              {activePdfSub.answers?.map((ans, idx) => (
                <div key={idx} className="border border-slate-200 rounded p-3 text-xs bg-slate-50/50 space-y-1">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Q{idx + 1}: {ans.prompt}</span>
                    <span className="text-blue-800 uppercase font-mono">{ans.highestDepth}</span>
                  </div>
                  <div className="text-slate-900 italic pl-2 border-l-2 border-blue-500 bg-white p-1 rounded">
                    "{ans.studentAnswer}"
                  </div>
                  {ans.feedback?.praise && (
                    <div className="text-[11px] text-slate-600 pl-2">
                      Feedback: {ans.feedback.praise}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Teacher remarks if any */}
            {activePdfSub.teacherFeedback && (
              <div className="bg-emerald-50 border border-emerald-300 rounded p-3 text-xs text-emerald-900">
                <span className="font-bold">Teacher Feedback / Endorsement: </span>
                <span>{activePdfSub.teacherFeedback}</span>
              </div>
            )}

            {/* Verification Footer */}
            <div className="pt-6 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-500">
              <div>GSIS EduTN43 Cloud Database Verified Record</div>
              <div>Permanent Student ID: {activePdfSub.studentId}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
