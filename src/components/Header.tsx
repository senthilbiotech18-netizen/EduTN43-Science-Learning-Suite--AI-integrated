import React, { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, Volume2, VolumeX, Sparkles, Layers, GraduationCap, Download, Laptop, ChevronDown, KeyRound, School } from 'lucide-react';
import { Topic, TeacherAssignment } from '../types';

interface HeaderProps {
  topic: Topic;
  onOpenTopics: () => void;
  onOpenDiagrams: () => void;
  onReset: () => void;
  onNewSession?: () => void;
  speechEnabled: boolean;
  onToggleSpeech: () => void;
  currentSlide: number;
  totalSlides: number;
  showingSummary: boolean;
  className?: string;
  selectedLevel?: string;
  onSelectLevel?: (level: string) => void;
  onOpenApiKeyModal?: () => void;
  hasCustomApiKey?: boolean;
  onOpenTeacherModal?: () => void;
  activeAssignment?: TeacherAssignment | null;
}

export const Header: React.FC<HeaderProps> = ({
  topic,
  onOpenTopics,
  onOpenDiagrams,
  onReset,
  onNewSession,
  speechEnabled,
  onToggleSpeech,
  currentSlide,
  totalSlides,
  showingSummary,
  className = 'Science Explorer',
  selectedLevel = 'MYP 1–3 (Grade 6–8)',
  onSelectLevel,
  onOpenApiKeyModal,
  hasCustomApiKey = false,
  onOpenTeacherModal,
  activeAssignment = null,
}) => {
  const isCellTopic = topic.id.includes('cell');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User installed EduTN43 App');
      }
      setDeferredPrompt(null);
    } else {
      setShowInstallGuide(true);
    }
  };

  const isLowerGrade = !selectedLevel || selectedLevel.includes('PYP') || selectedLevel.includes('MYP 1') || selectedLevel.includes('MYP 2') || selectedLevel.includes('MYP 3') || selectedLevel.includes('Grade 6') || selectedLevel.includes('Grade 7') || selectedLevel.includes('Grade 8');

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-blue-400/20 pb-4 mb-6 relative">
      <div>
        {/* Brand Logo & Meta */}
        <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white px-3 py-1 rounded-lg shadow-md border border-blue-400/30">
            <GraduationCap className="w-5 h-5 text-blue-200" />
            <span className="font-mono-custom font-black text-lg tracking-wide text-white">
              Edu<span className="text-blue-300">TN43</span>
            </span>
          </div>

          <span className="text-[11px] font-mono-custom text-blue-100 font-semibold uppercase tracking-wider flex items-center gap-1.5 bg-blue-900/50 px-2.5 py-1 rounded border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-300 inline" />
            SCIENCE LEARNING SUITE
          </span>

          <span
            className="px-2.5 py-1 rounded text-[11px] font-mono-custom font-bold uppercase text-white shadow-sm"
            style={{ backgroundColor: topic.badgeColor || '#2563EB' }}
          >
            {topic.subject}
          </span>

          {/* Interactive Grade Level Selector Dropdown */}
          <div className="relative inline-block">
            <button
              onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
              className="px-2.5 py-1 rounded text-[11px] font-mono-custom font-bold uppercase bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
              title="Click to select student grade level scaffolding"
            >
              <BookOpen className="w-3 h-3 text-amber-300" />
              <span>Level: {selectedLevel}</span>
              <ChevronDown className="w-3 h-3 text-amber-300 ml-0.5" />
            </button>

            {isLevelDropdownOpen && (
              <div className="absolute left-0 mt-1 w-64 bg-[#112238] border border-blue-400/40 rounded-xl shadow-2xl p-2 z-50 text-xs font-mono-custom space-y-1">
                <div className="text-[10px] uppercase font-bold text-blue-300 px-2.5 py-1 border-b border-blue-400/20">
                  Select Grade Level Scaffolding
                </div>

                <button
                  onClick={() => {
                    if (onSelectLevel) onSelectLevel('MYP 1–3 (Grade 6–8)');
                    setIsLevelDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                    isLowerGrade ? 'bg-blue-600 text-white font-bold' : 'text-blue-100 hover:bg-blue-900/50'
                  }`}
                >
                  <div>
                    <div className="font-bold">MYP 1–3 (Grade 6–8)</div>
                    <div className="text-[10px] text-blue-200 font-serif-custom opacity-90">Max 5 follow-ups &amp; guided rectification</div>
                  </div>
                  {isLowerGrade && <span className="text-amber-300 font-bold">✓</span>}
                </button>

                <button
                  onClick={() => {
                    if (onSelectLevel) onSelectLevel('MYP 4–5 (Grade 9–10)');
                    setIsLevelDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                    !isLowerGrade ? 'bg-blue-600 text-white font-bold' : 'text-blue-100 hover:bg-blue-900/50'
                  }`}
                >
                  <div>
                    <div className="font-bold">MYP 4–5 (Grade 9–10)</div>
                    <div className="text-[10px] text-blue-200 font-serif-custom opacity-90">Full Socratic depth &amp; advanced rigor</div>
                  </div>
                  {!isLowerGrade && <span className="text-amber-300 font-bold">✓</span>}
                </button>
              </div>
            )}
          </div>
        </div>

        <h1 className="font-mono-custom text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight flex flex-wrap items-center gap-2">
          <span className="text-amber-300 font-extrabold text-xl md:text-2xl">Topic:</span>
          <span>{topic.title}</span>
        </h1>
        <p className="text-sm text-blue-100/80 italic font-serif-custom max-w-2xl">
          {topic.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {onOpenTeacherModal && (
          <button
            onClick={onOpenTeacherModal}
            className="font-mono-custom text-xs font-bold px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-blue-950 transition-all flex items-center gap-1.5 shadow-md border border-amber-300 cursor-pointer"
            title="Open Teacher Assignment Portal: Lock topics, set learning outcomes, and generate share links"
          >
            <School className="w-3.5 h-3.5 text-blue-950" />
            <span>{activeAssignment ? `Class Task: ${activeAssignment.code}` : 'Teacher Assign'}</span>
          </button>
        )}

        {!activeAssignment && onNewSession && (
          <button
            onClick={onNewSession}
            className="font-mono-custom text-xs font-bold px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#0E1B1F] transition-all flex items-center gap-1.5 shadow-md border border-amber-300 cursor-pointer"
            title="Choose or type a new topic to study"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New / Change Topic</span>
          </button>
        )}

        {onOpenApiKeyModal && (
          <button
            onClick={onOpenApiKeyModal}
            className={`font-mono-custom text-xs font-bold px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-md border cursor-pointer ${
              hasCustomApiKey
                ? 'bg-amber-500 hover:bg-amber-400 text-blue-950 border-amber-300 ring-2 ring-amber-400/40'
                : 'bg-blue-900/60 hover:bg-blue-800/80 text-blue-100 border-blue-400/40'
            }`}
            title={hasCustomApiKey ? 'Custom Gemini API Key is active. Click to manage.' : 'Enter your own Google Gemini API key'}
          >
            <KeyRound className={`w-3.5 h-3.5 ${hasCustomApiKey ? 'text-blue-950' : 'text-amber-300'}`} />
            <span>{hasCustomApiKey ? 'API Key (Active)' : 'API Key'}</span>
          </button>
        )}

        <button
          onClick={handleInstallClick}
          className="font-mono-custom text-xs font-bold px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1.5 shadow-md border border-emerald-400/40 cursor-pointer"
          title="Download & Install EduTN43 Desktop/Chromebook App"
        >
          <Download className="w-4 h-4 text-emerald-200" />
          <span>Chromebook App</span>
        </button>

        {!activeAssignment && (
          <button
            onClick={onOpenTopics}
            className="font-mono-custom text-xs font-bold px-3.5 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-md border border-blue-300/30"
            title="Switch Subject or Topic"
          >
            <Layers className="w-4 h-4" />
            Browse Topics
          </button>
        )}

        {isCellTopic && (
          <button
            onClick={onOpenDiagrams}
            className="font-mono-custom text-xs font-semibold px-3 py-2 rounded-lg bg-blue-900/60 border border-blue-400/40 text-blue-100 hover:bg-blue-800/80 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Open Interactive Cell Reference Visualizer"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-300" />
            Cell Visualizer
          </button>
        )}

        <button
          onClick={onToggleSpeech}
          className={`font-mono-custom text-xs font-semibold px-2.5 py-2 rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
            speechEnabled
              ? 'bg-emerald-600/30 border-emerald-400/60 text-emerald-200'
              : 'bg-white/10 border-white/20 text-blue-100 hover:bg-white/20'
          }`}
          title={speechEnabled ? 'Read prompt aloud is ON' : 'Read prompt aloud is OFF'}
        >
          {speechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          {speechEnabled ? 'Audio On' : 'Audio Off'}
        </button>

        <button
          onClick={onReset}
          className="font-mono-custom text-xs text-blue-200/80 hover:text-white px-2.5 py-2 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
          title="Reset current topic practice"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset
        </button>

        <div className="font-mono-custom text-xs text-blue-200 text-right leading-tight bg-blue-950/60 px-3 py-1.5 rounded-lg border border-blue-400/30 hidden sm:block">
          <div className="text-blue-300 font-bold">EduTN43 CERTIFIED</div>
          <div className="text-[10px] text-blue-100/70">Criterion A Assessment</div>
        </div>
      </div>

      {/* Chromebook / Desktop Installation Guide Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#112238] border border-blue-400/40 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-blue-400/20 pb-3">
              <div className="p-2.5 bg-blue-600 rounded-xl">
                <Laptop className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-mono-custom text-lg font-bold">EduTN43 Chromebook &amp; PC App</h3>
                <p className="text-xs text-blue-200">Install as standalone app with offline support</p>
              </div>
            </div>

            <div className="space-y-2 text-xs font-serif-custom text-blue-100/90 leading-relaxed bg-blue-950/50 p-3.5 rounded-xl border border-blue-400/20">
              <p className="font-bold text-blue-300 font-mono-custom">How to install on Chromebook / Desktop Chrome:</p>
              <ol className="list-decimal list-inside space-y-1.5 pl-1">
                <li>Click the <strong>Install Icon</strong> (<Download className="w-3 h-3 inline text-emerald-400" />) in your browser address bar at the top right.</li>
                <li>Or open Chrome Menu (<strong>⋮</strong>) &rarr; <strong>"Save and share"</strong> &rarr; <strong>"Install EduTN43 Science Learning Suite"</strong>.</li>
                <li>The EduTN43 app will open in its own dedicated window and launch directly from your Chromebook shelf or desktop launcher offline!</li>
              </ol>
            </div>

            <button
              onClick={() => setShowInstallGuide(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono-custom font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

