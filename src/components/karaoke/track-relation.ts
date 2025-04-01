// src/lib/track-relation.ts

import { Track } from './audio-manager';

/**
 * Finds potential paired tracks (vocal/instrumental versions of the same song)
 * @param tracks All available tracks
 * @returns Array of track pairs
 */
export const findTrackPairs = (tracks: Track[]) => {
  const pairs: { vocal: Track, instrumental: Track }[] = [];
  
  // Find tracks with matching titles that form a vocal/instrumental pair
  tracks.forEach(track => {
    if (track.hasSongVersion) {
      // This is a karaoke/instrumental track with a corresponding vocal version
      const vocalVersions = tracks.filter(t => 
        // Try to find the vocal version of this instrumental track
        !t.hasSongVersion && 
        !t.isKaraokeTrack && 
        t.id !== track.id &&
        (
          // Check for similar titles
          t.title === track.title ||
          t.title.includes(track.title) ||
          track.title.includes(t.title) ||
          // Check for similar titles without "karaoke", "instrumental", etc.
          removeVersionIndicators(t.title) === removeVersionIndicators(track.title)
        ) &&
        // Same artist is a good indicator
        t.artist === track.artist
      );
      
      if (vocalVersions.length > 0) {
        // Add the first match as a pair
        pairs.push({
          vocal: vocalVersions[0],
          instrumental: track
        });
      }
    }
  });
  
  return pairs;
};

/**
 * Remove common indicators of karaoke/instrumental versions from title
 */
const removeVersionIndicators = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\(karaoke\)|\(instrumental\)|\- karaoke|\- instrumental/gi, '')
    .replace(/karaoke version|instrumental version/gi, '')
    .trim();
};

/**
 * Gets the counterpart track for a given track (vocal->instrumental or instrumental->vocal)
 */
export const getCounterpartTrack = (track: Track, allTracks: Track[]): Track | null => {
  const pairs = findTrackPairs(allTracks);
  
  // Check if this track is in any pair
  for (const pair of pairs) {
    if (pair.vocal.id === track.id) {
      return pair.instrumental;
    }
    if (pair.instrumental.id === track.id) {
      return pair.vocal;
    }
  }
  
  return null;
};

/**
 * Function to suggest a new track title based on an existing track
 * when uploading the counterpart (vocal/instrumental)
 */
export const suggestCounterpartTitle = (originalTitle: string, isInstrumental: boolean): string => {
  // Clean up any existing indicators
  const baseTitle = removeVersionIndicators(originalTitle);
  
  // Add appropriate suffix
  if (isInstrumental) {
    return `${baseTitle} (Karaoke Version)`;
  } else {
    // If we're suggesting the vocal version title, just return the clean title
    return baseTitle;
  }
};