import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useCart } from '../../context/CartContext';
import './MedicineDetail.css';

const EMOJIS = {
  'Pain Relief': '\uD83D\uDC8A', 'Antibiotics': '\uD83E\uDDA0', 'Eye Drops': '\uD83D\uDC41\uFE0F',
  'Cough Syrup': '\uD83E\uDE79', 'Insulin Therapy': '\uD83D\uDC89', 'Gastric': '\uD83C\uDF4E',
  'Supplements': '\uD83D\uDCAA', 'Heart': '\u2764\uFE0F', 'Mental Health': '\uD83E\uDDE0',
  'Skin Care': '\u2728', 'Cold & Flu': '\uD83E\uDD27', 'Allergy': '\uD83C\uDF3B', 'Diabetes': '\uD83C\uDF6C',
};

export default function MedicineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [medicine, setMedicine] = useState(null);

  useEffect(() => {
    API.get(`/api/medicines/${id}`).then(res => setMedicine(res.data));
  }, [id]);

  if (!medicine) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;

  const handleAddToCart = async () => {
    await addToCart(medicine.id);
    navigate('/cart');
  };

  return (
    <div className="medicine-detail">
      <span className="detail-back" onClick={() => navigate(-1)}>\u2190 Back</span>

      <div className="detail-content">
        <div className="detail-image">
          {EMOJIS[medicine.category] || '\uD83D\uDC8A'}
        </div>

        <div className="detail-info">
          <h1>{medicine.name}</h1>
          <p className="detail-brand">By {medicine.brand}</p>
          <span className="detail-category">{medicine.category}</span>
          {medicine.requires_prescription ? (
            <span style={{ display: 'inline-block', background: '#fef3c7', color: '#d97706', padding: '4px 14px', borderRadius: 50, fontSize: 13, fontWeight: 700, marginLeft: 8 }}>Rx Prescription Required</span>
          ) : null}
          <p className="detail-price">\u20B9{medicine.mrp}</p>

          <div className="detail-meta">
            <div>
              <span>Available Stock</span>
              <p className={`detail-stock ${medicine.quantity < 15 ? 'low' : 'ok'}`}>
                {medicine.quantity} units
              </p>
            </div>
            <div>
              <span>Cost per Unit</span>
              <p>\u20B9{medicine.cost_per_unit}</p>
            </div>
            <div>
              <span>Mfg Date</span>
              <p>{medicine.mfg_date}</p>
            </div>
            <div>
              <span>Expiry Date</span>
              <p>{medicine.exp_date}</p>
            </div>
          </div>

          <button className="btn-pink" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
