import React, { useState, useEffect, useRef } from 'react';
import { Question, SlideAnswerState, DialogueTurn, AIFeedback } from '../types';
import { Sparkles, HelpCircle, ArrowRight, RotateCcw, CheckCircle2, Award, MessageSquare, Send, ShieldAlert, Keyboard, AlertCircle, SpellCheck, Check } from 'lucide-react';
import { checkBiologicalSpelling } from '../utils/bioSpellChecker';

interface SlideCardProps {
  question: Question;
  slideIndex: number;
  totalSlides: number;
  state: SlideAnswerState;
  onUpdateInput: (text: string) => void;
  onSubmitAnswer: () => void;
  onResetSlide: () => void;
  onNextSlide: () => void;
  isLastSlide: boolean;
  topicLevel?: string;
  onPasteAttempt?: () => void;
}

export const SlideCard: React.FC<SlideCardProps> = ({
  question,
  slideIndex,
  totalSlides,
  state,
  onUpdateInput,
  onSubmitAnswer,
  onResetSlide,
  onNextSlide,
  isLastSlide,
  topicLevel = 'MYP 2 & 3',
  onPasteAttempt,
}) => {
  const [showHint, setShowHint] = useState(false);
  const [pasteWarning, setPasteWarning] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest dialogue turn when history updates
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.history.length, state.isChecking]);

  // Reset hint when slide changes
  useEffect(() => {
    setShowHint(false);
    setPasteWarning(false);
  }, [slideIndex]);

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setPasteWarning(true);
    if (onPasteAttempt) {
      onPasteAttempt();
    }
    setTimeout(() => {
      setPasteWarning(false);
    }, 4500);
  };

  const history = state?.history || [];
  const hasHistory = history.length > 0;
  const studentTurns = history.filter((t) => t.sender === 'student').length;
  const followUpCount = Math.max(0, studentTurns - 1);
  const isLowerGrade = !topicLevel || topicLevel.includes('PYP') || topicLevel.includes('MYP 1') || topicLevel.includes('MYP 2') || topicLevel.includes('MYP 3') || topicLevel.includes('Grade 6') || topicLevel.includes('Grade 7') || topicLevel.includes('Grade 8');
  const maxFollowUpsReached = isLowerGrade && followUpCount >= 5;

  const liveSpellingErrors = state.currentInput ? checkBiologicalSpelling(state.currentInput) : [];

  const handleFixSpelling = (original: string, correction: string) => {
    // Replace whole word occurrence in currentInput safely
    const escaped = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    const updated = state.currentInput.replace(regex, correction);
    onUpdateInput(updated);
  };

  const latestTurn = hasHistory ? history[history.length - 1] : null;
  const latestFeedback = latestTurn?.feedback;
  const isExceeding = state?.exceedingAchieved;

  const getVerdict = (fb?: AIFeedback): 'correct' | 'partial' | 'wrong' | 'unanswered' => {
    if (!fb) return 'unanswered';
    if (fb.exceedingAchieved || fb.depth === 'extending' || fb.depth === 'secure') {
      return 'correct'; // GREEN: Right answer
    }
    if (fb.misconception || fb.depth === 'surface') {
      return 'wrong'; // RED: Wrong answer / misconception
    }
    if (fb.depth === 'developing') {
      return 'partial'; // YELLOW: Partially correct
    }
    return 'wrong';
  };

  // Calculate circular mastery level
  const currentDepth = isExceeding
    ? 'extending'
    : (latestFeedback?.depth || state?.highestDepth || null);

  let masteryPercent = 0;
  let masteryLabel = 'Not Evaluated';
  let masteryColor = '#94A3B8';

  if (currentDepth === 'surface' || latestFeedback?.misconception) {
    masteryPercent = 25;
    masteryLabel = 'Needs Work / Wrong (25%)';
    masteryColor = '#DC2626'; // RED
  } else if (currentDepth === 'developing') {
    masteryPercent = 50;
    masteryLabel = 'Partially Correct (50%)';
    masteryColor = '#CA8A04'; // YELLOW
  } else if (currentDepth === 'secure') {
    masteryPercent = 75;
    masteryLabel = 'Secure / Right (75%)';
    masteryColor = '#16A34A'; // GREEN
  } else if (currentDepth === 'extending' || isExceeding) {
    masteryPercent = 100;
    masteryLabel = 'Mastered / Right (100%)';
    masteryColor = '#16A34A'; // GREEN
  }

  const radius = 20;
  const circumference = 2 * Math.PI * radius; // ~125.66
  const strokeDashoffset = circumference - (masteryPercent / 100) * circumference;

  const getBadgeStyle = (fb?: AIFeedback) => {
    const verdict = getVerdict(fb);
    if (verdict === 'correct') {
      return 'bg-emerald-600 text-white border-emerald-500 shadow-sm ring-2 ring-emerald-400/40';
    }
    if (verdict === 'partial') {
      return 'bg-amber-500 text-amber-950 border-amber-400 shadow-sm ring-2 ring-amber-300/40';
    }
    if (verdict === 'wrong') {
      return 'bg-rose-600 text-white border-rose-500 shadow-sm ring-2 ring-rose-400/40';
    }
    return 'bg-slate-700 text-white border-slate-600';
  };

  const getLabel = (fb?: AIFeedback) => {
    if (!fb) return 'Formative Feedback';
    if (fb.exceedingAchieved || fb.depth === 'extending') return '⭐ EXCEEDING LEVEL (CORRECT)';
    if (fb.depth === 'secure') return '✓ RIGHT ANSWER (SECURE)';
    if (fb.misconception) return '✕ INCORRECT (MISCONCEPTION FLAGGED)';
    if (fb.depth === 'developing') return '⚡ PARTIALLY CORRECT (DEVELOPING)';
    return '✕ NEEDS PRACTICE (WRONG)';
  };

  return (
    <div className="bg-[#F4EFE2] text-[#0E1B1F] rounded-xl p-5 md:p-8 shadow-2xl border border-[#C9C2AE] transition-all">
      {/* Slide Header Info */}
      <div className="font-mono-custom text-xs font-bold text-[#2C5F8A] tracking-wider mb-3 uppercase flex flex-wrap items-center justify-between gap-2">
        <span className="flex flex-wrap items-center gap-2">
          SLIDE {slideIndex + 1} OF {totalSlides} &nbsp;·&nbsp; STRAND {question.strand.toUpperCase()}
          {isExceeding && (
            <span className="bg-[#4A7A3E] text-white text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 shadow-sm">
              <Award className="w-3 h-3 text-[#E0AD63]" />
              Exceeding
            </span>
          )}
          {isLowerGrade && hasHistory && !isExceeding && (
            <span className="bg-[#2C5F8A]/15 text-[#2C5F8A] text-[10px] px-2 py-0.5 rounded-full font-mono-custom border border-[#2C5F8A]/30">
              Follow-up {followUpCount}/5 max
            </span>
          )}
        </span>

        <div className="flex items-center gap-2">
          {/* Circular Mastery Gauge Pill in Header */}
          <div className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-full border border-[#C9C2AE] shadow-xs">
            <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="16" stroke="#E2E8F0" strokeWidth="4" fill="transparent" />
                <circle
                  cx="22"
                  cy="22"
                  r="16"
                  stroke={masteryColor}
                  strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 16}
                  strokeDashoffset={2 * Math.PI * 16 - (masteryPercent / 100) * (2 * Math.PI * 16)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
            </div>
            <span className="font-mono-custom text-[10px] font-bold text-[#0E1B1F]">
              Mastery: <span style={{ color: masteryColor }}>{masteryPercent}%</span>
            </span>
          </div>

          {question.hint && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-[11px] font-mono-custom text-[#6B6455] hover:text-[#0E1B1F] flex items-center gap-1 cursor-pointer bg-black/5 px-2.5 py-1 rounded border border-black/10"
            >
              <HelpCircle className="w-3 h-3" />
              {showHint ? 'Hide hint' : 'Socratic Hint'}
            </button>
          )}
        </div>
      </div>

      {/* Main Question Prompt */}
      <h2 className="font-serif-custom text-xl md:text-2xl font-medium leading-snug mb-4 text-[#0E1B1F]">
        {question.prompt}
      </h2>

      {/* Optional Socratic Hint Box */}
      {showHint && question.hint && (
        <div className="mb-5 p-3.5 rounded-lg bg-[#EAE3D2] border-l-4 border-[#2C5F8A] text-xs font-serif-custom text-[#3A352B]">
          <strong className="font-mono-custom text-[#2C5F8A] uppercase tracking-wide block mb-0.5">
            Teacher Hint:
          </strong>
          {question.hint}
        </div>
      )}

      {/* Socratic Dialogue History Thread */}
      {hasHistory && (
        <div className="mb-6 space-y-4">
          <div className="font-mono-custom text-xs font-bold text-[#6B6455] uppercase tracking-wider border-b border-[#C9C2AE] pb-1 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#2C5F8A]" />
            Socratic Conversation History ({studentTurns} turn{studentTurns > 1 ? 's' : ''})
          </div>

          {history.map((turn, index) => {
            if (turn.sender === 'student') {
              const nextTurn = history[index + 1];
              const fb = nextTurn?.feedback;
              const verdict = getVerdict(fb);

              return (
                <div
                  key={turn.id}
                  className={`p-4 rounded-xl border-2 shadow-xs ml-2 md:ml-6 transition-all ${
                    verdict === 'correct'
                      ? 'bg-emerald-50/70 border-emerald-400 border-l-8 border-l-emerald-600'
                      : verdict === 'partial'
                      ? 'bg-amber-50/70 border-amber-400 border-l-8 border-l-amber-500'
                      : verdict === 'wrong'
                      ? 'bg-rose-50/70 border-rose-400 border-l-8 border-l-rose-500'
                      : 'bg-white border-[#C9C2AE]'
                  }`}
                >
                  <div className="flex justify-between items-center text-[11px] font-mono-custom font-bold mb-2">
                    <span className="text-[#2C5F8A]">YOUR RESPONSE (TURN {Math.floor(index / 2) + 1})</span>
                    <div className="flex items-center gap-2">
                      {verdict === 'correct' && (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <CheckCircle2 className="w-3 h-3" /> Right Answer
                        </span>
                      )}
                      {verdict === 'partial' && (
                        <span className="bg-amber-500 text-amber-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Sparkles className="w-3 h-3 text-amber-950" /> Partially Correct
                        </span>
                      )}
                      {verdict === 'wrong' && (
                        <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <AlertCircle className="w-3 h-3" /> Wrong / Needs Attention
                        </span>
                      )}
                      <span className="text-[10px] text-[#6B6455] font-normal">{turn.timestamp}</span>
                    </div>
                  </div>
                  <p className="font-serif-custom text-sm text-[#0E1B1F] leading-relaxed whitespace-pre-wrap">
                    "{turn.text}"
                  </p>

                  {/* Biological Spelling Spotted on Student Turn */}
                  {(() => {
                    const errors = turn.feedback?.spellingErrors || history[index + 1]?.feedback?.spellingErrors;
                    if (!errors || errors.length === 0) return null;
                    return (
                      <div className="mt-3 pt-2.5 border-t border-rose-200/80 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono-custom font-bold text-rose-900 bg-rose-100 border border-rose-300/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                          <SpellCheck className="w-3.5 h-3.5 text-rose-700" />
                          Biological Spelling Spotted:
                        </span>
                        {errors.map((err, errIdx) => (
                          <span
                            key={errIdx}
                            className="text-xs font-mono-custom bg-white border border-rose-300 px-2 py-0.5 rounded shadow-2xs flex items-center gap-1.5"
                          >
                            <span className="line-through text-rose-700 font-bold">{err.original}</span>
                            <span className="text-gray-400 font-sans">➔</span>
                            <span className="text-emerald-700 font-bold underline decoration-emerald-500 underline-offset-2">
                              {err.correction}
                            </span>
                          </span>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              );
            }

            if (turn.sender === 'ai' && turn.feedback) {
              const fb = turn.feedback;
              const verdict = getVerdict(fb);
              const isExceedingTurn = fb.exceedingAchieved || fb.depth === 'extending';

              return (
                <div
                  key={turn.id}
                  className={`p-5 rounded-xl border-2 shadow-sm transition-all ${
                    verdict === 'correct'
                      ? 'bg-emerald-50/95 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400/30'
                      : verdict === 'partial'
                      ? 'bg-amber-50/95 border-amber-400 text-amber-950 ring-2 ring-amber-300/30'
                      : 'bg-rose-50/95 border-rose-400 text-rose-950 ring-2 ring-rose-300/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`font-mono-custom text-[11px] font-bold px-3 py-1 rounded-full uppercase border tracking-wider flex items-center gap-1.5 ${getBadgeStyle(
                        fb
                      )}`}
                    >
                      {verdict === 'correct' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : verdict === 'partial' ? (
                        <Sparkles className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      {getLabel(fb)}
                    </span>
                    <span className="text-[10px] font-mono-custom text-[#6B6455]">{turn.timestamp}</span>
                  </div>

                  <p className="text-sm font-serif-custom mb-2 leading-relaxed font-medium">
                    {fb.praise}
                  </p>

                  {/* Biological Spelling Spotlight Box */}
                  {fb.spellingErrors && fb.spellingErrors.length > 0 && (
                    <div className="my-3 p-3.5 rounded-xl bg-amber-50/95 border-2 border-amber-400 shadow-xs">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-amber-500 text-amber-950 flex items-center justify-center font-bold shadow-2xs shrink-0">
                            <SpellCheck className="w-3.5 h-3.5 text-amber-950" />
                          </div>
                          <h5 className="font-mono-custom text-xs font-bold text-amber-950 uppercase tracking-wide">
                            Biological Terminology Spelling Spotlight
                          </h5>
                        </div>
                        <span className="text-[10px] font-mono-custom bg-amber-200/90 text-amber-950 px-2.5 py-0.5 rounded-full font-bold">
                          {fb.spellingErrors.length} {fb.spellingErrors.length === 1 ? 'correction' : 'corrections'} spotted
                        </span>
                      </div>

                      <div className="space-y-2 mt-2">
                        {fb.spellingErrors.map((err, errIdx) => (
                          <div
                            key={errIdx}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-white border border-amber-300/80 shadow-2xs"
                          >
                            <div className="flex items-center gap-2 text-xs font-mono-custom">
                              <span className="line-through text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-bold">
                                {err.original}
                              </span>
                              <span className="text-amber-800 font-bold">➔</span>
                              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-300 font-bold flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" />
                                {err.correction}
                              </span>
                            </div>

                            {err.explanation && (
                              <span className="text-xs font-serif-custom text-amber-900 bg-amber-50/80 px-2.5 py-1 rounded border border-amber-200/70">
                                💡 {err.explanation}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      <p className="text-[11px] font-serif-custom text-amber-900/90 mt-2.5 leading-relaxed">
                        <strong>Criterion A Guidance:</strong> In IB Science, using accurate biological vocabulary with correct scientific spelling demonstrates thorough knowing and understanding.
                      </p>
                    </div>
                  )}

                  {fb.gap && (
                    <div className={`text-xs font-serif-custom mb-2 p-3 rounded-lg border ${
                      verdict === 'correct'
                        ? 'bg-white/80 border-emerald-300 text-emerald-950'
                        : verdict === 'partial'
                        ? 'bg-amber-100/90 border-amber-300 text-amber-950'
                        : 'bg-rose-100/90 border-rose-300 text-rose-950'
                    }`}>
                      <strong className={`font-mono-custom text-[11px] uppercase tracking-wide block mb-0.5 ${
                        verdict === 'correct' ? 'text-emerald-800' : verdict === 'partial' ? 'text-amber-800' : 'text-rose-800'
                      }`}>
                        {isLowerGrade ? '💡 Concept Key & Rectification:' : 'Scaffolding Guidance:'}
                      </strong>
                      {fb.gap}
                    </div>
                  )}

                  {fb.followUp && !isExceedingTurn && (
                    <div className={`mt-3 pt-2.5 text-xs md:text-sm font-serif-custom font-medium p-3.5 rounded-lg border-2 ${
                      verdict === 'correct'
                        ? 'bg-white border-emerald-300 text-emerald-950'
                        : verdict === 'partial'
                        ? 'bg-white border-amber-400 text-amber-950'
                        : 'bg-white border-rose-300 text-rose-950'
                    }`}>
                      <strong className={`font-mono-custom text-xs font-bold uppercase tracking-wide block mb-1 flex items-center gap-1 ${
                        verdict === 'correct' ? 'text-emerald-800' : verdict === 'partial' ? 'text-amber-800' : 'text-rose-800'
                      }`}>
                        <Sparkles className="w-3.5 h-3.5" />
                        Teacher Scaffolding Question:
                      </strong>
                      "{fb.followUp}"
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}
          <div ref={threadEndRef} />
        </div>
      )}

      {/* Input / Response Box for Current or Follow-Up Turn */}
      <div className="space-y-3">
        {isExceeding ? (
          <div className="bg-[#4A7A3E]/20 border-2 border-[#4A7A3E] p-6 rounded-xl text-center space-y-3 shadow-md animate-in fade-in duration-300">
            <div className="w-12 h-12 bg-[#4A7A3E] text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Award className="w-7 h-7 text-[#E0AD63]" />
            </div>
            <h3 className="font-mono-custom text-lg font-bold text-[#0E1B1F]">
              🎉 EXCEEDING LEVEL ATTAINED FOR THIS SLIDE!
            </h3>
            <p className="font-serif-custom text-sm text-[#3A352B] max-w-lg mx-auto">
              Your response demonstrates complete scientific accuracy, precise terminology, and thorough cause-and-effect reasoning.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={onResetSlide}
                className="font-mono-custom text-xs font-semibold px-3 py-2 rounded border border-[#0E1B1F] text-[#0E1B1F] hover:bg-black/5 cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retry Slide
              </button>
              <button
                onClick={onNextSlide}
                className="font-mono-custom text-sm font-bold px-6 py-2.5 rounded bg-[#0E1B1F] text-[#F4EFE2] hover:bg-[#1E3A41] transition-colors shadow flex items-center gap-2 cursor-pointer"
              >
                {isLastSlide ? 'View Mastery Certificate & Summary' : 'Next Slide →'}
              </button>
            </div>
          </div>
        ) : maxFollowUpsReached ? (
          <div className="bg-blue-50/90 border-2 border-blue-600 p-6 rounded-xl text-center space-y-3 shadow-md animate-in fade-in duration-300">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-mono-custom text-base md:text-lg font-bold text-[#0E1B1F]">
              🎉 5 FOLLOW-UP QUESTIONS COMPLETED FOR THIS SLIDE!
            </h3>
            <p className="font-serif-custom text-sm text-[#3A352B] max-w-lg mx-auto">
              Great perseverance! You've completed all 5 follow-up questions for this slide. Click below to grade your progress and advance to the next slide!
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={onResetSlide}
                className="font-mono-custom text-xs font-semibold px-3 py-2 rounded border border-[#0E1B1F] text-[#0E1B1F] hover:bg-black/5 cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restart Thread
              </button>
              <button
                onClick={onNextSlide}
                className="font-mono-custom text-sm font-bold px-6 py-2.5 rounded bg-blue-700 hover:bg-blue-800 text-white transition-colors shadow-lg flex items-center gap-2 cursor-pointer"
              >
                {isLastSlide ? 'Finish Slide & View Certificate →' : 'Finish Slide & Move to Next →'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Dedicated Move-to-Next-Slide or Continue Option Card */}
            {hasHistory && (
              <div className={`mb-5 p-4 rounded-xl border-2 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-300 ${
                getVerdict(latestFeedback) === 'correct'
                  ? 'bg-emerald-50/95 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400/20'
                  : getVerdict(latestFeedback) === 'partial'
                  ? 'bg-amber-50/95 border-amber-400 text-amber-950 ring-2 ring-amber-300/20'
                  : 'bg-rose-50/95 border-rose-400 text-rose-950 ring-2 ring-rose-300/20'
              }`}>
                <div className="flex items-center gap-3.5">
                  {/* Large Circular Mastery Indicator */}
                  <div className="relative w-14 h-14 flex items-center justify-center shrink-0 bg-white rounded-full shadow-inner border border-black/10">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 52 52">
                      <circle cx="26" cy="26" r={radius} stroke="#E2E8F0" strokeWidth="5" fill="transparent" />
                      <circle
                        cx="26"
                        cy="26"
                        r={radius}
                        stroke={masteryColor}
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-mono-custom text-xs font-bold leading-none" style={{ color: masteryColor }}>
                        {masteryPercent}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-mono-custom text-sm font-bold flex items-center gap-2">
                      <span>Status:</span>
                      <span
                        className="text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-white shadow-xs"
                        style={{ backgroundColor: masteryColor }}
                      >
                        {masteryLabel}
                      </span>
                    </h4>
                    <p className="text-xs font-serif-custom mt-1 leading-relaxed opacity-95">
                      {getVerdict(latestFeedback) === 'correct' ? (
                        <>Your answer is evaluated as <strong className="text-emerald-700">Right (Green)</strong>. You can move to the next slide now, or answer further follow-ups to cement Exceeding level!</>
                      ) : getVerdict(latestFeedback) === 'partial' ? (
                        <>Your answer is <strong className="text-amber-800">Partially Correct (Yellow)</strong>. Answer the teacher's follow-up question below to turn it Green, or proceed whenever you are ready!</>
                      ) : (
                        <>Your answer was evaluated as <strong className="text-rose-700">Incorrect / Misconception (Red)</strong>. Check the teacher's rectification guidance and try answering below to correct your score!</>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onNextSlide}
                  className={`w-full sm:w-auto font-mono-custom text-xs md:text-sm font-bold px-5 py-2.5 rounded-lg text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0 border active:scale-97 ${
                    getVerdict(latestFeedback) === 'correct'
                      ? 'bg-emerald-700 hover:bg-emerald-800 border-emerald-600'
                      : getVerdict(latestFeedback) === 'partial'
                      ? 'bg-amber-600 hover:bg-amber-700 border-amber-500'
                      : 'bg-rose-700 hover:bg-rose-800 border-rose-600'
                  }`}
                >
                  <span>{isLastSlide ? 'Finish Slide & View Certificate →' : 'Move to Next Slide →'}</span>
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mb-2">
              <label className="block font-mono-custom text-xs font-bold text-[#0E1B1F] uppercase tracking-wider">
                {hasHistory
                  ? isLowerGrade
                    ? `💬 Write your answer to follow-up #${followUpCount + 1} (Max 5 for lower grade):`
                    : "💬 Write your answer to the teacher's follow-up question below:"
                  : 'Write your initial answer to the question:'}
              </label>
              <span className="font-mono-custom text-[11px] text-[#A8425A] bg-[#A8425A]/10 px-2.5 py-0.5 rounded border border-[#A8425A]/30 flex items-center gap-1 font-semibold">
                <Keyboard className="w-3 h-3 text-[#A8425A]" />
                Direct Typing Only (Paste Disabled)
              </span>
            </div>

            <div className="relative">
              <textarea
                value={state.currentInput}
                onChange={(e) => onUpdateInput(e.target.value)}
                onPaste={handlePaste}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
                placeholder={
                  hasHistory
                    ? 'Type out your explanation manually to answer the follow-up question...'
                    : 'Type a sentence or two explaining your reasoning...'
                }
                disabled={state.isChecking}
                rows={4}
                className="w-full p-4 rounded-lg border-1.5 border-[#C9C2AE] font-serif-custom text-base text-[#0E1B1F] bg-white resize-y transition-all outline-none focus:ring-2 focus:ring-[#2C5F8A]"
              />
              <div className="flex justify-between items-center text-xs font-mono-custom text-[#6B6455] mt-1 px-1">
                <span className="flex items-center gap-1">
                  <Keyboard className="w-3 h-3 inline text-[#2C5F8A]" />
                  {state.currentInput.length} characters typed
                </span>
                {state.currentInput.length > 0 && (
                  <button
                    onClick={() => onUpdateInput('')}
                    className="hover:text-[#A8425A] cursor-pointer"
                  >
                    Clear text
                  </button>
                )}
              </div>
            </div>

            {/* Live Biological Spelling Detection & Quick-Fix Bar */}
            {liveSpellingErrors.length > 0 && (
              <div className="mt-2.5 p-3 rounded-lg bg-amber-50/95 border-2 border-amber-300 text-xs font-mono-custom text-amber-950 flex flex-wrap items-center justify-between gap-2 shadow-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <SpellCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="font-bold text-amber-900">
                    Spelling Spotted in Biology Terminology ({liveSpellingErrors.length}):
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {liveSpellingErrors.map((err, errIdx) => (
                    <button
                      key={errIdx}
                      type="button"
                      onClick={() => handleFixSpelling(err.original, err.correction)}
                      className="bg-white hover:bg-emerald-50 text-amber-950 hover:text-emerald-950 border border-amber-300 hover:border-emerald-500 px-2.5 py-1 rounded-md shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 group"
                      title={`Click to auto-correct "${err.original}" to "${err.correction}"`}
                    >
                      <span className="line-through text-rose-700 font-bold">{err.original}</span>
                      <span className="text-gray-400 font-sans">➔</span>
                      <span className="text-emerald-700 font-bold underline decoration-emerald-500 underline-offset-2">
                        {err.correction}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-sans font-bold group-hover:bg-emerald-200">
                        Fix
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Copy/Paste Attempt Security Warning Alert */}
            {pasteWarning && (
              <div className="mt-3 p-3.5 rounded-lg bg-[#A8425A]/15 border-l-4 border-[#A8425A] text-xs font-mono-custom text-[#0E1B1F] flex items-center gap-2.5 animate-in fade-in duration-200">
                <ShieldAlert className="w-4 h-4 text-[#A8425A] shrink-0" />
                <div>
                  <strong>Copy-Pasting Blocked:</strong> To ensure authentic student work and genuine understanding, copy-pasting text into the response area is disabled. Please type out your biological explanation directly using your keyboard.
                </div>
              </div>
            )}

            {state.error && (
              <div className="mt-3 p-3 rounded-md bg-[#A8425A]/15 border-l-4 border-[#A8425A] text-xs text-[#0E1B1F] font-mono-custom">
                {state.error}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-1 border-t border-[#C9C2AE]/60 pt-3">
              {hasHistory ? (
                <button
                  onClick={onResetSlide}
                  className="font-mono-custom text-xs font-semibold text-[#6B6455] hover:text-[#0E1B1F] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Restart slide thread
                </button>
              ) : (
                <span className="text-xs font-serif-custom text-[#6B6455] italic">
                  Submit your initial answer to get instant feedback.
                </span>
              )}

              <div className="flex flex-wrap items-center gap-2.5">
                {hasHistory && (
                  <button
                    onClick={onNextSlide}
                    className="font-mono-custom text-xs md:text-sm font-bold px-4 py-2.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md border border-blue-500/30"
                    title="Grade current answer and proceed to next slide"
                  >
                    <span>{isLastSlide ? 'Finish Slide & View Certificate →' : 'Finish Slide & Move to Next →'}</span>
                  </button>
                )}

                <button
                  onClick={onSubmitAnswer}
                  disabled={state.isChecking || !state.currentInput.trim()}
                  className="font-mono-custom text-sm font-semibold px-5 py-2.5 rounded-md bg-[#0E1B1F] text-[#F4EFE2] hover:bg-[#1E3A41] active:scale-97 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer shadow"
                >
                  {state.isChecking ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-[#4F8FC7] animate-pulse" />
                      Evaluating thinking...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#E0AD63]" />
                      {hasHistory ? 'Submit Follow-up Answer' : 'Check My Thinking'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {hasHistory && (
              <div className="mt-3 text-xs font-serif-custom text-[#3A352B] bg-blue-50/80 p-2.5 rounded-lg border border-blue-200/70 flex items-center justify-between gap-2">
                <span>
                  💡 <strong>Student Control:</strong> You can answer the follow-up question to raise your depth level, or click <strong>"Finish Slide &amp; Move to Next"</strong> whenever you feel your answer is complete!
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
