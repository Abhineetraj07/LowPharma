import { useNavigate } from 'react-router-dom';
import './ThankYou.css';

const STEPS = ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function ThankYou() {
  const navigate = useNavigate();
  const activeStep = 1; // Placed and Approved are highlighted

  return (
    <div className="thankyou-page">
      <div className="thankyou-banner">
        <div className="thankyou-icon">{'\uD83D\uDED2'}</div>
        <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--pink)', marginTop: 8 }}>
          THANK YOU FOR YOUR PURCHASE
        </p>
      </div>

      <div className="thankyou-text">
        <h1>THANK</h1>
        <h1>YOU</h1>
      </div>

      <div className="tracker">
        <h3>Track your order</h3>
        <div className="tracker-steps">
          {STEPS.map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div className="tracker-step">
                <div className={`tracker-dot ${i <= activeStep ? 'active' : ''}`} />
                <span>{step}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`tracker-line ${i < activeStep ? 'active' : ''}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <button className="btn-pink" onClick={() => navigate('/home')}>Continue Shopping</button>
    </div>
  );
}
