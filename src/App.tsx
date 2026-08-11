import React, { useState, useEffect } from 'react';
import { TOPICS } from './data/topics';
import { SlideAnswerState, DialogueTurn, DepthLevel, PastSessionRecord, Topic } from './types';
import { Header } from './components/Header';
import { SlideRack } from './components/SlideRack';
import { SlideCard } from './components/SlideCard';
import { SessionSummary } from './components/SessionSummary';
import { CellDiagramModal } from './components/CellDiagramModal';
import { TopicSelectorModal } from './components/TopicSelectorModal';
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
} from './utils/storage';
import { evaluateAnswerOffline } from './utils/offlineEvaluator';

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
  const [selectedTopicId, setSelectedTopicId] = useState<string>(() => loadStoredTopicId('1-classification-living-organisms'));
  const [selectedLevel, setSelectedLevel] = useState<string>(() => {
    return localStorage.getItem('edutn43_level') || 'MYP 1–3 (Grade 6–8)';
  });

  const activeTopic: Topic = TOPICS.find((t) => t.id === selectedTopicId) || TOPICS[0];
  const questions = activeTopic.questions;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [studentName, setStudentName] = useState<string>(() => loadStoredStudentName('Senthil Kumar'));
  const [className, setClassName] = useState<string>(() => loadStoredClassName('Science Class'));
  const [answers, setAnswers] = useState<SlideAnswerState[]>(() =>
    loadStoredAnswers(activeTopic.id, questions.length)
  );
  const [pastSessions, setPastSessions] = useState<PastSessionRecord[]>(() => loadPastSessions());
  const [showingSummary, setShowingSummary] = useState<boolean>(false);
  const [isDiagramOpen, setIsDiagramOpen] = useState<boolean>(false);
  const [isTopicSelectorOpen, setIsTopicSelectorOpen] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(false);

  const currentQuestion = questions[currentIndex] || questions[0];
  const currentAnswerState = answers[currentIndex] || INITIAL_SLIDE_STATE;

  const handleSelectLevel = (newLevel: string) => {
    setSelectedLevel(newLevel);
    localStorage.setItem('edutn43_level', newLevel);
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

  // Handle switching topics
  const handleSelectTopic = (newTopic: Topic) => {
    saveStoredAnswers(activeTopic.id, answers);
    setSelectedTopicId(newTopic.id);
    saveStoredTopicId(newTopic.id);

    const loadedNewAnswers = loadStoredAnswers(newTopic.id, newTopic.questions.length);
    setAnswers(loadedNewAnswers);
    setCurrentIndex(0);
    setShowingSummary(false);
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
        },
        body: JSON.stringify({
          prompt: currentQuestion.prompt,
          strand: currentQuestion.strand,
          target: currentQuestion.target,
          answer: input,
          history: currentAnswerState.history,
          level: activeTopic.level,
          topicTitle: activeTopic.title,
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
      console.warn('Backend evaluation unavailable, using offline fallback evaluator:', err);
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
    <div className="min-h-screen bg-gradient-to-br from-[#0B192C] via-[#1E3E62] to-[#0A192F] text-white font-serif-custom p-4 md:p-8 flex justify-center items-start">
      <div className="max-w-4xl w-full bg-[#112238]/95 border border-blue-400/30 rounded-2xl p-4 md:p-8 shadow-2xl backdrop-blur-sm">
        <Header
          topic={activeTopic}
          onOpenTopics={() => setIsTopicSelectorOpen(true)}
          onOpenDiagrams={() => setIsDiagramOpen(true)}
          onReset={handleResetSession}
          speechEnabled={speechEnabled}
          onToggleSpeech={() => setSpeechEnabled(!speechEnabled)}
          currentSlide={currentIndex + 1}
          totalSlides={questions.length}
          showingSummary={showingSummary}
          className={className}
          selectedLevel={selectedLevel}
          onSelectLevel={handleSelectLevel}
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
              studentName={studentName}
              onUpdateStudentName={setStudentName}
              className={className}
              onUpdateClassName={setClassName}
              pastSessions={pastSessions}
              onClearHistory={handleClearHistory}
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
              />
            )
          )}
        </main>
      </div>

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
    </div>
  );
}


