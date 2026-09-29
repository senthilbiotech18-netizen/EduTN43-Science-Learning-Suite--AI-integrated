import React, { useState } from 'react';
import { Sparkles, BookOpen, GraduationCap, ArrowRight, Loader2, Lightbulb, Sliders, History, Library, KeyRound, School, Lock, Shield } from 'lucide-react';
import { Topic, PastSessionRecord, TeacherAssignment } from '../types';
import { TOPICS } from '../data/topics';
import { loadStoredApiKey } from '../utils/storage';
import { findAssignmentByCode } from '../utils/assignmentManager';

interface TopicSetupDashboardProps {
  onStartSession: (topic: Topic) => void;
  initialStudentName?: string;
  initialClassName?: string;
  onUpdateStudentName?: (name: string) => void;
  onUpdateClassName?: (cls: string) => void;
  onOpenTopicLibrary?: () => void;
  onOpenLibraryModal?: () => void;
  selectedLevel?: string;
  initialLevel?: string;
  onSelectLevel?: (level: string) => void;
  pastSessions?: PastSessionRecord[];
  onOpenApiKeyModal?: () => void;
  hasCustomApiKey?: boolean;
  onOpenTeacherModal?: () => void;
  onLaunchAssignment?: (assignment: TeacherAssignment) => void;
}

const POPULAR_SUGGESTIONS = [
  { label: 'Photosynthesis', icon: '🌱', level: 'MYP 1–3' },
  { label: 'Plant & Animal Cells', icon: '🔬', level: 'MYP 1–3' },
  { label: 'States of Matter & Phase Changes', icon: '🧪', level: 'MYP 1–3' },
  { label: 'Forces & Friction', icon: '⚡', level: 'MYP 1–3' },
  { label: 'Digestive System', icon: '🍎', level: 'MYP 1–3' },
  { label: 'Ecosystems & Food Webs', icon: '🌍', level: 'MYP 1–3' },
  { label: 'Acids, Bases & pH', icon: '⚗️', level: 'MYP 4–5' },
  { label: 'Cellular Respiration & ATP', icon: '🧬', level: 'MYP 4–5' },
];

