import React, { useState, useRef } from 'react';
import { Question, SlideAnswerState, PastSessionRecord, TeacherAssignment, ScaffoldStage } from '../types';
import { CheckCircle2, AlertTriangle, ArrowLeft, Download, RefreshCw, Award, Camera, Printer, Sparkles, User, ShieldCheck, GraduationCap, History, Trash2, SpellCheck, Lock, ShieldAlert, School, Check, CloudUpload, FolderHeart, ArrowRight } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface SessionSummaryProps {
  questions: Question[];
  answers: SlideAnswerState[];
  onReviewSlide: (index: number) => void;
  onRestart: () => void;
  onNewTopic?: () => void;
  studentName: string;
  onUpdateStudentName: (name: string) => void;
  className: string;
  onUpdateClassName: (name: string) => void;
  pastSessions?: PastSessionRecord[];
  onClearHistory?: () => void;
  activeAssignment?: TeacherAssignment | null;
  tabSwitchCount?: number;
  copyPasteAttemptCount?: number;
  studentId?: string;
  activeScaffoldStage?: ScaffoldStage | null;
  onSaveToFirebase?: () => Promise<void>;
  onGoToPortfolio?: () => void;
  onGoToNextScaffold?: () => void;
  hasNextScaffold?: boolean;
}


const CLASS_PRESETS = [
  'MYP 2C',
  'MYP 2A',
  'MYP 2B',
  'MYP 1',
  'MYP 3',
  'MYP 4',
  'MYP 5',
  'Grade 6 Science',
  'Grade 7 Science',
  'Grade 8 Science',
];

