import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "@/pages/login/Login";
import SignUp from "@/pages/signup/SignUp";
import Home from "@/pages/home/Home";
import ArtistPage from "@/pages/artist/ArtistPage";
import PlaylistPage from "@/pages/playlist/PlaylistPage";
import SearchPage from "@/pages/search/SearchPage";
import Player from "@/components/player/Player";
import { PlayerProvider, usePlayer } from "@/context/PlayerContext";
import UserPage from "@/pages/home/UserPage";
import { UserProvider } from "@/context/UserContext";
import AlbumPage from "@/pages/album/AlbumPage";

function ProtectedRoutes() {
  const { currentMusic } = usePlayer();
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artist/:id" element={<ArtistPage />} />
        <Route path="/playlist/:id" element={<PlaylistPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/account" element={<UserPage />} />
        <Route path="/album/:id" element={<AlbumPage />} />
      </Routes>
      <Player music={currentMusic} />
    </>
  );
}

function App() {
  const token = localStorage.getItem("token");

  // Debug: verificar se o token existe
  console.log("Token no localStorage:", token);
  console.log("Token existe?", !!token);

  // Se não há token, redirecionar para login
  if (!token) {
    console.log("Redirecionando para login...");
    return (
      <UserProvider>
        <PlayerProvider>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </PlayerProvider>
      </UserProvider>
    );
  }

  // Se há token, mostrar rotas protegidas
  console.log("Mostrando rotas protegidas...");
  return (
    <UserProvider>
      <PlayerProvider>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/signup" element={<Navigate to="/" replace />} />
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </div>
      </PlayerProvider>
    </UserProvider>
  );
}

export default App;
