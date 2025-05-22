import React, { createContext, useState, useContext } from 'react';
import { Podcast } from '../../types/Podcast'; 

interface PlayerContextProps {
  currentPodcast: Podcast | null;
  setCurrentPodcast: (podcast: Podcast | null) => void;
  isPlaying: boolean;
  setIsPlaying: (state: boolean) => void;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <PlayerContext.Provider value={{ currentPodcast, setCurrentPodcast, isPlaying, setIsPlaying }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
