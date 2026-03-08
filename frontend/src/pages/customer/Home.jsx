import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import './Home.css';

const EMOJIS = {
  'Pain Relief': '\uD83D\uDC8A',
  'Antibiotics': '\uD83E\uDDA0',
  'Eye Drops': '\uD83D\uDC41\uFE0F',
  'Cough Syrup': '\uD83E\uDE79',
  'Insulin Therapy': '\uD83D\uDC89',
  'Gastric': '\uD83C\uDF4E',
  'Supplements': '\uD83D\uDCAA',
  'Heart': '\u2764\uFE0F',
  'Mental Health': '\uD83E\uDDE0',
  'Skin Care': '\u2728',
  'Cold & Flu': '\uD83E\uDD27',
  'Allergy': '\uD83C\uDF3B',
  'Diabetes': '\uD83C\uDF6C',
};

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [medicines, setMedicines] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);

  useEffect(() => {
    API.get('/api/medicines/categories').then(res => setCategories(res.data));
    API.get('/api/medicines/bestsellers').then(res => setBestsellers(res.data));
    API.get('/api/medicines/').then(res => setMedicines(res.data));
  }, []);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      navigate('/search?q=');
    } else {
      navigate(`/search?category=${encodeURIComponent(cat)}`);
    }
  };

  return (
    <div className="home">
      <div className="category-nav">
        {categories.map(cat => (
          <button
            key={cat}
            className={activeCategory === cat ? 'active' : ''}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="hero-banners">
        <div className="hero-banner concept">
          <img src="https://cdn-icons-png.flaticon.com/512/2920/2920349.png" alt="Online pharmacy" />
        </div>
        <div className="hero-banner promo">
          <h2>Medicines<br />Up To 70% OFF</h2>
          <p>Health & Wellness Products</p>
          <button onClick={() => navigate('/search?q=')}>ORDER NOW</button>
        </div>
      </div>

      <div className="bestsellers">
        <h3>Bestsellers</h3>
        <div className="bestsellers-row">
          {bestsellers.map(med => (
            <div key={med.id} className="med-card" onClick={() => navigate(`/medicine/${med.id}`)}>
              <div className="med-emoji">{EMOJIS[med.category] || '\uD83D\uDC8A'}</div>
              <h4>{med.name}</h4>
              <p className="med-price">\u20B9{med.mrp}</p>
              <p className="med-brand">{med.brand}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
