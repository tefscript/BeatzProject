import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";
import api from "@/config/api";
import { usePlayer } from "@/context/PlayerContext";
import { getMultipleAlbumCovers } from "@/utils/albumCache";
import { useUser } from "@/context/UserContext";

const ArtistPage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [musics, setMusics] = useState([]);
  const [albumCovers, setAlbumCovers] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const { playMusic } = usePlayer();
  const { user } = useUser();

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        console.log('Buscando artista com id:', id);
        const resArtist = await api.get(`/api/artists/${id}`);
        setArtist(resArtist.data);
        const resMusics = await api.get(`/api/artists/${id}/songs`);
        setMusics(resMusics.data);
        
        // Busca as capas dos álbuns para todas as músicas
        const albumIds = resMusics.data
          .map(music => music.album_id)
          .filter(albumId => albumId); // Remove IDs nulos/undefined
        
        if (albumIds.length > 0) {
          const covers = await getMultipleAlbumCovers(albumIds);
          setAlbumCovers(covers);
        }
        // Verifica se o usuário já segue esse artista
        const followingRes = await api.get('/api/user/following');
        const followingIds = followingRes.data.map(a => a?.id || a?.artist?.id || a);
        setIsFollowing(followingIds.includes(Number(id)) || followingIds.includes(id));
      } catch (err) {
        console.error('Erro ao buscar artista:', err, err?.response);
        if (err?.response?.data?.error) {
          setError('Erro ao buscar artista: ' + err.response.data.error);
        } else if (err?.response?.status === 404) {
          setError('Artista não encontrado.');
        } else if (err?.response?.status === 401) {
          setError('Sessão expirada. Faça login novamente.');
        } else {
          setError('Erro ao carregar artista ou músicas');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchArtist();
  }, [id]);

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      await api.post('/api/user/follow', { artistId: id });
      setIsFollowing(true);
    } catch {
      alert('Erro ao seguir artista.');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setFollowLoading(true);
    try {
      await api.delete(`/api/user/unfollow`, { data: { artistId: id } });
      setIsFollowing(false);
    } catch {
      alert('Erro ao deixar de seguir artista.');
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", background: "#1e1e1e", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 72, padding: 32, color: "white" }}>
        {loading ? (
          <div>Carregando artista...</div>
        ) : error ? (
          <div style={{ color: "#ff4d4f" }}>{error}</div>
        ) : artist ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 32 }}>
              <div style={{ width: 200, height: 200, borderRadius: 16, overflow: 'hidden', background: '#333' }}>
                {artist.cover_photo ? (
                  <img src={artist.cover_photo} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : null}
              </div>
              <div>
                <h1 style={{ fontSize: 40, fontWeight: 700 }}>{artist.name}</h1>
                {/* Botão de seguir, etc, pode ser adicionado aqui */}
                {user && (
                  <button
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                    disabled={followLoading}
                    style={{
                      background: isFollowing ? '#232428' : '#6E54FF',
                      color: isFollowing ? '#6E54FF' : '#fff',
                      border: isFollowing ? '1.5px solid #6E54FF' : 'none',
                      borderRadius: 12,
                      padding: '10px 28px',
                      fontWeight: 700,
                      fontSize: 18,
                      marginTop: 18,
                      marginLeft: 0,
                      cursor: followLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isFollowing ? 'none' : '0 2px 12px #6E54FF33',
                    }}
                  >
                    {followLoading
                      ? '...'
                      : isFollowing
                        ? 'Seguindo'
                        : 'Seguir'}
                  </button>
                )}
              </div>
            </div>
            <h2 style={{ fontSize: 24, color: "#6E54FF", marginBottom: 16 }}>Músicas</h2>
            {musics.length === 0 ? (
              <div>Nenhuma música encontrada.</div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {musics.map((music) => {
                  const albumCover = music.cover_url || (music.album_id ? albumCovers.get(music.album_id) : null);
                  return (
                    <li
                      key={music.id}
                      style={{ 
                        marginBottom: 12, 
                        padding: 12, 
                        background: "#232323", 
                        borderRadius: 8, 
                        display: "flex",
                        alignItems: "center",
                        gap: 12
                      }}
                    >
                      {/* Imagem do álbum */}
                      <div style={{ width: 48, height: 48, borderRadius: 4, overflow: 'hidden', background: '#444', flexShrink: 0 }}>
                        {albumCover ? (
                          <img src={albumCover} alt="Album cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : null}
                      </div>
                      <div style={{ flex: 2, fontWeight: 500 }}>{music.title}</div>
                      <div style={{ flex: 1, color: '#aaa', textAlign: 'right' }}>{formatDuration(music.duration)}</div>
                      {music.url && (
                        <a href={music.url} target="_blank" rel="noopener noreferrer" style={{ color: '#6E54FF', marginLeft: 8, fontSize: 18 }} title="Ouvir/baixar">
                          &#128191;
                        </a>
                      )}
                      <button onClick={() => playMusic(music)} style={{ marginLeft: 8, background: '#6E54FF', border: 'none', borderRadius: 8, color: '#fff', padding: '8px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 16 }} title="Tocar">
                        ▶
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
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

export default ArtistPage; 