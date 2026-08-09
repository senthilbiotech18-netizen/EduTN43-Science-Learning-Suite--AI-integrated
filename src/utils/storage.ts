import { SlideAnswerState, PastSessionRecord } from '../types';

const KEYS = {
  STUDENT_NAME: 'cell_explorer_student_name',
  CLASS_NAME: 'cell_explorer_class_name',
  SELECTED_TOPIC: 'cell_explorer_selected_topic',
  ANSWERS_STATE_PREFIX: 'cell_explorer_answers_',
  PAST_SESSIONS: 'cell_explorer_past_sessions',
};

export function loadStoredTopicId(fallback: string = '1-classification-living-organisms'): string {
  try {
    return localStorage.getItem(KEYS.SELECTED_TOPIC) || fallback;
  } catch (e) {
    return fallback;
  }
}

export function saveStoredTopicId(topicId: string): void {
  try {
    localStorage.setItem(KEYS.SELECTED_TOPIC, topicId);
  } catch (e) {
    console.error('Failed to save selected topic:', e);
  }
}

export function loadStoredStudentName(fallback: string = 'Alex Rivers'): string {
  try {
    return localStorage.getItem(KEYS.STUDENT_NAME) || fallback;
  } catch (e) {
    return fallback;
  }
}

export function saveStoredStudentName(name: string): void {
  try {
    localStorage.setItem(KEYS.STUDENT_NAME, name);
  } catch (e) {
    console.error('Failed to save student name:', e);
  }
}

export function loadStoredClassName(fallback: string = 'Science Lab 1'): string {
  try {
    return localStorage.getItem(KEYS.CLASS_NAME) || fallback;
  } catch (e) {
    return fallback;
  }
}

export function saveStoredClassName(className: string): void {
  try {
    localStorage.setItem(KEYS.CLASS_NAME, className);
  } catch (e) {
    console.error('Failed to save class name:', e);
  }
}

export function loadStoredAnswers(topicId: string, totalQuestions: number): SlideAnswerState[] {
  try {
    const raw = localStorage.getItem(`${KEYS.ANSWERS_STATE_PREFIX}${topicId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === totalQuestions) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(`Failed to load stored slide answers for topic ${topicId}:`, e);
  }
  return Array.from({ length: totalQuestions }, () => ({
    history: [],
    currentInput: '',
    highestDepth: null,
    isChecking: false,
    error: null,
    exceedingAchieved: false,
  }));
}

export function saveStoredAnswers(topicId: string, answers: SlideAnswerState[]): void {
  try {
    localStorage.setItem(`${KEYS.ANSWERS_STATE_PREFIX}${topicId}`, JSON.stringify(answers));
  } catch (e) {
    console.error(`Failed to save slide answers for topic ${topicId}:`, e);
  }
}

export function loadPastSessions(): PastSessionRecord[] {
  try {
    const raw = localStorage.getItem(KEYS.PAST_SESSIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load past sessions:', e);
  }
  return [];
}

export function savePastSessions(sessions: PastSessionRecord[]): void {
  try {
    localStorage.setItem(KEYS.PAST_SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save past sessions:', e);
  }
}

export function calculateCriterionAGrade(answers: SlideAnswerState[], totalQuestions: number = 12) {
  let rawPoints = 0;
  let exceedingCount = 0;
  let totalTurns = 0;

  answers.forEach((ans) => {
    const depth = ans.highestDepth || 'surface';
    if (depth === 'extending' || ans.exceedingAchieved) {
      rawPoints += 4;
      exceedingCount += 1;
    } else if (depth === 'secure') {
      rawPoints += 3;
    } else if (depth === 'developing') {
      rawPoints += 2;
    } else {
      rawPoints += 1;
    }

    if (ans.history) {
      totalTurns += ans.history.filter((t) => t.sender === 'student').length;
    }
  });

  const maxPoints = totalQuestions * 4;
  const ratio = maxPoints > 0 ? rawPoints / maxPoints : 0;

  let grade = 1;
  let gradeDescriptor = 'Level 1-2: Limited recall of basic scientific facts.';

  if (ratio >= 0.90) {
    grade = 8;
    gradeDescriptor = 'Level 7-8: Consistently outlines, applies, and synthesizes scientific knowledge extensively with comprehensive cause-and-effect reasoning.';
  } else if (ratio >= 0.78) {
    grade = 7;
    gradeDescriptor = 'Level 7-8: Outlines and applies scientific knowledge extensively to explain complex science concepts and processes.';
  } else if (ratio >= 0.65) {
    grade = 6;
    gradeDescriptor = 'Level 5-6: Outlines scientific knowledge and applies understanding accurately across familiar contexts.';
  } else if (ratio >= 0.52) {
    grade = 5;
    gradeDescriptor = 'Level 5-6: Recalls scientific ideas and outlines basic concepts and functions clearly.';
  } else if (ratio >= 0.40) {
    grade = 4;
    gradeDescriptor = 'Level 3-4: Recalls basic scientific facts and outlines simple concepts with structured guidance.';
  } else if (ratio >= 0.28) {
    grade = 3;
    gradeDescriptor = 'Level 3-4: Identifies basic concepts and functions with occasional scaffolding prompts.';
  } else if (ratio >= 0.15) {
    grade = 2;
    gradeDescriptor = 'Level 1-2: States minimal scientific facts with teacher guidance.';
  } else {
    grade = 1;
    gradeDescriptor = 'Level 1-2: Initial attempt at answering science questions.';
  }

  return { grade, gradeDescriptor, exceedingCount, totalTurns, rawPoints };
}

