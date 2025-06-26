import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";
import api from "@/config/api";
import "@/App.css";
import { FiSearch } from "react-icons/fi";
import ProfileDropdown from "@/components/header/ProfileDropdown";
import CreatePlaylistModal from "@/components/playlist/CreatePlaylistModal";

const mockPlaylists = [
  { id: 1, name: "Dan & Hayley", cover_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
  { id: 2, name: "SOS", cover_url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca" },
  { id: 3, name: "Stranger in the Alps", cover_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4" },
];

const Home = () => {
  const [playlists, setPlaylists] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [error, setError] = useState("");
  const [errorArtists, setErrorArtists] = useState("");
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await api.get("/api/user/playlists");
        setPlaylists(response.data);
      } catch (err) {
        setError("Erro ao carregar playlists");
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoadingArtists(true);
      try {
        const followingRes = await api.get("/api/user/following");
        const artistIds = followingRes.data.map((item) => item.artist_id || item); // compatível com ambos formatos
        if (artistIds.length === 0) {
          setArtists([]);
        } else {
          const artistPromises = artistIds.map((id) => api.get(`/api/artists/${id}`));
          const artistResults = await Promise.allSettled(artistPromises);
          const artistsData = artistResults
            .filter((r) => r.status === "fulfilled")
            .map((r) => r.value.data);
          setArtists(artistsData);
        }
      } catch (err) {
        setErrorArtists("Erro ao carregar artistas seguidos");
      } finally {
        setLoadingArtists(false);
      }
    };
    fetchArtists();
  }, []);

  // Handler para pesquisa
  const [search, setSearch] = useState("");
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/search?query=${encodeURIComponent(search)}`);
  };

  return (
    <div style={{ display: "flex", background: "#18191A", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 72, padding: 32, color: "#fff", minHeight: "100vh" }}>
        {/* Top bar com search e perfil */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 24, gap: 24 }}>
          <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", background: "#232428", borderRadius: 24, padding: "4px 16px", width: 320 }}>
            <FiSearch size={20} color="#aaa" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: 16,
                marginLeft: 8,
                width: "100%"
              }}
            />
          </form>
          <ProfileDropdown />
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Good morning</h1>

        {/* Playlists horizontais (mock se vazio) */}
        <div style={{ display: "flex", gap: 24, marginBottom: 40, alignItems: 'center' }}>
          {loading ? (
            <div>Carregando playlists...</div>
          ) : error ? (
            <div style={{ color: "#ff4d4f" }}>{error}</div>
          ) : playlists.length === 0 ? (
            <>
              <div style={{ color: "#aaa" }}>Você ainda não tem playlists. Crie uma agora!</div>
              <button
                style={{ marginLeft: 24, background: '#6E54FF', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontSize: 16 }}
                onClick={() => setShowCreate(true)}
              >
                + Criar Playlist
              </button>
            </>
          ) : (
            playlists.map((playlist) => (
              <div
                key={playlist.id}
                style={{ width: 180, height: 60, background: "#232428", borderRadius: 12, display: "flex", alignItems: "center", gap: 16, cursor: "pointer", padding: 8 }}
                onClick={() => navigate(`/playlist/${playlist.id}`)}
              >
                <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', background: '#333' }}>
                  {playlist.cover_url ? (
                    <img src={playlist.cover_url} alt={playlist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      color: '#fff',
                      background: 'linear-gradient(135deg, #6E54FF 0%, #232428 100%)'
                    }}>
                      ♥
                    </div>
                  )}
                </div>
                <span style={{ color: "#fff", fontWeight: 600 }}>{playlist.name}</span>
              </div>
            ))
          )}
        </div>

        {/* Artistas */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#6E54FF", marginBottom: 16 }}>Artists</h2>
          {loadingArtists ? (
            <div>Carregando artistas...</div>
          ) : errorArtists ? (
            <div style={{ color: "#ff4d4f" }}>{errorArtists}</div>
          ) : artists.length === 0 ? (
            <div style={{ color: "#aaa" }}>Nenhum artista seguido. Descubra artistas na busca!</div>
          ) : (
            <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
              {artists.map((artist) => (
                <div
                  key={artist.id}
                  style={{ width: 160, textAlign: "center", background: "#232428", borderRadius: 12, padding: 16, cursor: "pointer" }}
                  onClick={() => navigate(`/artist/${artist.id}`)}
                >
                  <div style={{ width: 100, height: 100, borderRadius: 50, overflow: 'hidden', background: '#333', margin: '0 auto 12px' }}>
                    {artist.cover_photo ? (
                      <img src={artist.cover_photo} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : null}
                  </div>
                  <span style={{ fontWeight: 600 }}>{artist.name}</span>
                  <div style={{ color: "#aaa", fontSize: 14 }}>Artist</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Playlists cards */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#6E54FF", marginBottom: 0, marginRight: 16 }}>Playlists</h2>
            <button
              style={{ background: '#6E54FF', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}
              onClick={() => setShowCreate(true)}
            >
              + Criar Playlist
            </button>
          </div>
          {loading ? (
            <div>Carregando playlists...</div>
          ) : error ? (
            <div style={{ color: "#ff4d4f" }}>{error}</div>
          ) : playlists.length === 0 ? (
            <div style={{ color: "#aaa" }}>Você ainda não tem playlists. Crie uma agora!</div>
          ) : (
            <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  style={{ width: 160, background: "#232428", borderRadius: 12, padding: 16, cursor: "pointer", display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  onClick={() => navigate(`/playlist/${playlist.id}`)}
                >
                  <div style={{ width: 120, height: 120, borderRadius: 12, overflow: 'hidden', background: '#333', marginBottom: 8 }}>
                    {playlist.cover_url ? (
                      <img src={playlist.cover_url} alt={playlist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 48,
                        color: '#fff',
                        background: 'linear-gradient(135deg, #6E54FF 0%, #232428 100%)'
                      }}>
                        ♥
                      </div>
                    )}
                  </div>
                  <span style={{ fontWeight: 600, color: "#fff", marginBottom: 8 }}>{playlist.name}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      {/* Player permanece */}
      <footer style={{ position: "fixed", left: 72, right: 0, bottom: 0, height: 80, background: "#181818", borderTop: "2px solid #6E54FF", display: "flex", alignItems: "center", padding: "0 32px", color: "white", zIndex: 100 }}>
        <span>Player (em breve)</span>
      </footer>
      {/* Modal de criar playlist */}
      {showCreate && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000a', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CreatePlaylistModal onClose={() => {
            setShowCreate(false);
            // Recarregar playlists após criar
            setLoading(true);
            api.get("/api/user/playlists").then(res => setPlaylists(res.data)).catch(() => setError("Erro ao carregar playlists")).finally(() => setLoading(false));
          }} />
        </div>
      )}
    </div>
  );
};

export default Home; 