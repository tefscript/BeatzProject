import React, { useEffect, useState } from "react";
import Icon from "@/components/icon/Icon";
import api from "@/config/api";
import { useNavigate } from "react-router-dom";
import CreatePlaylistModal from "@/components/playlist/CreatePlaylistModal";

const Sidebar = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await api.get("/api/user/playlists");
        setPlaylists(res.data);
      } catch {
        // setError("Erro ao carregar playlists");
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  const openCreateModal = () => {
    setIsCreateModalVisible(true);
    setTimeout(() => setIsCreateModalOpen(true), 10); // Garante animação de entrada
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setTimeout(() => setIsCreateModalVisible(false), 400); // Tempo igual à transição do modal
  };

  return (
    <aside
      style={{
        height: "100vh",
        width: 72,
        background: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 16,
        paddingBottom: 8,
        position: "fixed",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* Botões com ícones */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 15,
          marginBottom: 0,
        }}
      >
        <button
          style={{
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            border: "none",
            borderRadius: 12,
            transition: "background 0.2s",
            padding: 0,
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#181818")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#000")}
          onClick={() => navigate("/")}
        >
          <Icon
            name="homeIcon"
            alt="Home"
            className="sidebar-icon-svg"
            style={{ color: "#b3b3b3", width: 24, height: 24 }}
          />
        </button>
        <button
          style={{
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            border: "none",
            borderRadius: 12,
            transition: "background 0.2s",
            padding: 0,
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#181818")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#000")}
          onClick={() => navigate("/search")}
        >
          <Icon
            name="searchIcon"
            alt="Search"
            className="sidebar-icon-svg"
            style={{ color: "#b3b3b3", width: 24, height: 24 }}
          />
        </button>
        <button
          style={{
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            border: "none",
            borderRadius: 12,
            transition: "background 0.2s",
            padding: 0,
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#181818")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#000")}
          onClick={openCreateModal}
        >
          <Icon
            name="addIcon"
            alt="Add"
            className="sidebar-icon-svg"
            style={{ color: "#b3b3b3", width: 24, height: 24 }}
          />
        </button>
      </nav>

      {/* Linha divisória */}
      <hr
        style={{
          width: 45,
          border: 0,
          borderTop: "3.5px solid #222",
          borderRadius: 12,
          margin: "15px 0 15px 0",
        }}
      />

      {/* Capas de playlists reais */}
      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          marginTop: 8,
          paddingBottom: 8,
        }}
      >
        {loading ? (
          <span style={{ color: "#aaa", fontSize: 12 }}>Carregando...</span>
        ) : (
          playlists.length === 0 ? (
            <span style={{ color: "#aaa", fontSize: 12 }}>Nenhuma playlist</span>
          ) : (
            playlists.map((playlist) => (
              <div
                key={playlist.id}
                style={{
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  position: "relative",
                  marginBottom: 2,
                }}
                onClick={() => navigate(`/playlist/${playlist.id}`)}
                title={playlist.name}
              >
                {playlist.cover_url ? (
                  <img
                    src={playlist.cover_url}
                    alt={playlist.name}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      objectFit: "cover",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                      background: "#222",
                      transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.08)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                ) : (
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#181818",
                      color: "#b3b3b3",
                      fontSize: 22,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    }}
                  >
                    ♫
                  </div>
                )}
                {/* Tooltip customizado */}
                <span
                  style={{
                    position: "absolute",
                    left: 56,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "#000",
                    color: "#fff",
                    fontSize: 12,
                    borderRadius: 4,
                    padding: "2px 8px",
                    opacity: 0,
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                    zIndex: 50,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.24)",
                    transition: "opacity 0.2s",
                  }}
                  className="sidebar-tooltip"
                >
                  {playlist.name}
                </span>
              </div>
            ))
          )
        )}
      </div>

      {isCreateModalVisible && (
        <CreatePlaylistModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
        />
      )}
    </aside>
  );
};

export default Sidebar;
