import React, { useState, useEffect, useRef } from 'react';
import { Question, SlideAnswerState, DialogueTurn, AIFeedback } from '../types';
import { Sparkles, HelpCircle, ArrowRight, RotateCcw, CheckCircle2, Award, MessageSquare, Send, ShieldAlert, Keyboard } from 'lucide-react';

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
    setTimeout(() => {
      setPasteWarning(false);
    }, 4500);
  };

  const hasHistory = state.history.length > 0;
  const latestTurn = hasHistory ? state.history[state.history.length - 1] : null;
  const latestFeedback = latestTurn?.feedback;
  const isExceeding = state.exceedingAchieved;

  const getBadgeStyle = (fb?: AIFeedback) => {
    if (!fb) return 'bg-[#8A5A1E]/20 text-[#E0AD63] border-[#E0AD63]';
    if (fb.exceedingAchieved || fb.depth === 'extending') {
      return 'bg-[#4A7A3E] text-white border-[#8FBF7F] ring-2 ring-[#8FBF7F]/50';
    }
    if (fb.depth === 'secure') {
      return 'bg-[#2C5F8A]/30 text-[#4F8FC7] border-[#4F8FC7]';
    }
    if (fb.misconception) {
      return 'bg-[#A8425A]/20 text-[#E2839B] border-[#E2839B]';
    }
    return 'bg-[#8A5A1E]/20 text-[#E0AD63] border-[#E0AD63]';
  };

  const getLabel = (fb?: AIFeedback) => {
    if (!fb) return 'Formative Feedback';
    if (fb.exceedingAchieved || fb.depth === 'extending') return '⭐ EXCEEDING LEVEL ATTAINED!';
    if (fb.depth === 'secure') return 'Secure Level';
    if (fb.misconception) return 'Misconception Flagged';
    if (fb.depth === 'developing') return 'Developing Level';
    return 'Getting Started Level';
  };

  return (
    <div className="bg-[#F4EFE2] text-[#0E1B1F] rounded-xl p-5 md:p-8 shadow-2xl border border-[#C9C2AE] transition-all">
      {/* Slide Header Info */}
      <div className="font-mono-custom text-xs font-bold text-[#2C5F8A] tracking-wider mb-3 uppercase flex items-center justify-between">
        <span className="flex items-center gap-2">
          SLIDE {slideIndex + 1} OF {totalSlides} &nbsp;·&nbsp; STRAND {question.strand.toUpperCase()}
          {isExceeding && (
            <span className="bg-[#4A7A3E] text-white text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 shadow-sm">
              <Award className="w-3 h-3 text-[#E0AD63]" />
              Exceeding
            </span>
          )}
        </span>
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
            Socratic Conversation History ({state.history.filter((t) => t.sender === 'student').length} turn{state.history.filter((t) => t.sender === 'student').length > 1 ? 's' : ''})
          </div>

          {state.history.map((turn, index) => {
            if (turn.sender === 'student') {
              return (
                <div key={turn.id} className="bg-white p-4 rounded-lg border border-[#C9C2AE] shadow-sm ml-2 md:ml-6">
                  <div className="flex justify-between items-center text-[11px] font-mono-custom font-bold text-[#2C5F8A] mb-1.5">
                    <span>YOUR RESPONSE (TURN {Math.floor(index / 2) + 1})</span>
                    <span className="text-[10px] text-[#6B6455] font-normal">{turn.timestamp}</span>
                  </div>
                  <p className="font-serif-custom text-sm text-[#0E1B1F] leading-relaxed whitespace-pre-wrap">
                    "{turn.text}"
                  </p>
                </div>
              );
            }

            if (turn.sender === 'ai' && turn.feedback) {
              const fb = turn.feedback;
              const isExceedingTurn = fb.exceedingAchieved || fb.depth === 'extending';

              return (
                <div
                  key={turn.id}
                  className={`p-5 rounded-lg border-l-4 shadow-sm transition-all ${
                    isExceedingTurn
                      ? 'bg-[#4A7A3E]/15 border-[#4A7A3E] text-[#0E1B1F] ring-1 ring-[#8FBF7F]/30'
                      : fb.misconception
                      ? 'bg-[#A8425A]/10 border-[#A8425A] text-[#0E1B1F]'
                      : 'bg-[#2C5F8A]/10 border-[#2C5F8A] text-[#0E1B1F]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`font-mono-custom text-[11px] font-bold px-2.5 py-0.5 rounded uppercase border tracking-wider flex items-center gap-1 ${getBadgeStyle(
                        fb
                      )}`}
                    >
                      {getLabel(fb)}
                    </span>
                    <span className="text-[10px] font-mono-custom text-[#6B6455]">{turn.timestamp}</span>
                  </div>

                  <p className="text-sm font-serif-custom text-[#0E1B1F] mb-2 leading-relaxed">
                    {fb.praise}
                  </p>

                  {fb.gap && (
                    <div className="text-xs font-serif-custom text-[#3A352B] mb-2 bg-white/70 p-2.5 rounded border border-[#C9C2AE]">
                      <strong className="font-mono-custom text-[11px] text-[#8A5A1E] uppercase tracking-wide block mb-0.5">
                        Scaffolding Gap Pointer:
                      </strong>
                      {fb.gap}
                    </div>
                  )}

                  {fb.followUp && !isExceedingTurn && (
                    <div className="mt-3 pt-2.5 border-t border-black/10 text-xs md:text-sm font-serif-custom text-[#0E1B1F] font-medium bg-[#EAE3D2]/70 p-3 rounded-md border border-[#C9C2AE]">
                      <strong className="font-mono-custom text-xs font-bold text-[#2C5F8A] uppercase tracking-wide block mb-1 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#E0AD63]" />
                        Teacher Follow-up Question:
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
              Your response demonstrates complete biological accuracy, precise scientific terminology, and thorough cause-and-effect reasoning.
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
        ) : (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block font-mono-custom text-xs font-bold text-[#0E1B1F] uppercase tracking-wider">
                {hasHistory
                  ? '💬 Write your answer to the teacher\'s follow-up question below:'
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

            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-1">
              {hasHistory ? (
                <button
                  onClick={onResetSlide}
                  className="font-mono-custom text-xs font-semibold text-[#6B6455] hover:text-[#0E1B1F] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Restart thread on this slide
                </button>
              ) : (
                <span className="text-xs font-serif-custom text-[#6B6455] italic">
                  Keep answering follow-up questions until you reach the Exceeding level!
                </span>
              )}

              <button
                onClick={onSubmitAnswer}
                disabled={state.isChecking || !state.currentInput.trim()}
                className="font-mono-custom text-sm font-semibold px-6 py-2.5 rounded-md bg-[#0E1B1F] text-[#F4EFE2] hover:bg-[#1E3A41] active:scale-97 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer shadow"
              >
                {state.isChecking ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#4F8FC7] animate-pulse" />
                    Evaluating thinking...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#E0AD63]" />
                    {hasHistory ? 'Submit Answer to Follow-up' : 'Check My Thinking'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
