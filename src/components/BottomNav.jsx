import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaFilm,
  FaTv,
  FaDragon,
  FaUser
} from 'react-icons/fa';

const BottomNav = () => {
  const { pathname } = useLocation();

  const isActive = (path) => pathname === path;

  return (
    <nav className="bottom-nav">
      <Link to="/" className={isActive('/') ? 'active' : ''}>
        <FaHome />
        <span>Home</span>
      </Link>

      <Link to="/movies" className={isActive('/movies') ? 'active' : ''}>
        <FaFilm />
        <span>Movies</span>
      </Link>

      <Link to="/tv-shows" className={isActive('/tv-shows') ? 'active' : ''}>
        <FaTv />
        <span>TV</span>
      </Link>

      <Link to="/anime" className={isActive('/anime') ? 'active' : ''}>
        <FaDragon />
        <span>Anime</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
