import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import API from '../../api/axios';
import './Profile.css';

const TABS = ['Edit Profile', 'Your Order', 'Medical Records', 'Manage Address', 'Settings'];

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('Edit Profile');

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [saveLabel, setSaveLabel] = useState('Save');

  useEffect(() => {
    API.get('/api/profile/').then(res => {
      setName(res.data.name);
      setMobile(res.data.mobile);
    });
    API.get('/api/orders/my').then(res => setOrders(res.data));
    API.get('/api/prescriptions/my').then(res => setPrescriptions(res.data));
    API.get('/api/addresses/').then(res => setAddresses(res.data));
  }, []);

  const handleSaveProfile = async () => {
    await API.put('/api/profile/customer', { name, mobile });
    setSaveLabel('Saved!');
    setTimeout(() => setSaveLabel('Save'), 2000);
  };

  const handleDeleteAddress = async (id) => {
    await API.delete(`/api/addresses/${id}`);
    setAddresses(addresses.filter(a => a.id !== id));
    showToast('Address removed');
  };

  const handleChangePassword = async () => {
    if (newPwd !== confirmPwd) {
      showToast('Passwords do not match');
      return;
    }
    try {
      await API.put('/api/profile/change-password', {
        current_password: currentPwd,
        new_password: newPwd,
      });
      showToast('Password changed!');
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to change password');
    }
  };

  const currentOrders = orders.filter(o => o.delivery_stage !== 'Delivered');
  const pastOrders = orders.filter(o => o.delivery_stage === 'Delivered');

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <p className="cart-breadcrumb" style={{ marginBottom: 16 }}>
          <a onClick={() => navigate('/home')}>Home</a> &gt; Profile
        </p>
        <div className="profile-user">
          <span className="avatar">{'\u263A'}</span>
          <h3>{user?.username}</h3>
        </div>
        <div className="profile-menu">
          {TABS.map(tab => (
            <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="profile-content">
        {activeTab === 'Edit Profile' && (
          <>
            <h2>Edit Profile</h2>
            <div className="profile-form">
              <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input placeholder="Mobile No." value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </div>
            <button className="btn-pink" style={{ marginTop: 16 }} onClick={handleSaveProfile}>
              {saveLabel}
            </button>
          </>
        )}

        {activeTab === 'Your Order' && (
          <>
            <div className="order-section">
              <h3>Current Orders</h3>
              {currentOrders.length === 0 && <p className="empty-state">No current orders</p>}
              {currentOrders.length > 0 && (
                <table className="order-table">
                  <tbody>
                    {currentOrders.map(order =>
                      order.items.map(item => (
                        <tr key={item.id}>
                          <td>{item.medicine_name}</td>
                          <td>{item.quantity}x</td>
                          <td style={{ fontWeight: 700 }}>{order.delivery_stage}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
            <div className="order-section">
              <h3>Past Orders</h3>
              {pastOrders.length === 0 && <p className="empty-state">No past orders</p>}
              {pastOrders.length > 0 && (
                <table className="order-table">
                  <tbody>
                    {pastOrders.map(order =>
                      order.items.map(item => (
                        <tr key={item.id}>
                          <td>{item.medicine_name}</td>
                          <td>{item.quantity}x</td>
                          <td style={{ color: 'var(--pink)' }}>
                            Delivered {new Date(order.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {activeTab === 'Medical Records' && (
          <>
            <h2>Medical Records</h2>
            {prescriptions.length === 0 ? (
              <p className="empty-state">No medical records saved yet</p>
            ) : (
              prescriptions.map(p => (
                <div key={p.id} className="address-card" style={{ marginBottom: 12 }}>
                  <h4>{p.original_name || 'Prescription'}</h4>
                  <p>Doctor: {p.doctor_name || 'N/A'}</p>
                  <p>Status: {p.status}</p>
                  <p>Uploaded: {new Date(p.uploaded_at).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'Manage Address' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0 }}>Manage Address</h2>
              <button className="btn-pink-outline" onClick={() => navigate('/add-address')}>
                + Add Address
              </button>
            </div>
            {addresses.length === 0 && <p className="empty-state">No saved addresses</p>}
            {addresses.map(addr => (
              <div key={addr.id} className="address-card">
                <h4>{addr.address_type}</h4>
                <p>
                  {addr.name}<br />
                  {addr.house_no}, {addr.road},<br />
                  {addr.city}, {addr.state}<br />
                  {addr.pin_code}
                </p>
                <div className="address-card-actions">
                  <button className="remove-btn" onClick={() => handleDeleteAddress(addr.id)}>Remove</button>
                  <button className="edit-btn">Edit</button>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'Settings' && (
          <>
            <h2>Change Password</h2>
            <div className="password-form">
              <input type="password" placeholder="Current password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} />
              <input type="password" placeholder="New password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
              <input type="password" placeholder="Confirm password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
              <button className="btn-pink" onClick={handleChangePassword}>Update</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
