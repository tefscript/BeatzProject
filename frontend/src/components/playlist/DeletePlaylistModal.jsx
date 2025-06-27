import React from "react";

export default function DeletePlaylistModal({ playlist, onDelete, onCancel }) {
  return (
    <div style={{ background: "#232428", borderRadius: 16, padding: 32, width: 340, boxShadow: "0 4px 32px #0006" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Delete {playlist?.name} from your playlists</h2>
      <div style={{ color: '#aaa', fontSize: 16, marginBottom: 24 }}>
        Tem certeza que deseja deletar esta playlist? Esta ação não pode ser desfeita.
      </div>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{ background: '#232428', color: '#fff', border: '1px solid #aaa', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
        <button onClick={onDelete} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Delete</button>
      </div>
    </div>
  );
} 