import Footer from '../components/Footer';
import './FooterPages.css';

export default function Contact() {
  return (
    <div className="footer-page">
      <div className="footer-page-content">
        <h1>Contact Us</h1>
        <p className="page-subtitle">
          Having issues with your order, payment, or delivery? Our support team is here to help.
        </p>

        <div className="contact-grid">
          <div className="contact-card">
            <h3>Order & Delivery Issues</h3>
            <p>Wrong items received, missing medicines, delayed delivery, or order tracking problems.</p>
            <p className="contact-detail">Email: <strong>orders@lowpharma.com</strong></p>
            <p className="contact-detail">Phone: <strong>+91 98765 43210</strong></p>
          </div>

          <div className="contact-card">
            <h3>Payment & Refunds</h3>
            <p>Payment failures, double charges, refund requests, or coupon issues.</p>
            <p className="contact-detail">Email: <strong>payments@lowpharma.com</strong></p>
            <p className="contact-detail">Phone: <strong>+91 98765 43211</strong></p>
          </div>

          <div className="contact-card">
            <h3>Prescription Support</h3>
            <p>Prescription upload issues, approval delays, or questions about prescription-required medicines.</p>
            <p className="contact-detail">Email: <strong>prescriptions@lowpharma.com</strong></p>
            <p className="contact-detail">Phone: <strong>+91 98765 43212</strong></p>
          </div>

          <div className="contact-card">
            <h3>Technical Support</h3>
            <p>Account issues, login problems, app bugs, or any other technical difficulties.</p>
            <p className="contact-detail">Email: <strong>tech@lowpharma.com</strong></p>
            <p className="contact-detail">Phone: <strong>+91 98765 43213</strong></p>
          </div>
        </div>

        <section className="response-time">
          <h2>Response Time</h2>
          <p>We aim to respond to all queries within <strong>24 hours</strong>. For urgent delivery or payment issues, call us directly during business hours.</p>
          <p><strong>Business Hours:</strong> Mon – Sat, 9:00 AM – 8:00 PM IST</p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
