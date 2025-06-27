import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import api from "@/config/api";
import { usePlayer } from "@/context/PlayerContext";
import { getMultipleAlbumCovers } from "@/utils/albumCache";
import { FiSearch } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { FiChevronRight } from "react-icons/fi";
import ProfileDropdown from "@/components/header/ProfileDropdown";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Albums", value: "albums" },
  { label: "Following", value: "following" },
  { label: "Musics", value: "musics" },
  { label: "Artists", value: "artists" },
];

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    musics: [],
    artists: [],
    albums: [],
  });
  const [albumCovers, setAlbumCovers] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { playMusic } = usePlayer();
  const [followingArtists, setFollowingArtists] = useState([]);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Busca real em cada endpoint
      const [musicsRes, artistsRes, albumsRes] = await Promise.all([
        api.get(`/api/musics?search=${encodeURIComponent(query)}`),
        api.get(`/api/artists?search=${encodeURIComponent(query)}`),
        api.get(`/api/albums?search=${encodeURIComponent(query)}`),
      ]);
      setResults({
        musics: musicsRes.data,
        artists: artistsRes.data,
        albums: albumsRes.data,
      });
      // Busca as capas dos álbuns das músicas
      if (musicsRes.data) {
        const covers = await getMultipleAlbumCovers(
          musicsRes.data.map((m) => m.album_id)
        );
        setAlbumCovers(covers);
      }
    } catch (err) {
      setError("Erro ao buscar");
    } finally {
      setLoading(false);
    }
  };

  // Dispara busca ao trocar filtro
  useEffect(() => {
    // Só faz nova busca se já houver termo ou filtro não for 'all'
    if (activeFilter === "all" && !query) return;
    handleSearch();
    // eslint-disable-next-line
  }, [activeFilter]);

  // Buscar artistas seguidos ao carregar a página
  useEffect(() => {
    async function fetchFollowing() {
      try {
        const res = await api.get("/api/user/following");
        setFollowingArtists(res.data);
      } catch (err) {
        setFollowingArtists([]);
      }
    }
    fetchFollowing();
  }, []);

  // Filtro dos resultados
  const filteredResults = () => {
    if (activeFilter === "all") {
      return results;
    }
    if (activeFilter === "albums") {
      return { musics: [], artists: [], albums: results.albums };
    }
    if (activeFilter === "musics") {
      return { musics: results.musics, artists: [], albums: [] };
    }
    if (activeFilter === "artists") {
      return { musics: [], artists: results.artists, albums: [] };
    }
    if (activeFilter === "following") {
      return { musics: [], artists: followingArtists, albums: [] };
    }
    return { musics: [], artists: [], albums: [] };
  };

  const res = filteredResults();

  return (
    <div style={{ display: "flex", background: "#18191A", minHeight: "100vh" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          marginLeft: 72,
          padding: "32px 32px 50px 40px",
          color: "#fff",
          minHeight: "100vh",
        }}
      >
        {/* Barra de busca*/}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 32,
            gap: 16,
            justifyContent: "space-between",
          }}
        >
          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              alignItems: "center",
              background: "#232428",
              borderRadius: 24,
              padding: "8px 24px",
              width: 520,
              position: "relative",
            }}
          >
            <FiSearch size={22} color="#aaa" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: 15,
                marginLeft: 12,
                width: "100%",
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                style={{
                  position: "absolute",
                  right: 16,
                  background: "none",
                  border: "none",
                  color: "#aaa",
                  fontSize: 22,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
                aria-label="Limpar busca"
              >
                <IoMdClose />
              </button>
            )}
          </form>
          <div>
            <ProfileDropdown />
          </div>
        </div>
        {/* Filtros */}
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "flex-start",
            marginBottom: 32,
            marginLeft: 5,
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              style={{
                background: activeFilter === f.value ? "#35363a" : "#232428",
                color: "#fff",
                border: "none",
                borderRadius: 16,
                padding: "8px 20px",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "none",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#35363a")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background =
                  activeFilter === f.value ? "#35363a" : "#232428")
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Resultados */}
        {loading ? (
          <div style={{ textAlign: "center", color: "#aaa" }}>Buscando...</div>
        ) : error ? (
          <div style={{ textAlign: "center", color: "#ff4d4f" }}>{error}</div>
        ) : (
          <>
            {/* Albums */}
            {res.albums && res.albums.length > 0 && (
              <section style={{ marginBottom: 40 }}>
                <h2 style={{ color: "#fff", fontSize: 20, marginBottom: 16 }}>
                  Albums
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                    gap: 15,
                    justifyItems: "start",
                  }}
                >
                  {res.albums.map((album) => {
                    const artist = res.artists.find(
                      (a) => a.id === album.artist_id
                    );
                    return (
                      <div
                        key={album.id}
                        style={{
                          width: 210,
                          height: 300,
                          background: "#232428",
                          borderRadius: 3,
                          padding: 13,
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          position: "relative",
                          transition: "background 0.2s",
                          boxSizing: "border-box",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.background = "#2a2a2a")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.background = "#232428")
                        }
                        onClick={() => {
                          console.log('Navegando para álbum:', album.id, album);
                          navigate(`/album/${album.id}`);
                        }}
                      >
                        <div
                          style={{
                            width: 180,
                            height: 180,
                            borderRadius: 2,
                            overflow: "hidden",
                            background: "#333",
                            marginBottom: 18,
                            position: "relative",
                          }}
                        >
                          {album.cover_url ? (
                            <img
                              src={album.cover_url}
                              alt={album.title}
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
                            fontWeight: 700,
                            color: "#fff",
                            marginBottom: 2,
                            textAlign: "center",
                            width: "100%",
                            fontSize: 16,
                            lineHeight: 1.2,
                          }}
                        >
                          {album.title}
                        </span>
                        <span
                          style={{
                            color: "#e0e0e0",
                            fontWeight: 400,
                            fontSize: 13,
                            textAlign: "center",
                            width: "100%",
                            lineHeight: 1.2,
                            marginTop: 10,
                          }}
                        >
                          {album.artist && album.artist.name
                            ? album.artist.name
                            : "Artista desconhecido"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
            {/* Músicas */}
            {res.musics && res.musics.length > 0 && (
              <section style={{ marginBottom: 40 }}>
                <h2 style={{ color: "#fff", fontSize: 20, marginBottom: 16 }}>
                  Musics
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 24,
                    justifyItems: "start",
                  }}
                >
                  {res.musics.map((music) => {
                    const albumCover = albumCovers.get(music.album_id);
                    return (
                      <div
                        key={music.id}
                        style={{
                          width: 180,
                          background: "#232428",
                          borderRadius: 12,
                          padding: 16,
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          position: "relative",
                          transition: "background 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.background = "#2a2a2a")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.background = "#232428")
                        }
                      >
                        <div
                          style={{
                            width: 120,
                            height: 120,
                            borderRadius: 12,
                            overflow: "hidden",
                            background: "#333",
                            marginBottom: 8,
                            position: "relative",
                          }}
                        >
                          {albumCover ? (
                            <img
                              src={albumCover}
                              alt={music.title}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : null}
                          {/* Botão de play sobre a capa */}
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
                            onClick={() =>
                              playMusic({ ...music, coverUrl: albumCover })
                            }
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
                          {music.title}
                        </span>
                        <span
                          style={{
                            color: "#aaa",
                            fontSize: 14,
                            textAlign: "center",
                            width: "100%",
                          }}
                        >
                          {music.artist}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
            {/* Artistas */}
            {res.artists && res.artists.length > 0 && (
              <section style={{ marginBottom: 40 }}>
                <h2 style={{ color: "#fff", fontSize: 20, marginBottom: 16 }}>
                  Artists
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: 24,
                    justifyItems: "start",
                  }}
                >
                  {res.artists.map((artist) => (
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
                      onClick={() => {
                        console.log('Navegando para artista:', artist.id, artist);
                        navigate(`/artist/${artist.id}`);
                      }}
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
                      <span style={{ color: "#aaa", fontSize: 14 }}>
                        Artist
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {/* Placeholder amigável */}
            {!res.musics?.length &&
              !res.artists?.length &&
              !res.albums?.length && (
                <div
                  style={{
                    marginLeft: 15,
                    color: "#aaa",
                    marginTop: 64,
                    fontSize: 15,
                  }}
                >
                  Nenhum resultado encontrado. Tente buscar por outro termo!
                </div>
              )}
          </>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
