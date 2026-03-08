import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../api/axios';
import Footer from '../components/Footer';
import './Login.css';

export default function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { fetchCart } = useCart();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/api/auth/login', { username, password });
      if (res.data.role !== role) {
        setError(`This account is registered as a ${res.data.role}`);
        return;
      }
      login(res.data);
      if (role === 'customer') {
        await fetchCart();
        navigate('/home');
      } else {
        navigate('/pharmacist/inventory');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password');
    }
  };

  const roleLabel = role === 'customer' ? 'For Customer' : 'For Pharmacist';

  return (
    <div className="auth-page">
      <div className="landing-navbar">
        <div className="navbar-logo">
          <span className="arrow">&#x2193;</span> LOWPHARMA
        </div>
      </div>

      <div className="auth-content">
        <div className="auth-left">
          <button className="back-arrow" onClick={() => navigate('/')}>&#8592;</button>
          <img src="https://cdn-icons-png.flaticon.com/512/2920/2920349.png" alt="Illustration" />
          <h2>Medicines, Home Delivered</h2>
          <p>Order any medicines or healthcare products anytime</p>
        </div>

        <div className="auth-right">
          <form className="auth-form" onSubmit={handleLogin}>
            <h2>Login</h2>
            <p className="subtitle">Gain access to your<br />trusted online medicine delivery partner</p>
            <p className="role-label">{roleLabel}</p>

            {error && <p className="auth-error">{error}</p>}

            <input
              type="text"
              placeholder="Enter your username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="btn-pink">Login</button>

            <p className="switch-link">
              New to LowPharma?{' '}
              <a onClick={() => navigate(`/signup/${role}`)}>Sign Up</a>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
