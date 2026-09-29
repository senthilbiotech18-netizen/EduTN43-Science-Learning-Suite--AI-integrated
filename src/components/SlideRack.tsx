import React from 'react';
import { SlideAnswerState } from '../types';
import { CheckCircle2, Award, Sparkles } from 'lucide-react';

interface SlideRackProps {
  total: number;
  currentIndex: number;
  answers: SlideAnswerState[];
  onSelectSlide: (index: number) => void;
  showingSummary: boolean;
  onShowSummary: () => void;
}

export const SlideRack: React.FC<SlideRackProps> = ({
  total,
  currentIndex,
  answers = [],
  onSelectSlide,
  showingSummary,
  onShowSummary,
}) => {
  const hasStartedAny = (answers || []).some((a) => (a?.history?.length || 0) > 0);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
      <div className="flex items-center gap-2 flex-wrap">
        {Array.from({ length: total }).map((_, i) => {
          const state = answers[i];
          const isCurrent = !showingSummary && currentIndex === i;
          const isExceeding = state?.exceedingAchieved || state?.highestDepth === 'extending';
          const highestDepth = state?.highestDepth;
          const turnCount = state?.history ? state.history.filter((t) => t.sender === 'student').length : 0;

          let btnStyle = 'bg-transparent border-blue-400/30 text-blue-200/80 hover:border-blue-300 hover:text-white';

          if (isCurrent) {
            btnStyle = 'border-blue-300 text-white bg-blue-500/30 font-bold ring-2 ring-blue-400/50 scale-105 shadow-md';
          } else if (isExceeding) {
            btnStyle = 'bg-emerald-600 border-emerald-400 text-white font-bold shadow-sm';
          } else if (highestDepth === 'secure') {
            btnStyle = 'bg-blue-600/40 border-blue-400 text-blue-100';
          } else if (highestDepth === 'developing' || highestDepth === 'surface') {
            btnStyle = 'bg-amber-600/30 border-amber-400 text-amber-200';
          }

          return (
            <button
              key={i}
              onClick={() => onSelectSlide(i)}
              className={`w-9 h-7 rounded-lg border text-xs font-mono-custom font-semibold flex items-center justify-center transition-all relative cursor-pointer ${btnStyle}`}
              title={`Slide ${i + 1}: ${
                isExceeding
                  ? 'Exceeding Level Attained!'
                  : highestDepth
                  ? `${highestDepth} (${turnCount} turns)`
                  : 'Not attempted yet'
              }`}
            >
              {i + 1}
              {isExceeding && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-blue-900" title="⭐ Exceeding Level Attained" />
              )}
            </button>
          );
        })}
      </div>

      {hasStartedAny && (
        <button
          onClick={onShowSummary}
          className={`font-mono-custom text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
            showingSummary
              ? 'bg-white text-blue-950 shadow-md font-bold'
              : 'bg-blue-600/40 border border-blue-400/40 text-white hover:bg-blue-600/60'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          EduTN43 Mastery View
        </button>
      )}
    </div>
  );
};
