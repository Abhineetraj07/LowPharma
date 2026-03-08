import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import './SearchResults.css';

const EMOJIS = {
  'Pain Relief': '\uD83D\uDC8A', 'Antibiotics': '\uD83E\uDDA0', 'Eye Drops': '\uD83D\uDC41\uFE0F',
  'Cough Syrup': '\uD83E\uDE79', 'Insulin Therapy': '\uD83D\uDC89', 'Gastric': '\uD83C\uDF4E',
  'Supplements': '\uD83D\uDCAA', 'Heart': '\u2764\uFE0F', 'Mental Health': '\uD83E\uDDE0',
  'Skin Care': '\u2728', 'Cold & Flu': '\uD83E\uDD27', 'Allergy': '\uD83C\uDF3B', 'Diabetes': '\uD83C\uDF6C',
};

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart();
  const { showToast } = useToast();

  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';

  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'All');
  const [sort, setSort] = useState('default');

  useEffect(() => {
    API.get('/api/medicines/categories').then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (activeCategory && activeCategory !== 'All') params.set('category', activeCategory);
    if (sort !== 'default') params.set('sort', sort);

    API.get(`/api/medicines/?${params.toString()}`).then(res => setResults(res.data));
  }, [query, activeCategory, sort]);

  const handleAddToCart = async (medId) => {
    await addToCart(medId);
    showToast('Added to cart!');
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
  };

  return (
    <div>
      <div className="category-tabs">
        {categories.map(cat => (
          <button key={cat} className={activeCategory === cat ? 'active' : ''} onClick={() => handleCategoryClick(cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div className="search-page">
        <div className="search-main">
          <p className="search-breadcrumb">
            <a onClick={() => navigate('/home')}>Home</a> &gt; {query || activeCategory || 'All'}
          </p>
          <p className="search-title">
            Showing results for <strong>{query || activeCategory || 'All Medicines'}</strong>
          </p>

          <div className="sort-chips">
            {[['default', 'Default'], ['price_asc', 'Price \u2191'], ['price_desc', 'Price \u2193'], ['name', 'Name']].map(([key, label]) => (
              <button key={key} className={sort === key ? 'active' : ''} onClick={() => setSort(key)}>{label}</button>
            ))}
          </div>

          {results.map(med => (
            <div key={med.id} className="result-item">
              <div className="result-emoji">{EMOJIS[med.category] || '\uD83D\uDC8A'}</div>
              <div className="result-info">
                <h3>{med.name} {med.requires_prescription ? <span style={{ fontSize: 11, background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: 50, fontWeight: 700, marginLeft: 8 }}>Rx Required</span> : null}</h3>
                <p className="result-brand">By {med.brand}</p>
                <p className="result-price">\u20B9{med.mrp}</p>
              </div>
              <div className="result-actions">
                <button className="btn-pink-outline" onClick={() => handleAddToCart(med.id)}>Add to cart</button>
                <button className="btn-pink-outline" onClick={() => navigate(`/medicine/${med.id}`)}>Details</button>
              </div>
            </div>
          ))}

          {results.length === 0 && (
            <p style={{ color: 'var(--gray)', marginTop: 40, textAlign: 'center' }}>No medicines found.</p>
          )}
        </div>

        <div className="search-sidebar">
          <h3>Filter by</h3>
          <p className="sidebar-info">
            {cartCount > 0
              ? `${cartCount} item(s) in cart`
              : 'Please add item(s) to proceed'}
          </p>
          <button
            className="btn-pink"
            style={{ width: '100%' }}
            disabled={cartCount === 0}
            onClick={() => navigate('/cart')}
          >
            Cart and Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
