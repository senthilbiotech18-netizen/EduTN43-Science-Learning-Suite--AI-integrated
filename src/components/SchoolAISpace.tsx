import React, { useState, useRef, useEffect } from 'react';
import {
  Topic,
  Question,
  SlideAnswerState,
  TeacherAssignment,
  ScaffoldStage,
  DialogueTurn,
  DepthLevel,
} from '../types';
import {
  Sparkles,
  Bot,
  User,
  Send,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  Volume2,
  VolumeX,
  FileText,
  BookOpen,
  Award,
  ChevronRight,
  ShieldAlert,
  Flame,
  Layers,
  MessageSquare,
  Check,
  Lock,
  Target,
} from 'lucide-react';

interface SchoolAISpaceProps {
  topic: Topic;
  questions: Question[];
  answers: SlideAnswerState[];
  activeAssignment: TeacherAssignment | null;
  activeScaffoldStage: ScaffoldStage | null;
  studentName: string;
  studentId: string;
  className: string;
  selectedLevel: string;
  speechEnabled: boolean;
  onToggleSpeech: () => void;
  onUpdateInput: (slideIndex: number, text: string) => void;
  onSubmitAnswer: (slideIndex: number, text: string) => void;
  onResetSlide: (slideIndex: number) => void;
  onCompleteSpace: () => void;
  onExit: () => void;
  tabSwitchCount?: number;
  copyPasteAttemptCount?: number;
}

