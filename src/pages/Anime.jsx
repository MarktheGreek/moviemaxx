import { useEffect, useState } from "react";
import SeasonRow from "../components/SeasonRow";
import Modal from "../components/Modal";
import { useTMDB } from "../hooks/useTMDB";

const Anime = () => {
  const { fetchTrendingAnime, fetchCredits, tvGenres } = useTMDB();

  const [anime, setAnime] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTrendingAnime().then(setAnime);
  }, []);

  // Simple seasonal split (demo logic)
  const winter = anime.slice(0, 8);
  const spring = anime.slice(8, 16);
  const summer = anime.slice(16, 24);
  const fall = anime.slice(24, 32);

  const handleItemClick = async (item) => {
    const cast = await fetchCredits("tv", item.id);
    const genres =
      item.genre_ids?.map(id => tvGenres.get(id)).filter(Boolean) || [];

    setSelectedItem({
      ...item,
      type: "tv",
      genres,
      cast: cast.join(", ") || "N/A"
    });

    setIsModalOpen(true);
  };

  return (
    <div className="anime-page">
      <SeasonRow
        title="Winter Anime"
        emoji="❄️"
        items={winter}
        onItemClick={handleItemClick}
      />

      <SeasonRow
        title="Spring Anime"
        emoji="🌸"
        items={spring}
        onItemClick={handleItemClick}
      />

      <SeasonRow
        title="Summer Anime"
        emoji="☀️"
        items={summer}
        onItemClick={handleItemClick}
      />

      <SeasonRow
        title="Fall Anime"
        emoji="🍁"
        items={fall}
        onItemClick={handleItemClick}
      />

      {isModalOpen && selectedItem && (
        <Modal
          item={selectedItem}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Anime;
