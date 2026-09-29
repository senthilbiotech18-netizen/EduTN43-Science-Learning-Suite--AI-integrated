import React, { useState, useEffect } from 'react';
import { TOPICS, getOrCreateTopic } from './data/topics';
import {
  SlideAnswerState,
  DialogueTurn,
  DepthLevel,
  PastSessionRecord,
  Topic,
  TeacherAssignment,
  StudentRecord,
  StudentSubmission,
  ScaffoldStage,
  PortalMode,
} from './types';
import { Header } from './components/Header';
import { SlideRack } from './components/SlideRack';
import { SlideCard } from './components/SlideCard';
import { SessionSummary } from './components/SessionSummary';
import { CellDiagramModal } from './components/CellDiagramModal';
import { TopicSelectorModal } from './components/TopicSelectorModal';
import { TopicSetupDashboard } from './components/TopicSetupDashboard';
import { ApiKeyModal } from './components/ApiKeyModal';
import { TeacherAssignmentModal } from './components/TeacherAssignmentModal';
import { AssignedTaskBanner } from './components/AssignedTaskBanner';
import { PortalNavigation } from './components/PortalNavigation';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { StudentPortfolio } from './components/StudentPortfolio';
import {
  listenToAssignments,
  listenToStudents,
  listenToAllSubmissions,
  saveSubmission,
} from './utils/firebaseService';
import {
  loadStoredStudentName,
  saveStoredStudentName,
  loadStoredClassName,
  saveStoredClassName,
  loadStoredTopicId,
  saveStoredTopicId,
  loadStoredAnswers,
  saveStoredAnswers,
  loadPastSessions,
  savePastSessions,
  calculateCriterionAGrade,
  loadStoredApiKey,
  saveStoredApiKey,
} from './utils/storage';
import { evaluateAnswerOffline } from './utils/offlineEvaluator';
import {
  loadActiveAssignment,
  setActiveAssignment,
  parseAssignmentFromUrl,
} from './utils/assignmentManager';

const INITIAL_SLIDE_STATE: SlideAnswerState = {
  history: [],
  currentInput: '',
  highestDepth: null,
  isChecking: false,
  error: null,
  exceedingAchieved: false,
};

const DEPTH_RANK: Record<DepthLevel, number> = {
  surface: 1,
  developing: 2,
  secure: 3,
  extending: 4,
};

