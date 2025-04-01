// src/lib/track-storage.ts
import { Track } from './audio-manager';

export interface TrackStorage {
  getTracks: () => Track[];
  addTrack: (track: Track) => void;
  deleteTrack: (trackId: number | string) => void;
  filterTracks: (category: string, searchQuery: string) => Track[];
}

export const createTrackStorage = (storageKey: string): TrackStorage => {
  const loadTracks = (): Track[] => {
    try {
      const savedTracks = localStorage.getItem(storageKey);
      return savedTracks ? JSON.parse(savedTracks) : [];
    } catch (error) {
      console.error('Error loading tracks from storage:', error);
      return [];
    }
  };

  const saveTracks = (tracks: Track[]): void => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tracks));
    } catch (error) {
      console.error('Error saving tracks to storage:', error);
    }
  };

  return {
    getTracks: loadTracks,
    
    addTrack: (track: Track): void => {
      const tracks = loadTracks();
      tracks.push(track);
      saveTracks(tracks);
    },
    
    deleteTrack: (trackId: number | string): void => {
      const tracks = loadTracks();
      const filteredTracks = tracks.filter(track => track.id !== trackId);
      saveTracks(filteredTracks);
    },
    
    filterTracks: (category: string, searchQuery: string): Track[] => {
      const tracks = loadTracks();
      
      return tracks.filter(track => {
        const matchesCategory = category === "All" || track.category === category;
        const matchesSearch = searchQuery === "" || 
          track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          track.artist.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesCategory && matchesSearch;
      });
    }
  };
};