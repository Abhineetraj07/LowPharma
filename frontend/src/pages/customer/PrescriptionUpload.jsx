import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import './PrescriptionUpload.css';

export default function PrescriptionUpload() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { showToast } = useToast();
  const fileRef = useRef();

  const [uploaded, setUploaded] = useState(false);
  const [selectedPast, setSelectedPast] = useState(false);
  const [pastPrescriptions, setPastPrescriptions] = useState([]);
  const [address, setAddress] = useState(null);
  const [prescriptionId, setPrescriptionId] = useState(null);

  useEffect(() => {
    API.get('/api/prescriptions/my').then(res => setPastPrescriptions(res.data));
    API.get('/api/addresses/').then(res => {
      if (res.data.length > 0) setAddress(res.data[0]);
    });
  }, []);

  const itemTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const handling = 10;
  const discount = 50;
  const delivery = 40;

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await API.post('/api/prescriptions/upload', formData);
      setPrescriptionId(res.data.id);
      setUploaded(true);
      setSelectedPast(false);
      showToast('Prescription uploaded!');
    } catch {
      showToast('Upload failed');
    }
  };

  const handleSelectPast = () => {
    if (pastPrescriptions.length > 0) {
      setPrescriptionId(pastPrescriptions[0].id);
      setSelectedPast(true);
      setUploaded(false);
    }
  };

  const canCheckout = uploaded || selectedPast;

  return (
    <div className="prescription-page">
      <div className="prescription-main">
        <p className="prescription-breadcrumb">
          <a onClick={() => navigate('/home')}>Home</a> &gt; <a onClick={() => navigate('/cart')}>Cart</a> &gt; Prescription
        </p>

        <div className={`upload-box ${uploaded ? 'uploaded' : ''}`} onClick={() => fileRef.current?.click()}>
          <div className="upload-icon">{'\uD83D\uDCCB'}</div>
          <button className="btn-pink-outline">
            {uploaded ? 'File uploaded' : 'Upload Prescription'}
          </button>
          <input type="file" ref={fileRef} onChange={handleUpload} accept="image/*,.pdf" />
        </div>

        <div className="upload-divider">
          <hr /><span>OR</span><hr />
        </div>

        <div className="past-prescription">
          <div className="rx-icon">{'\uD83D\uDCDD'}</div>
          <p>Select from past prescriptions</p>
          <button
            className="btn-pink-outline"
            onClick={handleSelectPast}
            disabled={pastPrescriptions.length === 0}
          >
            {selectedPast ? 'Selected' : 'Select Files'}
          </button>
        </div>
      </div>

      <div className="prescription-sidebar">
        <div className="bill-summary">
          <h3>Bill Summary</h3>
          <div className="bill-row"><span>Item total (MRP)</span><span>{'\u20B9'}{itemTotal}</span></div>
          <div className="bill-row"><span>Handling charges</span><span>{'\u20B9'}{handling}</span></div>
          <div className="bill-row discount"><span>Total discount</span><span>-{'\u20B9'}{discount}</span></div>
          <div className="bill-row"><span>Delivery charges</span><span>{'\u20B9'}{delivery}</span></div>
        </div>

        <div className="delivery-section" style={{ marginTop: 20 }}>
          <h4>Delivery Address</h4>
          {address ? (
            <p style={{ fontSize: 13, color: 'var(--gray)', marginTop: 8, lineHeight: 1.6 }}>
              {address.house_no}, {address.road},<br />
              {address.city}, {address.state}<br />
              {address.pin_code}
            </p>
          ) : (
            <a onClick={() => navigate('/add-address')} style={{ color: 'var(--pink)', fontWeight: 700, fontSize: 13 }}>
              Add one
            </a>
          )}
        </div>

        <button
          className="btn-pink"
          style={{ width: '100%', marginTop: 24 }}
          disabled={!canCheckout}
          onClick={() => navigate('/checkout', { state: { prescriptionId } })}
        >
          Checkout
        </button>

        <p className="prescription-note">
          All uploads are encrypted and only visible to the pharmacists.
          Any prescription you upload is verified before processing the order.
        </p>
      </div>
    </div>
  );
}
