import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import './components.css';

const MovieRowSlider = ({
  title,
  items = [],
  onItemClick = () => {},
  columns = 6, // 👈 DEFAULT
}) => {
  const sliderRef = useRef(null);
  const displayItems = items.slice(0, 24);

  if (!displayItems.length) return null;

  const scrollSlider = (direction) => {
    const el = sliderRef.current;
    if (!el) return;

    el.scrollBy({
      left: el.clientWidth * 0.9,
      behavior: 'smooth',
    });
  };

  return (
    <section className="row">
      <div className="row-header">
        <h2>{title}</h2>

        <div className="row-controls">
          <button className="row-btn" onClick={() => scrollSlider('left')}>‹</button>
          <button className="row-btn" onClick={() => scrollSlider('right')}>›</button>
        </div>
      </div>

      {/* 👇 PASS COLUMNS TO CSS */}
      <div
        className="carousel"
        ref={sliderRef}
        style={{ '--cards-per-view': columns }}
      >
        {displayItems.map(item => (
          <MovieCard
            key={item.id}
            item={item}
            onClick={() => onItemClick(item)}
          />
        ))}
      </div>
    </section>
  );
};

export default MovieRowSlider;
