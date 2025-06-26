import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";
import api from "@/config/api";
import { usePlayer } from "@/context/PlayerContext";
import { getMultipleAlbumCovers } from "@/utils/albumCache";

const ArtistPage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [musics, setMusics] = useState([]);
  const [albumCovers, setAlbumCovers] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { playMusic } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const resArtist = await api.get(`/api/artists/${id}`);
        setArtist(resArtist.data);
        const resMusics = await api.get(`/api/artists/${id}/musics`);
        setMusics(resMusics.data);
        
        // Busca as capas dos álbuns para todas as músicas
        const albumIds = resMusics.data
          .map(music => music.album_id)
          .filter(albumId => albumId); // Remove IDs nulos/undefined
        
        if (albumIds.length > 0) {
          const covers = await getMultipleAlbumCovers(albumIds);
          setAlbumCovers(covers);
        }
      } catch (err) {
        setError("Erro ao carregar artista ou músicas");
      } finally {
        setLoading(false);
      }
    };
    fetchArtist();
  }, [id]);

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
              </div>
            </div>
            <h2 style={{ fontSize: 24, color: "#6E54FF", marginBottom: 16 }}>Músicas</h2>
            {musics.length === 0 ? (
              <div>Nenhuma música encontrada.</div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {musics.map((music) => {
                  const albumCover = music.album_id ? albumCovers.get(music.album_id) : null;
                  
                  return (
                    <li
                      key={music.id}
                      style={{ 
                        marginBottom: 12, 
                        padding: 12, 
                        background: "#232323", 
                        borderRadius: 8, 
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 12
                      }}
                      onClick={() => playMusic({
                        id: music.id,
                        title: music.title,
                        artist: artist.name,
                        coverUrl: albumCover || undefined
                      })}
                    >
                      {/* Imagem do álbum */}
                      <div style={{ width: 48, height: 48, borderRadius: 4, overflow: 'hidden', background: '#444', flexShrink: 0 }}>
                        {albumCover ? (
                          <img src={albumCover} alt="Album cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : null}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 500, display: "block" }}>{music.title}</span>
                        {/* Pode exibir duração, álbum, etc */}
                      </div>
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

export default ArtistPage; 