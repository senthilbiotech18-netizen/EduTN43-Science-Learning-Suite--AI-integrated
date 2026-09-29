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

export interface SpellingCorrection {
  original: string;
  correction: string;
  explanation?: string;
}

export interface AIFeedback {
  depth: DepthLevel;
  misconception: boolean;
  praise: string;
  gap: string | null;
  followUp: string | null;
  exceedingAchieved?: boolean;
  spellingErrors?: SpellingCorrection[];
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

export interface ScaffoldStage {
  scaffoldNumber: number; // 1, 2, 3...
  title: string; // e.g. "Scaffold Learning 1: Core Recall & Foundational Concepts"
  description: string;
  targetOutcome: string;
  questionIds: number[]; // question IDs from the topic assigned to this scaffold stage
}

export interface TeacherAssignment {
  id: string;
  code: string; // e.g. "BIO-7B", "CELL-9A"
  title: string;
  className: string;
  teacherName: string;
  topicId: string;
  topicTitle: string;
  level: string; // e.g. "MYP 1–3 (Grade 6–8)"
  slideCount?: number; // Number of assigned slides (e.g. 3, 5, 8, 12)
  learningOutcomes: string[]; // List of explicit learning outcomes
  instructions?: string;
  scaffolds?: ScaffoldStage[]; // List of scaffold stages (Scaffold Learning 1, 2, etc.)
  antiCheat: {
    disableCopyPaste: boolean;
    disableTabSwitch: boolean;
    maxViolationsAllowed?: number;
  };
  createdAt: string;
  dueDate?: string;
}

export interface StudentRecord {
  id: string;
  studentId: string; // e.g. "GSIS-2024-001"
  name: string;
  className: string;
  email?: string;
  createdAt: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export interface SubmissionAnswerDetail {
  questionId?: number;
  slideIndex?: number;
  prompt: string;
  strand?: StrandType;
  studentAnswer: string;
  highestDepth: DepthLevel | null;
  history?: DialogueTurn[];
  feedback?: AIFeedback | string;
  iterations?: number;
}

export interface StudentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  assignmentId: string;
  assignmentCode: string;
  topicId: string;
  topicTitle: string;
  scaffoldNumber: number; // 1, 2, 3
  scaffoldTitle: string;
  criterionAGrade: number; // 1 to 8
  exceedingCount: number;
  totalSlides: number;
  totalTurns: number;
  answers: SubmissionAnswerDetail[];
  tabSwitchCount: number;
  copyPasteAttemptCount: number;
  pdfDownloaded?: boolean;
  submittedAt: string;
  teacherFeedback?: string;
  teacherGradedAt?: string;
}

export type PortalMode = 'student' | 'teacher' | 'portfolio' | 'learning' | 'practice';

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
  assignmentCode?: string;
  tabSwitchCount?: number;
  copyPasteAttemptCount?: number;
}



