import { useParams } from "react-router-dom";

const Playlist = () => {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Playlist: {id}</h2>
      <p>Músicas da playlist vão aparecer aqui.</p>
    </div>
  );
};

export default Playlist;