import React from "react";

const Player = ({ music }) => {
  // music: { title, artist, coverUrl }
  return (
    <footer style={{
      position: "fixed",
      left: 72,
      right: 0,
      bottom: 0,
      height: 80,
      background: "#181818",
      borderTop: "2px solid #6E54FF",
      display: "flex",
      alignItems: "center",
      padding: "0 32px",
      color: "white",
      zIndex: 100
    }}>
      {/* Capa */}
      <div style={{ width: 56, height: 56, background: "#333", borderRadius: 8, marginRight: 20 }}>
        {music?.coverUrl && <img src={music.coverUrl} alt="cover" style={{ width: "100%", height: "100%", borderRadius: 8, objectFit: "cover" }} />}
      </div>
      {/* Info */}
      <div style={{ minWidth: 120, marginRight: 32 }}>
        <div style={{ fontWeight: 600 }}>{music?.title || "Selecione uma música"}</div>
        <div style={{ fontSize: 14, color: "#aaa" }}>{music?.artist || ""}</div>
      </div>
      {/* Controles */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button style={{ background: "none", border: "none", color: "white", fontSize: 20, cursor: "pointer" }}>&lt;&lt;</button>
        <button style={{ background: "#6E54FF", border: "none", borderRadius: "50%", width: 40, height: 40, color: "white", fontSize: 20, cursor: "pointer" }}>&#9654;</button>
        <button style={{ background: "none", border: "none", color: "white", fontSize: 20, cursor: "pointer" }}>&gt;&gt;</button>
      </div>
      {/* Barra de progresso (mock) */}
      <div style={{ flex: 1, margin: "0 32px" }}>
        <div style={{ height: 6, background: "#333", borderRadius: 3, position: "relative" }}>
          <div style={{ width: "30%", height: 6, background: "#6E54FF", borderRadius: 3 }} />
        </div>
      </div>
      {/* Volume */}
      <div style={{ width: 120, display: "flex", alignItems: "center", gap: 8 }}>
        <span role="img" aria-label="volume">🔊</span>
        <input type="range" min={0} max={100} defaultValue={70} style={{ flex: 1 }} />
      </div>
    </footer>
  );
};

export default Player; 