export const SchoolAISpace: React.FC<SchoolAISpaceProps> = ({
  topic,
  questions,
  answers,
  activeAssignment,
  activeScaffoldStage,
  studentName,
  studentId,
  className,
  selectedLevel,
  speechEnabled,
  onToggleSpeech,
  onUpdateInput,
  onSubmitAnswer,
  onResetSlide,
  onCompleteSpace,
  onExit,
  tabSwitchCount = 0,
  copyPasteAttemptCount = 0,
}) => {
  // Current active question / milestone in the conversational Space
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [showVocabDrawer, setShowVocabDrawer] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentQ = questions[activeQuestionIdx] || questions[0];
  const currentState = answers[activeQuestionIdx] || {
    history: [],
    currentInput: '',
    highestDepth: null,
    isChecking: false,
    error: null,
    exceedingAchieved: false,
  };

  // Group questions into SchoolAI Milestones
  // Milestone 1: Activate & State Definitions (Questions 1 & 2 or first half)
  // Milestone 2: Explore Mechanisms & Interactions (Questions 3 & 4 or middle)
  // Milestone 3: Real-World Application & Evaluation (Questions 5 & 6 or final)
  const milestoneCount = Math.min(3, Math.max(1, Math.ceil(questions.length / 2)));
  const getMilestoneForIndex = (idx: number): number => {
    if (questions.length <= 3) return idx + 1;
    if (idx < 2) return 1;
    if (idx < 4) return 2;
    return 3;
  };

  const getMilestoneTitle = (mNum: number): string => {
    if (mNum === 1) return 'Concept Recall & Foundational Definitions';
    if (mNum === 2) return 'Process Mechanics & System Interactions';
    return 'Evaluative Synthesis & Real-World Application';
  };

  const getMilestoneStrand = (mNum: number): string => {
    if (mNum === 1) return 'Criterion A (Strand i)';
    if (mNum === 2) return 'Criterion A (Strand i & ii)';
    return 'Criterion A (Strand ii)';
  };

  // Calculate overall space completion metrics
  const completedQuestionsCount = answers.filter(
    (a) => a.history.length > 0 && (a.highestDepth === 'secure' || a.highestDepth === 'extending' || a.history.length >= 2)
  ).length;
  const progressPercent = Math.min(100, Math.round((completedQuestionsCount / Math.max(1, questions.length)) * 100));

  // Determine full assignment scaffold stages
  const defaultStages: ScaffoldStage[] = [
    {
      scaffoldNumber: 1,
      title: 'Scaffold 1: Foundational Recall & Key Terms',
      description: 'Recall and state key scientific terms and cellular structures',
      targetOutcome: 'Strand i: State scientific knowledge accurately',
      questionIds: [],
    },
    {
      scaffoldNumber: 2,
      title: 'Scaffold 2: Process Mechanics & Cause-and-Effect',
      description: 'Describe cellular functions and analyze structure-to-function interactions',
      targetOutcome: 'Strand i & ii: Describe mechanisms and explain scientific relationships',
      questionIds: [],
    },
    {
      scaffoldNumber: 3,
      title: 'Scaffold 3: Evaluative Synthesis & Real-World Application',
      description: 'Apply understanding to solve novel scenarios and evaluate hypotheses',
      targetOutcome: 'Strand ii: Apply scientific understanding to solve problems and evaluate effects',
      questionIds: [],
    },
  ];

  const assignmentScaffolds: ScaffoldStage[] =
    activeAssignment?.scaffolds && activeAssignment.scaffolds.length > 0
      ? activeAssignment.scaffolds
      : defaultStages;

  const currentScaffoldNum = activeScaffoldStage?.scaffoldNumber || 1;
  const currentStageObj =
    assignmentScaffolds.find((s) => s.scaffoldNumber === currentScaffoldNum) ||
    assignmentScaffolds[0];

  const overallAssignmentCompletionPercent = Math.min(
    100,
    Math.round(
      (((currentScaffoldNum - 1) + (progressPercent / 100)) /
        assignmentScaffolds.length) *
        100
    )
  );

  // Extract key vocabulary terms for the topic
  const vocabTerms = React.useMemo(() => {
    const rawTokens = `${topic.title} ${topic.description} ${questions.map((q) => q.prompt + ' ' + q.target).join(' ')}`
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 5 && !['question', 'explain', 'describe', 'outline', 'student', 'answer', 'scientific', 'criterion'].includes(w));
    return Array.from(new Set(rawTokens)).slice(0, 8);
  }, [topic, questions]);

  // Check which vocabulary words student has used in conversation
  const studentConversationText = answers
    .flatMap((a) => a.history.filter((h) => h.sender === 'student').map((h) => h.text))
    .join(' ')
    .toLowerCase();

  // Scroll to bottom when history changes or user sends answer
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentState.history.length, currentState.isChecking]);

  const handleSend = () => {
    if (!currentState.currentInput.trim() || currentState.isChecking) return;
    onSubmitAnswer(activeQuestionIdx, currentState.currentInput.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInsertScaffoldPrompt = (promptText: string) => {
    const current = currentState.currentInput ? currentState.currentInput + ' ' : '';
    onUpdateInput(activeQuestionIdx, current + promptText);
    textareaRef.current?.focus();
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* SchoolAI Space Navigation & Brand Bar */}
      <div className="bg-[#091528]/95 border-2 border-cyan-500/40 rounded-2xl p-4 md:p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-6 h-6 animate-pulse text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-mono font-bold uppercase tracking-wider">
                  SchoolAI Space
                </span>
                {activeAssignment ? (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-mono">
                    Task: {activeAssignment.code}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-sans">
                    Adaptive Inquiry
                  </span>
                )}
                <span className="text-xs text-blue-300 font-sans font-medium">
                  {studentName} ({studentId}) • {className}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-0.5 flex items-center gap-2">
                <span>{topic.title}</span>
              </h2>
            </div>
          </div>

          {/* Action Header Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onToggleSpeech}
              className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                speechEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                  : 'bg-blue-950/60 text-blue-400 border-blue-800/40 hover:text-white'
              }`}
              title={speechEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onCompleteSpace}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-200" />
              <span>Verified Report &amp; PDF</span>
            </button>

            <button
              onClick={onExit}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-all cursor-pointer"
              title="Return to Student Portal"
            >
              Exit Space
            </button>
          </div>
        </div>

        {/* Space Progress Bar */}
        <div className="mt-3 pt-3 border-t border-blue-500/20 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-blue-200">
            <span className="font-semibold text-cyan-300">Inquiry Progress:</span>
            <span>
              {completedQuestionsCount} of {questions.length} inquiries resolved ({progressPercent}%)
            </span>
          </div>
          <div className="w-1/2 md:w-2/5 bg-slate-900 rounded-full h-2 overflow-hidden border border-blue-500/30">
            <div
              className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visual Assignment Scaffold Progress Stepper */}
      <div className="bg-[#09172E]/95 border-2 border-cyan-500/30 rounded-2xl p-4 md:p-5 shadow-xl backdrop-blur-md space-y-4">
        {/* Stepper Header Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Target className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Assignment Scaffold Stepper
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
                  Stage {currentScaffoldNum} of {assignmentScaffolds.length}
                </span>
              </div>
              <h3 className="text-sm md:text-base font-bold text-white tracking-tight">
                {currentStageObj.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono font-bold text-blue-300">
                Assignment Completion
              </div>
              <div className="text-xs md:text-sm font-bold text-emerald-400 font-mono">
                {overallAssignmentCompletionPercent}% Completed
              </div>
            </div>
            <div className="w-20 md:w-28 bg-slate-900 rounded-full h-2.5 overflow-hidden border border-blue-500/30">
              <div
                className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${overallAssignmentCompletionPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stepper Steps Row */}
        <div className="relative pt-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 relative">
            {assignmentScaffolds.map((stage) => {
              const isCompleted = stage.scaffoldNumber < currentScaffoldNum;
              const isCurrent = stage.scaffoldNumber === currentScaffoldNum;

              return (
                <div
                  key={stage.scaffoldNumber}
                  className={`relative p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-gradient-to-b from-cyan-950/70 to-[#0A1A33] border-cyan-400 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400/50'
                      : isCompleted
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-100'
                      : 'bg-[#061120]/70 border-blue-900/40 text-blue-300/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                            : isCurrent
                            ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/40 ring-4 ring-cyan-400/20'
                            : 'bg-blue-950 border border-blue-800 text-blue-400'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : isCurrent ? (
                          <span>{stage.scaffoldNumber}</span>
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-blue-400/60" />
                        )}
                      </div>

                      <span
                        className={`text-xs font-mono font-bold uppercase tracking-wider ${
                          isCurrent
                            ? 'text-cyan-300'
                            : isCompleted
                            ? 'text-emerald-400'
                            : 'text-blue-400/70'
                        }`}
                      >
                        Scaffold {stage.scaffoldNumber}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                        isCurrent
                          ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 animate-pulse'
                          : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          : 'bg-blue-950 text-blue-400/60 border border-blue-900/40'
                      }`}
                    >
                      {isCurrent ? '★ Current' : isCompleted ? '✓ Passed' : 'Upcoming'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div
                      className={`text-xs font-bold leading-tight font-sans ${
                        isCurrent
                          ? 'text-white'
                          : isCompleted
                          ? 'text-emerald-100'
                          : 'text-blue-200/60'
                      }`}
                    >
                      {stage.title.replace(/^Scaffold \d+:\s*/, '')}
                    </div>

                    {stage.targetOutcome && (
                      <div
                        className={`text-[11px] line-clamp-2 leading-relaxed ${
                          isCurrent
                            ? 'text-cyan-200/80 font-sans'
                            : isCompleted
                            ? 'text-emerald-200/70'
                            : 'text-blue-300/40'
                        }`}
                      >
                        {stage.targetOutcome}
                      </div>
                    )}
                  </div>

                  {/* Visual Progress Sub-Indicator */}
                  <div className="mt-3 pt-2 border-t border-blue-500/10 flex items-center justify-between text-[10px] font-mono">
                    <span className={isCurrent ? 'text-cyan-300 font-semibold' : 'text-blue-400/60'}>
                      {isCurrent
                        ? `${completedQuestionsCount}/${questions.length} Inquiries Completed`
                        : isCompleted
                        ? 'Mastery Recorded'
                        : 'Unlocks Next'}
                    </span>
                    {isCurrent && (
                      <span className="text-emerald-400 font-bold">{progressPercent}%</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Stage Guidance Callout */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-950/60 via-[#0B1E38] to-blue-950/60 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-blue-200">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <span className="font-semibold text-cyan-300 font-mono">Current Learning Target:</span>
            <span className="text-white/90 font-sans">
              {currentStageObj.targetOutcome || currentStageObj.description}
            </span>
          </div>

          <div className="text-[11px] font-mono text-cyan-300/80 shrink-0">
            {currentScaffoldNum < assignmentScaffolds.length ? (
              <span>Proceed to Scaffold {currentScaffoldNum + 1} upon completion</span>
            ) : (
              <span className="text-emerald-300 font-bold">★ Final Assignment Stage</span>
            )}
          </div>
        </div>
      </div>

      {/* Main SchoolAI Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: SchoolAI Milestones & Vocabulary Guide (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Pedagogical Space Philosophy Card */}
          <div className="bg-[#0B1A30]/90 border border-blue-500/30 rounded-2xl p-4 text-xs text-blue-200 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase tracking-wider text-[11px]">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Socratic Guide: Science Sidekick</span>
            </div>
            <p className="text-blue-200/80 leading-relaxed">
              I am your Socratic AI learning partner. I guide your thinking through probing questions and adaptive hints—
              <span className="text-cyan-300 font-semibold"> I will never just give you the answer!</span>
            </p>
          </div>

          {/* Curriculum Milestones List */}
          <div className="bg-[#0B1A30]/90 border border-blue-500/30 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Mission Milestones</span>
              </h3>
              <span className="text-[11px] text-blue-300 font-mono">
                Stage {activeQuestionIdx + 1}/{questions.length}
              </span>
            </div>

            <div className="space-y-2">
              {questions.map((q, qIdx) => {
                const qState = answers[qIdx];
                const isCurrent = qIdx === activeQuestionIdx;
                const isDone = qState && qState.history.length > 0 && (qState.highestDepth === 'secure' || qState.highestDepth === 'extending' || qState.history.length >= 2);
                const depth = qState?.highestDepth;
                const mNum = getMilestoneForIndex(qIdx);

                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestionIdx(qIdx)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/40'
                        : isDone
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-blue-200 hover:bg-emerald-950/40'
                        : 'bg-[#081324] border-blue-900/40 text-blue-300/80 hover:bg-blue-900/30'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center text-[10px] font-bold text-slate-900">
                          {qIdx + 1}
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-blue-500/40 flex items-center justify-center text-[10px] text-blue-400">
                          {qIdx + 1}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 truncate">
                          Milestone {mNum} • Strand {q.strand}
                        </span>
                        {depth && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              depth === 'extending'
                                ? 'bg-purple-500/30 text-purple-300 border border-purple-400/40'
                                : depth === 'secure'
                                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40'
                                : 'bg-blue-500/30 text-blue-300'
                            }`}
                          >
                            {depth}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/90 line-clamp-2 mt-0.5 font-sans">
                        {q.prompt}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scientific Vocabulary Tracker */}
          <div className="bg-[#0B1A30]/90 border border-blue-500/30 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Curriculum Vocabulary Bank</span>
              </h3>
              <span className="text-[10px] text-blue-300 font-sans">Target Mastery</span>
            </div>
            <p className="text-[11px] text-blue-300/80">
              Apply these scientific terms in your responses. They will illuminate when detected!
            </p>
            <div className="flex flex-wrap gap-1.5">
              {vocabTerms.map((term) => {
                const isUsed = studentConversationText.includes(term.toLowerCase());
                return (
                  <span
                    key={term}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                      isUsed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 font-bold shadow-sm shadow-emerald-500/20'
                        : 'bg-blue-950/40 text-blue-300/70 border border-blue-800/30'
                    }`}
                  >
                    {isUsed ? '✓ ' : ''}{term}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Academic Integrity Monitor */}
          {(tabSwitchCount > 0 || copyPasteAttemptCount > 0) && (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Monitored session: {tabSwitchCount} tab focus changes · {copyPasteAttemptCount} paste attempts.
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Conversational Socratic Space Stream (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-[740px] bg-[#091528]/95 border-2 border-blue-500/40 rounded-2xl shadow-2xl overflow-hidden">
          {/* Active Question / Inquiry Banner */}
          <div className="bg-gradient-to-r from-[#0C1E3A] via-[#10274B] to-[#0A1A33] border-b border-blue-500/30 p-4 shrink-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-mono font-bold">
                Inquiry Stage {activeQuestionIdx + 1} of {questions.length} • Strand {currentQ.strand}
              </span>

              <div className="flex items-center gap-2">
                {activeQuestionIdx > 0 && (
                  <button
                    onClick={() => setActiveQuestionIdx(activeQuestionIdx - 1)}
                    className="px-2.5 py-1 rounded-lg bg-blue-900/40 hover:bg-blue-800 text-blue-200 text-xs transition-all cursor-pointer"
                  >
                    ← Previous
                  </button>
                )}
                {activeQuestionIdx < questions.length - 1 && (
                  <button
                    onClick={() => setActiveQuestionIdx(activeQuestionIdx + 1)}
                    className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    Next Inquiry →
                  </button>
                )}
              </div>
            </div>

            <h3 className="text-base md:text-lg font-bold text-white font-sans mt-1">
              {currentQ.prompt}
            </h3>

            {currentQ.hint && (
              <p className="text-xs text-cyan-300/80 mt-1 flex items-center gap-1.5 font-sans">
                <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                <span>Target Focus: {currentQ.hint}</span>
              </p>
            )}
          </div>

          {/* Socratic Dialogue Stream */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
            {/* Opening Welcome from AI Tutor */}
            <div className="flex gap-3 items-start max-w-[90%]">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white shrink-0 shadow-md">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div className="bg-[#0C1B33] border border-blue-500/30 rounded-2xl rounded-tl-none p-4 shadow-md text-sm text-blue-100 space-y-2">
                <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">
                  Science Sidekick
                </div>
                <p>
                  Welcome to our SchoolAI Socratic Space, <span className="font-semibold text-white">{studentName}</span>! Let's explore{' '}
                  <span className="font-bold text-amber-300">{topic.title}</span>.
                </p>
                <p className="text-xs text-blue-200/90 bg-blue-950/50 p-2.5 rounded-xl border border-blue-400/20">
                  <span className="font-bold text-cyan-300">Your Inquiry: </span>
                  {currentQ.prompt}
                </p>
                <p className="text-xs text-blue-300/80 italic">
                  Take a moment to formulate your thoughts. Explain in your own words, using accurate science terminology!
                </p>
              </div>
            </div>

            {/* Conversation History Turns */}
            {currentState.history.map((turn, tIdx) => {
              const isAi = turn.sender === 'ai';
              const feedback = turn.feedback;

              return (
                <div
                  key={turn.id || tIdx}
                  className={`flex gap-3 items-start ${isAi ? 'max-w-[92%]' : 'max-w-[92%] ml-auto flex-row-reverse'}`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md ${
                      isAi ? 'bg-gradient-to-br from-cyan-500 to-blue-700' : 'bg-gradient-to-br from-blue-600 to-indigo-700'
                    }`}
                  >
                    {isAi ? <Bot className="w-5 h-5 text-amber-300" /> : <User className="w-5 h-5 text-blue-100" />}
                  </div>

                  <div
                    className={`rounded-2xl p-4 shadow-md text-sm space-y-2 ${
                      isAi
                        ? 'bg-[#0C1B33] border border-blue-500/30 rounded-tl-none text-blue-100'
                        : 'bg-[#122B52] border border-cyan-400/40 rounded-tr-none text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-bold font-mono text-cyan-300">
                        {isAi ? 'Science Sidekick' : studentName}
                      </span>
                      <span className="text-[11px] text-blue-300/60 font-mono">{turn.timestamp}</span>
                    </div>

                    <div className="whitespace-pre-wrap leading-relaxed">{turn.text}</div>

                    {/* Socratic Formative Guidance Box for AI responses */}
                    {isAi && feedback && (
                      <div className="mt-3 pt-3 border-t border-blue-500/20 space-y-2 text-xs">
                        {/* Depth Level Badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] font-mono ${
                              feedback.depth === 'extending'
                                ? 'bg-purple-500/30 text-purple-200 border border-purple-400/40'
                                : feedback.depth === 'secure'
                                ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                                : 'bg-blue-500/30 text-blue-200 border border-blue-400/30'
                            }`}
                          >
                            Cognitive Depth: {feedback.depth}
                          </span>

                          {feedback.exceedingAchieved && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold">
                              ★ Exceeding Mastery Unlocked!
                            </span>
                          )}
                        </div>

                        {/* Gap / Hint */}
                        {feedback.gap && (
                          <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-400/30 text-cyan-200">
                            <span className="font-bold text-amber-300">💡 Conceptual Hint: </span>
                            {feedback.gap}
                          </div>
                        )}

                        {/* Follow-up Probing Question */}
                        {feedback.followUp && (
                          <div className="p-2.5 rounded-xl bg-blue-900/30 border border-blue-400/30 text-blue-100">
                            <span className="font-bold text-cyan-300">❓ Probing Question: </span>
                            {feedback.followUp}
                          </div>
                        )}

                        {/* Spelling Correction Guidance */}
                        {feedback.spellingErrors && feedback.spellingErrors.length > 0 && (
                          <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-400/40 text-purple-200 space-y-1">
                            <span className="font-bold text-purple-300">Scientific Vocabulary Spell Check:</span>
                            {feedback.spellingErrors.map((err, eIdx) => (
                              <div key={eIdx} className="text-[11px] font-mono">
                                • "{err.original}" → <span className="font-bold text-white underline">{err.correction}</span>
                                {err.explanation ? ` (${err.explanation})` : ''}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* AI Thinking Animation */}
            {currentState.isChecking && (
              <div className="flex gap-3 items-start max-w-[85%]">
                <div className="w-9 h-9 rounded-xl bg-cyan-600 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Bot className="w-5 h-5 animate-pulse text-amber-300" />
                </div>
                <div className="bg-[#0C1B33] border border-cyan-400/40 rounded-2xl rounded-tl-none p-3.5 shadow-md flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-xs text-cyan-300 font-mono">Science Sidekick is analyzing your reasoning...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Scaffold Probing Assist Chips */}
          <div className="px-4 py-2 bg-[#071322] border-t border-blue-500/20 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
            <span className="text-blue-400 font-mono text-[11px] shrink-0">Scaffold Prompts:</span>
            <button
              onClick={() => handleInsertScaffoldPrompt("Can you give me a guiding hint without telling me the answer?")}
              className="px-2.5 py-1 rounded-lg bg-blue-900/40 hover:bg-blue-800 text-blue-200 border border-blue-500/30 whitespace-nowrap text-[11px] transition-all cursor-pointer"
            >
              💡 Give me a guiding hint
            </button>
            <button
              onClick={() => handleInsertScaffoldPrompt("Could you break this question down into smaller steps?")}
              className="px-2.5 py-1 rounded-lg bg-blue-900/40 hover:bg-blue-800 text-blue-200 border border-blue-500/30 whitespace-nowrap text-[11px] transition-all cursor-pointer"
            >
              🧩 Break it down
            </button>
            <button
              onClick={() => handleInsertScaffoldPrompt("How does this link to biological structures and cause-and-effect?")}
              className="px-2.5 py-1 rounded-lg bg-blue-900/40 hover:bg-blue-800 text-blue-200 border border-blue-500/30 whitespace-nowrap text-[11px] transition-all cursor-pointer"
            >
              🔗 Link cause and effect
            </button>
          </div>

          {/* Chat Response Input Box */}
          <div className="p-3 md:p-4 bg-[#081528] border-t border-blue-500/30 shrink-0 space-y-2">
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={currentState.currentInput}
                  onChange={(e) => onUpdateInput(activeQuestionIdx, e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Respond to Science Sidekick... (Type your reasoning for Inquiry ${activeQuestionIdx + 1})`}
                  rows={2}
                  disabled={currentState.isChecking}
                  className="w-full bg-[#050D1A] border border-blue-400/40 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 resize-none font-sans"
                />
                <div className="absolute right-2 bottom-2 text-[10px] text-blue-400/60 font-mono">
                  Cmd/Ctrl + Enter to send
                </div>
              </div>

              <button
                onClick={handleSend}
                disabled={!currentState.currentInput.trim() || currentState.isChecking}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white font-bold transition-all shadow-md cursor-pointer flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-blue-300/70">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SchoolAI Socratic Engine Active · IB MYP Criterion A
              </span>

              {currentState.history.length > 0 && (
                <button
                  onClick={() => onResetSlide(activeQuestionIdx)}
                  className="text-blue-400/70 hover:text-rose-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear conversation for this inquiry</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
