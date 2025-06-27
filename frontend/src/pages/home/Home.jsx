import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";
import api from "@/config/api";
import "@/App.css";
import { FiSearch } from "react-icons/fi";
import ProfileDropdown from "@/components/header/ProfileDropdown";
import CreatePlaylistModal from "@/components/playlist/CreatePlaylistModal";
import { usePlayer } from "@/context/PlayerContext";

const mockPlaylists = [
  {
    id: 1,
    name: "Dan & Hayley",
    cover_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },
  {
    id: 2,
    name: "SOS",
    cover_url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
  },
  {
    id: 3,
    name: "Stranger in the Alps",
    cover_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
  },
];

// Função para saudação dinâmica
function getGreeting() {
  // Usar uma variável global que pode ser alterada via console
  const hour =
    window.testHour !== undefined ? window.testHour : new Date().getHours();
  console.log("Hora detectada para saudação:", hour);
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const Home = () => {
  const [playlists, setPlaylists] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [error, setError] = useState("");
  const [errorArtists, setErrorArtists] = useState("");
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());
  const { playMusic } = usePlayer();
  // Sugestões
  const [suggestions, setSuggestions] = useState([]);

  // Função para atualizar a saudação
  const updateGreeting = () => {
    setGreeting(getGreeting());
  };

  // Expor a função globalmente para uso no console
  React.useEffect(() => {
    window.updateHomeGreeting = updateGreeting;
    console.log("Para testar horários, use no console:");
    console.log("window.testHour = 8; // manhã");
    console.log("window.testHour = 14; // tarde");
    console.log("window.testHour = 20; // noite");
    console.log("window.updateHomeGreeting(); // atualiza a tela");
  }, []);

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
        const artistIds = followingRes.data.map(
          (item) => item.artist?.id || item.id || item
        );
        if (artistIds.length === 0) {
          setArtists([]);
        } else {
          const artistPromises = artistIds.map((id) =>
            api.get(`/api/artists/${id}`)
          );
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

  // Sugestões
  useEffect(() => {
    async function fetchSuggestions() {
      try {
        // Buscar artistas, álbuns e músicas
        const [artistsRes, albumsRes, musicsRes] = await Promise.all([
          api.get("/api/artists"),
          api.get("/api/albums"),
          api.get("/api/musics"),
        ]);
        let allSuggestions = [];
        // Adiciona tipo para renderização
        allSuggestions = [
          ...artistsRes.data.map((a) => ({ ...a, _type: "artist" })),
          ...albumsRes.data.map((a) => ({ ...a, _type: "album" })),
          ...musicsRes.data.map((m) => ({ ...m, _type: "music" })),
        ];
        // Embaralhar e pegar 5 aleatórios
        allSuggestions = allSuggestions
          .sort(() => Math.random() - 0.5)
          .slice(0, 5);
        setSuggestions(allSuggestions);
      } catch (e) {
        setSuggestions([]);
      }
    }
    fetchSuggestions();
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
      <main
        style={{
          flex: 1,
          marginLeft: 72,
          padding: "0 32px 50px 40px",
          color: "#fff",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
            marginTop: 32,
          }}
        >
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>
            {greeting}
          </h1>
          <ProfileDropdown />
        </div>

        {/* SUGESTÕES - AGORA NO TOPO */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#fff",
              marginBottom: 16,
            }}
          >
            Sugestões para você
          </h2>
          {suggestions.length === 0 ? (
            <div style={{ color: "#aaa" }}>Nenhuma sugestão no momento.</div>
          ) : (
            <div
              style={{
                display: "flex",
                gap: 24,
                marginTop: 8,
                marginBottom: 8,
              }}
            >
              {suggestions.map((item) => {
                if (item._type === "artist") {
                  return (
                    <div
                      key={"artist-" + item.id}
                      style={{
                        width: 160,
                        background: "#232428",
                        borderRadius: 12,
                        padding: 16,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        transition: "background 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#2a2a2a")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "#232428")
                      }
                      onClick={() => navigate(`/artist/${item.id}`)}
                    >
                      <div
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 50,
                          overflow: "hidden",
                          background: "#333",
                          marginBottom: 8,
                        }}
                      >
                        {item.cover_photo ? (
                          <img
                            src={item.cover_photo}
                            alt={item.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : null}
                      </div>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#fff",
                          marginBottom: 4,
                        }}
                      >
                        {item.name}
                      </span>
                      <span style={{ color: "#aaa", fontSize: 14 }}>
                        Artist
                      </span>
                    </div>
                  );
                }
                if (item._type === "album") {
                  return (
                    <div
                      key={"album-" + item.id}
                      style={{
                        width: 160,
                        background: "#232428",
                        borderRadius: 12,
                        padding: 16,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        transition: "background 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#2a2a2a")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "#232428")
                      }
                      onClick={() => navigate(`/album/${item.id}`)}
                    >
                      <div
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 12,
                          overflow: "hidden",
                          background: "#333",
                          marginBottom: 8,
                        }}
                      >
                        {item.cover_url ? (
                          <img
                            src={item.cover_url}
                            alt={item.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : null}
                      </div>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#fff",
                          marginBottom: 4,
                        }}
                      >
                        {item.title}
                      </span>
                      <span style={{ color: "#aaa", fontSize: 14 }}>Album</span>
                    </div>
                  );
                }
                if (item._type === "music") {
                  return (
                    <div
                      key={"music-" + item.id}
                      style={{
                        width: 160,
                        background: "#232428",
                        borderRadius: 12,
                        padding: 16,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        transition: "background 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#2a2a2a")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "#232428")
                      }
                      onClick={() =>
                        playMusic({ ...item, coverUrl: item.cover_url })
                      }
                    >
                      <div
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 12,
                          overflow: "hidden",
                          background: "#333",
                          marginBottom: 8,
                          position: "relative",
                        }}
                      >
                        {item.cover_url ? (
                          <img
                            src={item.cover_url}
                            alt={item.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : null}
                        <button
                          style={{
                            position: "absolute",
                            bottom: 8,
                            right: 8,
                            background: "#6E54FF",
                            border: "none",
                            borderRadius: "50%",
                            width: 36,
                            height: 36,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: 20,
                            boxShadow: "0 2px 8px rgba(110,84,255,0.18)",
                            opacity: 0.92,
                            cursor: "pointer",
                            transition: "background 0.2s",
                          }}
                          title="Play music"
                          onClick={(e) => {
                            e.stopPropagation();
                            playMusic({ ...item, coverUrl: item.cover_url });
                          }}
                        >
                          <span style={{ fontSize: 20 }}>&#9654;</span>
                        </button>
                      </div>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#fff",
                          marginBottom: 4,
                        }}
                      >
                        {item.title}
                      </span>
                      <span style={{ color: "#aaa", fontSize: 14 }}>Music</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </section>

        {/* Artistas */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#fff",
              marginBottom: 16,
            }}
          >
            Artists
          </h2>
          {loadingArtists ? (
            <div>Carregando artistas...</div>
          ) : errorArtists ? (
            <div style={{ color: "#ff4d4f" }}>{errorArtists}</div>
          ) : artists.length === 0 ? (
            <div style={{ color: "#aaa" }}>
              Nenhum artista seguido. Descubra artistas na busca!
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  marginTop: 8,
                  marginBottom: 8,
                }}
              >
                {artists.slice(0, 5).map((artist) => (
                  <div
                    key={artist.id}
                    style={{
                      width: 160,
                      background: "#232428",
                      borderRadius: 12,
                      padding: 16,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      transition: "background 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#2a2a2a")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "#232428")
                    }
                    onClick={() => navigate(`/artist/${artist.id}`)}
                  >
                    <div
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        overflow: "hidden",
                        background: "#333",
                        marginBottom: 8,
                      }}
                    >
                      {artist.cover_photo ? (
                        <img
                          src={artist.cover_photo}
                          alt={artist.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : null}
                    </div>
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#fff",
                        marginBottom: 4,
                      }}
                    >
                      {artist.name}
                    </span>
                    <span style={{ color: "#aaa", fontSize: 14 }}>Artist</span>
                  </div>
                ))}
              </div>
              {artists.length > 5 && (
                <div style={{ marginTop: 4 }}>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#6E54FF",
                      fontWeight: 600,
                      fontSize: 15,
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: 0,
                    }}
                    onClick={() => navigate("/search?filter=following")}
                  >
                    Ver todos
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Playlists cards */}
        <section>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
          >
            <h2
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "#fff",
                marginBottom: 0,
                marginRight: 16,
              }}
            >
              Playlists
            </h2>
          </div>
          {loading ? (
            <div>Carregando playlists...</div>
          ) : error ? (
            <div style={{ color: "#ff4d4f" }}>{error}</div>
          ) : playlists.length === 0 ? (
            <div style={{ color: "#aaa" }}>
              Você ainda não tem playlists. Crie uma agora!
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                gap: 24,
                marginTop: 8,
                marginBottom: 60,
              }}
            >
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  style={{
                    width: 160,
                    background: "#232428",
                    borderRadius: 12,
                    padding: 16,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  onClick={() => navigate(`/playlist/${playlist.id}`)}
                >
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 12,
                      overflow: "hidden",
                      background: "#333",
                      marginBottom: 8,
                    }}
                  >
                    {playlist.cover_url ? (
                      <img
                        src={playlist.cover_url}
                        alt={playlist.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 48,
                          color: "#fff",
                          background:
                            "linear-gradient(135deg, #6E54FF 0%, #232428 100%)",
                        }}
                      >
                        ♥
                      </div>
                    )}
                  </div>
                  <span
                    style={{ fontWeight: 600, color: "#fff", marginBottom: 8 }}
                  >
                    {playlist.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      {/* Player permanece */}
      <footer
        style={{
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
          zIndex: 100,
        }}
      >
        <span>Player (em breve)</span>
      </footer>
      {/* Modal de criar playlist */}
      {showCreate && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "#000a",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CreatePlaylistModal
            onClose={() => {
              setShowCreate(false);
              // Recarregar playlists após criar
              setLoading(true);
              api
                .get("/api/user/playlists")
                .then((res) => setPlaylists(res.data))
                .catch(() => setError("Erro ao carregar playlists"))
                .finally(() => setLoading(false));
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
