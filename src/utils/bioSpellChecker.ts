import { SpellingCorrection } from '../types';

// Common biological terms mapping: common misspelled variant -> standard term + tip
const COMMON_BIO_TYPOS: Record<string, { correction: string; tip?: string }> = {
  // Cell organelles & structures
  mitocondria: { correction: 'mitochondria', tip: "Remember the 'ch' in mitochondria" },
  mitocondrion: { correction: 'mitochondrion', tip: "Remember the 'ch' in mitochondrion" },
  mitochrondia: { correction: 'mitochondria', tip: "Watch out for extra 'r': mitochondria" },
  mitochindria: { correction: 'mitochondria', tip: "Spell with 'o': mitochondria" },
  mithochondria: { correction: 'mitochondria', tip: "Starts with 'mito-': mitochondria" },
  mitochondira: { correction: 'mitochondria', tip: "Ends with '-dria': mitochondria" },
  mitocondrian: { correction: 'mitochondrion', tip: "Singular form is mitochondrion" },

  chlorplast: { correction: 'chloroplast', tip: "Includes 'o': chloroplast" },
  chlorplasts: { correction: 'chloroplasts', tip: "Includes 'o': chloroplasts" },
  cloroplast: { correction: 'chloroplast', tip: "Starts with 'ch': chloroplast" },
  cloroplasts: { correction: 'chloroplasts', tip: "Starts with 'ch': chloroplasts" },
  chloropast: { correction: 'chloroplast', tip: "Has an 'l': chloroplast" },
  chloropasts: { correction: 'chloroplasts', tip: "Has an 'l': chloroplasts" },
  chlorophyl: { correction: 'chlorophyll', tip: "Double 'll' at the end: chlorophyll" },
  clorophyll: { correction: 'chlorophyll', tip: "Starts with 'ch': chlorophyll" },
  clorophyl: { correction: 'chlorophyll', tip: "Starts with 'ch' and ends with double 'l': chlorophyll" },
  chlorophil: { correction: 'chlorophyll', tip: "Spelled with 'y' and double 'l': chlorophyll" },

  citoplasm: { correction: 'cytoplasm', tip: "Starts with 'cy-': cytoplasm" },
  cytoplam: { correction: 'cytoplasm', tip: "Includes the 's': cytoplasm" },
  cytoplazm: { correction: 'cytoplasm', tip: "Spelled with 's': cytoplasm" },
  cytoplams: { correction: 'cytoplasm', tip: "Spelled with 's': cytoplasm" },
  cytosol: { correction: 'cytosol', tip: "Liquid portion of cytoplasm" },

  ribosom: { correction: 'ribosome', tip: "Ends with an 'e': ribosome" },
  ribisome: { correction: 'ribosome', tip: "Spelled with 'o': ribosome" },
  ribisomes: { correction: 'ribosomes', tip: "Spelled with 'o': ribosomes" },
  ribizome: { correction: 'ribosome', tip: "Spelled with 's': ribosome" },
  ribizomes: { correction: 'ribosomes', tip: "Spelled with 's': ribosomes" },

  vacule: { correction: 'vacuole', tip: "Spelled 'vacuole' with 'uo'" },
  vacules: { correction: 'vacuoles', tip: "Spelled 'vacuoles' with 'uo'" },
  vacoule: { correction: 'vacuole', tip: "Spelled 'vacuole' ('uo', not 'ou')" },
  vacoules: { correction: 'vacuoles', tip: "Spelled 'vacuoles'" },
  vacuol: { correction: 'vacuole', tip: "Ends with an 'e': vacuole" },

  neucleus: { correction: 'nucleus', tip: "Starts with 'nu-': nucleus" },
  nuclius: { correction: 'nucleus', tip: "Ends with '-eus': nucleus" },
  neucleas: { correction: 'nucleus', tip: "Spelled 'nucleus'" },
  nucleous: { correction: 'nucleus', tip: "Spelled 'nucleus' ('nucleolus' is the sub-structure)" },
  neucleolus: { correction: 'nucleolus', tip: "Spelled 'nucleolus'" },
  nucleolis: { correction: 'nucleolus', tip: "Ends with '-us': nucleolus" },

  organell: { correction: 'organelle', tip: "Ends with '-elle': organelle" },
  organels: { correction: 'organelles', tip: "Spelled 'organelles' with double 'l'" },
  organnelle: { correction: 'organelle', tip: "Single 'n', double 'l': organelle" },
  organnelles: { correction: 'organelles', tip: "Single 'n', double 'l': organelles" },

  membrance: { correction: 'membrane', tip: "Ends in '-ane': membrane" },
  menbrane: { correction: 'membrane', tip: "Spelled with 'm': membrane" },
  membraine: { correction: 'membrane', tip: "Spelled 'membrane'" },
  membranes: { correction: 'membranes', tip: "Spelled 'membranes'" },

  lysosome: { correction: 'lysosome', tip: "Spelled 'lysosome'" },
  lisosome: { correction: 'lysosome', tip: "Starts with 'ly-': lysosome" },
  lisosomes: { correction: 'lysosomes', tip: "Starts with 'ly-': lysosomes" },
  lysozome: { correction: 'lysosome', tip: "Spelled with 's': lysosome" },
  lysozomes: { correction: 'lysosomes', tip: "Spelled with 's': lysosomes" },

  // Processes & Transport
  photocynthesis: { correction: 'photosynthesis', tip: "Spelled with 's': photosynthesis" },
  photosynthisis: { correction: 'photosynthesis', tip: "Spelled '-thesis': photosynthesis" },
  photosythesis: { correction: 'photosynthesis', tip: "Don't forget the 'n': photosynthesis" },
  phototsynthesis: { correction: 'photosynthesis', tip: "Spelled 'photosynthesis'" },
  fotosynthesis: { correction: 'photosynthesis', tip: "Starts with 'ph-': photosynthesis" },

  resperaton: { correction: 'respiration', tip: "Spelled 'respiration' with '-ir-'" },
  respiraton: { correction: 'respiration', tip: "Ends in '-ation': respiration" },
  resperation: { correction: 'respiration', tip: "Spelled with 'i': respiration" },
  respration: { correction: 'respiration', tip: "Spelled 'respiration'" },

  diffussion: { correction: 'diffusion', tip: "Double 'f', single 's': diffusion" },
  difussion: { correction: 'diffusion', tip: "Double 'f', single 's': diffusion" },
  difusion: { correction: 'diffusion', tip: "Double 'f': diffusion" },

  osmoses: { correction: 'osmosis', tip: "Singular process is spelled 'osmosis'" },
  osmoisis: { correction: 'osmosis', tip: "Spelled 'osmosis'" },
  osmois: { correction: 'osmosis', tip: "Spelled 'osmosis'" },

  homeostatis: { correction: 'homeostasis', tip: "Ends with '-stasis': homeostasis" },
  homestasis: { correction: 'homeostasis', tip: "Includes 'eo': homeostasis" },
  homeostaisis: { correction: 'homeostasis', tip: "Spelled 'homeostasis'" },

  permeble: { correction: 'permeable', tip: "Spelled '-able': permeable" },
  permeblee: { correction: 'permeable', tip: "Spelled 'permeable'" },
  semipermeble: { correction: 'semi-permeable', tip: "Spelled 'semi-permeable'" },
  semipermeable: { correction: 'semi-permeable', tip: "Hyphenated or single word 'semi-permeable'" },

  // Genetics & Cell Division
  cromosome: { correction: 'chromosome', tip: "Starts with 'ch-': chromosome" },
  cromosomes: { correction: 'chromosomes', tip: "Starts with 'ch-': chromosomes" },
  chromosom: { correction: 'chromosome', tip: "Ends with an 'e': chromosome" },
  chromosoms: { correction: 'chromosomes', tip: "Ends with '-mes': chromosomes" },
  chromozome: { correction: 'chromosome', tip: "Spelled with 's': chromosome" },
  chromozomes: { correction: 'chromosomes', tip: "Spelled with 's': chromosomes" },
  chromotid: { correction: 'chromatid', tip: "Spelled 'chromatid' with 'a'" },
  chromatids: { correction: 'chromatids', tip: "Spelled 'chromatids'" },
  chromatin: { correction: 'chromatin', tip: "Spelled 'chromatin'" },

  mitosiss: { correction: 'mitosis', tip: "Ends in single 's': mitosis" },
  mitocis: { correction: 'mitosis', tip: "Spelled with 's': mitosis" },
  meoisis: { correction: 'meiosis', tip: "Spelled 'meiosis' ('ei')" },
  miosis: { correction: 'meiosis', tip: "Spelled 'meiosis'" },

  ensyme: { correction: 'enzyme', tip: "Spelled with 'z': enzyme" },
  ensymes: { correction: 'enzymes', tip: "Spelled with 'z': enzymes" },
  enzym: { correction: 'enzyme', tip: "Ends with an 'e': enzyme" },
  enzimes: { correction: 'enzymes', tip: "Spelled with 'y': enzymes" },

  eucaryote: { correction: 'eukaryote', tip: "Spelled with 'k': eukaryote" },
  eucaryotes: { correction: 'eukaryotes', tip: "Spelled with 'k': eukaryotes" },
  eukariote: { correction: 'eukaryote', tip: "Spelled with 'y': eukaryote" },
  eukariotes: { correction: 'eukaryotes', tip: "Spelled with 'y': eukaryotes" },
  eucaryotic: { correction: 'eukaryotic', tip: "Spelled with 'k': eukaryotic" },
  eukariotic: { correction: 'eukaryotic', tip: "Spelled with 'y': eukaryotic" },

  procaryote: { correction: 'prokaryote', tip: "Spelled with 'k': prokaryote" },
  procaryotes: { correction: 'prokaryotes', tip: "Spelled with 'k': prokaryotes" },
  prokariote: { correction: 'prokaryote', tip: "Spelled with 'y': prokaryote" },
  prokariotes: { correction: 'prokaryotes', tip: "Spelled with 'y': prokaryotes" },
  procaryotic: { correction: 'prokaryotic', tip: "Spelled with 'k': prokaryotic" },
  prokariotic: { correction: 'prokaryotic', tip: "Spelled with 'y': prokaryotic" },

  // Molecules & Chemistry of life
  glucoce: { correction: 'glucose', tip: "Ends with '-se': glucose" },
  glukose: { correction: 'glucose', tip: "Spelled with 'c': glucose" },
  celulose: { correction: 'cellulose', tip: "Double 'l': cellulose" },
  cellulous: { correction: 'cellulose', tip: "Ends in '-ose': cellulose" },
  protien: { correction: 'protein', tip: "'e' before 'i': protein" },
  protiens: { correction: 'proteins', tip: "'e' before 'i': proteins" },
  carbohidrate: { correction: 'carbohydrate', tip: "Spelled with 'y': carbohydrate" },
  carbohidrates: { correction: 'carbohydrates', tip: "Spelled with 'y': carbohydrates" },
  carbohydrat: { correction: 'carbohydrate', tip: "Ends with 'e': carbohydrate" },
  lipide: { correction: 'lipid', tip: "Usually spelled 'lipid' without trailing 'e'" },

  aerobik: { correction: 'aerobic', tip: "Ends in 'c': aerobic" },
  anerobic: { correction: 'anaerobic', tip: "Spelled 'anaerobic' ('an-')" },
  anarobic: { correction: 'anaerobic', tip: "Spelled 'anaerobic'" },

  nucleotied: { correction: 'nucleotide', tip: "Ends with '-tide': nucleotide" },
  nucleotids: { correction: 'nucleotides', tip: "Ends with '-tides': nucleotides" },

  homozigous: { correction: 'homozygous', tip: "Spelled with 'y': homozygous" },
  heterozigous: { correction: 'heterozygous', tip: "Spelled with 'y': heterozygous" },
  alelle: { correction: 'allele', tip: "Single 'l' first, double 'll': allele" },
  aleles: { correction: 'alleles', tip: "Spelled 'alleles'" },

  // Cellular structures & microbiology
  centriole: { correction: 'centriole', tip: "Spelled 'centriole'" },
  centrioles: { correction: 'centrioles', tip: "Spelled 'centrioles'" },
  centrosom: { correction: 'centrosome', tip: "Ends with 'e': centrosome" },
  phagocitosis: { correction: 'phagocytosis', tip: "Spelled with 'y': phagocytosis" },
  pinocitosis: { correction: 'pinocytosis', tip: "Spelled with 'y': pinocytosis" },
  pathogene: { correction: 'pathogen', tip: "Spelled 'pathogen'" },
  bakteria: { correction: 'bacteria', tip: "Spelled with 'c': bacteria" },
  bakterium: { correction: 'bacterium', tip: "Spelled with 'c': bacterium" },
};

