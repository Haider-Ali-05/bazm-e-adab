export interface Couplet {
  misra1: string;  // First hemistich
  misra2: string;  // Second hemistich
  index: number;
}

export interface StructuredPoem {
  title: string | null;
  type: 'ghazal' | 'nazm' | 'hamd' | 'qasida' | 'other';
  couplets: Couplet[];
  metadata: {
    coupletCount: number;
    hasRadif: boolean;
    radif: string | null;
    takhallus: string | null;
  };
}

export function detectStructure(lines: string[], knownTitle: string | null = null): StructuredPoem {
  const couplets: Couplet[] = [];
  let currentMisra1: string | null = null;
  
  // Clean lines: Remove excessive blanks, group into couplets
  let coupletIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '') {
      if (currentMisra1 !== null) {
        // We have an unpaired misra followed by a blank line. We might want to keep it as a standalone, but a couplet needs 2.
        // For robustness, pair it with an empty string or skip. Let's skip for pure couplet structure.
        currentMisra1 = null;
      }
      continue;
    }
    
    if (currentMisra1 === null) {
      currentMisra1 = line;
    } else {
      couplets.push({
        misra1: currentMisra1,
        misra2: line,
        index: coupletIndex++
      });
      currentMisra1 = null;
    }
  }

  // If there's an odd line left, we could optionally append it
  if (currentMisra1 !== null) {
     couplets.push({
       misra1: currentMisra1,
       misra2: '', // Unmatched
       index: coupletIndex
     });
  }

  // Radif Detection
  let radif: string | null = null;
  let hasRadif = false;
  let type: 'ghazal' | 'nazm' | 'hamd' | 'qasida' | 'other' = 'other';
  
  if (couplets.length > 1) {
    const matla = couplets[0];
    // Find common suffix between misra1 and misra2 of the first couplet
    const suffix = findCommonSuffix(matla.misra1, matla.misra2);
    
    if (suffix && suffix.length > 2) { // meaningful suffix
      // Check if this suffix appears at the end of misra2 in subsequent couplets
      let radifMatches = 0;
      for (let i = 1; i < couplets.length; i++) {
        if (couplets[i].misra2.endsWith(suffix)) {
          radifMatches++;
        }
      }
      
      // If majority of misra2 end with this suffix, it's a ghazal
      if (radifMatches > couplets.length / 2) {
        type = 'ghazal';
        hasRadif = true;
        radif = suffix.trim();
      }
    }
  }

  if (type === 'other') {
    // If consecutive couplets have different rhymes, it's likely a nazm
    if (couplets.length >= 2) {
      type = 'nazm';
    }
  }

  // Takhallus Detection
  let takhallus: string | null = null;
  if (type === 'ghazal' && couplets.length > 2) {
    // Takhallus usually in the last couplet (maqta)
    // Often marked with takhallus symbol ؔ (U+0614)
    const maqta = couplets[couplets.length - 1];
    const maqtaText = maqta.misra1 + ' ' + maqta.misra2;
    const takhallusMatch = maqtaText.match(/(\S+)ؔ/);
    if (takhallusMatch) {
      takhallus = takhallusMatch[1];
    }
  }

  return {
    title: knownTitle,
    type,
    couplets,
    metadata: {
      coupletCount: couplets.length,
      hasRadif,
      radif,
      takhallus
    }
  };
}

function findCommonSuffix(str1: string, str2: string): string | null {
  const tokens1 = str1.trim().split(/\s+/);
  const tokens2 = str2.trim().split(/\s+/);
  let common: string[] = [];
  
  let i = tokens1.length - 1;
  let j = tokens2.length - 1;
  
  while (i >= 0 && j >= 0 && tokens1[i] === tokens2[j]) {
    common.unshift(tokens1[i]);
    i--;
    j--;
  }
  
  return common.length > 0 ? common.join(' ') : null;
}
