import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import './Pharmacist.css';

const DELIVERY_STAGES = ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function Orders() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = () => {
    API.get('/api/orders/all').then(res => setOrders(res.data));
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.customer_name?.toLowerCase().includes(search.toLowerCase()) || `ORD ${o.id}`.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (fromDate) {
      const orderDate = new Date(o.created_at).toISOString().split('T')[0];
      if (orderDate < fromDate) return false;
    }
    if (toDate) {
      const orderDate = new Date(o.created_at).toISOString().split('T')[0];
      if (orderDate > toDate) return false;
    }
    return true;
  });

  const handleApprove = async (orderId) => {
    await API.put(`/api/orders/${orderId}/approve`);
    showToast('Order approved');
    fetchOrders();
    setSelectedOrder(null);
  };

  const handleDeny = async (orderId) => {
    await API.put(`/api/orders/${orderId}/deny`);
    showToast('Order denied');
    fetchOrders();
    setSelectedOrder(null);
  };

  const handleViewDetails = (e, order) => {
    e.stopPropagation();
    setSelectedOrder(selectedOrder?.id === order.id ? null : order);
  };

  const statusClass = (s) => s?.toLowerCase().replace(/\s+/g, '-') || 'pending';

  const getStageIndex = (stage) => {
    if (stage === 'Cancelled') return -1;
    const idx = DELIVERY_STAGES.indexOf(stage);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="pharma-page">
      <p className="cart-breadcrumb" style={{ marginBottom: 8 }}>
        <a onClick={() => navigate('/pharmacist/inventory')}>Home</a> &gt; Orders
      </p>

      <div className="orders-filters">
        <input placeholder="Search for orders" value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 200 }} />
        <label>Filter by: All orders</label>
        <label>From:</label>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} max={new Date().toISOString().split('T')[0]} />
        <label>To:</label>
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} max={new Date().toISOString().split('T')[0]} />
        <button className="btn-pink" style={{ padding: '8px 20px' }} onClick={() => setSelectedOrder(null)}>Go</button>
        {(fromDate || toDate) && (
          <button
            className="btn-pink-outline"
            style={{ padding: '6px 16px', fontSize: 12 }}
            onClick={() => { setFromDate(''); setToDate(''); setSelectedOrder(null); }}
          >
            Clear
          </button>
        )}
      </div>

      <h3 style={{ marginBottom: 12 }}>Order Status</h3>
      <table className="med-table">
        <thead>
          <tr>
            <th>Batch No</th>
            <th>Name</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Stage</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(o => (
            <tr key={o.id} className={`order-row ${selectedOrder?.id === o.id ? 'selected' : ''}`}>
              <td>ORD {o.id}</td>
              <td>{o.customer_name}</td>
              <td>{new Date(o.created_at).toLocaleDateString()}</td>
              <td>₹{o.total_amount}</td>
              <td><span className={`order-status-badge ${statusClass(o.prescription_status)}`}>{o.prescription_status}</span></td>
              <td><span className={`order-status-badge ${statusClass(o.delivery_stage)}`}>{o.delivery_stage}</span></td>
              <td>
                <button
                  className="btn-pink"
                  style={{ padding: '6px 16px', fontSize: 12 }}
                  onClick={(e) => handleViewDetails(e, o)}
                >
                  {selectedOrder?.id === o.id ? 'Hide' : 'View Details'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <p style={{ color: 'var(--gray)', textAlign: 'center', padding: 20 }}>
          {fromDate || toDate ? 'No orders found for this date range' : 'No orders yet'}
        </p>
      )}

      {selectedOrder && (
        <div className="order-detail-panel">
          <div className="order-detail-left">
            <h3>Order #{selectedOrder.id} — Details</h3>

            <div className="order-customer-info">
              <p><strong>Customer:</strong> {selectedOrder.customer_name}</p>
              {selectedOrder.customer_phone && <p><strong>Phone:</strong> {selectedOrder.customer_phone}</p>}
              <p><strong>Address:</strong> {selectedOrder.address_text || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
              <p><strong>Payment:</strong> {selectedOrder.payment_method || 'N/A'}</p>
            </div>

            <h4 style={{ marginTop: 20, marginBottom: 10 }}>Items Ordered</h4>
            <table className="med-table" style={{ marginBottom: 16 }}>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map(item => (
                  <tr key={item.id}>
                    <td>{item.medicine_name}</td>
                    <td>{item.medicine_brand}</td>
                    <td>{item.medicine_category}</td>
                    <td>{item.quantity}x</td>
                    <td>₹{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="order-bill-mini">
              <div className="bill-mini-row"><span>Subtotal</span><span>₹{selectedOrder.items.reduce((s, i) => s + i.price, 0)}</span></div>
              <div className="bill-mini-row"><span>Handling</span><span>₹{selectedOrder.handling_charges}</span></div>
              <div className="bill-mini-row"><span>Delivery</span><span>₹{selectedOrder.delivery_charges}</span></div>
              <div className="bill-mini-row discount"><span>Discount</span><span>-₹{selectedOrder.discount}</span></div>
              {selectedOrder.coupon_discount > 0 && (
                <div className="bill-mini-row discount"><span>Coupon ({selectedOrder.coupon_code})</span><span>-₹{selectedOrder.coupon_discount}</span></div>
              )}
              <div className="bill-mini-row total"><span>Total</span><span>₹{selectedOrder.total_amount}</span></div>
            </div>
          </div>

          <div className="order-detail-right">
            <h4>Delivery Status</h4>

            {selectedOrder.delivery_stage === 'Cancelled' ? (
              <div className="delivery-cancelled">
                <span className="order-status-badge cancelled">Cancelled</span>
                <p style={{ marginTop: 8, fontSize: 13, color: 'var(--gray)' }}>This order has been cancelled.</p>
              </div>
            ) : (
              <div className="delivery-tracker">
                {DELIVERY_STAGES.map((stage, idx) => {
                  const currentIdx = getStageIndex(selectedOrder.delivery_stage);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;
                  return (
                    <div key={stage} className={`tracker-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                      <div className="tracker-dot">
                        {isCompleted && <span>✓</span>}
                      </div>
                      {idx < DELIVERY_STAGES.length - 1 && <div className={`tracker-line ${idx < currentIdx ? 'completed' : ''}`} />}
                      <span className="tracker-label">{stage}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <h4 style={{ marginTop: 24 }}>Prescription Status</h4>
            <span className={`order-status-badge ${statusClass(selectedOrder.prescription_status)}`}>
              {selectedOrder.prescription_status}
            </span>

            {(selectedOrder.prescription_status === 'Pending Approval') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
                <button className="btn-pink" onClick={() => handleApprove(selectedOrder.id)}>Approve Order</button>
                <button className="btn-pink-outline" onClick={() => navigate('/pharmacist/prescriptions')}>View Prescription</button>
                <button className="btn-pink" style={{ background: 'var(--red)' }} onClick={() => handleDeny(selectedOrder.id)}>Deny Order</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
