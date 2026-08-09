export type DepthLevel = 'surface' | 'developing' | 'secure' | 'extending';

export type StrandType = 'i' | 'ii';

export type SubjectType = 'Biology' | 'Chemistry' | 'Physics' | 'Environmental Science';

export interface Question {
  id: number;
  strand: StrandType;
  prompt: string;
  target: string;
  hint?: string;
}

export interface Topic {
  id: string;
  title: string;
  level: string; // e.g., 'MYP 2 & 3', 'MYP 4 & 5', 'MYP 1-5'
  subject: SubjectType;
  description: string;
  badgeColor: string;
  icon: string; // lucide icon name
  questions: Question[];
  organelles?: OrganelleInfo[];
}

export interface AIFeedback {
  depth: DepthLevel;
  misconception: boolean;
  praise: string;
  gap: string | null;
  followUp: string | null;
  exceedingAchieved?: boolean;
}

export interface DialogueTurn {
  id: string;
  sender: 'student' | 'ai';
  text: string;
  feedback?: AIFeedback;
  timestamp: string;
}

export interface SlideAnswerState {
  history: DialogueTurn[];
  currentInput: string;
  highestDepth: DepthLevel | null;
  isChecking: boolean;
  error: string | null;
  exceedingAchieved: boolean;
}

export interface OrganelleInfo {
  id: string;
  name: string;
  foundIn: 'both' | 'plant' | 'animal';
  function: string;
  description: string;
  color: string;
}

export interface PastSessionRecord {
  id: string;
  timestamp: string;
  studentName: string;
  className: string;
  grade: number;
  exceedingCount: number;
  totalSlides: number;
  totalTurns: number;
  topicId?: string;
  topicTitle?: string;
}


