import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onSearch, searchResults, onItemClick, isSearching }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getPosterUrl = (posterPath) =>
    posterPath ? `https://image.tmdb.org/t/p/w92${posterPath}` : null;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleItemSelect = (item) => {
    onItemClick?.(item);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <nav className={`top-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="navbar-logo">
        <img src="/logo/MovieMax.png" alt="MovieMax" />
      </Link>

      <div className="navbar-search-container">
        <input
          type="text"
          placeholder="Search movies & TV..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
        />

        {isSearchFocused && searchQuery && (
          <div className="search-results-dropdown">
            {searchResults?.length ? (
              searchResults.map(item => (
                <div
                  key={item.id}
                  className="search-result-item"
                  onClick={() => handleItemSelect(item)}
                >
                  {getPosterUrl(item.poster_path) && (
                    <img src={getPosterUrl(item.poster_path)} alt="" />
                  )}
                  <span>{item.title || item.name}</span>
                </div>
              ))
            ) : isSearching ? (
              <p className="search-loading">Searching…</p>
            ) : (
              <p className="search-no-results">No results</p>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
