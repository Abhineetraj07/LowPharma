import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing-navbar">
        <div className="navbar-logo">
          <span className="arrow">&#x2193;</span> LOWPHARMA
        </div>
      </div>

      <div className="landing-content">
        <div className="landing-left">
          <img src="https://cdn-icons-png.flaticon.com/512/2920/2920349.png" alt="Medicines delivered" />
          <h2>Medicines, Home Delivered</h2>
          <p>Order any medicines or healthcare products anytime</p>
        </div>

        <div className="landing-right">
          <div className="role-card">
            <h2>Are You...</h2>
            <div className="role-options">
              <div className="role-option" onClick={() => navigate('/login/customer')}>
                <img src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png" alt="Customer" />
                <p>Customer?</p>
              </div>
              <div className="role-option" onClick={() => navigate('/login/pharmacist')}>
                <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="Pharmacist" />
                <p>Pharmacist?</p>
              </div>
            </div>
            <p className="tagline">Gain access to your<br />trusted online medicine delivery partner</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
