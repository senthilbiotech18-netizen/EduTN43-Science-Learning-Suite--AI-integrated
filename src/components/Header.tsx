import React, { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, Volume2, VolumeX, Sparkles, Layers, GraduationCap, Download, Laptop } from 'lucide-react';
import { Topic } from '../types';

interface HeaderProps {
  topic: Topic;
  onOpenTopics: () => void;
  onOpenDiagrams: () => void;
  onReset: () => void;
  speechEnabled: boolean;
  onToggleSpeech: () => void;
  currentSlide: number;
  totalSlides: number;
  showingSummary: boolean;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  topic,
  onOpenTopics,
  onOpenDiagrams,
  onReset,
  speechEnabled,
  onToggleSpeech,
  currentSlide,
  totalSlides,
  showingSummary,
  className = 'Science Explorer',
}) => {
  const isCellTopic = topic.id.includes('cell');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

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
          <span className="px-2.5 py-1 rounded text-[11px] font-mono-custom font-bold uppercase bg-white/10 text-blue-200 border border-blue-300/20 flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {topic.level || 'PYP to MYP 5'}
          </span>
        </div>

        <h1 className="font-mono-custom text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight flex items-center gap-2">
          {topic.title}
        </h1>
        <p className="text-sm text-blue-100/80 italic font-serif-custom max-w-2xl">
          {topic.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={handleInstallClick}
          className="font-mono-custom text-xs font-bold px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1.5 shadow-md border border-emerald-400/40 cursor-pointer animate-pulse hover:animate-none"
          title="Download & Install EduTN43 Desktop/Chromebook App"
        >
          <Download className="w-4 h-4 text-emerald-200" />
          <span>Download Chromebook App</span>
        </button>

        <button
          onClick={onOpenTopics}
          className="font-mono-custom text-xs font-bold px-3.5 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-md border border-blue-300/30"
          title="Switch Subject or Topic"
        >
          <Layers className="w-4 h-4" />
          Select Topic / Grade
        </button>

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

