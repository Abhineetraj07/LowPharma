import Footer from '../components/Footer';
import './FooterPages.css';

export default function About() {
  return (
    <div className="footer-page">
      <div className="footer-page-content">
        <h1>About LowPharma</h1>

        <section>
          <h2>Who We Are</h2>
          <p>
            LowPharma is an online medicine ordering and pharmacy management platform built to bridge
            the gap between local pharmacies and customers. We connect neighbourhood pharmacies with
            people who need medicines delivered to their doorstep — quickly, reliably, and affordably.
          </p>
        </section>

        <section>
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-num">1</span>
              <h3>Browse & Search</h3>
              <p>Search for medicines by name, brand, or category. Filter by your preferred local pharmacy.</p>
            </div>
            <div className="step-card">
              <span className="step-num">2</span>
              <h3>Add to Cart</h3>
              <p>Add medicines to your cart. For prescription-only medicines, upload your doctor's prescription.</p>
            </div>
            <div className="step-card">
              <span className="step-num">3</span>
              <h3>Checkout & Pay</h3>
              <p>Choose your delivery address, apply coupons, select a payment method, and place your order.</p>
            </div>
            <div className="step-card">
              <span className="step-num">4</span>
              <h3>Track & Receive</h3>
              <p>Track your order in real-time. Your local pharmacist prepares and dispatches it for delivery.</p>
            </div>
          </div>
        </section>

        <section>
          <h2>For Pharmacists</h2>
          <p>
            Local pharmacies can sign up as pharmacists to manage their inventory, review prescriptions,
            process orders, and track sales — all from a single dashboard. LowPharma helps pharmacies
            reach more customers without the overhead of building their own online presence.
          </p>
        </section>

        <section>
          <h2>Our Team</h2>
          <p>
            LowPharma is developed by a team of Computer Science students at SRM Institute of
            Science and Technology as part of our academic project.
          </p>
          <ul className="team-list">
            <li>Gayathri Devi</li>
            <li>Aishani Mishra</li>
            <li>Abhineet Raj</li>
          </ul>
        </section>
      </div>
      <Footer />
    </div>
  );
}
