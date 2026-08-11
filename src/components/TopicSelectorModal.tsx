import React, { useState } from 'react';
import { TOPICS } from '../data/topics';
import { Topic, SubjectType } from '../types';
import {
  X,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Search,
  Atom,
  Dna,
  Zap,
  Leaf,
  FlaskConical,
  Microscope,
  Layers,
  GraduationCap
} from 'lucide-react';

interface TopicSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTopic: Topic;
  onSelectTopic: (topic: Topic) => void;
  selectedLevel?: string;
  onSelectLevel?: (level: string) => void;
}

export const TopicSelectorModal: React.FC<TopicSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedTopic,
  onSelectTopic,
  selectedLevel = 'MYP 1–3 (Grade 6–8)',
  onSelectLevel,
}) => {
  const [activeSubject, setActiveSubject] = useState<SubjectType | 'All'>('All');
  const [activeLevelFilter, setActiveLevelFilter] = useState<'All' | 'MYP 1-3' | 'MYP 4-5'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const subjects: (SubjectType | 'All')[] = ['All', 'Biology', 'Chemistry', 'Physics', 'Environmental Science'];

  const filteredTopics = TOPICS.filter((t) => {
    const matchesSubject = activeSubject === 'All' || t.subject === activeSubject;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.level.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const getSubjectIcon = (subj: SubjectType) => {
    switch (subj) {
      case 'Biology':
        return <Dna className="w-4 h-4 text-[#48BB78]" />;
      case 'Chemistry':
        return <FlaskConical className="w-4 h-4 text-[#DD6B20]" />;
      case 'Physics':
        return <Zap className="w-4 h-4 text-[#3182CE]" />;
      case 'Environmental Science':
        return <Leaf className="w-4 h-4 text-[#38A169]" />;
      default:
        return <Atom className="w-4 h-4 text-[#E0AD63]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-[#112238] text-white rounded-2xl shadow-2xl max-w-4xl w-full border border-blue-400/30 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#0B192C] p-5 flex items-center justify-between border-b border-blue-400/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono-custom font-black text-sm text-blue-300 tracking-wider uppercase flex items-center gap-1.5 bg-blue-900/60 px-2.5 py-0.5 rounded border border-blue-400/30">
                <GraduationCap className="w-4 h-4 text-blue-300" />
                EduTN43 SCIENCE PRACTICE SUITE
              </span>
            </div>
            <h2 className="font-mono-custom text-xl md:text-2xl font-bold text-white">
              Select Science Subject &amp; Practice Topic
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grade Level Selection Banner */}
        <div className="bg-[#0E1B1F] p-4 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#E0AD63]" />
            <div>
              <span className="font-mono-custom text-xs font-bold text-[#E0AD63] uppercase tracking-wide block">
                Target Grade Level Scaffolding:
              </span>
              <span className="text-[11px] font-serif-custom text-[#9FB0B6]">
                Controls follow-up question limits and hint depth for student practice.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono-custom text-xs w-full md:w-auto">
            <button
              onClick={() => onSelectLevel && onSelectLevel('MYP 1–3 (Grade 6–8)')}
              className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg border font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedLevel.includes('MYP 1') || selectedLevel.includes('Grade 6') || selectedLevel.includes('MYP 2') || selectedLevel.includes('MYP 3')
                  ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/30'
                  : 'bg-white/5 text-[#9FB0B6] border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>🟢 MYP 1–3 (Grade 6–8)</span>
              <span className="text-[10px] bg-blue-900/60 text-blue-200 px-1.5 py-0.5 rounded ml-1">Max 5 Follow-ups</span>
            </button>

            <button
              onClick={() => onSelectLevel && onSelectLevel('MYP 4–5 (Grade 9–10)')}
              className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg border font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedLevel.includes('MYP 4') || selectedLevel.includes('Grade 9') || selectedLevel.includes('MYP 5')
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-400/30'
                  : 'bg-white/5 text-[#9FB0B6] border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>🟦 MYP 4–5 (Grade 9–10)</span>
              <span className="text-[10px] bg-indigo-900/60 text-indigo-200 px-1.5 py-0.5 rounded ml-1">Advanced Rigor</span>
            </button>
          </div>
        </div>

        {/* Search & Subject Filter Bar */}
        <div className="p-5 border-b border-white/10 bg-[#122229]/60 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Subject Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 font-mono-custom text-xs">
              {subjects.map((subj) => (
                <button
                  key={subj}
                  onClick={() => setActiveSubject(subj)}
                  className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeSubject === subj
                      ? 'bg-[#2C5F8A] text-white font-bold border border-[#4F8FC7]/50 shadow-sm'
                      : 'bg-white/5 text-[#9FB0B6] hover:bg-white/10 hover:text-white border border-transparent'
                  }`}
                >
                  {subj !== 'All' && getSubjectIcon(subj)}
                  <span>{subj}</span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9FB0B6]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics or levels..."
                className="w-full bg-[#0E1B1F] text-xs font-mono-custom text-white pl-9 pr-3 py-2 rounded-lg border border-white/15 focus:outline-none focus:border-[#E0AD63]"
              />
            </div>
          </div>
        </div>

        {/* Topic Grid */}
        <div className="p-5 md:p-6 max-h-[60vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTopics.map((topic) => {
            const isSelected = selectedTopic.id === topic.id;
            return (
              <div
                key={topic.id}
                onClick={() => {
                  onSelectTopic(topic);
                  onClose();
                }}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#2C5F8A]/40 border-[#E0AD63] ring-2 ring-[#E0AD63]/30 shadow-lg'
                    : 'bg-[#122229]/80 border-white/10 hover:border-white/30 hover:bg-[#122229]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-mono-custom font-bold uppercase text-white shadow-sm flex items-center gap-1"
                        style={{ backgroundColor: topic.badgeColor }}
                      >
                        {getSubjectIcon(topic.subject)}
                        {topic.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-custom font-bold uppercase bg-white/10 text-[#E0AD63] border border-white/15 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        {topic.level}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono-custom text-[#9FB0B6] bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      {topic.questions.length} Slides
                    </span>
                  </div>

                  <h3 className="font-mono-custom text-base font-bold text-white mb-1 flex items-center justify-between">
                    <span>{topic.title}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-[#E0AD63] shrink-0" />}
                  </h3>

                  <p className="font-serif-custom text-xs text-[#9FB0B6] leading-relaxed">
                    {topic.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono-custom">
                  <span className="text-[11px] text-[#8FBF7F] italic">
                    AI Socratic Scaffolding Enabled
                  </span>
                  <button
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#E0AD63] text-[#0E1B1F]'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {isSelected ? 'Active Topic' : 'Select Topic'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#0E1B1F] p-4 border-t border-white/10 flex items-center justify-between text-xs font-mono-custom text-[#9FB0B6]">
          <span>
            Showing {filteredTopics.length} available science topics (12 slides standard)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
