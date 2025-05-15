import React from "react";
import Icon from "@/components/icon/Icon";

const playlists = [
  "/assets/sidebar/playlist1.png",
  "/assets/sidebar/playlist2.png",
  "/assets/sidebar/playlist3.png",
  "/assets/sidebar/playlist4.png",
  "/assets/sidebar/playlist5.png",
  "/assets/sidebar/playlist6.png",
  "/assets/sidebar/playlist7.png",
  "/assets/sidebar/playlist8.png",
];

const Sidebar = () => {
  return (
    <aside className="h-screen w-[72px] bg-[#000000] text-white flex flex-col items-center py-6 gap-4 fixed overflow-y-auto">
      {/* Botões com ícones */}
      <nav className="flex flex-col items-center gap-6">
        <button className="w-10 h-10 flex items-center justify-center hover:bg-neutral-800 rounded-md transition">
          <Icon name="homeIcon" alt="Home" className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center hover:bg-neutral-800 rounded-md transition">
          <Icon name="searchIcon" alt="Search" className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center hover:bg-neutral-800 rounded-md transition">
          <Icon name="addIcon" alt="Add" className="w-5 h-5" />
        </button>
      </nav>

      {/* Linha divisória */}
      <div className="w-8 h-px bg-neutral-700 my-4" />

      {/* Capas de playlists */}
      <div className="flex flex-col gap-3 items-center">
        {playlists.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Playlist ${index + 1}`}
            className="w-10 h-10 rounded-md object-cover hover:scale-105 transition-transform"
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
