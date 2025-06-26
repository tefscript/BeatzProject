import React, { useState } from "react";

export default function EditPlaylistModal({ playlist, onSave, onCancel }) {
  const [name, setName] = useState(playlist?.name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      setError("O nome não pode ser vazio.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Chame a API de edição aqui se necessário
      await onSave(name);
    } catch (err) {
      setError("Erro ao salvar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#232428", borderRadius: 16, padding: 32, width: 340, boxShadow: "0 4px 32px #0006" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Rename playlist</h2>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Type here..."
        style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #444", background: "#18191A", color: "#fff", fontSize: 16, marginBottom: 18 }}
      />
      {error && <div style={{ color: "#ff4d4f", marginBottom: 12 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{ background: '#232428', color: '#fff', border: '1px solid #aaa', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
        <button onClick={handleSave} disabled={loading} style={{ background: '#6E54FF', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>{loading ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  );
} 