export default function App() {
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(() => loadStoredTopicId('1-classification-living-organisms'));
  const [selectedLevel, setSelectedLevel] = useState<string>(() => {
    return localStorage.getItem('edutn43_level') || 'MYP 1–3 (Grade 6–8)';
  });

  // Portal Navigation & Multi-Role State
  const queryParams = new URLSearchParams(window.location.search);
  const initialPortalParam = queryParams.get('portal') as PortalMode | null;
  const initialStudentIdParam = queryParams.get('studentId') || 'GSIS-2024-001';
  const initialStudentNameParam = queryParams.get('name') || '';
  const initialClassParam = queryParams.get('class') || '';

  const [portalMode, setPortalMode] = useState<PortalMode>(() => {
    if (initialPortalParam) return initialPortalParam;
    return 'teacher';
  });
  const [currentStudentId, setCurrentStudentId] = useState<string>(initialStudentIdParam);
  const [activeScaffoldStage, setActiveScaffoldStage] = useState<ScaffoldStage | null>(null);

  // Firestore real-time synchronized collections
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);

  useEffect(() => {
    const unsubAsg = listenToAssignments(setAssignments);
    const unsubStu = listenToStudents((loadedStudents) => {
      setStudents(loadedStudents);
      const urlParams = new URLSearchParams(window.location.search);
      const sId = urlParams.get('studentId');
      if (sId) {
        const found = loadedStudents.find(
          (s) => s.studentId.trim().toLowerCase() === sId.trim().toLowerCase()
        );
        if (found) {
          setCurrentStudentId(found.studentId);
          if (!urlParams.get('name')) setStudentName(found.name);
          if (!urlParams.get('class')) setClassName(found.className);
        }
      }
    });
    const unsubSub = listenToAllSubmissions(setSubmissions);
    return () => {
      unsubAsg();
      unsubStu();
      unsubSub();
    };
  }, []);

  // Sync portal mode to URL
  const handleSwitchPortal = (mode: PortalMode) => {
    setPortalMode(mode);
    const url = new URL(window.location.href);
    url.searchParams.set('portal', mode);
    if (mode === 'portfolio' || mode === 'student') {
      url.searchParams.set('studentId', currentStudentId);
    }
    window.history.replaceState({}, '', url.toString());
  };

  const handleDeleteStudent = (student: StudentRecord) => {
    const normId = student.studentId.trim().toLowerCase();
    const normClass = (student.className || '').trim().toLowerCase();
    setStudents((prev) =>
      prev.filter((s) => {
        const sId = s.studentId.trim().toLowerCase();
        const sClass = (s.className || '').trim().toLowerCase();
        const sDocId = s.id ? s.id.trim().toLowerCase() : '';
        const targetDocId = student.id ? student.id.trim().toLowerCase() : '';
        if (sDocId && targetDocId && sDocId === targetDocId) return false;
        if (sId === normId && sClass === normClass) return false;
        return true;
      })
    );
  };

  const handleUpdateStudentCredentials = (name: string, cls: string, id: string) => {
    setStudentName(name);
    setClassName(cls);
    setCurrentStudentId(id);
    const url = new URL(window.location.href);
    url.searchParams.set('studentId', id);
    url.searchParams.set('name', name);
    url.searchParams.set('class', cls);
    window.history.replaceState({}, '', url.toString());
  };

  // Teacher Assignment & Anti-Cheat state
  const [activeAssignment, setActiveAssignmentState] = useState<TeacherAssignment | null>(() => {
    const urlAssignment = parseAssignmentFromUrl();
    if (urlAssignment) return urlAssignment;
    return loadActiveAssignment();
  });
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [tabSwitchCount, setTabSwitchCount] = useState<number>(0);
  const [copyPasteAttemptCount, setCopyPasteAttemptCount] = useState<number>(0);
  const [integrityWarning, setIntegrityWarning] = useState<string | null>(null);

  const [currentTopic, setCurrentTopic] = useState<Topic>(() => {
    const urlAssignment = parseAssignmentFromUrl();
    if (urlAssignment) {
      const foundTopic = getOrCreateTopic(urlAssignment.topicId, urlAssignment.topicTitle, urlAssignment.level);
      if (foundTopic) return foundTopic;
    }
    const found = TOPICS.find((t) => t.id === loadStoredTopicId('1-classification-living-organisms'));
    return found || TOPICS[0];
  });

  const activeTopic: Topic = currentTopic;
  const questions = activeTopic.questions;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [studentName, setStudentName] = useState<string>(() => {
    if (initialStudentNameParam) return initialStudentNameParam;
    return loadStoredStudentName('Rahul Sharma');
  });
  const [className, setClassName] = useState<string>(() => {
    if (initialClassParam) return initialClassParam;
    const urlAssignment = parseAssignmentFromUrl();
    if (urlAssignment) return urlAssignment.className;
    return loadStoredClassName('Grade 8A');
  });
  const [answers, setAnswers] = useState<SlideAnswerState[]>(() =>
    loadStoredAnswers(activeTopic.id, questions.length)
  );
  const [pastSessions, setPastSessions] = useState<PastSessionRecord[]>(() => loadPastSessions());
  const [showingSummary, setShowingSummary] = useState<boolean>(false);
  const [isDiagramOpen, setIsDiagramOpen] = useState<boolean>(false);
  const [isTopicSelectorOpen, setIsTopicSelectorOpen] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>(() => loadStoredApiKey());
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    saveStoredApiKey(key);
  };

  const currentQuestion = questions[currentIndex] || questions[0];
  const currentAnswerState = answers[currentIndex] || INITIAL_SLIDE_STATE;

  const handleSelectLevel = (newLevel: string) => {
    setSelectedLevel(newLevel);
    localStorage.setItem('edutn43_level', newLevel);
  };

  // Launch a teacher assignment
  const handleLaunchAssignment = (assignment: TeacherAssignment) => {
    setActiveAssignment(assignment);
    setActiveAssignmentState(assignment);
    setClassName(assignment.className);
    setTabSwitchCount(0);
    setCopyPasteAttemptCount(0);

    const foundTopic = getOrCreateTopic(assignment.topicId, assignment.topicTitle, assignment.level);
    const targetTopic = foundTopic || currentTopic;

    saveStoredAnswers(currentTopic.id, answers);
    setCurrentTopic(targetTopic);
    setSelectedTopicId(targetTopic.id);
    saveStoredTopicId(targetTopic.id);
    setSelectedLevel(assignment.level);
    localStorage.setItem('edutn43_level', assignment.level);

    const loadedNewAnswers = Array.from({ length: targetTopic.questions.length }, () => ({ ...INITIAL_SLIDE_STATE }));
    setAnswers(loadedNewAnswers);
    setCurrentIndex(0);
    setShowingSummary(false);
    setIsSessionActive(true);
  };

  // Exit an active teacher assignment
  const handleExitAssignment = () => {
    if (window.confirm('Exit assigned class task mode? This will return to the general topic setup dashboard.')) {
      setActiveAssignment(null);
      setActiveAssignmentState(null);
      setActiveScaffoldStage(null);
      setIsSessionActive(false);
      setPortalMode('student');
    }
  };

  // Launch a specific scaffold task from Student Dashboard
  const handleStartScaffoldTask = (
    assignment: TeacherAssignment,
    scaffold: ScaffoldStage,
    topic: Topic
  ) => {
    setActiveAssignment(assignment);
    setActiveAssignmentState(assignment);
    setActiveScaffoldStage(scaffold);
    setClassName(assignment.className);
    setTabSwitchCount(0);
    setCopyPasteAttemptCount(0);

    saveStoredAnswers(currentTopic.id, answers);
    setCurrentTopic(topic);
    setSelectedTopicId(topic.id);
    saveStoredTopicId(topic.id);
    setSelectedLevel(assignment.level);
    localStorage.setItem('edutn43_level', assignment.level);

    const loadedNewAnswers = Array.from({ length: topic.questions.length }, () => ({ ...INITIAL_SLIDE_STATE }));
    setAnswers(loadedNewAnswers);
    setCurrentIndex(0);
    setShowingSummary(false);
    setIsSessionActive(true);
    setPortalMode('learning');
  };

  // Save student's completed scaffold work to Firebase Firestore
  const handleSaveToFirebase = async () => {
    const gradeResult = calculateCriterionAGrade(answers);
    const grade = gradeResult.grade;
    const exceedingCount = answers.filter((a) => a.highestDepth === 'extending').length;
    const totalTurns = answers.reduce((sum, a) => sum + a.history.length, 0);

    const submissionAnswers = answers.map((ans, idx) => ({
      slideIndex: idx,
      prompt: questions[idx]?.prompt || `Question ${idx + 1}`,
      studentAnswer: ans.history[ans.history.length - 1]?.userAnswer || ans.currentInput || '',
      highestDepth: ans.highestDepth || 'surface',
      feedback: ans.history[ans.history.length - 1]?.feedback,
      iterations: ans.history.length,
    }));

    const newSub: StudentSubmission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      assignmentId: activeAssignment?.id || 'default-asg',
      assignmentCode: activeAssignment?.code || 'BIO-SC-01',
      studentId: currentStudentId,
      studentName: studentName,
      className: className,
      scaffoldNumber: activeScaffoldStage?.scaffoldNumber || 1,
      scaffoldTitle: activeScaffoldStage?.title || `Scaffold Learning ${activeScaffoldStage?.scaffoldNumber || 1}`,
      topicId: activeTopic.id,
      topicTitle: activeTopic.title,
      totalSlides: questions.length,
      criterionAGrade: grade,
      exceedingCount: exceedingCount,
      totalTurns: totalTurns,
      tabSwitchCount: tabSwitchCount,
      copyPasteAttemptCount: copyPasteAttemptCount,
      submittedAt: new Date().toISOString(),
      answers: submissionAnswers,
    };

    await saveSubmission(newSub);
  };

  const handleGoToNextScaffold = () => {
    if (!activeAssignment || !activeScaffoldStage) return;
    const nextScaffoldNum = activeScaffoldStage.scaffoldNumber + 1;
    const nextStage = activeAssignment.scaffolds?.find(
      (s) => s.scaffoldNumber === nextScaffoldNum
    );
    if (nextStage) {
      handleStartScaffoldTask(activeAssignment, nextStage, activeTopic);
    }
  };

  // Automatically start session if loaded via assignment URL
  useEffect(() => {
    const urlAssignment = parseAssignmentFromUrl();
    if (urlAssignment) {
      handleLaunchAssignment(urlAssignment);
    }
  }, []);

  // Anti-cheat tab switch tracking via visibilitychange and blur
  useEffect(() => {
    if (!isSessionActive || !activeAssignment?.antiCheat?.disableTabSwitch) {
      return;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          const next = prev + 1;
          setIntegrityWarning(`Tab switch detected (#${next}). Stay on this window during assigned learning.`);
          return next;
        });
      }
    };

    const handleWindowBlur = () => {
      setTabSwitchCount((prev) => {
        const next = prev + 1;
        setIntegrityWarning(`Window unfocused (#${next}). Please remain focused on the assignment task.`);
        return next;
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isSessionActive, activeAssignment]);

  // Handle student paste attempt
  const handlePasteAttempt = () => {
    setCopyPasteAttemptCount((prev) => prev + 1);
  };

  // Persist settings, topic ID, and active answers on update
  useEffect(() => {
    saveStoredStudentName(studentName);
  }, [studentName]);

  useEffect(() => {
    saveStoredClassName(className);
  }, [className]);

  useEffect(() => {
    saveStoredTopicId(activeTopic.id);
  }, [activeTopic.id]);

  useEffect(() => {
    saveStoredAnswers(activeTopic.id, answers);
  }, [activeTopic.id, answers]);

  useEffect(() => {
    savePastSessions(pastSessions);
  }, [pastSessions]);

  // Handle starting a session from the Topic Setup Dashboard
  const handleStartSession = (topic: Topic) => {
    saveStoredAnswers(currentTopic.id, answers);
    setCurrentTopic(topic);
    setSelectedTopicId(topic.id);
    saveStoredTopicId(topic.id);
    setSelectedLevel(topic.level);
    localStorage.setItem('edutn43_level', topic.level);

    const loadedNewAnswers = Array.from({ length: topic.questions.length }, () => ({ ...INITIAL_SLIDE_STATE }));
    setAnswers(loadedNewAnswers);
    setCurrentIndex(0);
    setShowingSummary(false);
    setIsSessionActive(true);
  };

  // Handle switching topics
  const handleSelectTopic = (newTopic: Topic) => {
    saveStoredAnswers(currentTopic.id, answers);
    setCurrentTopic(newTopic);
    setSelectedTopicId(newTopic.id);
    saveStoredTopicId(newTopic.id);
    setSelectedLevel(newTopic.level);
    localStorage.setItem('edutn43_level', newTopic.level);

    const loadedNewAnswers = Array.from({ length: newTopic.questions.length }, () => ({ ...INITIAL_SLIDE_STATE }));
    setAnswers(loadedNewAnswers);
    setCurrentIndex(0);
    setShowingSummary(false);
    setIsSessionActive(true);
  };

  // Read prompt aloud if speech is toggled
  useEffect(() => {
    if (speechEnabled && 'speechSynthesis' in window && !showingSummary && currentQuestion) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQuestion.prompt);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentIndex, speechEnabled, showingSummary, currentQuestion]);

  const recordCurrentAttempt = (answersState: SlideAnswerState[]) => {
    const hasAnyAttempts = answersState.some((a) => a.history && a.history.length > 0);
    if (!hasAnyAttempts) return;

    const { grade, exceedingCount, totalTurns } = calculateCriterionAGrade(answersState, questions.length);

    const record: PastSessionRecord = {
      id: `sess-${Date.now()}`,
      timestamp: `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      studentName: studentName || 'Student Learner',
      className: className || 'MYP 2C',
      grade,
      exceedingCount,
      totalSlides: questions.length,
      totalTurns,
      topicId: activeTopic.id,
      topicTitle: activeTopic.title,
      assignmentCode: activeAssignment?.code,
      tabSwitchCount,
      copyPasteAttemptCount,
    };

    setPastSessions((prev) => {
      if (prev.length > 0 && Date.now() - parseInt(prev[0].id.replace('sess-', '')) < 10000) {
        const updated = [...prev];
        updated[0] = record;
        return updated;
      }
      return [record, ...prev].slice(0, 20);
    });
  };

  const handleUpdateInput = (text: string) => {
    setAnswers((prev) => {
      const copy = [...prev];
      if (!copy[currentIndex]) return prev;
      copy[currentIndex] = {
        ...copy[currentIndex],
        currentInput: text,
        error: null,
      };
      return copy;
    });
  };

  const handleSubmitAnswer = async () => {
    const input = currentAnswerState.currentInput.trim();
    if (!input || !currentQuestion) return;

    setAnswers((prev) => {
      const copy = [...prev];
      if (!copy[currentIndex]) return prev;
      copy[currentIndex] = {
        ...copy[currentIndex],
        isChecking: true,
        error: null,
      };
      return copy;
    });

    try {
      const response = await fetch('/api/check-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'x-gemini-api-key': apiKey } : {}),
        },
        body: JSON.stringify({
          prompt: currentQuestion.prompt,
          strand: currentQuestion.strand,
          target: currentQuestion.target,
          answer: input,
          history: currentAnswerState.history,
          level: activeTopic.level,
          topicTitle: activeTopic.title,
          customApiKey: apiKey || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const feedback = await response.json();
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const studentTurn: DialogueTurn = {
        id: `std-${Date.now()}`,
        sender: 'student',
        text: input,
        feedback: feedback,
        timestamp: timeStr,
      };

      const aiTurn: DialogueTurn = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: feedback.praise,
        feedback: feedback,
        timestamp: timeStr,
      };

      setAnswers((prev) => {
        const copy = [...prev];
        const state = copy[currentIndex];
        if (!state) return prev;

        const newHistory = [...state.history, studentTurn, aiTurn];
        const newDepth: DepthLevel = feedback.depth || 'developing';
        const currentRank = state.highestDepth ? DEPTH_RANK[state.highestDepth] : 0;
        const newRank = DEPTH_RANK[newDepth] || 2;
        const updatedHighest = newRank > currentRank ? newDepth : state.highestDepth || newDepth;
        const isExceeding = feedback.exceedingAchieved || newDepth === 'extending';

        const updatedAnswers = [...copy];
        updatedAnswers[currentIndex] = {
          ...state,
          history: newHistory,
          currentInput: '',
          highestDepth: updatedHighest,
          isChecking: false,
          exceedingAchieved: state.exceedingAchieved || isExceeding,
        };

        recordCurrentAttempt(updatedAnswers);
        return updatedAnswers;
      });
    } catch (err: any) {
      console.log('Backend evaluation unavailable, using offline fallback evaluator:', err?.message || err);
      const feedback = evaluateAnswerOffline(
        currentQuestion.prompt,
        currentQuestion.target,
        input,
        currentAnswerState.history,
        activeTopic.level
      );
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const studentTurn: DialogueTurn = {
        id: `std-${Date.now()}`,
        sender: 'student',
        text: input,
        feedback: feedback,
        timestamp: timeStr,
      };

      const aiTurn: DialogueTurn = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: feedback.praise,
        feedback: feedback,
        timestamp: timeStr,
      };

      setAnswers((prev) => {
        const copy = [...prev];
        const state = copy[currentIndex];
        if (!state) return prev;

        const newHistory = [...state.history, studentTurn, aiTurn];
        const newDepth: DepthLevel = feedback.depth || 'developing';
        const currentRank = state.highestDepth ? DEPTH_RANK[state.highestDepth] : 0;
        const newRank = DEPTH_RANK[newDepth] || 2;
        const updatedHighest = newRank > currentRank ? newDepth : state.highestDepth || newDepth;
        const isExceeding = feedback.exceedingAchieved || newDepth === 'extending';

        const updatedAnswers = [...copy];
        updatedAnswers[currentIndex] = {
          ...state,
          history: newHistory,
          currentInput: '',
          highestDepth: updatedHighest,
          isChecking: false,
          error: null,
          exceedingAchieved: state.exceedingAchieved || isExceeding,
        };

        recordCurrentAttempt(updatedAnswers);
        return updatedAnswers;
      });
    }
  };

  const handleResetSlide = () => {
    setAnswers((prev) => {
      const copy = [...prev];
      if (!copy[currentIndex]) return prev;
      copy[currentIndex] = { ...INITIAL_SLIDE_STATE };
      return copy;
    });
  };

  const handleNextSlide = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowingSummary(false);
    } else {
      recordCurrentAttempt(answers);
      setShowingSummary(true);
    }
  };

  const handleSelectSlide = (index: number) => {
    setCurrentIndex(index);
    setShowingSummary(false);
  };

  const handleShowSummary = () => {
    recordCurrentAttempt(answers);
    setShowingSummary(true);
  };

  const handleResetSession = () => {
    if (window.confirm(`Reset all practice slides for "${activeTopic.title}"? Your past attempt history will remain saved.`)) {
      recordCurrentAttempt(answers);
      const newAnswers = Array.from({ length: questions.length }, () => ({ ...INITIAL_SLIDE_STATE }));
      setAnswers(newAnswers);
      setCurrentIndex(0);
      setShowingSummary(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all saved past attempts history from browser storage?')) {
      setPastSessions([]);
      savePastSessions([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B192C] via-[#1E3E62] to-[#0A192F] text-white font-serif-custom p-3 sm:p-4 md:p-8 flex flex-col items-center">
      {/* Top Multi-Portal Navigation */}
      <div className="w-full max-w-6xl mb-6">
        <PortalNavigation
          activePortal={portalMode}
          onSelectPortal={handleSwitchPortal}
          currentStudentId={currentStudentId}
        />
      </div>

      {/* 1. Teacher Portal */}
      {portalMode === 'teacher' && (
        <TeacherDashboard
          assignments={assignments}
          students={students}
          submissions={submissions}
          onDeleteStudent={handleDeleteStudent}
          onOpenStudentWork={(sId) => {
            setCurrentStudentId(sId);
            const stu = students.find((s) => s.studentId === sId);
            if (stu) {
              setStudentName(stu.name);
              setClassName(stu.className);
            }
            handleSwitchPortal('student');
          }}
          onOpenStudentPortfolio={(sId) => {
            setCurrentStudentId(sId);
            handleSwitchPortal('portfolio');
          }}
        />
      )}

      {/* 2. Student Portal */}
      {portalMode === 'student' && (
        <StudentDashboard
          students={students}
          assignments={assignments}
          currentStudentId={currentStudentId}
          currentStudentName={studentName}
          currentClassName={className}
          onUpdateStudentCredentials={handleUpdateStudentCredentials}
          onStartScaffoldTask={handleStartScaffoldTask}
          onOpenPortfolio={(sId) => {
            setCurrentStudentId(sId);
            handleSwitchPortal('portfolio');
          }}
          studentSubmissions={submissions}
        />
      )}

      {/* 3. Individual Student Portfolio */}
      {portalMode === 'portfolio' && (
        <StudentPortfolio
          initialStudentId={currentStudentId}
          students={students}
          onGoToWork={() => handleSwitchPortal('student')}
          onSelectStudentId={(sId) => setCurrentStudentId(sId)}
        />
      )}

      {/* 4. Socratic Learning Session / Topic Setup */}
      {portalMode === 'learning' && (
        <>
          {!isSessionActive ? (
            <TopicSetupDashboard
              onStartSession={handleStartSession}
              onOpenLibraryModal={() => setIsTopicSelectorOpen(true)}
              initialLevel={selectedLevel}
              selectedLevel={selectedLevel}
              onSelectLevel={handleSelectLevel}
              initialStudentName={studentName}
              initialClassName={className}
              onUpdateStudentName={setStudentName}
              onUpdateClassName={setClassName}
              pastSessions={pastSessions || []}
              onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
              hasCustomApiKey={Boolean(apiKey)}
              onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
              onLaunchAssignment={handleLaunchAssignment}
            />
          ) : (
            <div className="max-w-4xl w-full bg-[#112238]/95 border border-blue-400/30 rounded-2xl p-4 md:p-8 shadow-2xl backdrop-blur-sm">
              {/* Top Banner pinned for Teacher Assigned Tasks & Locked Learning Outcomes */}
              {activeAssignment && (
                <AssignedTaskBanner
                  assignment={activeAssignment}
                  currentSlide={currentIndex + 1}
                  totalSlides={questions.length}
                  tabSwitchCount={tabSwitchCount}
                  copyPasteAttemptCount={copyPasteAttemptCount}
                  onExitAssignment={handleExitAssignment}
                />
              )}

              {/* Integrity Warning Toast if tab switched */}
              {integrityWarning && (
                <div className="mb-4 p-3 bg-rose-950/90 border-2 border-rose-500 text-rose-100 rounded-xl text-xs font-mono-custom flex items-center justify-between gap-2 shadow-lg animate-in slide-in-from-top duration-300">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚠️</span>
                    <span>{integrityWarning}</span>
                  </div>
                  <button
                    onClick={() => setIntegrityWarning(null)}
                    className="px-2.5 py-0.5 bg-rose-900 hover:bg-rose-800 text-white rounded border border-rose-400/50 cursor-pointer"
                  >
                    Acknowledge
                  </button>
                </div>
              )}

              <Header
                topic={activeTopic}
                onOpenTopics={() => setIsTopicSelectorOpen(true)}
                onOpenDiagrams={() => setIsDiagramOpen(true)}
                onReset={handleResetSession}
                onNewSession={() => {
                  setIsSessionActive(false);
                  setPortalMode('student');
                }}
                speechEnabled={speechEnabled}
                onToggleSpeech={() => setSpeechEnabled(!speechEnabled)}
                currentSlide={currentIndex + 1}
                totalSlides={questions.length}
                showingSummary={showingSummary}
                className={className}
                selectedLevel={selectedLevel}
                onSelectLevel={handleSelectLevel}
                onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
                hasCustomApiKey={Boolean(apiKey)}
                onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
                activeAssignment={activeAssignment}
              />

              <SlideRack
                total={questions.length}
                currentIndex={currentIndex}
                answers={answers}
                onSelectSlide={handleSelectSlide}
                showingSummary={showingSummary}
                onShowSummary={handleShowSummary}
              />

              <main>
                {showingSummary ? (
                  <SessionSummary
                    questions={questions}
                    answers={answers}
                    onReviewSlide={handleSelectSlide}
                    onRestart={() => {
                      recordCurrentAttempt(answers);
                      setAnswers(Array.from({ length: questions.length }, () => ({ ...INITIAL_SLIDE_STATE })));
                      setCurrentIndex(0);
                      setShowingSummary(false);
                    }}
                    onNewTopic={() => {
                      setIsSessionActive(false);
                      setPortalMode('student');
                    }}
                    studentName={studentName}
                    onUpdateStudentName={setStudentName}
                    className={className}
                    onUpdateClassName={setClassName}
                    pastSessions={pastSessions}
                    onClearHistory={handleClearHistory}
                    activeAssignment={activeAssignment}
                    tabSwitchCount={tabSwitchCount}
                    copyPasteAttemptCount={copyPasteAttemptCount}
                    studentId={currentStudentId}
                    activeScaffoldStage={activeScaffoldStage}
                    onSaveToFirebase={handleSaveToFirebase}
                    onGoToPortfolio={() => handleSwitchPortal('portfolio')}
                    onGoToNextScaffold={handleGoToNextScaffold}
                    hasNextScaffold={Boolean(
                      activeAssignment?.scaffolds?.some(
                        (s) => s.scaffoldNumber === (activeScaffoldStage?.scaffoldNumber || 1) + 1
                      )
                    )}
                  />
                ) : (
                  currentQuestion && (
                    <SlideCard
                      question={currentQuestion}
                      slideIndex={currentIndex}
                      totalSlides={questions.length}
                      state={currentAnswerState}
                      onUpdateInput={handleUpdateInput}
                      onSubmitAnswer={handleSubmitAnswer}
                      onResetSlide={handleResetSlide}
                      onNextSlide={handleNextSlide}
                      isLastSlide={currentIndex === questions.length - 1}
                      topicLevel={selectedLevel}
                      onPasteAttempt={handlePasteAttempt}
                    />
                  )
                )}
              </main>
            </div>
          )}
        </>
      )}

      <TopicSelectorModal
        isOpen={isTopicSelectorOpen}
        onClose={() => setIsTopicSelectorOpen(false)}
        selectedTopic={activeTopic}
        onSelectTopic={handleSelectTopic}
        selectedLevel={selectedLevel}
        onSelectLevel={handleSelectLevel}
      />

      <CellDiagramModal
        isOpen={isDiagramOpen}
        onClose={() => setIsDiagramOpen(false)}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      <TeacherAssignmentModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        currentTopic={activeTopic}
        onLaunchAssignment={handleLaunchAssignment}
      />
    </div>
  );
}


