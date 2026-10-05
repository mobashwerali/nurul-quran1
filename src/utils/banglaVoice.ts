// High-fidelity Bangla Voice Engine using Google TTS audio stream + Web Speech API fallback

export function splitTextIntoChunks(text: string, maxLength: number = 150): string[] {
  const clean = text
    .replace(/\[.*?\]/g, '')
    .replace(/[০-৯0-9]+/g, '')
    .trim();

  if (!clean) return [];

  // Split on punctuation: ।, ,, ;, ?, !
  const parts = clean.split(/([।,;?!]+)/);
  const chunks: string[] = [];
  let current = '';

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part) continue;

    if ((current + part).length <= maxLength) {
      current += part;
    } else {
      if (current.trim()) chunks.push(current.trim());
      if (part.length > maxLength) {
        const words = part.split(' ');
        let wordChunk = '';
        for (const w of words) {
          if ((wordChunk + ' ' + w).length <= maxLength) {
            wordChunk = wordChunk ? wordChunk + ' ' + w : w;
          } else {
            if (wordChunk.trim()) chunks.push(wordChunk.trim());
            wordChunk = w;
          }
        }
        current = wordChunk;
      } else {
        current = part;
      }
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks.length > 0 ? chunks : [clean.slice(0, maxLength)];
}

export function getGoogleTTSUrl(text: string): string {
  return `/api/tts?text=${encodeURIComponent(text)}`;
}