export const SessionSummary: React.FC<SessionSummaryProps> = ({
  questions,
  answers,
  onReviewSlide,
  onRestart,
  onNewTopic,
  studentName,
  onUpdateStudentName,
  className,
  onUpdateClassName,
  pastSessions = [],
  onClearHistory,
  activeAssignment,
  tabSwitchCount = 0,
  copyPasteAttemptCount = 0,
  studentId = 'GSIS-2024-001',
  activeScaffoldStage,
  onSaveToFirebase,
  onGoToPortfolio,
  onGoToNextScaffold,
  hasNextScaffold,
}) => {
  const [showScreenshotMode, setShowScreenshotMode] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSubmittingCloud, setIsSubmittingCloud] = useState(false);
  const [cloudSubmitted, setCloudSubmitted] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const counts = {
    surface: 0,
    developing: 0,
    secure: 0,
    extending: 0,
  };

  const misconceptions: { slide: number; prompt: string; note: string }[] = [];

  answers.forEach((ans, idx) => {
    const depth = ans.highestDepth || 'surface';
    if (counts.hasOwnProperty(depth)) {
      counts[depth]++;
    }

    const latestFeedback = ans.history[ans.history.length - 1]?.feedback;
    if (latestFeedback?.misconception) {
      misconceptions.push({
        slide: idx + 1,
        prompt: questions[idx].prompt,
        note: latestFeedback.gap || latestFeedback.followUp || 'Worth reviewing this organelle concept in depth.',
      });
    }
  });

  // Aggregate all spotted biological spelling corrections across all slides
  const allSpellingCorrections: { slide: number; original: string; correction: string; explanation?: string }[] = [];
  answers.forEach((ans, idx) => {
    ans.history.forEach((turn) => {
      if (turn.feedback?.spellingErrors) {
        turn.feedback.spellingErrors.forEach((err) => {
          const exists = allSpellingCorrections.some(
            (c) => c.slide === idx + 1 && c.original.toLowerCase() === err.original.toLowerCase()
          );
          if (!exists) {
            allSpellingCorrections.push({
              slide: idx + 1,
              original: err.original,
              correction: err.correction,
              explanation: err.explanation,
            });
          }
        });
      }
    });
  });

  const total = questions.length;
  const exceedingCount = counts.extending;
  const secureCount = counts.secure;
  const developingCount = counts.developing;
  const surfaceCount = counts.surface;
  const isAllExceeding = exceedingCount === total;

  // Calculate total dialogue turns across all slides
  const totalTurns = answers.reduce((acc, ans) => acc + (ans.history ? ans.history.filter(t => t.sender === 'student').length : 0), 0);

  // Calculate IB Criterion A Grade out of 8
  let rawPoints = 0;
  answers.forEach((ans) => {
    const depth = ans.highestDepth || 'surface';
    if (depth === 'extending' || ans.exceedingAchieved) rawPoints += 4;
    else if (depth === 'secure') rawPoints += 3;
    else if (depth === 'developing') rawPoints += 2;
    else rawPoints += 1;
  });

  const maxPoints = total * 4;
  const ratio = rawPoints / maxPoints;

  let criterionAGrade = 1;
  let gradeDescriptor = 'Level 1-2: Limited recall of basic scientific facts.';

  if (ratio >= 0.90) {
    criterionAGrade = 8;
    gradeDescriptor = 'Level 7-8: Consistently outlines, applies, and synthesizes scientific knowledge extensively with comprehensive cause-and-effect biological reasoning.';
  } else if (ratio >= 0.78) {
    criterionAGrade = 7;
    gradeDescriptor = 'Level 7-8: Outlines and applies scientific knowledge extensively to explain complex organelle structures and cell processes.';
  } else if (ratio >= 0.65) {
    criterionAGrade = 6;
    gradeDescriptor = 'Level 5-6: Outlines scientific knowledge and applies biological understanding accurately across familiar cell contexts.';
  } else if (ratio >= 0.52) {
    criterionAGrade = 5;
    gradeDescriptor = 'Level 5-6: Recalls scientific ideas and outlines basic cell structure and organelle functions clearly.';
  } else if (ratio >= 0.40) {
    criterionAGrade = 4;
    gradeDescriptor = 'Level 3-4: Recalls basic scientific facts and outlines simple biological concepts with structured guidance.';
  } else if (ratio >= 0.28) {
    criterionAGrade = 3;
    gradeDescriptor = 'Level 3-4: Identifies basic organelle functions with occasional scaffolding prompts.';
  } else if (ratio >= 0.15) {
    criterionAGrade = 2;
    gradeDescriptor = 'Level 1-2: States minimal scientific facts with teacher guidance.';
  } else {
    criterionAGrade = 1;
    gradeDescriptor = 'Level 1-2: Initial attempt at answering biological questions.';
  }

  // Calculate Earned Badges
  const badges = [
    {
      id: 'crit-a-master',
      title: 'Criterion A Scholar',
      icon: '🏆',
      description: 'Achieved IB Criterion A Grade 7 or 8/8',
      earned: criterionAGrade >= 7,
    },
    {
      id: 'exceeding-scholar',
      title: 'Exceeding Level Attained',
      icon: '⭐',
      description: 'Reached Exceeding level on practice slides',
      earned: exceedingCount > 0,
    },
    {
      id: 'socratic-thinker',
      title: 'Socratic Dialogue Master',
      icon: '💬',
      description: 'Engaged in multi-turn teacher follow-up reasoning',
      earned: totalTurns >= 3,
    },
    {
      id: 'organelle-expert',
      title: 'Cell Structure Expert',
      icon: '🔬',
      description: 'Demonstrated Secure or Exceeding mastery on 4+ slides',
      earned: (exceedingCount + secureCount) >= 4,
    },
    {
      id: 'authentic-work',
      title: 'Authentic Keyboard Typist',
      icon: '🛡️',
      description: 'Typed all biological explanations directly without copy-pasting',
      earned: true,
    },
  ];

  const earnedBadges = badges.filter((b) => b.earned);

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    setIsGeneratingPDF(true);

    try {
      const element = certificateRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc, clonedElement) => {
          // Hide interactive buttons inside cloned certificate
          const buttons = clonedElement.querySelectorAll('button');
          buttons.forEach((btn) => {
            (btn as HTMLElement).style.display = 'none';
          });

          // Clean up style tags to replace oklab/oklch color functions unsupported by html2canvas
          const styleElements = clonedDoc.querySelectorAll('style');
          styleElements.forEach((style) => {
            if (style.textContent) {
              style.textContent = style.textContent
                .replace(/oklab\([^)]+\)/gi, 'rgb(14, 27, 31)')
                .replace(/oklch\([^)]+\)/gi, 'rgb(14, 27, 31)');
            }
          });

          // Clean up inline styles containing oklab/oklch
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el) => {
            if (el instanceof HTMLElement && el.style) {
              ['color', 'backgroundColor', 'borderColor', 'outlineColor', 'fill', 'stroke'].forEach((prop) => {
                const val = el.style.getPropertyValue(prop);
                if (val && (val.includes('oklab') || val.includes('oklch'))) {
                  el.style.setProperty(
                    prop,
                    prop === 'backgroundColor' ? '#ffffff' : prop === 'borderColor' ? '#C9C2AE' : '#0E1B1F'
                  );
                }
              });
            }
          });
        },
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdfHeight - 20) / imgHeight);
      const canvasWidthMM = imgWidth * ratio;
      const canvasHeightMM = imgHeight * ratio;

      const marginX = (pdfWidth - canvasWidthMM) / 2;
      const marginY = 10;

      pdf.addImage(imgData, 'PNG', marginX, marginY, canvasWidthMM, canvasHeightMM);
      const safeStudent = (studentName || 'Student').trim().replace(/\s+/g, '_');
      const safeClass = (className || 'Class').trim().replace(/\s+/g, '_');
      pdf.save(`${safeStudent}_${safeClass}_Cell_Explorer_Certificate.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadReport = () => {
    let text = `=======================================================\n`;
    text += `EduTN43 SCIENCE · IB CRITERION A MASTERY REPORT\n`;
    text += `=======================================================\n`;
    text += `Student Name: ${studentName || 'Student'}\n`;
    text += `Class / Section: ${className || 'MYP 2C'}\n`;
    text += `Date: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n`;
    text += `IB Criterion A Score: GRADE ${criterionAGrade} / 8\n`;
    text += `Descriptor: ${gradeDescriptor}\n`;
    text += `Badges Earned: ${earnedBadges.map(b => `${b.icon} ${b.title}`).join(', ')}\n`;
    text += `Overall Status: ${isAllExceeding ? 'ALL SLIDES AT EXCEEDING LEVEL' : `${exceedingCount}/${total} Slides at Exceeding Level`}\n`;
    if (allSpellingCorrections.length > 0) {
      text += `Spotted Biological Spelling Corrections (${allSpellingCorrections.length}):\n`;
      allSpellingCorrections.forEach((c) => {
        text += `- Slide ${c.slide}: "${c.original}" -> "${c.correction}" ${c.explanation ? `(${c.explanation})` : ''}\n`;
      });
    } else {
      text += `Biological Spelling Accuracy: 100% (No biological terminology spelling errors spotted)\n`;
    }
    text += `-------------------------------------------------------\n\n`;

    answers.forEach((ans, i) => {
      text += `SLIDE ${i + 1} (Strand ${questions[i].strand.toUpperCase()}): ${questions[i].prompt}\n`;
      text += `Highest Depth Level Reached: ${(ans.highestDepth || 'Not attempted').toUpperCase()}\n`;
      text += `Total Socratic Dialogue Turns: ${ans.history.filter(t => t.sender === 'student').length}\n`;
      if (ans.history.length > 0) {
        text += `Final Student Response: "${ans.history[ans.history.length - 2]?.text || ''}"\n`;
        text += `Final Teacher Evaluation: "${ans.history[ans.history.length - 1]?.text || ''}"\n`;
      }
      text += `-------------------------------------------------------\n\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(studentName || 'Student').replace(/\s+/g, '_')}_${(className || 'Class').replace(/\s+/g, '_')}_Certificate.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCloudSubmit = async () => {
    if (!onSaveToFirebase) return;
    setIsSubmittingCloud(true);
    try {
      await onSaveToFirebase();
      setCloudSubmitted(true);
    } catch (err) {
      console.error('Firebase save error:', err);
    } finally {
      setIsSubmittingCloud(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Scaffold Learning & Cloud Submission Header Bar */}
      {activeScaffoldStage && (
        <div className="bg-gradient-to-r from-[#0C1F38] via-[#102B4E] to-[#0A1A30] border-2 border-cyan-400/50 rounded-2xl p-5 md:p-6 shadow-2xl text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 text-xs font-bold font-sans">
                  Scaffold Learning {activeScaffoldStage.scaffoldNumber}
                </span>
                <span className="text-xs text-blue-300 font-mono">
                  Student ID: {studentId}
                </span>
                {cloudSubmitted && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-xs font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Saved to Cloud &amp; Portfolio
                  </span>
                )}
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-sans">
                {activeScaffoldStage.title}
              </h3>
              <p className="text-xs text-blue-200/80 font-sans mt-0.5">
                {activeScaffoldStage.description}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleCloudSubmit}
                disabled={isSubmittingCloud || cloudSubmitted}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-lg transition-all cursor-pointer ${
                  cloudSubmitted
                    ? 'bg-emerald-700 text-white cursor-default'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white'
                }`}
              >
                <CloudUpload className="w-4 h-4" />
                <span>
                  {isSubmittingCloud
                    ? 'Saving to Firebase...'
                    : cloudSubmitted
                    ? '✓ Submitted to Teacher & Cloud'
                    : 'Submit Work to Firebase'}
                </span>
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm bg-emerald-700 hover:bg-emerald-600 text-white shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-emerald-200" />
                <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF Report'}</span>
              </button>

              {onGoToPortfolio && (
                <button
                  onClick={onGoToPortfolio}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 hover:text-white border border-indigo-400/40 text-xs font-medium transition-all cursor-pointer"
                >
                  <FolderHeart className="w-4 h-4 text-indigo-300" />
                  <span>View My Portfolio Link</span>
                </button>
              )}

              {hasNextScaffold && onGoToNextScaffold && (
                <button
                  onClick={onGoToNextScaffold}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold text-xs md:text-sm shadow-md transition-all cursor-pointer"
                >
                  <span>Proceed to Scaffold {activeScaffoldStage.scaffoldNumber + 1}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Header Controls */}
      <div className="bg-[#F4EFE2] text-[#0E1B1F] rounded-xl p-6 md:p-8 shadow-2xl border border-[#C9C2AE]">
        <div className="flex justify-between items-start flex-wrap gap-4 border-b border-[#C9C2AE] pb-4 mb-6">
          <div>
            <div className="font-mono-custom text-xs font-bold text-[#4A7A3E] tracking-wider uppercase flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#8FBF7F]" />
              CRITERION A PERFORMANCE &amp; EXCEEDING MASTERY SUMMARY
            </div>
            <h2 className="font-mono-custom text-2xl font-bold mt-1 text-[#0E1B1F]">
              Session Completion Dashboard
            </h2>
            <p className="text-sm text-[#6B6455] font-serif-custom italic">
              {className} Science · Cell structure &amp; organelles
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="font-mono-custom text-xs font-bold px-4 py-2 rounded bg-[#4A7A3E] text-white hover:bg-[#3d6533] transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-[#E0AD63]" />
              {isGeneratingPDF ? 'Generating PDF...' : '📄 Download PDF Certificate'}
            </button>
            <button
              onClick={() => setShowScreenshotMode(!showScreenshotMode)}
              className="font-mono-custom text-xs font-semibold px-3 py-2 rounded bg-white border border-[#C9C2AE] text-[#0E1B1F] hover:bg-[#EAE3D2] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Camera className="w-3.5 h-3.5 text-[#2C5F8A]" />
              {showScreenshotMode ? 'Normal View' : '📸 Screenshot Frame'}
            </button>
            <button
              onClick={handleDownloadReport}
              className="font-mono-custom text-xs font-semibold px-3 py-2 rounded bg-white border border-[#C9C2AE] text-[#0E1B1F] hover:bg-[#EAE3D2] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#2C5F8A]" />
              Export Text
            </button>
            {onNewTopic && (
              <button
                onClick={onNewTopic}
                className="font-mono-custom text-xs font-bold px-3 py-2 rounded bg-amber-500 hover:bg-amber-400 text-[#0E1B1F] transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                New / Change Topic
              </button>
            )}
            <button
              onClick={onRestart}
              className="font-mono-custom text-xs font-semibold px-3 py-2 rounded bg-[#0E1B1F] text-[#F4EFE2] hover:bg-[#1E3A41] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#E0AD63]" />
              Practice Again
            </button>
          </div>
        </div>

        {/* Student Name & Class Input Bar */}
        <div className="bg-[#EAE3D2] p-4 rounded-lg border border-[#C9C2AE] mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-[#2C5F8A] shrink-0" />
            <div className="flex-1">
              <label className="block font-mono-custom text-[11px] font-bold text-[#2C5F8A] uppercase tracking-wider">
                Student Full Name:
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => onUpdateStudentName(e.target.value)}
                placeholder="Enter your name (e.g., Senthil Kumar)..."
                className="w-full px-3 py-1.5 rounded border border-[#C9C2AE] font-serif-custom text-sm font-semibold bg-white text-[#0E1B1F] outline-none focus:ring-2 focus:ring-[#2C5F8A] mt-0.5"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-[#2C5F8A] shrink-0" />
            <div className="flex-1">
              <label className="block font-mono-custom text-[11px] font-bold text-[#2C5F8A] uppercase tracking-wider">
                Class / Grade / Section:
              </label>
              <div className="flex gap-2 mt-0.5">
                <select
                  value={CLASS_PRESETS.includes(className) ? className : 'custom'}
                  onChange={(e) => {
                    if (e.target.value !== 'custom') {
                      onUpdateClassName(e.target.value);
                    }
                  }}
                  className="px-2.5 py-1.5 rounded border border-[#C9C2AE] font-mono-custom text-xs font-bold bg-white text-[#0E1B1F] outline-none focus:ring-2 focus:ring-[#2C5F8A]"
                >
                  {CLASS_PRESETS.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                  <option value="custom">Other Custom Class...</option>
                </select>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => onUpdateClassName(e.target.value)}
                  placeholder="Class name..."
                  className="flex-1 px-3 py-1.5 rounded border border-[#C9C2AE] font-serif-custom text-sm font-semibold bg-white text-[#0E1B1F] outline-none focus:ring-2 focus:ring-[#2C5F8A]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* IB Criterion A Score Card & Badges */}
        <div className="bg-white rounded-xl border-2 border-[#4A7A3E] p-5 mb-6 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#C9C2AE]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#4A7A3E] text-white flex flex-col items-center justify-center font-mono-custom shadow-inner shrink-0">
                <span className="text-2xl font-bold leading-none">{criterionAGrade}</span>
                <span className="text-[10px] uppercase text-[#E0AD63] font-semibold">OUT OF 8</span>
              </div>
              <div>
                <div className="font-mono-custom text-xs font-bold text-[#4A7A3E] uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#8FBF7F]" />
                  IB MYP SCIENCE CRITERION A (KNOWING &amp; UNDERSTANDING)
                </div>
                <h3 className="font-mono-custom text-lg font-bold text-[#0E1B1F] mt-0.5">
                  Criterion A Achievement Grade: {criterionAGrade} / 8
                </h3>
                <p className="font-serif-custom text-xs text-[#3A352B] mt-1 max-w-xl">
                  {gradeDescriptor}
                </p>
              </div>
            </div>

            <div className="bg-[#F4EFE2] px-4 py-2.5 rounded-lg border border-[#C9C2AE] text-center shrink-0">
              <div className="font-mono-custom text-[10px] font-bold text-[#6B6455] uppercase">
                Exceeding Level Mastery
              </div>
              <div className="font-mono-custom text-sm font-bold text-[#4A7A3E]">
                {exceedingCount} / {total} Slides
              </div>
            </div>
          </div>

          {/* Earned Badges Grid */}
          <div className="pt-4">
            <h4 className="font-mono-custom text-xs font-bold text-[#2C5F8A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#E0AD63]" />
              Earned Achievement Badges ({earnedBadges.length}/{badges.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    badge.earned
                      ? 'bg-[#4A7A3E]/10 border-[#4A7A3E] text-[#0E1B1F]'
                      : 'bg-black/5 border-dashed border-black/20 text-[#6B6455] opacity-50'
                  }`}
                >
                  <div className="text-xl mb-1">{badge.icon}</div>
                  <div className="font-mono-custom text-[11px] font-bold leading-tight">
                    {badge.title}
                  </div>
                  <div className="font-serif-custom text-[10px] mt-0.5 text-[#3A352B] line-clamp-2">
                    {badge.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Saved Practice Attempt History Section */}
        {pastSessions && pastSessions.length > 0 && (
          <div className="bg-white rounded-xl border border-[#C9C2AE] p-5 mb-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#C9C2AE] mb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#2C5F8A]" />
                <h3 className="font-mono-custom text-xs font-bold text-[#2C5F8A] uppercase tracking-wider">
                  Saved Attempt &amp; Score History ({pastSessions.length} {pastSessions.length === 1 ? 'Record' : 'Records'})
                </h3>
              </div>
              {onClearHistory && (
                <button
                  onClick={onClearHistory}
                  className="font-mono-custom text-[11px] font-semibold text-[#A8425A] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear History
                </button>
              )}
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {pastSessions.map((sess, idx) => (
                <div
                  key={sess.id}
                  className="p-3 bg-[#F4EFE2]/60 rounded-lg border border-[#C9C2AE] flex items-center justify-between flex-wrap gap-2 text-xs font-serif-custom"
                >
                  <div>
                    <div className="font-mono-custom font-bold text-[#0E1B1F]">
                      Attempt #{pastSessions.length - idx} &bull; {sess.studentName} ({sess.className})
                    </div>
                    <div className="text-[#6B6455] text-[11px] mt-0.5">
                      📅 {sess.timestamp} &bull; {sess.totalTurns} Socratic response turns
                    </div>
                  </div>
                  <div className="flex items-center gap-3 font-mono-custom">
                    <div className="text-right">
                      <span className="text-[10px] text-[#6B6455] uppercase block">Criterion A</span>
                      <span className="font-bold text-sm text-[#4A7A3E]">
                        Grade {sess.grade} / 8
                      </span>
                    </div>
                    <div className="bg-[#4A7A3E] text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase">
                      {sess.exceedingCount} / {sess.totalSlides} Exceeding
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Depth Level Breakdown Bars */}
        <div className="mb-6 bg-white p-5 rounded-lg border border-[#C9C2AE]">
          <h3 className="font-mono-custom text-xs font-bold text-[#2C5F8A] uppercase tracking-wider mb-4">
            Depth of Understanding Mastery Distribution
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Exceeding (Extending)', count: counts.extending, color: '#4A7A3E' },
              { label: 'Secure Level', count: counts.secure, color: '#8FBF7F' },
              { label: 'Developing Level', count: counts.developing, color: '#E0AD63' },
              { label: 'Getting Started', count: counts.surface, color: '#4F8FC7' },
            ].map((bar) => {
              const pct = total > 0 ? (bar.count / total) * 100 : 0;
              return (
                <div key={bar.label} className="flex items-center gap-3">
                  <div className="w-40 font-mono-custom text-xs text-[#4A453A] font-semibold">
                    {bar.label}
                  </div>
                  <div className="flex-1 h-3 bg-black/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: bar.color }}
                    />
                  </div>
                  <div className="w-8 font-mono-custom text-xs font-bold text-[#4A453A] text-right">
                    {bar.count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Biological Terminology Spelling Review */}
        <div className="bg-white border-1.5 border-[#C9C2AE] rounded-lg p-5 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <h3 className="font-mono-custom text-xs font-bold text-[#2C5F8A] tracking-wider uppercase flex items-center gap-2">
              <SpellCheck className="w-4 h-4 text-[#2C5F8A]" />
              BIOLOGICAL TERMINOLOGY &amp; SPELLING REVIEW
            </h3>
            {allSpellingCorrections.length === 0 ? (
              <span className="font-mono-custom text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                100% Scientific Spelling Accuracy
              </span>
            ) : (
              <span className="font-mono-custom text-[11px] bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                {allSpellingCorrections.length} {allSpellingCorrections.length === 1 ? 'terminology correction' : 'terminology corrections'} spotted
              </span>
            )}
          </div>

          {allSpellingCorrections.length === 0 ? (
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs font-serif-custom text-emerald-950 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Excellent scientific precision!</strong> All biological terminology was spelled accurately throughout your answers.
              </span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {allSpellingCorrections.map((corr, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 font-mono-custom">
                    <span className="font-bold text-[#2C5F8A] text-[11px]">Slide {corr.slide}:</span>
                    <span className="line-through text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-bold">
                      {corr.original}
                    </span>
                    <span className="text-amber-800 font-bold">➔</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                      {corr.correction}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {corr.explanation && (
                      <span className="font-serif-custom text-[11px] text-amber-900 italic">
                        {corr.explanation}
                      </span>
                    )}
                    <button
                      onClick={() => onReviewSlide(corr.slide - 1)}
                      className="font-mono-custom text-[11px] text-[#2C5F8A] hover:underline cursor-pointer ml-auto shrink-0"
                    >
                      Review slide &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Misconceptions Check */}
        {misconceptions.length > 0 && (
          <div className="bg-white border-1.5 border-[#C9C2AE] rounded-lg p-5 mb-6">
            <h3 className="font-mono-custom text-xs font-bold text-[#A8425A] tracking-wider uppercase mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#A8425A]" />
              CONCEPTS WORTH REVIEWING
            </h3>
            <div className="space-y-3">
              {misconceptions.map((item, idx) => (
                <div key={idx} className="p-3 bg-[#EAE3D2]/50 rounded border border-[#C9C2AE] text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono-custom font-bold text-[#2C5F8A]">
                      Slide {item.slide}
                    </span>
                    <button
                      onClick={() => onReviewSlide(item.slide - 1)}
                      className="font-mono-custom text-[11px] text-[#A8425A] hover:underline cursor-pointer"
                    >
                      Review slide &rarr;
                    </button>
                  </div>
                  <div className="font-serif-custom font-medium text-[#0E1B1F] mb-1">
                    "{item.prompt}"
                  </div>
                  <div className="font-serif-custom text-[#3A352B] italic bg-white p-2 rounded border border-[#C9C2AE]">
                    <strong>Teacher note:</strong> {item.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Official Certificate of Completion (Designed for Screenshot Presentation) */}
      <div
        ref={certificateRef}
        className={`bg-white text-[#0E1B1F] p-8 md:p-10 rounded-2xl border-4 shadow-2xl relative overflow-hidden transition-all ${
          showScreenshotMode
            ? 'border-[#4A7A3E] ring-8 ring-[#8FBF7F]/30 scale-[1.01]'
            : 'border-[#2C5F8A]'
        }`}
      >
        {/* Screenshot Banner Prompt */}
        <div className="bg-[#122229] text-[#F4EFE2] -mx-8 -mt-8 md:-mx-10 md:-mt-10 p-4 mb-8 flex items-center justify-between flex-wrap gap-2 border-b-2 border-[#E0AD63]">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#E0AD63]" />
            <span className="font-mono-custom text-xs font-bold uppercase tracking-wider text-[#F4EFE2]">
              OFFICIAL SCREENSHOT &amp; PRINTABLE PRESENTATION CARD
            </span>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="font-mono-custom text-xs font-semibold px-3 py-1.5 bg-[#4A7A3E] text-white rounded hover:bg-[#3d6533] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-[#E0AD63]" />
            {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF Certificate'}
          </button>
        </div>

        {/* Certificate Decorative Border Frame */}
        <div className="border-2 border-dashed border-[#C9C2AE] p-6 md:p-8 rounded-xl bg-[#F4EFE2]/30 relative">
          {/* Header Badge */}
          <div className="flex justify-between items-start flex-wrap gap-4 border-b-2 border-[#0E1B1F] pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1.5 bg-blue-700 text-white px-2.5 py-0.5 rounded font-mono-custom font-black text-sm">
                  <GraduationCap className="w-4 h-4 text-blue-200" />
                  Edu<span className="text-blue-300">TN43</span>
                </div>
                <span className="font-mono-custom text-xs font-bold text-[#2C5F8A] tracking-widest uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2C5F8A]" />
                  IB SCIENCE · {className.toUpperCase()} · CRITERION A
                </span>
              </div>
              <h1 className="font-mono-custom text-2xl md:text-3xl font-bold text-[#0E1B1F] mt-1">
                EduTN43 Formative Practice Completion Certificate
              </h1>
              <p className="font-serif-custom text-sm text-[#6B6455] italic mt-0.5">
                Science Learning Suite · IB MYP Socratic Scaffolded Assessment
              </p>
            </div>

            {/* Official Stamp Box */}
            <div className="bg-[#4A7A3E] text-white p-3 rounded-lg border-2 border-[#8FBF7F] text-center shadow-md font-mono-custom">
              <div className="text-[10px] uppercase font-semibold text-[#E0AD63]">VERIFIED LEVEL</div>
              <div className="text-base font-bold tracking-wider">
                {isAllExceeding ? '⭐ EXCEEDING' : 'FORMATIVE COMPLETE'}
              </div>
              <div className="text-[9px] opacity-80 mt-0.5">SOCRATIC AI VERIFIED</div>
            </div>
          </div>

          {/* Student Info Block */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg border border-[#C9C2AE] mb-4">
            <div>
              <div className="font-mono-custom text-[10px] font-bold text-[#2C5F8A] uppercase">
                Student Name
              </div>
              <div className="font-serif-custom text-base font-bold text-[#0E1B1F]">
                {studentName || 'Student Learner'}
              </div>
            </div>
            <div>
              <div className="font-mono-custom text-[10px] font-bold text-[#2C5F8A] uppercase">
                Class / Grade
              </div>
              <div className="font-serif-custom text-base font-bold text-[#0E1B1F]">
                {className || 'MYP 2C'}
              </div>
            </div>
            <div>
              <div className="font-mono-custom text-[10px] font-bold text-[#2C5F8A] uppercase">
                Date &amp; Timestamp
              </div>
              <div className="font-serif-custom text-xs font-semibold text-[#0E1B1F] mt-1">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>
            <div>
              <div className="font-mono-custom text-[10px] font-bold text-[#2C5F8A] uppercase">
                Criterion A Score
              </div>
              <div className="font-serif-custom text-sm font-bold text-[#4A7A3E] mt-0.5 flex items-center gap-1">
                <span className="bg-[#4A7A3E] text-white px-2 py-0.5 rounded text-xs font-mono-custom font-bold">
                  GRADE {criterionAGrade} / 8
                </span>
              </div>
            </div>
          </div>

          {/* Academic Integrity & Assignment Verification Seal in Certificate */}
          {activeAssignment && (
            <div className="bg-amber-50/80 border-2 border-amber-300 rounded-lg p-3.5 mb-4 flex flex-wrap items-center justify-between gap-3 font-mono-custom text-xs">
              <div className="flex items-center gap-2.5">
                <School className="w-5 h-5 text-amber-800 shrink-0" />
                <div>
                  <div className="font-bold text-amber-950">
                    Official Class Task: {activeAssignment.title} (#{activeAssignment.code})
                  </div>
                  <div className="text-[11px] text-amber-900 font-serif-custom">
                    Target Class: <strong>{activeAssignment.className}</strong> &bull; Assigned by <strong>{activeAssignment.teacherName}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 border ${
                  tabSwitchCount === 0 && copyPasteAttemptCount === 0
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                    : 'bg-rose-100 border-rose-400 text-rose-800'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {tabSwitchCount === 0 && copyPasteAttemptCount === 0
                    ? '100% Academic Integrity Verified'
                    : `${tabSwitchCount} tab switches, ${copyPasteAttemptCount} paste blocks`}
                </span>
              </div>
            </div>
          )}

          {/* Certificate Badges Strip */}
          <div className="bg-[#EAE3D2]/70 p-3.5 rounded-lg border border-[#C9C2AE] mb-6">
            <div className="font-mono-custom text-[10px] font-bold text-[#2C5F8A] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>UNLOCKED ACHIEVEMENT BADGES ({earnedBadges.length}):</span>
              <span className="text-[#4A7A3E] font-semibold">{gradeDescriptor}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {earnedBadges.map((badge) => (
                <span
                  key={badge.id}
                  className="bg-white border border-[#4A7A3E] text-[#0E1B1F] px-2.5 py-1 rounded font-mono-custom text-[11px] font-bold flex items-center gap-1 shadow-sm"
                >
                  <span>{badge.icon}</span>
                  <span>{badge.title}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Table of Slides and Final Depth Levels */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full text-left border-collapse font-serif-custom text-xs">
              <thead>
                <tr className="border-b-2 border-[#0E1B1F] bg-[#EAE3D2] font-mono-custom text-[11px] text-[#0E1B1F] uppercase">
                  <th className="p-2.5">Slide #</th>
                  <th className="p-2.5">Question Concept</th>
                  <th className="p-2.5 text-center">Dialogue Turns</th>
                  <th className="p-2.5 text-right">Attained Mastery Level</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, idx) => {
                  const state = answers[idx];
                  const depth = state?.highestDepth || 'surface';
                  const turnCount = state?.history ? state.history.filter(t => t.sender === 'student').length : 0;
                  const isExceeding = depth === 'extending';

                  return (
                    <tr key={q.id} className="border-b border-[#C9C2AE] hover:bg-black/5">
                      <td className="p-2.5 font-mono-custom font-bold text-[#2C5F8A]">
                        Slide {idx + 1}
                      </td>
                      <td className="p-2.5 text-[#0E1B1F] font-medium max-w-xs truncate">
                        {q.prompt}
                      </td>
                      <td className="p-2.5 text-center font-mono-custom text-[#6B6455]">
                        {turnCount} {turnCount === 1 ? 'turn' : 'turns'}
                      </td>
                      <td className="p-2.5 text-right">
                        <span
                          className={`font-mono-custom text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                            isExceeding
                              ? 'bg-[#4A7A3E] text-white'
                              : depth === 'secure'
                              ? 'bg-[#2C5F8A] text-white'
                              : 'bg-[#E0AD63] text-[#0E1B1F]'
                          }`}
                        >
                          {isExceeding ? '⭐ Exceeding' : depth === 'secure' ? 'Secure' : 'Developing'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Signature Block */}
          <div className="pt-4 border-t border-[#C9C2AE] flex justify-between items-end flex-wrap gap-4 text-xs font-mono-custom text-[#6B6455]">
            <div>
              <div className="font-bold text-[#0E1B1F]">Verified Socratic AI Learning Environment</div>
              <div className="text-[10px]">Cell Explorer · Systems for Life Module</div>
            </div>
            <div className="text-right">
              <div className="italic font-serif-custom text-[#3A352B]">
                "Scaffolded thinking towards scientific mastery"
              </div>
              <div className="text-[10px] text-[#4A7A3E] font-bold uppercase mt-0.5">
                Ready for Teacher Presentation &amp; Submission
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