export const TopicSetupDashboard: React.FC<TopicSetupDashboardProps> = ({
  onStartSession,
  initialStudentName = 'Senthil Kumar',
  initialClassName = 'Science Class',
  onUpdateStudentName,
  onUpdateClassName,
  onOpenTopicLibrary,
  onOpenLibraryModal,
  selectedLevel: propSelectedLevel,
  initialLevel,
  onSelectLevel,
  pastSessions = [],
  onOpenApiKeyModal,
  hasCustomApiKey = false,
  onOpenTeacherModal,
  onLaunchAssignment,
}) => {
  const currentLevel = propSelectedLevel || initialLevel || 'MYP 1–3 (Grade 6–8)';
  const handleOpenLibrary = onOpenTopicLibrary || onOpenLibraryModal || (() => {});
  const [topicInput, setTopicInput] = useState('');
  const [slideCount, setSlideCount] = useState<number>(5);
  const [customSlideCount, setCustomSlideCount] = useState<string>('5');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Student Assignment PIN / Code quick launcher
  const [taskPinInput, setTaskPinInput] = useState('');
  const [taskPinError, setTaskPinError] = useState<string | null>(null);

  const handleLaunchByPin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = taskPinInput.trim().toUpperCase();
    if (!cleanPin) return;

    const found = findAssignmentByCode(cleanPin);
    if (found && onLaunchAssignment) {
      setTaskPinError(null);
      onLaunchAssignment(found);
    } else {
      setTaskPinError(`Assignment code "${cleanPin}" not found. Please check with your teacher.`);
    }
  };

  const isLowerGrade = !currentLevel || currentLevel.includes('PYP') || currentLevel.includes('MYP 1') || currentLevel.includes('MYP 2') || currentLevel.includes('MYP 3') || currentLevel.includes('Grade 6') || currentLevel.includes('Grade 7') || currentLevel.includes('Grade 8');

  const handleStart = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = topicInput.trim();

    if (!query) {
      setErrorMsg('Please enter a science topic you want to learn or practice.');
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);

    // Check if the student entered an exact match with an existing topic in the library
    const matchedLibraryTopic = TOPICS.find(
      (t) => t.title.toLowerCase() === query.toLowerCase() || t.id.toLowerCase() === query.toLowerCase()
    );

    if (matchedLibraryTopic) {
      // Use the library topic but slice questions to requested slideCount
      const slicedQuestions = matchedLibraryTopic.questions.slice(0, slideCount).map((q, idx) => ({
        ...q,
        id: idx + 1,
      }));

      const customizedTopic: Topic = {
        ...matchedLibraryTopic,
        level: currentLevel,
        questions: slicedQuestions,
      };

      setIsGenerating(false);
      onStartSession(customizedTopic);
      return;
    }

    // Otherwise, generate a custom scaffolded topic
    const customKey = loadStoredApiKey();
    try {
      const res = await fetch('/api/generate-topic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(customKey ? { 'x-gemini-api-key': customKey } : {}),
        },
        body: JSON.stringify({
          topicTitle: query,
          level: currentLevel,
          slideCount: slideCount,
          customApiKey: customKey || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const generatedTopic = await res.json();
      setIsGenerating(false);
      onStartSession(generatedTopic);
    } catch (err: any) {
      console.log('Custom topic generation fallback applied:', err?.message || err);
      // Construct a local fallback topic so student is never blocked
      const localTopic: Topic = {
        id: `custom-${Date.now()}`,
        title: query,
        level: currentLevel,
        subject: 'Biology',
        description: `Student-selected topic inquiry on ${query}`,
        badgeColor: isLowerGrade ? 'bg-emerald-600' : 'bg-blue-600',
        icon: 'Sparkles',
        questions: Array.from({ length: slideCount }, (_, i) => ({
          id: i + 1,
          strand: (i % 2 === 0 ? 'i' : 'ii') as 'i' | 'ii',
          prompt: i === 0
            ? `What is "${query}", and what is its main role or importance in science?`
            : i === 1
            ? `Explain the key parts or conditions necessary for "${query}" to occur.`
            : i === 2
            ? `How does "${query}" affect the environment or living organisms around it?`
            : `Give a practical everyday example of "${query}" in action.`,
          target: `Accurate scientific description and explanation of ${query}.`,
          hint: `Focus on the core concept and explain what causes it.`,
        })),
      };
      setIsGenerating(false);
      onStartSession(localTopic);
    }
  };

  return (
    <div className="space-y-6">
      {/* General Topic Dashboard Header */}
      <div className="border-b border-blue-400/20 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono-custom text-xs font-bold px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-200 border border-blue-400/30 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Adaptive Socratic Science Lab
              </span>
              <span className="font-mono-custom text-xs text-blue-300/80">
                IB MYP Criterion A (Knowing &amp; Understanding)
              </span>
            </div>
            <h1 className="font-mono-custom text-3xl md:text-4xl font-bold text-white tracking-tight">
              Topic Setup
            </h1>
            <p className="font-serif-custom text-sm md:text-base text-blue-100/90 mt-1 max-w-2xl">
              Type any science topic you want to study today. We will scaffold questions specifically to your grade level and preferred number of inquiries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenTeacherModal && (
              <button
                type="button"
                onClick={onOpenTeacherModal}
                className="font-mono-custom text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-blue-950 transition-all flex items-center gap-2 cursor-pointer shadow-md border border-amber-300"
                title="Teacher Assignment Portal: Create and distribute class tasks with locked learning outcomes"
              >
                <School className="w-4 h-4 text-blue-950" />
                <span>Teacher Assign Portal</span>
              </button>
            )}

            {onOpenApiKeyModal && (
              <button
                type="button"
                onClick={onOpenApiKeyModal}
                className={`font-mono-custom text-xs font-bold px-3.5 py-2.5 rounded-xl border transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                  hasCustomApiKey
                    ? 'bg-amber-500 hover:bg-amber-400 text-blue-950 border-amber-300 ring-2 ring-amber-400/40'
                    : 'bg-white/10 hover:bg-white/15 text-blue-100 border-blue-300/30 hover:border-blue-300/60'
                }`}
                title={hasCustomApiKey ? 'Custom Gemini API Key is active. Click to manage.' : 'Enter your own Google Gemini API key'}
              >
                <KeyRound className={`w-4 h-4 ${hasCustomApiKey ? 'text-blue-950' : 'text-amber-300'}`} />
                <span>{hasCustomApiKey ? 'API Key (Active)' : 'Student API Key'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenLibrary}
              className="font-mono-custom text-xs font-bold px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-blue-100 border border-blue-300/30 transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:border-blue-300/60"
            >
              <Library className="w-4 h-4 text-amber-300" />
              <span>Browse Library (25+ Topics)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Student Quick Class Assignment PIN Launcher */}
      <div className="bg-gradient-to-r from-[#0C1A2E] to-[#162D4A] border-2 border-amber-400/70 rounded-2xl p-4 md:p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono-custom font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>Have a Class Assignment PIN or Code?</span>
              <span className="bg-amber-400/20 text-amber-200 text-[10px] px-2 py-0.2 rounded font-mono-custom">
                Try: CELL-7A or PHOTO-9B
              </span>
            </div>
            <p className="text-xs font-serif-custom text-blue-100 mt-0.5">
              Enter your teacher's code to automatically load your class's assigned topic, locked learning outcomes, and assessment rules.
            </p>
          </div>
        </div>

        <form onSubmit={handleLaunchByPin} className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <input
            type="text"
            value={taskPinInput}
            onChange={(e) => {
              setTaskPinInput(e.target.value.toUpperCase());
              if (taskPinError) setTaskPinError(null);
            }}
            placeholder="e.g. CELL-7A"
            className="w-full md:w-36 px-3 py-2 rounded-lg bg-[#0B1A2C] border-2 border-amber-400/50 font-mono-custom font-bold text-sm text-amber-300 placeholder-blue-300/40 text-center uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-blue-950 font-mono-custom font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer shrink-0"
          >
            <span>Load Task</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {taskPinError && (
        <div className="p-3 rounded-xl bg-red-900/50 border border-red-500/60 text-red-200 text-xs font-mono-custom flex items-center gap-2">
          <span>⚠️ {taskPinError}</span>
        </div>
      )}

      {/* Main Interactive Topic Builder Card */}
      <form onSubmit={handleStart} className="bg-[#152B44] border-2 border-blue-400/40 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Step 1: Type Your Topic */}
        <div>
          <label className="block font-mono-custom text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500/30 text-amber-300 flex items-center justify-center text-xs font-bold border border-amber-400/40">
              1
            </span>
            <span>What topic would you like to explore today?</span>
          </label>

          <div className="relative">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => {
                setTopicInput(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Type your own topic (e.g., Photosynthesis, Cell Structures, Forces & Friction, States of Matter...)"
              className="w-full px-4 py-3.5 rounded-xl bg-[#0B1A2C] border-2 border-blue-400/40 font-serif-custom text-base text-white placeholder-blue-300/40 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all shadow-inner"
              autoFocus
            />
            {topicInput.trim() && (
              <button
                type="button"
                onClick={() => setTopicInput('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono-custom text-blue-300/60 hover:text-white cursor-pointer px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick suggestions chips */}
          <div className="mt-3">
            <div className="text-[11px] font-mono-custom text-blue-300/80 uppercase tracking-wide flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
              <span>Or click a starter topic to fill in:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SUGGESTIONS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setTopicInput(item.label);
                    if (onSelectLevel) {
                      if (item.level.includes('MYP 4')) {
                        onSelectLevel('MYP 4–5 (Grade 9–10)');
                      } else {
                        onSelectLevel('MYP 1–3 (Grade 6–8)');
                      }
                    }
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-serif-custom transition-all cursor-pointer flex items-center gap-1.5 ${
                    topicInput === item.label
                      ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-semibold shadow-xs'
                      : 'bg-[#0E2034] hover:bg-blue-900/40 border-blue-400/20 text-blue-200'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Grade Level Scaffolding */}
        <div className="pt-2 border-t border-blue-400/20">
          <label className="block font-mono-custom text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-500/30 text-blue-300 flex items-center justify-center text-xs font-bold border border-blue-400/40">
              2
            </span>
            <span>Select Your Grade Level Scaffolding</span>
          </label>
          <p className="text-xs font-serif-custom text-blue-200/80 mb-3">
            Questions, follow-ups, and hints are strictly calibrated to avoid overwhelming students with high-end college jargon.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onSelectLevel && onSelectLevel('MYP 1–3 (Grade 6–8)')}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 ${
                isLowerGrade
                  ? 'bg-emerald-950/40 border-emerald-400 text-white shadow-lg ring-2 ring-emerald-400/30'
                  : 'bg-[#0E2034] border-blue-400/20 text-blue-200 hover:border-blue-400/40'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold shrink-0 border border-emerald-400/30">
                🟢
              </div>
              <div className="flex-1">
                <div className="font-mono-custom font-bold text-sm text-emerald-300 flex items-center justify-between">
                  <span>MYP 1–3 (Grade 6–8)</span>
                  {isLowerGrade && <span className="text-xs bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded">Selected</span>}
                </div>
                <div className="text-xs font-serif-custom text-blue-100/80 mt-1 leading-relaxed">
                  Simple, accessible language; core observable concepts; gentle misconception rectifications; <strong>max 5 follow-up questions</strong> per slide.
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectLevel && onSelectLevel('MYP 4–5 (Grade 9–10)')}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 ${
                !isLowerGrade
                  ? 'bg-blue-950/50 border-blue-400 text-white shadow-lg ring-2 ring-blue-400/30'
                  : 'bg-[#0E2034] border-blue-400/20 text-blue-200 hover:border-blue-400/40'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold shrink-0 border border-blue-400/30">
                🟦
              </div>
              <div className="flex-1">
                <div className="font-mono-custom font-bold text-sm text-blue-300 flex items-center justify-between">
                  <span>MYP 4–5 (Grade 9–10)</span>
                  {!isLowerGrade && <span className="text-xs bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded">Selected</span>}
                </div>
                <div className="text-xs font-serif-custom text-blue-100/80 mt-1 leading-relaxed">
                  Advanced scientific terminology, detailed mechanisms, cause-and-effect reasoning, and full Socratic depth.
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Step 3: Select Number of Slides */}
        <div className="pt-2 border-t border-blue-400/20">
          <label className="block font-mono-custom text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-500/30 text-purple-300 flex items-center justify-center text-xs font-bold border border-purple-400/40">
              3
            </span>
            <span>How many Space inquiries would you like to explore?</span>
          </label>
          <p className="text-xs font-serif-custom text-blue-200/80 mb-3">
            Choose a bite-sized inquiry count so your SchoolAI Space remains focused, deep, and engaging!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => {
                setSlideCount(3);
                setCustomSlideCount('3');
              }}
              className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                slideCount === 3
                  ? 'bg-purple-900/40 border-purple-400 text-white shadow-md ring-2 ring-purple-400/30'
                  : 'bg-[#0E2034] border-blue-400/20 text-blue-200 hover:border-blue-400/40'
              }`}
            >
              <div className="font-mono-custom font-bold text-lg text-purple-300">3 Inquiries</div>
              <div className="text-[11px] font-serif-custom text-purple-200/80">Quick Practice (10 min)</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setSlideCount(5);
                setCustomSlideCount('5');
              }}
              className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                slideCount === 5
                  ? 'bg-amber-900/40 border-amber-400 text-white shadow-md ring-2 ring-amber-400/30'
                  : 'bg-[#0E2034] border-blue-400/20 text-blue-200 hover:border-blue-400/40'
              }`}
            >
              <div className="font-mono-custom font-bold text-lg text-amber-300">5 Inquiries</div>
              <div className="text-[11px] font-serif-custom text-amber-200/80">⭐ Recommended</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setSlideCount(8);
                setCustomSlideCount('8');
              }}
              className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                slideCount === 8
                  ? 'bg-blue-900/40 border-blue-400 text-white shadow-md ring-2 ring-blue-400/30'
                  : 'bg-[#0E2034] border-blue-400/20 text-blue-200 hover:border-blue-400/40'
              }`}
            >
              <div className="font-mono-custom font-bold text-lg text-blue-300">8 Inquiries</div>
              <div className="text-[11px] font-serif-custom text-blue-200/80">Deep Inquiry</div>
            </button>

            <div className="p-2.5 rounded-xl border-2 border-blue-400/20 bg-[#0E2034] flex flex-col justify-center items-center">
              <label className="text-[11px] font-mono-custom text-blue-300 mb-1">Custom (3–10):</label>
              <input
                type="number"
                min="3"
                max="10"
                value={customSlideCount}
                onChange={(e) => {
                  setCustomSlideCount(e.target.value);
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val >= 3 && val <= 10) {
                    setSlideCount(val);
                  }
                }}
                className="w-16 text-center font-mono-custom font-bold bg-[#0B1A2C] text-white border border-blue-400/40 rounded py-1 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Optional Student Info */}
        <div className="pt-2 border-t border-blue-400/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono-custom text-xs text-blue-300 uppercase tracking-wide mb-1">
              Student Name:
            </label>
            <input
              type="text"
              value={initialStudentName}
              onChange={(e) => onUpdateStudentName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0B1A2C] border border-blue-400/30 font-serif-custom text-sm text-white focus:outline-none focus:border-blue-400"
              placeholder="e.g. Alex Chen"
            />
          </div>
          <div>
            <label className="block font-mono-custom text-xs text-blue-300 uppercase tracking-wide mb-1">
              Class / Section:
            </label>
            <input
              type="text"
              value={initialClassName}
              onChange={(e) => onUpdateClassName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0B1A2C] border border-blue-400/30 font-serif-custom text-sm text-white focus:outline-none focus:border-blue-400"
              placeholder="e.g. Grade 7 Science"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-900/40 border border-red-500/60 text-red-200 text-xs font-mono-custom">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Start Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full font-mono-custom text-base font-bold py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-[#0E1B1F] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#0E1B1F]" />
                <span>Calibrating SchoolAI Space ({slideCount} Inquiries) for "{topicInput.trim()}"...</span>
              </>
            ) : (
              <>
                <span>Launch SchoolAI Space ({slideCount} Inquiries)</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Past Sessions History (if any) */}
      {(pastSessions || []).length > 0 && (
        <div className="bg-[#112238]/60 border border-blue-400/20 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-mono-custom text-blue-300 uppercase font-bold mb-3">
            <History className="w-4 h-4 text-amber-300" />
            <span>Recent Practice Sessions</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(pastSessions || []).slice(0, 3).map((sess) => (
              <div key={sess.id} className="bg-[#0B1A2C]/80 p-3 rounded-lg border border-blue-400/10 text-xs">
                <div className="font-bold text-white truncate">{sess.topicTitle || 'Science Practice'}</div>
                <div className="text-blue-300 text-[11px] mt-0.5">{sess.studentName} · {sess.timestamp}</div>
                <div className="mt-1 flex items-center justify-between text-[11px] font-mono-custom text-amber-300">
                  <span>Score: {sess.grade}/8</span>
                  <span>{sess.exceedingCount} Exceeding</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
