import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "@/pages/login/Login";
import SignUp from "@/pages/signup/SignUp";
import Sidebar from "@/components/sidebar/Sidebar";
import CreatePlaylistModal from "@/components/playlist/CreatePlaylistModal";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/*<Route path="/createplaylist" element={<CreatePlaylistModal />} />
        <Route path="/sidebar" element={<Sidebar />} />*/}
      </Routes>
    </div>
  );
}

export default App;
