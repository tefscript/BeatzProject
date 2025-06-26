import React, { createContext, useContext, useState } from "react";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [currentMusic, setCurrentMusic] = useState(null); // { title, artist, coverUrl, ... }
  const [isPlaying, setIsPlaying] = useState(false);

  const playMusic = (music) => {
    setCurrentMusic(music);
    setIsPlaying(true);
  };

  const pauseMusic = () => setIsPlaying(false);
  const resumeMusic = () => setIsPlaying(true);

  return (
    <PlayerContext.Provider value={{ currentMusic, isPlaying, playMusic, pauseMusic, resumeMusic }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
} 