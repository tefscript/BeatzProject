import { useState } from "react";
import "@/components/playlist/CreatePlaylistModal.css";

export default function CreatePlaylistModal({ onClose }) {
  const [playlistName, setPlaylistName] = useState("");

  const handleCreate = async () => {
    if (!playlistName.trim()) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Você precisa estar logado para criar uma playlist.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: playlistName,
          cover_url: null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert("Erro: " + (data.error || "Erro ao criar playlist"));
        return;
      }

      alert(`Playlist "${data.playlist.name}" criada com sucesso!`);

      if (onClose) onClose(); // Fecha o modal
    } catch (err) {
      console.error("Erro ao criar playlist:", err);
      alert("Erro interno ao criar a playlist.");
    }
  };


  return (
    <div className="body-create-playlist">
      <div className="container-create-playlist">
        <h1 className="text1-create-playlist">
          Create a <br /> Playlist
        </h1>

        <hr className="hr-create-playlist" />

        <div className="create-playlist-form">
          <label htmlFor="playlist-name" className="create-playlist-label">
            WHAT’S THE NAME OF YOUR NEW PLAYLIST?
          </label>
          <br/>
          <br/>
          <input
            id="playlist-name"
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Type here..."
            className="create-playlist-input"
          />
        </div>

        <div className="create-playlist-button">
          <button onClick={handleCreate} className="cp-button">
            CREATE
          </button>
        </div>
      </div>
    </div>
  );
}
