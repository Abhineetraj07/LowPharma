import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import API from '../../api/axios';
import './Checkout.css';

const PAYMENT_METHODS = ['Credit / Debit Card', 'Cash on Delivery', 'UPI', 'Netbanking'];

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart } = useCart();
  const { showToast } = useToast();

  const [address, setAddress] = useState(null);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  const prescriptionId = location.state?.prescriptionId;

  useEffect(() => {
    API.get('/api/addresses/').then(res => {
      if (res.data.length > 0) setAddress(res.data[0]);
    });
  }, []);

  const itemTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const handling = 10;
  const discount = 50;
  const delivery = 40;
  const couponDiscount = couponApplied ? 30 : 0;
  const total = itemTotal + handling - discount + delivery - couponDiscount;

  const handleApplyCoupon = () => {
    if (coupon.trim()) {
      setCouponApplied(true);
      showToast('Coupon applied! \u20B930 off');
    }
  };

  const handlePayNow = async () => {
    try {
      const addressText = address
        ? `${address.name}, ${address.house_no}, ${address.road}, ${address.city}, ${address.state} ${address.pin_code}`
        : '';

      await API.post('/api/orders/', {
        address_text: addressText,
        coupon_code: couponApplied ? coupon : '',
        payment_method: paymentMethod,
        prescription_id: prescriptionId,
      });

      showToast('Order placed successfully!');
      navigate('/thankyou');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Order failed');
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-left">
        <h2>Order Placed</h2>

        <div className="bill-summary">
          <h3>Bill Summary</h3>
          <div className="bill-row"><span>Item total (MRP)</span><span>{'\u20B9'}{itemTotal}</span></div>
          <div className="bill-row"><span>Handling charges</span><span>{'\u20B9'}{handling}</span></div>
          <div className="bill-row discount"><span>Total discount</span><span>-{'\u20B9'}{discount}</span></div>
          <div className="bill-row"><span>Delivery charges</span><span>{'\u20B9'}{delivery}</span></div>
          {couponApplied && <div className="bill-row discount"><span>Coupon discount</span><span>-{'\u20B9'}{couponDiscount}</span></div>}
          <hr className="bill-divider" />
          <div className="bill-total"><span>To be paid</span><span>{'\u20B9'}{total}</span></div>
        </div>

        <div className="delivery-section" style={{ marginTop: 24 }}>
          <h4>{'\uD83C\uDFE0'} Delivering to</h4>
          {address ? (
            <>
              <p style={{ fontSize: 13, color: 'var(--gray)', marginTop: 8, lineHeight: 1.6 }}>
                {address.name}<br />
                {address.house_no}, {address.road},<br />
                {address.city}, {address.state}<br />
                {address.pin_code}
              </p>
              <a onClick={() => navigate('/add-address')} style={{ fontWeight: 700, fontSize: 13 }}>Add address</a>
            </>
          ) : (
            <a onClick={() => navigate('/add-address')} style={{ color: 'var(--pink)', fontWeight: 700 }}>Add address</a>
          )}
        </div>
      </div>

      <div className="checkout-right">
        <div className="coupon-input">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            disabled={couponApplied}
          />
          <button onClick={handleApplyCoupon} disabled={couponApplied}>
            {couponApplied ? '\u2713' : 'Apply'}
          </button>
        </div>
        {couponApplied && <p className="coupon-success">{'\u2713'} Coupon applied! {'\u20B9'}30 off</p>}

        <div className="payment-methods">
          <h3>Mode of Payment</h3>
          {PAYMENT_METHODS.map(method => (
            <div
              key={method}
              className={`payment-option ${paymentMethod === method ? 'selected' : ''}`}
              onClick={() => setPaymentMethod(method)}
            >
              {method}
            </div>
          ))}
        </div>

        <button
          className="btn-pink"
          style={{ width: '100%', marginTop: 24 }}
          disabled={!paymentMethod}
          onClick={handlePayNow}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