// Target dictionary of canonical biological terms to run Levenshtein distance against
const CANONICAL_BIO_TERMS = [
  'mitochondria', 'mitochondrion', 'chloroplast', 'chloroplasts', 'chlorophyll',
  'cytoplasm', 'cytosol', 'ribosome', 'ribosomes', 'vacuole', 'vacuoles',
  'nucleus', 'nucleolus', 'organelle', 'organelles', 'membrane', 'membranes',
  'lysosome', 'lysosomes', 'photosynthesis', 'respiration', 'diffusion',
  'osmosis', 'homeostasis', 'permeable', 'semipermeable', 'chromosome', 'chromosomes',
  'chromatid', 'chromatin', 'mitosis', 'meiosis', 'enzyme', 'enzymes',
  'eukaryote', 'eukaryotes', 'eukaryotic', 'prokaryote', 'prokaryotes', 'prokaryotic',
  'glucose', 'cellulose', 'protein', 'proteins', 'carbohydrate', 'carbohydrates',
  'lipid', 'lipids', 'aerobic', 'anaerobic', 'nucleotide', 'nucleotides',
  'homozygous', 'heterozygous', 'allele', 'alleles', 'centriole', 'centrioles',
  'centrosome', 'phagocytosis', 'pinocytosis', 'pathogen', 'bacteria', 'bacterium',
  'endoplasmic', 'reticulum', 'golgi', 'vesicle', 'vesicles', 'adenosine', 'triphosphate',
];

