import "./SeasonRow.css";

const SeasonRow = ({ title, emoji, items, onItemClick }) => {
  return (
    <section className="season-row">
      <h2 className="season-title">
        <span>{emoji}</span> {title}
      </h2>

      <div className="season-scroll">
        {items.map(item => (
          <div
            key={item.id}
            className="season-card"
            onClick={() => onItemClick(item)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
              alt={item.name}
            />
            <div className="season-card-info">
              <h3>{item.name}</h3>
              <span>⭐ {item.vote_average?.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SeasonRow;
