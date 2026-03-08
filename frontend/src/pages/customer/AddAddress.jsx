import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import API from '../../api/axios';
import './AddAddress.css';

export default function AddAddress() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [road, setRoad] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [addressType, setAddressType] = useState('Home');

  const handleSave = async () => {
    if (!name.trim() || !pinCode.trim()) {
      showToast('Name and Pin Code are required');
      return;
    }
    await API.post('/api/addresses/', {
      name, mobile, house_no: houseNo, road, city, state, pin_code: pinCode, address_type: addressType,
    });
    showToast('Address saved!');
    navigate('/profile');
  };

  return (
    <div className="add-address-page">
      <div className="profile-sidebar">
        <p className="cart-breadcrumb" style={{ marginBottom: 16 }}>
          <a onClick={() => navigate('/home')}>Home</a> &gt; Manage address
        </p>
        <div className="profile-user">
          <span className="avatar">{'\u263A'}</span>
          <h3>{user?.username}</h3>
        </div>
        <div className="profile-menu">
          {['Edit Profile', 'Your Order', 'Medical Records', 'Manage Address'].map(tab => (
            <button key={tab} className={tab === 'Manage Address' ? 'active' : ''} onClick={() => navigate('/profile')}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="add-address-content">
        <h2>Add Address</h2>
        <div className="address-form">
          <label>Deliver To:</label>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />

          <label>Mobile No.</label>
          <input placeholder="+91" value={mobile} onChange={(e) => setMobile(e.target.value)} />

          <label>House No., Building</label>
          <input value={houseNo} onChange={(e) => setHouseNo(e.target.value)} />

          <label>Road Name, Area, Locality</label>
          <input value={road} onChange={(e) => setRoad(e.target.value)} />

          <label>City</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} />

          <label>State</label>
          <input value={state} onChange={(e) => setState(e.target.value)} />

          <label>Pin Code</label>
          <input value={pinCode} onChange={(e) => setPinCode(e.target.value)} />

          <label>Address Type</label>
          <div className="address-type-chips">
            {['Home', 'Work', 'Other'].map(type => (
              <button key={type} className={addressType === type ? 'active' : ''} onClick={() => setAddressType(type)}>
                {type}
              </button>
            ))}
          </div>

          <button className="btn-pink" onClick={handleSave}>Save & Continue</button>
        </div>
      </div>
    </div>
  );
}
