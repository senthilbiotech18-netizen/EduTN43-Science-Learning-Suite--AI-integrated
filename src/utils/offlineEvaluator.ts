import { DepthLevel, AIFeedback } from '../types';
import { checkBiologicalSpelling } from './bioSpellChecker';

export function evaluateAnswerOffline(
  _prompt: string,
  target: string,
  studentAnswer: string,
  history: any[] = [],
  level: string = 'MYP 2 & 3'
): AIFeedback {
  const answerLower = studentAnswer.toLowerCase().trim();
  const targetLower = target.toLowerCase();

  const studentTurns = Array.isArray(history) ? history.filter((t) => t.sender === 'student').length + 1 : 1;
  const followUpCount = studentTurns - 1;
  const isLowerGrade = !level || level.includes('PYP') || level.includes('MYP 1') || level.includes('MYP 2') || level.includes('MYP 3') || level.includes('Grade 6') || level.includes('Grade 7') || level.includes('Grade 8');

  // Extract key vocabulary words (>3 characters, excluding stop words)
  const stopWords = new Set([
    'the', 'and', 'that', 'this', 'with', 'from', 'they', 'have', 'been',
    'which', 'their', 'when', 'what', 'where', 'also', 'some', 'into', 'than',
    'them', 'each', 'does', 'such', 'like', 'through', 'about', 'cause', 'causes'
  ]);

  const targetKeywords = targetLower
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w));

  const uniqueTargetKeywords = Array.from(new Set(targetKeywords));

  const matchedKeywords = uniqueTargetKeywords.filter((word) =>
    answerLower.includes(word)
  );

  const missingKeywords = uniqueTargetKeywords.filter(
    (word) => !answerLower.includes(word)
  );

  const matchRatio =
    uniqueTargetKeywords.length > 0
      ? matchedKeywords.length / uniqueTargetKeywords.length
      : 0.5;

  const wordCount = answerLower.split(/\s+/).length;

  let depth: DepthLevel = 'surface';
  let praise = '';
  let followUp: string | null = null;
  let gap: string | null = null;
  let exceeding = false;

  // Max 5 follow-up questions limit for lower grades
  if (isLowerGrade && followUpCount >= 4) {
    depth = 'extending';
    exceeding = true;
    praise = `🎉 Excellent perseverance! You have completed all 5 follow-up questions for this slide. Great job practicing Criterion A!`;
    gap = null;
    followUp = null;
    return { praise, depth, misconception: false, gap, followUp, exceedingAchieved: true };
  }

  if (matchRatio >= 0.7 || (matchRatio >= 0.5 && wordCount >= 18) || followUpCount >= 3) {
    depth = 'extending';
    exceeding = true;
    praise = `Outstanding scientific reasoning! You've accurately integrated key concepts such as ${matchedKeywords.slice(0, 3).join(', ')}.`;
    followUp = isLowerGrade ? null : `To push your understanding even further: Can you explain how this process connects to broader biological systems?`;
  } else if (matchRatio >= 0.35 || wordCount >= 10) {
    depth = 'secure';
    praise = `Solid attempt! You correctly identified core elements of the target concept.`;
    if (missingKeywords.length > 0) {
      gap = isLowerGrade 
        ? `💡 Gentle Reminder: The core concept is "${target}". Keep this key idea in mind!`
        : `Notice that key concepts like ${missingKeywords.slice(0, 2).join(' and ')} were not fully highlighted.`;
      followUp = `In simple words: How does ${missingKeywords.slice(0, 2).join(' or ')} play a key role here?`;
    } else {
      followUp = `Can you explain the main job of this cell structure in one simple sentence?`;
    }
  } else if (wordCount >= 4) {
    depth = 'developing';
    praise = `Good starting thought! You are on the right path.`;
    gap = isLowerGrade
      ? `💡 Let's clarify together: "${target}".`
      : (missingKeywords.length > 0 ? `Consider including key vocabulary like ${missingKeywords.slice(0, 2).join(' or ')}.` : null);
    followUp = `What is the primary function or reason for this process?`;
  } else {
    depth = 'surface';
    praise = `Thank you for your answer! Let's build upon this gently step-by-step.`;
    gap = `💡 Key Concept Rectification: Remember that "${target}".`;
    followUp = `Re-read the key point above: Can you restate it in your own words?`;
  }

  const spellingErrors = checkBiologicalSpelling(studentAnswer);

  return {
    praise,
    depth,
    misconception: false,
    gap,
    followUp,
    exceedingAchieved: exceeding,
    spellingErrors: spellingErrors.length > 0 ? spellingErrors : undefined,
  };
}
