// Arabic/Urdu connecting letter categories for Kashida insertion
const KASHIDA_PREFERRED = new Set([
  'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'ل', 'م', 'ن'
]);

const KASHIDA_ACCEPTABLE = new Set([
  'ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ'
]);

const NON_CONNECTING = new Set([
  'ا', 'آ', 'د', 'ذ', 'ر', 'ز', 'ژ', 'و', 'ے'
]);

const KASHIDA_CHAR = '\u0640'; // ـ

export interface AlignedCouplet {
  misra1: string;
  misra2: string;
  alignmentMethod: 'kashida' | 'stacked' | 'user_review';
  widthRatio: number;
  adjustments: {
    kashidaCount: number;
    spacingFactor: number;
    fontScaleFactor: number;
  };
}

interface KashidaPosition {
  wordIndex: number;
  charIndex: number;
  priority: number;
}

export function alignCouplet(
  misra1: string,
  misra2: string,
  options?: { maxKashidaPerWord?: number; fontScaleLimit?: number }
): AlignedCouplet {
  const maxKashidaPerWord = options?.maxKashidaPerWord ?? 3;
  
  const w1 = estimateWidth(misra1);
  const w2 = estimateWidth(misra2);
  
  const maxW = Math.max(w1, w2);
  const minW = Math.min(w1, w2);
  const ratio = minW === 0 ? 1 : maxW / minW;

  let alignedMisra1 = misra1;
  let alignedMisra2 = misra2;
  let method: 'kashida' | 'stacked' | 'user_review' = 'kashida';
  let kashidaCount = 0;
  let spacingFactor = 1.0;
  let fontScaleFactor = 1.0;

  if (ratio <= 1.5) {
    method = 'kashida';
    // Shorter misra needs stretching
    const isM1Shorter = w1 < w2;
    const targetW = maxW;
    const currentW = minW;
    let deficit = targetW - currentW;

    if (deficit > 0) {
      const shorterText = isM1Shorter ? misra1 : misra2;
      const words = shorterText.split(/\s+/);
      
      const eligiblePositions: KashidaPosition[] = [];
      
      for (let i = 0; i < words.length; i++) {
        const wordPositions = findKashidaPositions(words[i]);
        for (const pos of wordPositions) {
          eligiblePositions.push({ wordIndex: i, charIndex: pos.index, priority: pos.priority });
        }
      }
      
      // Sort by priority desc
      eligiblePositions.sort((a, b) => b.priority - a.priority);
      
      const kashidaInsertions = new Map<string, number>(); // key: "wordIdx:charIdx"
      
      // Distribute kashidas
      let added = 0;
      // Loop over positions until deficit is met, adding 1 kashida at a time
      let pass = 0;
      while (deficit > 0 && pass < maxKashidaPerWord) {
        let addedThisPass = false;
        for (const pos of eligiblePositions) {
          if (deficit <= 0) break;
          const key = `${pos.wordIndex}:${pos.charIndex}`;
          const currentCount = kashidaInsertions.get(key) || 0;
          if (currentCount < maxKashidaPerWord) {
            kashidaInsertions.set(key, currentCount + 1);
            deficit -= 0.8; // Kashida weight
            added++;
            kashidaCount++;
            addedThisPass = true;
          }
        }
        if (!addedThisPass) break;
        pass++;
      }

      // Format words with insertions
      const newWords = [...words];
      for (const [key, count] of kashidaInsertions.entries()) {
        const [wordIdx, charIdx] = key.split(':').map(Number);
        const word = newWords[wordIdx];
        const chars = Array.from(word);
        chars[charIdx] = chars[charIdx] + KASHIDA_CHAR.repeat(count);
        newWords[wordIdx] = chars.join('');
      }

      const newText = newWords.join(' ');
      if (isM1Shorter) {
        alignedMisra1 = newText;
      } else {
        alignedMisra2 = newText;
      }

      // If still deficit, tweak spacing or scale
      if (deficit > 2) {
        spacingFactor = Math.min(1.5, 1.0 + (deficit / 10));
      }
      if (deficit > 5 && spacingFactor >= 1.5) {
        fontScaleFactor = Math.max(0.92, 1.0 - (deficit / 50)); 
      }
    }
  } else if (ratio <= 2.5) {
    method = 'stacked';
  } else {
    method = 'user_review';
  }

  return {
    misra1: alignedMisra1,
    misra2: alignedMisra2,
    alignmentMethod: method,
    widthRatio: ratio,
    adjustments: {
      kashidaCount,
      spacingFactor,
      fontScaleFactor
    }
  };
}

function findKashidaPositions(word: string): { index: number; priority: number }[] {
  const chars = Array.from(word);
  const positions: { index: number; priority: number }[] = [];
  
  for (let i = 0; i < chars.length - 1; i++) {
    const c1 = chars[i];
    const c2 = chars[i+1];
    
    // Non-connecting before or after invalidates
    if (NON_CONNECTING.has(c1) || NON_CONNECTING.has(c2)) continue;
    
    // Lam-Alef ligature exception (لا)
    if (c1 === 'ل' && c2 === 'ا') continue;

    let priority = 0;
    if (KASHIDA_PREFERRED.has(c1)) {
      priority = 3;
    } else if (KASHIDA_ACCEPTABLE.has(c1)) {
      priority = 1;
    }

    if (priority > 0) {
      // Prioritize middle-of-word connections to enhance Nastaleeq aesthetics
      const positionBonus = Math.min(i, chars.length - 2 - i);
      priority += positionBonus;
      
      positions.push({ index: i, priority });
    }
  }
  return positions;
}

function estimateWidth(text: string): number {
  let width = 0;
  for (const char of Array.from(text)) {
    if (char === ' ') {
      width += 0.5;
    } else if (char === KASHIDA_CHAR) {
      width += 0.8;
    } else if (char >= '\u0610' && char <= '\u061A' || char >= '\u064B' && char <= '\u065F') {
      // Diacritics
      width += 0.0;
    } else {
      width += 1.0;
    }
  }
  return width;
}
