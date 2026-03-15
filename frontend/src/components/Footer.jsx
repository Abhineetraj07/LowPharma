import { useNavigate } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-logo">
        <span className="arrow">&#x2193;</span> LOWPHARMA
      </div>
      <div className="footer-links">
        <a onClick={() => navigate('/about')}>About</a>
        <a onClick={() => navigate('/contact')}>Contact Us</a>
        <a onClick={() => navigate('/need-help')}>Need Help</a>
      </div>
    </footer>
  );
}
