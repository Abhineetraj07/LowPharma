import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../api/axios';
import Footer from '../components/Footer';
import './Login.css';

export default function Signup() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { fetchCart } = useCart();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await API.post('/api/auth/signup', {
        username, email, password, role,
      });
      login(res.data);
      if (role === 'customer') {
        await fetchCart();
        navigate('/home');
      } else {
        navigate('/pharmacist/inventory');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed');
    }
  };

  const roleLabel = role === 'customer' ? 'Sign Up as Customer' : 'Sign Up as Pharmacist';

  return (
    <div className="auth-page">
      <div className="landing-navbar">
        <div className="navbar-logo">
          <span className="arrow">&#x2193;</span> LOWPHARMA
        </div>
      </div>

      <div className="auth-content">
        <div className="auth-left">
          <button className="back-arrow" onClick={() => navigate(`/login/${role}`)}>&#8592;</button>
          <img src="https://cdn-icons-png.flaticon.com/512/2382/2382533.png" alt="Signup" style={{ maxWidth: 320 }} />
          <h2>Medicines, Home Delivered</h2>
          <p>Order any medicines or healthcare products anytime</p>
        </div>

        <div className="auth-right">
          <form className="auth-form" onSubmit={handleSignup}>
            <h2>{roleLabel}</h2>
            <p className="subtitle">Gain access to your<br />trusted online medicine delivery partner</p>

            {error && <p className="auth-error">{error}</p>}

            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className="btn-pink">Sign Up</button>

            <p className="switch-link">
              Already have an account?{' '}
              <a onClick={() => navigate(`/login/${role}`)}>Login</a>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