function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export function checkBiologicalSpelling(studentText: string): SpellingCorrection[] {
  if (!studentText || typeof studentText !== 'string') return [];

  const foundCorrections: SpellingCorrection[] = [];
  const seenWords = new Set<string>();

  // Clean and split words
  const words = studentText
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4);

  for (const rawWord of words) {
    const word = rawWord.trim();
    if (!word || seenWords.has(word)) continue;

    // 1. Direct typo dictionary check
    if (COMMON_BIO_TYPOS[word]) {
      const match = COMMON_BIO_TYPOS[word];
      seenWords.add(word);
      foundCorrections.push({
        original: word,
        correction: match.correction,
        explanation: match.tip || `Correct scientific spelling is "${match.correction}"`,
      });
      continue;
    }

    // If it's already an exact match to a canonical term, skip
    if (CANONICAL_BIO_TERMS.includes(word)) {
      continue;
    }

    // 2. Fuzzy Levenshtein check against canonical terms
    // Only check if word is long enough to avoid false positives
    if (word.length >= 5) {
      let closestTerm: string | null = null;
      let minDistance = 999;

      for (const canonical of CANONICAL_BIO_TERMS) {
        // Only compare if length difference is small (<= 2)
        if (Math.abs(word.length - canonical.length) <= 2) {
          const dist = levenshteinDistance(word, canonical);
          // Allow distance of 1 (for length >= 5) or 2 (for length >= 8)
          const maxAllowed = canonical.length >= 8 ? 2 : 1;
          if (dist > 0 && dist <= maxAllowed && dist < minDistance) {
            minDistance = dist;
            closestTerm = canonical;
          }
        }
      }

      // Avoid matching common English words that happen to be near a bio term
      const commonEnglishWords = new Set([
        'their', 'there', 'where', 'which', 'about', 'these', 'those', 'other',
        'could', 'would', 'should', 'water', 'plant', 'animal', 'human', 'light',
        'sound', 'energy', 'force', 'space', 'earth', 'blood', 'heart', 'lungs',
        'brain', 'mouth', 'taste', 'smell', 'sight', 'touch', 'sense', 'sleep',
        'table', 'chair', 'house', 'field', 'small', 'large', 'point', 'state',
      ]);

      if (closestTerm && !commonEnglishWords.has(word)) {
        seenWords.add(word);
        foundCorrections.push({
          original: word,
          correction: closestTerm,
          explanation: `Spotted biological terminology spelling error: did you mean "${closestTerm}"?`,
        });
      }
    }
  }

  return foundCorrections;
}
