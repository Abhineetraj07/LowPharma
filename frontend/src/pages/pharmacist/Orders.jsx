import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import './Pharmacist.css';

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
    return matchSearch;
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

  const statusClass = (s) => s?.toLowerCase().replace(/\s+/g, '-') || 'pending';

  return (
    <div className="pharma-page">
      <p className="cart-breadcrumb" style={{ marginBottom: 8 }}>Home &gt; Orders</p>

      <div className="orders-filters">
        <input placeholder="Search for orders" value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 200 }} />
        <label>Filter by: All orders</label>
        <label>From:</label>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <label>To:</label>
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        <button className="btn-pink" style={{ padding: '8px 20px' }}>Go</button>
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
            <tr key={o.id} className={`order-row ${selectedOrder?.id === o.id ? 'selected' : ''}`}
                onClick={() => setSelectedOrder(o)}>
              <td>ORD {o.id}</td>
              <td>{o.customer_name}</td>
              <td>{new Date(o.created_at).toLocaleDateString()}</td>
              <td>{'\u20B9'}{o.total_amount}</td>
              <td><span className={`order-status-badge ${statusClass(o.prescription_status)}`}>{o.prescription_status}</span></td>
              <td><span className={`order-status-badge ${statusClass(o.delivery_stage)}`}>{o.delivery_stage}</span></td>
              <td><button className="btn-pink" style={{ padding: '6px 16px', fontSize: 12 }}>View Details</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <div className="order-detail-panel">
          <div className="order-detail-left">
            <h3>Order Details</h3>
            <table>
              <tbody>
                <tr><td style={{ fontWeight: 700 }}>{selectedOrder.customer_name}</td><td></td></tr>
                <tr><td>{selectedOrder.customer_phone}</td><td></td></tr>
                <tr><td>{selectedOrder.address_text}</td><td></td></tr>
                <tr><td>{new Date(selectedOrder.created_at).toLocaleDateString()}</td><td></td></tr>
              </tbody>
            </table>
            <table style={{ marginTop: 12 }}>
              <tbody>
                {selectedOrder.items.map(item => (
                  <tr key={item.id}>
                    <td>{item.medicine_name}</td>
                    <td>{item.quantity}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="order-detail-right">
            <h4>Order Status</h4>
            <span className={`order-status-badge ${statusClass(o => selectedOrder.delivery_stage)}`} style={{ marginBottom: 16, display: 'block' }}>
              {selectedOrder.delivery_stage}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              <button className="btn-pink" onClick={() => handleApprove(selectedOrder.id)}>Approve</button>
              <button className="btn-pink-outline" onClick={() => navigate('/pharmacist/prescriptions')}>View Prescription</button>
              <button className="btn-pink" style={{ background: 'var(--red)' }} onClick={() => handleDeny(selectedOrder.id)}>Deny</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
