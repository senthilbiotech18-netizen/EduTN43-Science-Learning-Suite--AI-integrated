import { TeacherAssignment } from '../types';

const ASSIGNMENTS_STORAGE_KEY = 'edutn43_teacher_assignments';
const CURRENT_ACTIVE_ASSIGNMENT_KEY = 'edutn43_active_assignment';

// Built-in starter template assignments ready for teachers to deploy immediately
export const STARTER_ASSIGNMENTS: TeacherAssignment[] = [
  {
    id: 'asg-cells-myp2',
    code: 'CELL-7A',
    title: 'Cell Organelles & Microscopic Architecture',
    className: 'Grade 7 Biology - Section A',
    teacherName: 'Dr. Senthil Kumar',
    topicId: '2-cell-biology-organelles',
    topicTitle: 'Cell Biology & Organelle Microscopic Architecture',
    level: 'MYP 1–3 (Grade 6–8)',
    learningOutcomes: [
      'Identify the nucleus, mitochondria, cell membrane, cell wall, and chloroplasts.',
      'Explain the specialized role of mitochondria in cellular respiration and ATP release.',
      'Differentiate plant vs animal cells with precision in Criterion A scientific vocabulary.',
      'Master accurate biological terminology spelling without errors.',
    ],
    instructions: 'Complete all slides to Secure or Extending level. Direct manual typing only. Tab switching and copy-paste are disabled.',
    antiCheat: {
      disableCopyPaste: true,
      disableTabSwitch: true,
      maxViolationsAllowed: 5,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'asg-photosynthesis-myp4',
    code: 'PHOTO-9B',
    title: 'Plant Nutrition & Photosynthetic Energy Transformation',
    className: 'Grade 9 Biology - MYP 4',
    teacherName: 'Science Department',
    topicId: '5-plant-nutrition-photosynthesis',
    topicTitle: 'Plant Nutrition & Photosynthetic Energy Transformation',
    level: 'MYP 4–5 (Grade 9–10)',
    learningOutcomes: [
      'Write the balanced equation for photosynthesis and explain light energy capture.',
      'Explain limiting factors (light intensity, CO2 concentration, temperature).',
      'Describe leaf tissue cross-section adaptations (palisade mesophyll, stomata).',
      'Synthesize how glucose is converted to starch, cellulose, and amino acids.',
    ],
    instructions: 'Demonstrate deep Socratic rigor. Connect biochemical causes to environmental effects.',
    antiCheat: {
      disableCopyPaste: true,
      disableTabSwitch: true,
      maxViolationsAllowed: 5,
    },
    createdAt: new Date().toISOString(),
  },
];

export function loadSavedAssignments(): TeacherAssignment[] {
  try {
    const raw = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load assignments:', e);
  }
  return STARTER_ASSIGNMENTS;
}

export function saveAssignments(assignments: TeacherAssignment[]): void {
  try {
    localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(assignments));
  } catch (e) {
    console.error('Failed to save assignments:', e);
  }
}

export function saveNewAssignment(newAssignment: TeacherAssignment): TeacherAssignment[] {
  const current = loadSavedAssignments();
  const filtered = current.filter((a) => a.code.toUpperCase() !== newAssignment.code.toUpperCase());
  const updated = [newAssignment, ...filtered];
  saveAssignments(updated);
  return updated;
}

export function findAssignmentByCode(code: string): TeacherAssignment | null {
  if (!code) return null;
  const clean = code.trim().toUpperCase();
  const all = loadSavedAssignments();
  return all.find((a) => a.code.toUpperCase() === clean || a.id.toUpperCase() === clean) || null;
}

export function loadActiveAssignment(): TeacherAssignment | null {
  try {
    const raw = localStorage.getItem(CURRENT_ACTIVE_ASSIGNMENT_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return null;
}

export function setActiveAssignment(assignment: TeacherAssignment | null): void {
  try {
    if (!assignment) {
      localStorage.removeItem(CURRENT_ACTIVE_ASSIGNMENT_KEY);
    } else {
      localStorage.setItem(CURRENT_ACTIVE_ASSIGNMENT_KEY, JSON.stringify(assignment));
    }
  } catch (e) {
    // ignore
  }
}

export const OFFICIAL_VERCEL_URL = 'https://edu-tn-43-science-learning-suite-ai.vercel.app';

export function getAppBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('gsis_target_base_url');
    if (saved) return saved.replace(/\/+$/, '');
    if (window.location.hostname.includes('vercel.app')) {
      return window.location.origin;
    }
  }
  return OFFICIAL_VERCEL_URL;
}

// Encode assignment into a shareable URL hash or parameter
export function createAssignmentShareUrl(assignment: TeacherAssignment, customBase?: string): string {
  const base = customBase || getAppBaseUrl();
  try {
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify({
      code: assignment.code,
      title: assignment.title,
      className: assignment.className,
      teacherName: assignment.teacherName,
      topicId: assignment.topicId,
      topicTitle: assignment.topicTitle,
      level: assignment.level,
      learningOutcomes: assignment.learningOutcomes,
      instructions: assignment.instructions,
      antiCheat: assignment.antiCheat,
    }))));
    return `${base}?task=${assignment.code}&data=${payload}`;
  } catch (e) {
    return `${base}?task=${assignment.code}`;
  }
}

// Parse assignment from current URL parameters
export function parseAssignmentFromUrl(): TeacherAssignment | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('task') || params.get('assign');
    const data = params.get('data');

    if (data) {
      const decoded = decodeURIComponent(escape(atob(data)));
      const parsed = JSON.parse(decoded);
      if (parsed && parsed.topicId) {
        return {
          id: `asg-${Date.now()}`,
          code: parsed.code || code || 'ASSIGN-1',
          title: parsed.title || 'Teacher Assigned Task',
          className: parsed.className || 'Assigned Science Class',
          teacherName: parsed.teacherName || 'Teacher',
          topicId: parsed.topicId,
          topicTitle: parsed.topicTitle || 'Assigned Topic',
          level: parsed.level || 'MYP 1–3 (Grade 6–8)',
          learningOutcomes: Array.isArray(parsed.learningOutcomes) ? parsed.learningOutcomes : [],
          instructions: parsed.instructions,
          antiCheat: parsed.antiCheat || {
            disableCopyPaste: true,
            disableTabSwitch: true,
            maxViolationsAllowed: 5,
          },
          createdAt: new Date().toISOString(),
        };
      }
    }

    if (code) {
      const local = findAssignmentByCode(code);
      if (local) return local;
    }
  } catch (e) {
    console.error('Error parsing assignment from url:', e);
  }
  return null;
}
