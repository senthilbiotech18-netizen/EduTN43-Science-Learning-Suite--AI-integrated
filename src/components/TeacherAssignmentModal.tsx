import React, { useState } from 'react';
import { TeacherAssignment, Topic } from '../types';
import { TOPICS, getOrCreateTopic } from '../data/topics';
import {
  saveNewAssignment,
  createAssignmentShareUrl,
  loadSavedAssignments,
} from '../utils/assignmentManager';
import {
  X,
  Target,
  Plus,
  Trash2,
  Share2,
  Copy,
  Check,
  Shield,
  Lock,
  Sparkles,
  School,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface TeacherAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTopic: Topic;
  onLaunchAssignment: (assignment: TeacherAssignment) => void;
}

export const TeacherAssignmentModal: React.FC<TeacherAssignmentModalProps> = ({
  isOpen,
  onClose,
  currentTopic,
  onLaunchAssignment,
}) => {
  const [assignmentsList, setAssignmentsList] = useState<TeacherAssignment[]>(() => loadSavedAssignments());
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');

  // Form State
  const [title, setTitle] = useState(
    `Class Assignment: ${currentTopic.title}`
  );
  const [className, setClassName] = useState('Grade 8 Biology - Section A');
  const [teacherName, setTeacherName] = useState('Dr. Senthil Kumar');
  const [selectedTopicId, setSelectedTopicId] = useState(currentTopic.id);
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  const [customTopicName, setCustomTopicName] = useState('');
  const [level, setLevel] = useState(currentTopic.level);
  const [code, setCode] = useState(() => `TASK-${Math.floor(100 + Math.random() * 900)}`);
  const [disableTabSwitch, setDisableTabSwitch] = useState(true);
  const [disableCopyPaste, setDisableCopyPaste] = useState(true);

  // Suggested default learning outcomes based on the topic
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([
    `Accurately define and explain key concepts in ${currentTopic.title}.`,
    `Apply scientific vocabulary to solve unfamiliar and real-world biological scenarios.`,
    `Evaluate cause-and-effect relationships with Criterion A precision.`,
    `Demonstrate 100% scientific spelling accuracy on biological terminology.`,
  ]);
  const [newOutcomeInput, setNewOutcomeInput] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddOutcome = () => {
    if (!newOutcomeInput.trim()) return;
    setLearningOutcomes([...learningOutcomes, newOutcomeInput.trim()]);
    setNewOutcomeInput('');
  };

  const handleRemoveOutcome = (index: number) => {
    setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
  };

  const handleTopicChange = (topicId: string) => {
    if (topicId === '__custom__') {
      setIsCustomTopic(true);
      setSelectedTopicId('__custom__');
      setTitle(customTopicName ? `Class Assignment: ${customTopicName}` : 'Class Assignment: Science Inquiry');
      return;
    }
    setIsCustomTopic(false);
    setSelectedTopicId(topicId);
    const found = TOPICS.find((t) => t.id === topicId);
    if (found) {
      setLevel(found.level);
      setTitle(`Class Assignment: ${found.title}`);
      setLearningOutcomes([
        `Accurately define and outline core principles of ${found.title}.`,
        `Apply scientific terminology to explain mechanisms and functions.`,
        `Exceed basic recall through high-level Socratic reasoning and justifications.`,
        `Demonstrate precision in scientific spelling and biological keywords.`,
      ]);
    }
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCustom = customTopicName.trim();
    const topicObj = isCustomTopic && cleanCustom
      ? getOrCreateTopic(undefined, cleanCustom, level)
      : (TOPICS.find((t) => t.id === selectedTopicId) || currentTopic);

    const assignment: TeacherAssignment = {
      id: `asg-${Date.now()}`,
      code: code.trim().toUpperCase(),
      title: title.trim(),
      className: className.trim(),
      teacherName: teacherName.trim(),
      topicId: topicObj.id,
      topicTitle: topicObj.title,
      level,
      learningOutcomes: learningOutcomes.filter((o) => o.trim().length > 0),
      instructions: 'Complete all slides. Direct typing required. Tab switching and copy-pasting are strictly monitored.',
      antiCheat: {
        disableCopyPaste,
        disableTabSwitch,
        maxViolationsAllowed: 5,
      },
      createdAt: new Date().toISOString(),
    };

    const updated = saveNewAssignment(assignment);
    setAssignmentsList(updated);
    onLaunchAssignment(assignment);
    onClose();
  };

  const handleCopy = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    } else {
      setCopiedLink(text);
      setTimeout(() => setCopiedLink(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#112238] border-2 border-amber-400/80 rounded-2xl max-w-3xl w-full text-white shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 bg-[#0C1A2E] border-b border-amber-400/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-blue-950 flex items-center justify-center font-bold shadow-md">
              <School className="w-6 h-6 text-blue-950" />
            </div>
            <div>
              <h2 className="text-xl font-mono-custom font-bold text-white flex items-center gap-2">
                Teacher Assignment &amp; Class Task Portal
              </h2>
              <p className="text-xs font-serif-custom text-blue-200">
                Lock a specific topic, configure mandatory learning outcomes, and enforce tab-switch/paste security for your class.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-blue-400/20 bg-[#0E1E33] px-5 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 text-xs font-mono-custom font-bold rounded-t-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'create'
                ? 'bg-[#112238] text-amber-300 border-t-2 border-x-2 border-amber-400/80'
                : 'text-blue-300 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Create New Class Assignment
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 text-xs font-mono-custom font-bold rounded-t-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'manage'
                ? 'bg-[#112238] text-amber-300 border-t-2 border-x-2 border-amber-400/80'
                : 'text-blue-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Manage &amp; Share Saved Assignments ({assignmentsList.length})
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'create' ? (
            <form onSubmit={handleCreateAssignment} className="space-y-5">
              {/* Row 1: Class, Teacher & Task Code */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono-custom font-bold text-amber-300 uppercase mb-1">
                    Target Class / Section *
                  </label>
                  <input
                    type="text"
                    required
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="e.g. Grade 9 Biology - MYP 4"
                    className="w-full px-3 py-2 rounded-lg bg-[#0C1A2E] border border-blue-400/40 text-sm text-white font-serif-custom focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-custom font-bold text-amber-300 uppercase mb-1">
                    Teacher Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="e.g. Dr. Senthil Kumar"
                    className="w-full px-3 py-2 rounded-lg bg-[#0C1A2E] border border-blue-400/40 text-sm text-white font-serif-custom focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-custom font-bold text-amber-300 uppercase mb-1">
                    Assignment PIN / Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. BIO-7B"
                    className="w-full px-3 py-2 rounded-lg bg-[#0C1A2E] border border-blue-400/40 text-sm font-mono-custom font-bold text-amber-300 tracking-wider focus:ring-2 focus:ring-amber-400 outline-none uppercase"
                  />
                </div>
              </div>

              {/* Row 2: Selected Topic & Scaffolding Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-custom font-bold text-blue-200 uppercase mb-1">
                    Assigned Topic Deck *
                  </label>
                  <select
                    value={selectedTopicId}
                    onChange={(e) => handleTopicChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0C1A2E] border border-blue-400/40 text-sm text-white font-serif-custom focus:ring-2 focus:ring-amber-400 outline-none"
                  >
                    <option value="__custom__">✍️ Custom Topic (Enter your own topic)...</option>
                    {TOPICS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.subject}: {t.title} ({t.level})
                      </option>
                    ))}
                  </select>

                  {isCustomTopic && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={customTopicName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomTopicName(val);
                          setTitle(`Class Assignment: ${val}`);
                        }}
                        placeholder="Type any science curriculum topic..."
                        required
                        className="w-full px-3 py-1.5 rounded-lg bg-[#081322] border border-cyan-400/50 text-sm text-cyan-200 placeholder-blue-300/40 focus:ring-2 focus:ring-cyan-400 outline-none font-serif-custom"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono-custom font-bold text-blue-200 uppercase mb-1">
                    Scaffolding Grade Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0C1A2E] border border-blue-400/40 text-sm text-white font-serif-custom focus:ring-2 focus:ring-amber-400 outline-none"
                  >
                    <option value="MYP 1–3 (Grade 6–8)">MYP 1–3 (Grade 6–8) — Max 5 Follow-ups</option>
                    <option value="MYP 4–5 (Grade 9–10)">MYP 4–5 (Grade 9–10) — Advanced Rigor</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Assignment Title */}
              <div>
                <label className="block text-xs font-mono-custom font-bold text-blue-200 uppercase mb-1">
                  Assignment Title Displayed to Students
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Unit 2: Plant vs Animal Cell Mastery"
                  className="w-full px-3 py-2 rounded-lg bg-[#0C1A2E] border border-blue-400/40 text-sm text-white font-serif-custom focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>

              {/* Row 4: Configured Learning Outcomes */}
              <div className="p-4 rounded-xl bg-[#0C1A2E] border border-blue-400/30">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono-custom font-bold text-amber-300 uppercase flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-amber-400" />
                    Pinned Learning Outcomes (Shown at Top of Every Student Slide)
                  </label>
                  <span className="text-[11px] font-mono-custom text-blue-300">
                    {learningOutcomes.length} outcomes configured
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  {learningOutcomes.map((outcome, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[#11243B] border border-blue-400/20 text-xs font-serif-custom"
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-mono-custom font-bold text-amber-300 shrink-0">
                          LO{idx + 1}:
                        </span>
                        <span className="text-blue-100">{outcome}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveOutcome(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1 shrink-0 cursor-pointer"
                        title="Remove this outcome"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOutcomeInput}
                    onChange={(e) => setNewOutcomeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddOutcome();
                      }
                    }}
                    placeholder="Add another specific learning outcome for this task..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#11243B] border border-blue-400/30 text-xs text-white font-serif-custom focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddOutcome}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono-custom font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>

              {/* Row 5: Anti-Cheat & Assessment Integrity Locks */}
              <div className="p-4 rounded-xl bg-amber-950/20 border-2 border-amber-500/40">
                <h4 className="text-xs font-mono-custom font-bold text-amber-300 uppercase flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  Anti-Cheat &amp; Assessment Integrity Controls
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-2.5 rounded-lg bg-[#0C1A2E]/80 border border-amber-400/30 cursor-pointer hover:bg-[#0C1A2E]">
                    <input
                      type="checkbox"
                      checked={disableTabSwitch}
                      onChange={(e) => setDisableTabSwitch(e.target.checked)}
                      className="w-4 h-4 accent-amber-400 rounded"
                    />
                    <div>
                      <div className="text-xs font-mono-custom font-bold text-white">
                        Disable &amp; Monitor Tab Switching
                      </div>
                      <div className="text-[11px] font-serif-custom text-blue-200">
                        Tracks and warns when students leave or switch browser tabs.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-2.5 rounded-lg bg-[#0C1A2E]/80 border border-amber-400/30 cursor-pointer hover:bg-[#0C1A2E]">
                    <input
                      type="checkbox"
                      checked={disableCopyPaste}
                      onChange={(e) => setDisableCopyPaste(e.target.checked)}
                      className="w-4 h-4 accent-amber-400 rounded"
                    />
                    <div>
                      <div className="text-xs font-mono-custom font-bold text-white">
                        Disable Copy &amp; Paste
                      </div>
                      <div className="text-[11px] font-serif-custom text-blue-200">
                        Prevents pasting from external websites or AI prompts.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit / Launch Button */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 font-mono-custom text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-blue-950 font-mono-custom font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  Assign &amp; Launch Task For Class
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-serif-custom text-blue-200">
                Share any of these assignments with your class. When students open the link or enter the code, they will be locked into the exact topic with your pinned learning outcomes.
              </p>

              {assignmentsList.map((asg) => {
                const shareUrl = createAssignmentShareUrl(asg);
                return (
                  <div
                    key={asg.id}
                    className="p-4 rounded-xl bg-[#0C1A2E] border border-amber-400/40 shadow-md space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-1 rounded bg-amber-500 text-blue-950 font-mono-custom text-xs font-black uppercase">
                          {asg.code}
                        </span>
                        <h3 className="font-mono-custom font-bold text-sm text-white">
                          {asg.title}
                        </h3>
                      </div>
                      <span className="text-xs font-mono-custom bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded border border-blue-400/30">
                        {asg.className}
                      </span>
                    </div>

                    <div className="text-xs font-serif-custom text-blue-200">
                      Topic: <strong className="text-white">{asg.topicTitle}</strong> ({asg.level})
                    </div>

                    <div className="bg-[#11243B] p-2.5 rounded-lg border border-blue-400/20 text-xs font-serif-custom space-y-1">
                      <div className="font-mono-custom text-[11px] text-amber-300 font-bold">
                        {asg.learningOutcomes.length} Assigned Learning Outcomes:
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-blue-100">
                        {asg.learningOutcomes.slice(0, 2).map((lo, i) => (
                          <li key={i} className="truncate">{lo}</li>
                        ))}
                        {asg.learningOutcomes.length > 2 && (
                          <li className="text-blue-300 italic">+{asg.learningOutcomes.length - 2} more outcomes</li>
                        )}
                      </ul>
                    </div>

                    {/* Action buttons: Copy Link, Copy Code, Launch */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(asg.code, 'code')}
                          className="px-3 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white border border-blue-400/30 font-mono-custom text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedCode === asg.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode === asg.code ? 'Code Copied!' : `Copy Code (${asg.code})`}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopy(shareUrl, 'link')}
                          className="px-3 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white border border-blue-400/30 font-mono-custom text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedLink === shareUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                          <span>{copiedLink === shareUrl ? 'Direct Link Copied!' : 'Copy Direct Link'}</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onLaunchAssignment(asg);
                          onClose();
                        }}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono-custom font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer ml-auto"
                      >
                        <span>Start Task View</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
