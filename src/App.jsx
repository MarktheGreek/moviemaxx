import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import Popular from './pages/Popular';
import Watch from './pages/Watch';
import About from './pages/About';
import Disclaimer from './pages/Disclaimer';
import { useTMDB } from './hooks/useTMDB';
import Footer from './components/Footer';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // ✅ NEW: loader state
  const [appReady, setAppReady] = useState(false);

  const { searchTMDB } = useTMDB();
  const navigate = useNavigate();

  // ✅ NEW: wait for FIRST render
  useEffect(() => {
    requestAnimationFrame(() => {
      setAppReady(true);
    });
  }, []);

  // ✅ NEW: remove loader ONLY when app is ready
  useEffect(() => {
    if (appReady) {
      const loader = document.querySelector('.loading-screen');
      if (loader) {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.6s ease';
        setTimeout(() => loader.remove(), 600);
      }
    }
  }, [appReady]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchTMDB(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleItemClick = (item) => {
    if (item && item.id && (item.media_type || item.type)) {
      const type = item.media_type || item.type;
      navigate(`/watch?type=${type}&id=${item.id}`);
      setSearchResults([]);
    }
  };

  return (
    // ✅ app-shell is important (background exists before fetch)
    <div className="app-shell">
      <Navbar
        onSearch={handleSearch}
        searchResults={searchResults}
        onItemClick={handleItemClick}
        isSearching={isSearching}
      />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv-shows" element={<TVShows />} />
          <Route path="/popular" element={<Popular />} />
          <Route path="/watch" element={<Watch />} />
          <Route path="/about" element={<About />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

