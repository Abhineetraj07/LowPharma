import { useState, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../api/axios';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (searchQuery.length >= 1) {
      const timer = setTimeout(async () => {
        try {
          const res = await API.get(`/api/medicines/suggestions?q=${searchQuery}`);
          setSuggestions(res.data);
          setShowSuggestions(true);
        } catch {
          setSuggestions([]);
        }
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (term) => {
    const q = term || searchQuery;
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      setShowSuggestions(false);
      setSearchQuery(q);
    }
  };

  const handleLogoClick = () => {
    if (user?.role === 'pharmacist') {
      navigate('/pharmacist/inventory');
    } else {
      navigate('/home');
    }
  };

  const handleLogout = async () => {
    await clearCart();
    setSearchQuery('');
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo" onClick={handleLogoClick}>
          <span className="arrow">&#x2193;</span> LOWPHARMA
        </div>

        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search for medicines"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          />
          <span className="search-icon" onClick={() => handleSearch()}>&#x1F50D;</span>
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((s, i) => (
                <div key={i} onMouseDown={() => handleSearch(s)}>{s}</div>
              ))}
            </div>
          )}
        </div>

        <div className="navbar-actions">
          {user?.role === 'customer' && (
            <>
              <button onClick={() => navigate('/profile')}>
                <span style={{ fontSize: 22 }}>&#9786;</span>
              </button>
              <button className="cart-btn" onClick={() => navigate('/cart')}>
                Cart
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
            </>
          )}
          {user?.role === 'pharmacist' && (
            <button onClick={() => navigate('/pharmacist/profile')}>
              <span style={{ fontSize: 22 }}>&#9786;</span>
            </button>
          )}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {user?.role === 'pharmacist' && (
        <div className="pharma-subnav">
          <NavLink to="/pharmacist/prescriptions" className={({ isActive }) => isActive ? 'active' : ''}>Prescriptions</NavLink>
          <NavLink to="/pharmacist/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
          <NavLink to="/pharmacist/orders" className={({ isActive }) => isActive ? 'active' : ''}>Orders</NavLink>
          <NavLink to="/pharmacist/transactions" className={({ isActive }) => isActive ? 'active' : ''}>Transactions</NavLink>
        </div>
      )}
    </>
  );
}
