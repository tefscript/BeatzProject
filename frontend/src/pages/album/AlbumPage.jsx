import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";
import api from "@/config/api";
import { usePlayer } from "@/context/PlayerContext";
import ProfileDropdown from "@/components/header/ProfileDropdown";

const AlbumPage = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { playMusic } = usePlayer();

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const resAlbum = await api.get(`/api/albums/${id}`);
        setAlbum(resAlbum.data);
        const resMusics = await api.get(`/api/albums/${id}/songs`);
        setMusics(resMusics.data);
      } catch (err) {
        console.error('Erro ao carregar álbum:', err, err?.response);
        if (err?.response?.data?.error) {
          setError('Erro ao carregar álbum: ' + err.response.data.error);
        } else if (err?.response?.status === 404) {
          setError('Álbum não encontrado.');
        } else if (err?.response?.status === 401) {
          setError('Sessão expirada. Faça login novamente.');
        } else {
          setError('Erro ao carregar álbum');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [id]);

  return (
    <div style={{ display: "flex", background: "#18191A", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 72, padding: 32, color: "#fff", minHeight: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 24 }}>
          <ProfileDropdown />
        </div>
        {loading ? (
          <div style={{ color: "#aaa" }}>Carregando álbum...</div>
        ) : error ? (
          <div style={{ color: "#ff4d4f" }}>{error}</div>
        ) : album ? (
          <>
            {/* Header do álbum */}
            <div style={{ display: "flex", alignItems: "center", gap: 40, marginBottom: 40 }}>
              <div style={{ width: 200, height: 200, borderRadius: 24, overflow: 'hidden', background: 'linear-gradient(135deg, #6E54FF 0%, #232428 100%)', boxShadow: '0 4px 32px #0004' }}>
                {album.cover_url ? (
                  <img src={album.cover_url} alt={album.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, color: '#fff', background: 'linear-gradient(135deg, #6E54FF 0%, #232428 100%)' }}>♪</div>
                )}
              </div>
              <div>
                <div style={{ color: "#aaa", fontWeight: 600, fontSize: 18, marginBottom: 8 }}>ALBUM</div>
                <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 12, background: 'linear-gradient(90deg, #fff 60%, #6E54FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{album.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <span style={{ color: '#aaa', fontWeight: 500 }}>{album.artist_name || '-'}</span>
                  <span style={{ color: '#aaa', fontWeight: 400 }}>&bull; {musics.length} songs</span>
                </div>
              </div>
            </div>
            {/* Lista de músicas */}
            <div style={{ background: '#232428', borderRadius: 16, padding: 24, minHeight: 200 }}>
              <div style={{ display: 'flex', color: '#aaa', fontWeight: 600, fontSize: 16, marginBottom: 16 }}>
                <div style={{ flex: 3 }}>TITLE</div>
                <div style={{ flex: 1 }}>TIME</div>
              </div>
              {musics.length === 0 ? (
                <div style={{ color: '#aaa', textAlign: 'center', padding: 32 }}>Nenhuma música neste álbum.</div>
              ) : (
                musics.map((music) => (
                  <div key={music.id} style={{ display: 'flex', alignItems: 'center', borderRadius: 8, padding: '10px 0', cursor: 'pointer', transition: 'background 0.2s', gap: 16 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', background: '#333', marginRight: 12 }}>
                      {album.cover_url ? (
                        <img src={album.cover_url} alt={music.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : null}
                    </div>
                    <div style={{ flex: 3, fontWeight: 600 }}>{music.title}</div>
                    <div style={{ flex: 1, color: '#aaa', textAlign: 'right' }}>{formatDuration(music.duration)}</div>
                    {music.url && (
                      <a href={music.url} target="_blank" rel="noopener noreferrer" style={{ color: '#6E54FF', marginLeft: 12, fontSize: 18 }} title="Ouvir/baixar">
                        &#128191;
                      </a>
                    )}
                    <button onClick={() => playMusic(music)} style={{ marginLeft: 12, background: '#6E54FF', border: 'none', borderRadius: 8, color: '#fff', padding: '8px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 16 }} title="Tocar">
                      ▶
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
};

// Função utilitária para formatar duração em segundos para mm:ss
function formatDuration(seconds) {
  if (!seconds) return '--:--';
  const min = Math.floor(seconds / 60);
  const sec = (seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

export default AlbumPage; 