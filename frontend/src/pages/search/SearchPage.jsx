import React, { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import api from "@/config/api";
import { usePlayer } from "@/context/PlayerContext";
import { getMultipleAlbumCovers } from "@/utils/albumCache";
import { FiSearch } from "react-icons/fi";
import ProfileDropdown from "@/components/header/ProfileDropdown";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Albums", value: "albums" },
  { label: "Following", value: "following" },
  { label: "Musics", value: "musics" },
  { label: "Artists", value: "artists" },
];

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ musics: [], artists: [], albums: [] });
  const [albumCovers, setAlbumCovers] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { playMusic } = usePlayer();

  const handleSearch = async (e) => {
    e.preventDefault();
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
        const covers = await getMultipleAlbumCovers(musicsRes.data.map(m => m.album_id));
        setAlbumCovers(covers);
      }
    } catch (err) {
      setError("Erro ao buscar");
    } finally {
      setLoading(false);
    }
  };

  // Filtro dos resultados
  const filteredResults = () => {
    if (activeFilter === "all") return results;
    const filtered = { musics: [], artists: [], albums: [] };
    if (activeFilter === "musics") filtered.musics = results.musics;
    if (activeFilter === "artists") filtered.artists = results.artists;
    if (activeFilter === "albums") filtered.albums = results.albums;
    // Following pode ser implementado depois
    return filtered;
  };

  const res = filteredResults();

  return (
    <div style={{ display: "flex", background: "#18191A", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 72, padding: 32, color: "#fff", minHeight: "100vh" }}>
        {/* Barra de busca centralizada */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 32, gap: 24 }}>
          <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", background: "#232428", borderRadius: 24, padding: "8px 24px", width: 480 }}>
            <FiSearch size={22} color="#aaa" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for musics, artists or playlists..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: 18,
                marginLeft: 12,
                width: "100%"
              }}
            />
          </form>
          <ProfileDropdown />
        </div>

        {/* Filtros */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 32 }}>
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              style={{
                background: activeFilter === f.value ? "#6E54FF" : "#232428",
                color: activeFilter === f.value ? "#fff" : "#aaa",
                border: "none",
                borderRadius: 16,
                padding: "8px 20px",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer"
              }}
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
                <h2 style={{ color: "#6E54FF", fontSize: 20, marginBottom: 16 }}>Albums</h2>
                <div style={{ display: "flex", gap: 24 }}>
                  {res.albums.map((album) => (
                    <div key={album.id} style={{ width: 180, background: "#232428", borderRadius: 12, padding: 16, cursor: "pointer", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 120, height: 120, borderRadius: 12, overflow: 'hidden', background: '#333', marginBottom: 8 }}>
                        {album.cover_url ? (
                          <img src={album.cover_url} alt={album.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : null}
                      </div>
                      <span style={{ fontWeight: 600, color: "#fff", marginBottom: 8 }}>{album.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {/* Músicas */}
            {res.musics && res.musics.length > 0 && (
              <section style={{ marginBottom: 40 }}>
                <h2 style={{ color: "#6E54FF", fontSize: 20, marginBottom: 16 }}>Musics</h2>
                <div style={{ display: "flex", gap: 24 }}>
                  {res.musics.map((music) => {
                    const albumCover = albumCovers.get(music.album_id);
                    return (
                      <div key={music.id} style={{ width: 180, background: "#232428", borderRadius: 12, padding: 16, cursor: "pointer", display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={() => playMusic({ ...music, coverUrl: albumCover })}>
                        <div style={{ width: 120, height: 120, borderRadius: 12, overflow: 'hidden', background: '#333', marginBottom: 8 }}>
                          {albumCover ? (
                            <img src={albumCover} alt={music.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : null}
                        </div>
                        <span style={{ fontWeight: 600, color: "#fff", marginBottom: 4 }}>{music.title}</span>
                        <span style={{ color: "#aaa", fontSize: 14 }}>{music.artist}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
            {/* Artistas */}
            {res.artists && res.artists.length > 0 && (
              <section style={{ marginBottom: 40 }}>
                <h2 style={{ color: "#6E54FF", fontSize: 20, marginBottom: 16 }}>Artists</h2>
                <div style={{ display: "flex", gap: 24 }}>
                  {res.artists.map((artist) => (
                    <div key={artist.id} style={{ width: 160, background: "#232428", borderRadius: 12, padding: 16, cursor: "pointer", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 100, height: 100, borderRadius: 50, overflow: 'hidden', background: '#333', marginBottom: 8 }}>
                        {artist.cover_photo ? (
                          <img src={artist.cover_photo} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : null}
                      </div>
                      <span style={{ fontWeight: 600, color: "#fff", marginBottom: 4 }}>{artist.name}</span>
                      <span style={{ color: "#aaa", fontSize: 14 }}>Artist</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {/* Placeholder amigável */}
            {(!res.musics?.length && !res.artists?.length && !res.albums?.length) && (
              <div style={{ textAlign: "center", color: "#aaa", marginTop: 64, fontSize: 18 }}>
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