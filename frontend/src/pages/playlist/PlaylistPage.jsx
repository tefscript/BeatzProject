import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";
import api from "@/config/api";
import { usePlayer } from "@/context/PlayerContext";
import { getMultipleAlbumCovers } from "@/utils/albumCache";
import { FiEdit2, FiPlay, FiUser, FiTrash2, FiPlus } from "react-icons/fi";
import ProfileDropdown from "@/components/header/ProfileDropdown";
import EditPlaylistModal from "@/components/playlist/EditPlaylistModal";
import DeletePlaylistModal from "@/components/playlist/DeletePlaylistModal";
import CreatePlaylistModal from "@/components/playlist/CreatePlaylistModal";

const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [musics, setMusics] = useState([]);
  const [albumCovers, setAlbumCovers] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { playMusic } = usePlayer();
  const [showAddMusic, setShowAddMusic] = useState(false);
  const [searchMusic, setSearchMusic] = useState("");
  const [availableMusics, setAvailableMusics] = useState([]);
  const [loadingAvailable, setLoadingAvailable] = useState(false);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const resPlaylist = await api.get(`/api/playlists/${id}`);
        setPlaylist(resPlaylist.data);
        if (resPlaylist.data.musics) {
          setMusics(resPlaylist.data.musics);
          const covers = await getMultipleAlbumCovers(resPlaylist.data.musics.map(m => m.album_id));
          setAlbumCovers(covers);
        } else {
          setMusics([]);
        }
      } catch (err) {
        setError("Erro ao carregar playlist");
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [id]);

  // Editar playlist
  const handleEdit = async (newName) => {
    try {
      await api.put(`/api/playlists/${id}`, { name: newName });
      setPlaylist((p) => ({ ...p, name: newName }));
      setShowEdit(false);
    } catch (err) {
      alert("Erro ao editar playlist");
    }
  };

  // Deletar playlist
  const handleDelete = async () => {
    try {
      await api.delete(`/api/playlists/${id}`);
      setShowDelete(false);
      navigate("/");
    } catch (err) {
      alert("Erro ao deletar playlist");
    }
  };

  // Função para buscar músicas disponíveis
  const fetchAvailableMusics = async (query = "") => {
    setLoadingAvailable(true);
    try {
      const res = await api.get(`/api/musics${query ? `?search=${encodeURIComponent(query)}` : ""}`);
      setAvailableMusics(res.data);
    } catch {
      setAvailableMusics([]);
    } finally {
      setLoadingAvailable(false);
    }
  };

  // Adicionar música à playlist
  const handleAddMusic = async (songId) => {
    try {
      await api.post(`/api/playlists/${id}/songs`, { songId });
      setShowAddMusic(false);
      // Atualizar lista de músicas
      setLoading(true);
      const resPlaylist = await api.get(`/api/playlists/${id}`);
      setPlaylist(resPlaylist.data);
      if (resPlaylist.data.musics) {
        setMusics(resPlaylist.data.musics);
        const covers = await getMultipleAlbumCovers(resPlaylist.data.musics.map(m => m.album_id));
        setAlbumCovers(covers);
      } else {
        setMusics([]);
      }
    } catch {
      alert("Erro ao adicionar música");
    }
  };

  // Remover música da playlist
  const handleRemoveMusic = async (songId) => {
    try {
      await api.delete(`/api/playlists/${id}/songs`, { data: { songId } });
      // Atualizar lista de músicas
      setLoading(true);
      const resPlaylist = await api.get(`/api/playlists/${id}`);
      setPlaylist(resPlaylist.data);
      if (resPlaylist.data.musics) {
        setMusics(resPlaylist.data.musics);
        const covers = await getMultipleAlbumCovers(resPlaylist.data.musics.map(m => m.album_id));
        setAlbumCovers(covers);
      } else {
        setMusics([]);
      }
    } catch {
      alert("Erro ao remover música");
    }
  };

  return (
    <div style={{ display: "flex", background: "#18191A", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 72, padding: 32, color: "#fff", minHeight: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 24 }}>
          <ProfileDropdown />
        </div>
        {loading ? (
          <div style={{ color: "#aaa" }}>Carregando playlist...</div>
        ) : error ? (
          <div style={{ color: "#ff4d4f" }}>{error}</div>
        ) : playlist ? (
          <>
            {/* Header da playlist */}
            <div style={{ display: "flex", alignItems: "center", gap: 40, marginBottom: 40 }}>
              <div style={{ width: 200, height: 200, borderRadius: 24, overflow: 'hidden', background: 'linear-gradient(135deg, #6E54FF 0%, #232428 100%)', boxShadow: '0 4px 32px #0004' }}>
                {playlist.cover_url ? (
                  <img src={playlist.cover_url} alt={playlist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, color: '#fff', background: 'linear-gradient(135deg, #6E54FF 0%, #232428 100%)' }}>♥</div>
                )}
              </div>
              <div>
                <div style={{ color: "#aaa", fontWeight: 600, fontSize: 18, marginBottom: 8 }}>PLAYLIST</div>
                <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 12, background: 'linear-gradient(90deg, #fff 60%, #6E54FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{playlist.name}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <FiUser size={20} color="#aaa" />
                  <span style={{ color: '#aaa', fontWeight: 500 }}>{playlist.owner_name || 'Usuário'}</span>
                  <span style={{ color: '#aaa', fontWeight: 400 }}>&bull; {musics.length} songs</span>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <button style={{ background: '#6E54FF', color: '#fff', border: 'none', borderRadius: 24, padding: '10px 28px', fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px #0002' }}>
                    <FiPlay size={22} style={{ marginRight: 8, verticalAlign: -3 }} /> Play
                  </button>
                  <button style={{ background: '#232428', color: '#fff', border: '1px solid #6E54FF', borderRadius: 24, padding: '10px 28px', fontWeight: 700, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setShowEdit(true)}>
                    <FiEdit2 size={20} style={{ marginRight: 8, verticalAlign: -3 }} /> Edit
                  </button>
                  <button style={{ background: '#232428', color: '#ff4d4f', border: '1px solid #ff4d4f', borderRadius: 24, padding: '10px 28px', fontWeight: 700, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setShowDelete(true)}>
                    <FiTrash2 size={20} style={{ marginRight: 8, verticalAlign: -3 }} /> Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Modais */}
            {showEdit && <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000a', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EditPlaylistModal playlist={playlist} onSave={handleEdit} onCancel={() => setShowEdit(false)} />
            </div>}
            {showDelete && <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000a', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DeletePlaylistModal playlist={playlist} onDelete={handleDelete} onCancel={() => setShowDelete(false)} />
            </div>}

            {/* Lista de músicas */}
            <div style={{ background: '#232428', borderRadius: 16, padding: 24, minHeight: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', color: '#aaa', fontWeight: 600, fontSize: 16 }}>
                  <div style={{ flex: 3 }}>TITLE</div>
                  <div style={{ flex: 2 }}>ALBUM</div>
                  <div style={{ flex: 1, textAlign: 'right' }}>TIME</div>
                </div>
                <button style={{ background: '#6E54FF', color: '#fff', border: 'none', borderRadius: 24, padding: '8px 20px', fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => { setShowAddMusic(true); fetchAvailableMusics(); }}>
                  <FiPlus size={20} /> Adicionar música
                </button>
              </div>
              {musics.length === 0 ? (
                <div style={{ color: '#aaa', textAlign: 'center', padding: 32 }}>Nenhuma música nesta playlist.</div>
              ) : (
                musics.map((music) => {
                  const albumCover = albumCovers.get(music.album_id);
                  return (
                    <div key={music.id} style={{ display: 'flex', alignItems: 'center', borderRadius: 8, padding: '10px 0', cursor: 'pointer', transition: 'background 0.2s', gap: 16 }} onClick={() => playMusic({ ...music, coverUrl: albumCover })}>
                      <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', background: '#333', marginRight: 12 }}>
                        {albumCover ? (
                          <img src={albumCover} alt={music.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : null}
                      </div>
                      <div style={{ flex: 3, fontWeight: 600 }}>{music.title}</div>
                      <div style={{ flex: 2, color: '#aaa' }}>{music.album_name || '-'}</div>
                      <div style={{ flex: 1, textAlign: 'right', color: '#aaa' }}>{music.duration || '--:--'}</div>
                      <button style={{ background: 'none', border: 'none', color: '#ff4d4f', marginLeft: 16, cursor: 'pointer' }} title="Remover da playlist" onClick={e => { e.stopPropagation(); handleRemoveMusic(music.id); }}>
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal de adicionar música */}
            {showAddMusic && (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000a', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: '#232428', borderRadius: 16, padding: 32, minWidth: 400, maxHeight: 600, overflowY: 'auto', boxShadow: '0 4px 32px #0008', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 22 }}>Adicionar música</h2>
                    <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }} onClick={() => setShowAddMusic(false)}>&times;</button>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar música..."
                    value={searchMusic}
                    onChange={e => { setSearchMusic(e.target.value); fetchAvailableMusics(e.target.value); }}
                    style={{ background: '#18191A', border: '1px solid #444', borderRadius: 8, color: '#fff', padding: 10, fontSize: 16, marginBottom: 12 }}
                  />
                  {loadingAvailable ? (
                    <div style={{ color: '#aaa' }}>Carregando músicas...</div>
                  ) : availableMusics.length === 0 ? (
                    <div style={{ color: '#aaa' }}>Nenhuma música encontrada.</div>
                  ) : (
                    availableMusics.map(music => (
                      <div key={music.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 0', borderBottom: '1px solid #333' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', background: '#333' }}>
                          {music.cover_url ? (
                            <img src={music.cover_url} alt={music.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : null}
                        </div>
                        <div style={{ flex: 3 }}>
                          <div style={{ color: '#fff', fontWeight: 600 }}>{music.title}</div>
                          <div style={{ color: '#aaa', fontSize: 14 }}>{music.artist_name || '-'}</div>
                        </div>
                        <button style={{ background: '#6E54FF', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 15 }} onClick={() => handleAddMusic(music.id)}>
                          Adicionar
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
};

export default PlaylistPage; 