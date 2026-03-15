import { useState } from 'react';
import Footer from '../components/Footer';
import './FooterPages.css';

const FAQS = [
  {
    q: 'How do I place an order?',
    a: 'Browse or search for medicines, add them to your cart, select a delivery address, and checkout. For prescription medicines, you will need to upload a valid prescription before placing the order.',
  },
  {
    q: 'What if I receive the wrong medicine?',
    a: 'Contact our Order & Delivery team immediately at orders@lowpharma.com or call +91 98765 43210. We will arrange a replacement or refund within 48 hours.',
  },
  {
    q: 'How do I upload a prescription?',
    a: 'When your cart contains prescription-required medicines, you will be prompted to upload a prescription image before checkout. You can also upload from your past prescriptions saved in your Medical Records.',
  },
  {
    q: 'My payment failed but money was deducted. What should I do?',
    a: 'Don\'t worry. Contact our Payment support at payments@lowpharma.com with your order ID. Failed transaction amounts are auto-refunded within 5-7 business days. If not, we will initiate a manual refund.',
  },
  {
    q: 'Can I cancel my order?',
    a: 'You can cancel your order before it is dispatched. Go to Profile > Your Orders and contact support with your order details.',
  },
  {
    q: 'How do I change my delivery address?',
    a: 'Go to your Cart page and click "Change" under the delivery address section to pick from your saved addresses. To add a new address, go to Profile > Manage Address.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Delivery typically takes 1-3 hours for local pharmacies. Exact time depends on the pharmacy\'s processing time and your distance from the pharmacy.',
  },
  {
    q: 'How do I choose a specific pharmacy?',
    a: 'On the search results page, you can filter medicines by pharmacy name. Each medicine card shows which pharmacy it is from.',
  },
  {
    q: 'I am a pharmacist. How do I register my pharmacy?',
    a: 'Select "Pharmacist" on the landing page, sign up, and then go to Profile > Pharmacy Details to fill in your pharmacy name, license number, address, and operating hours.',
  },
];

export default function NeedHelp() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="footer-page">
      <div className="footer-page-content">
        <h1>Need Help?</h1>
        <p className="page-subtitle">
          Find answers to common questions below. If you still need assistance, reach out to our support team.
        </p>

        <div className="faq-list">
          {FAQS.map((faq, i) => (
            <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                <span>{faq.q}</span>
                <span className="faq-toggle">{openIndex === i ? '−' : '+'}</span>
              </button>
              {openIndex === i && <p className="faq-answer">{faq.a}</p>}
            </div>
          ))}
        </div>

        <section className="still-need-help">
          <h2>Still need help?</h2>
          <p>Email us at <strong>support@lowpharma.com</strong> or call <strong>+91 98765 43210</strong></p>
          <p><strong>Business Hours:</strong> Mon – Sat, 9:00 AM – 8:00 PM IST</p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
