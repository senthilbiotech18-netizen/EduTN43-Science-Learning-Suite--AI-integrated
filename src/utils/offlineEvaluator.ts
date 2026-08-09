import { DepthLevel, AIFeedback } from '../types';

export function evaluateAnswerOffline(
  _prompt: string,
  target: string,
  studentAnswer: string
): AIFeedback {
  const answerLower = studentAnswer.toLowerCase().trim();
  const targetLower = target.toLowerCase();

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

  if (matchRatio >= 0.7 || (matchRatio >= 0.5 && wordCount >= 18)) {
    depth = 'extending';
    exceeding = true;
    praise = `Outstanding scientific reasoning! You've accurately integrated key concepts such as ${matchedKeywords.slice(0, 3).join(', ')}.`;
    followUp = `To push your understanding even further: Can you explain how this process connects to broader biological systems?`;
  } else if (matchRatio >= 0.35 || wordCount >= 10) {
    depth = 'secure';
    praise = `Solid attempt! You correctly identified core elements of the target concept.`;
    if (missingKeywords.length > 0) {
      gap = `Notice that key concepts like ${missingKeywords.slice(0, 2).join(' and ')} were not fully highlighted.`;
      followUp = `How does incorporating ${missingKeywords.slice(0, 2).join(' and ')} strengthen your scientific explanation?`;
    } else {
      followUp = `Can you elaborate on the underlying biological mechanism?`;
    }
  } else if (wordCount >= 4) {
    depth = 'developing';
    praise = `Good starting thought! You are on the right path.`;
    gap = missingKeywords.length > 0 ? `Consider including key vocabulary like ${missingKeywords.slice(0, 2).join(' or ')}.` : null;
    followUp = `What is the main function or cause involved in this scenario?`;
  } else {
    depth = 'surface';
    praise = `Thank you for your answer. Let's build upon this step-by-step.`;
    gap = `Your answer is very brief and needs key biological details.`;
    followUp = `Re-read the question prompt: What is the primary process or role being described?`;
  }

  return {
    praise,
    depth,
    misconception: false,
    gap,
    followUp,
    exceedingAchieved: exceeding,
  };
}
