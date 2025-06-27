import React, { useRef, useState, useEffect } from "react";

const Player = ({ music }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    // Sempre que trocar de música, reseta progresso e inicia a reprodução automaticamente
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load();
    }
    if (music?.url) {
      setIsPlaying(true);
      setTimeout(() => {
        audioRef.current && audioRef.current.play();
      }, 0);
    } else {
      setIsPlaying(false);
    }
  }, [music?.url]);

  const handlePlayPause = () => {
    if (!music?.url) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressBarChange = (e) => {
    const value = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setProgress(value);
    }
  };

  const handleVolumeChange = (e) => {
    const value = Number(e.target.value) / 100;
    setVolume(value);
  };

  return (
    <footer
      style={{
        position: "fixed",
        left: 72,
        right: 0,
        bottom: 0,
        height: 90,
        background: "linear-gradient(90deg, #232428 0%, #18191A 100%)",
        borderTop: "2px solid #6E54FF",
        display: "flex",
        alignItems: "center",
        padding: "0 40px",
        color: "white",
        zIndex: 100,
        boxShadow: '0 -2px 24px #0008',
      }}
    >
      {/* Capa */}
      <div
        style={{
          width: 64,
          height: 64,
          background: "#18191A",
          borderRadius: 16,
          marginRight: 28,
          boxShadow: '0 2px 12px #0006',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {music?.coverUrl && (
          <img
            src={music.coverUrl}
            alt="cover"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 16,
              objectFit: "cover",
              boxShadow: '0 2px 12px #0006',
            }}
          />
        )}
      </div>
      {/* Info */}
      <div style={{ minWidth: 140, marginRight: 40, maxWidth: 220, overflow: 'hidden' }}>
        <div style={{ fontWeight: 700, fontSize: 18, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {music?.title || "Selecione uma música"}
        </div>
        <div style={{ fontSize: 15, color: "#b3b3b3", fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{music?.artist || ""}</div>
      </div>
      {/* Controles */}
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginRight: 32 }}>
        <button
          style={{
            background: "none",
            border: "none",
            color: "#b3b3b3",
            fontSize: 28,
            cursor: "not-allowed",
            borderRadius: 12,
            padding: 8,
            transition: 'background 0.2s, color 0.2s',
          }}
          disabled
        >
          &#9198;
        </button>
        <button
          style={{
            background: isPlaying ? "#fff" : "#6E54FF",
            border: "none",
            borderRadius: "50%",
            width: 56,
            height: 56,
            color: isPlaying ? "#6E54FF" : "#fff",
            fontSize: 32,
            cursor: music?.url ? "pointer" : "not-allowed",
            opacity: music?.url ? 1 : 0.5,
            boxShadow: isPlaying ? '0 2px 12px #6E54FF44' : '0 2px 12px #0006',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s, color 0.2s',
          }}
          onClick={handlePlayPause}
          disabled={!music?.url}
        >
          {isPlaying ? <span>&#10073;&#10073;</span> : <span>&#9654;</span>}
        </button>
        <button
          style={{
            background: "none",
            border: "none",
            color: "#b3b3b3",
            fontSize: 28,
            cursor: "not-allowed",
            borderRadius: 12,
            padding: 8,
            transition: 'background 0.2s, color 0.2s',
          }}
          disabled
        >
          &#9197;
        </button>
      </div>
      {/* Barra de progresso real */}
      <div style={{ flex: 1, margin: "0 32px", display: 'flex', alignItems: 'center', gap: 16 }}>
        <input
          type="range"
          min={0}
          max={duration || 1}
          value={progress}
          onChange={handleProgressBarChange}
          style={{
            flex: 1,
            height: 6,
            borderRadius: 3,
            outline: 'none',
            boxShadow: '0 1px 6px #0004',
            cursor: music?.url ? 'pointer' : 'not-allowed',
            transition: 'accent-color 0.2s',
            background: `linear-gradient(90deg, #6E54FF ${(progress/(duration||1))*100}%, #232428 ${(progress/(duration||1))*100}%)`,
            accentColor: '#6E54FF',
          }}
          disabled={!music?.url}
        />
        <span style={{ fontSize: 13, color: '#b3b3b3', minWidth: 60, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
          {formatTime(progress)} / {formatTime(duration)}
        </span>
      </div>
      {/* Volume */}
      <div
        style={{ width: 120, display: "flex", alignItems: "center", gap: 10 }}
      >
        <span role="img" aria-label="volume" style={{ fontSize: 20, color: '#b3b3b3' }}>
          🔊
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(volume * 100)}
          onChange={handleVolumeChange}
          style={{
            width: 70,
            accentColor: '#6E54FF',
            height: 4,
            borderRadius: 2,
            background: '#232428',
            outline: 'none',
            boxShadow: '0 1px 4px #0003',
            cursor: 'pointer',
            marginLeft: 4,
          }}
        />
      </div>
      {/* Elemento de áudio real */}
      {music?.url && (
        <audio
          ref={audioRef}
          src={music.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      )}
    </footer>
  );
};

function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default Player;
