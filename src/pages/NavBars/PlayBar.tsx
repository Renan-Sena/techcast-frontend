import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faTimes } from '@fortawesome/free-solid-svg-icons';
import { usePlayer } from './PlayerContext';
import { API_BASE_URL } from '../../config/api';

const PlayerBar: React.FC = () => {
  const { currentPodcast, setCurrentPodcast, isPlaying, setIsPlaying } = usePlayer();
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [draggingBar, setDraggingBar] = useState(false);
  const [posX, setPosX] = useState(0);
  const dragStartX = useRef(0);
  const dragStartPosX = useRef(0);
  const [draggingProgress, setDraggingProgress] = useState(false);

  // Helper para montar URLs completas se necessário
  const getFullUrl = (url?: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  };

  useEffect(() => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.play() : audioRef.current.pause();
  }, [isPlaying, currentPodcast]);

  const handleTimeUpdate = () => {
    if (audioRef.current && !draggingProgress) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = () => {
    if (!currentPodcast) return;
    setIsPlaying(!isPlaying);
  };

  const handleClose = () => {
    setIsPlaying(false);
    setCurrentPodcast(null);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.progressBar) return;
    setDraggingBar(true);
    dragStartX.current = e.clientX;
    dragStartPosX.current = posX;
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggingBar) {
      let newPos = dragStartPosX.current + (e.clientX - dragStartX.current);
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const maxPos = window.innerWidth - containerWidth;
      newPos = Math.min(Math.max(newPos, 0), maxPos);
      setPosX(newPos);
    } else if (draggingProgress && audioRef.current && duration) {
      const progressBar = document.getElementById('progress-bar');
      if (!progressBar) return;
      const rect = progressBar.getBoundingClientRect();
      let relativeX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
      const newTime = (relativeX / rect.width) * duration;
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const handleMouseUp = () => {
    if (draggingBar) setDraggingBar(false);
    if (draggingProgress) setDraggingProgress(false);
  };

  useEffect(() => {
    if (draggingBar || draggingProgress) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingBar, draggingProgress]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    let relativeX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const newTime = (relativeX / rect.width) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDraggingProgress(true);
    handleProgressClick(e);
  };

  if (!currentPodcast) return null;

  const progressPercent = duration ? Math.min((progress / duration) * 100, 100) : 0;

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      style={{
        ...styles.playerBar,
        left: posX,
        cursor: draggingBar ? 'grabbing' : 'grab',
      }}
      title="Clique e arraste para mover a barra"
    >
      <img
        src={getFullUrl(currentPodcast.imageUrl)}
        alt={currentPodcast.title}
        style={styles.cover}
        draggable={false}
      />

      <div style={styles.info}>
        <div style={styles.title}>{currentPodcast.title}</div>
        <div style={styles.progressText}>
          {formatTime(progress)} / {formatTime(duration)}
        </div>
        <div
          id="progress-bar"
          data-progress-bar="true"
          style={{
            ...styles.progressBarBackground,
            cursor: draggingProgress ? 'grabbing' : 'pointer',
          }}
          onClick={handleProgressClick}
          onMouseDown={handleProgressMouseDown}
        >
          <div style={{ ...styles.progressBarFill, width: `${progressPercent}%` }} />
        </div>
      </div>

      <button
        onClick={togglePlay}
        style={styles.playButton}
        title={isPlaying ? 'Pausar' : 'Tocar'}
      >
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} color="#fff" />
      </button>

      <button onClick={handleClose} style={styles.closeButton} title="Fechar player">
        <FontAwesomeIcon icon={faTimes} color="#fff" />
      </button>

      <audio
        ref={audioRef}
        src={getFullUrl(currentPodcast.audioUrl)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleClose}
        onLoadedMetadata={handleLoadedMetadata}
      />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  playerBar: {
    position: 'fixed',
    bottom: 20,
    height: 70,
    backgroundColor: '#1E90FF',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 1rem',
    gap: '1rem',
    boxShadow: '0 0 15px rgba(30,144,255,0.4)',
    borderRadius: 8,
    userSelect: 'none',
    zIndex: 1000,
    minWidth: 320,
  },
  cover: {
    height: 50,
    width: 50,
    borderRadius: 6,
    objectFit: 'cover',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  progressText: {
    fontSize: 12,
    opacity: 0.9,
  },
  progressBarBackground: {
    position: 'relative',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
    transition: 'width 0.3s ease',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#104E8B',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#104E8B',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
  },
};

export default PlayerBar;
