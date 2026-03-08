import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import API from '../../api/axios';
import './Pharmacist.css';

const TABS = ['Edit Profile', 'Pharmacy Details', 'Settings'];

export default function PharmacistProfile() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('Edit Profile');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [pharmacyAddress, setPharmacyAddress] = useState('');
  const [operatingHours, setOperatingHours] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [saveLabel, setSaveLabel] = useState('Save');

  useEffect(() => {
    API.get('/api/profile/').then(res => {
      const d = res.data;
      setName(d.name); setEmail(d.email); setMobile(d.mobile);
      setPharmacyName(d.pharmacy_name); setLicenseNumber(d.license_number);
      setPharmacyAddress(d.pharmacy_address); setOperatingHours(d.operating_hours);
      setContactNumber(d.contact_number);
    });
  }, []);

  const handleSaveProfile = async () => {
    await API.put('/api/profile/pharmacist', { name, email, mobile, pharmacy_name: pharmacyName, license_number: licenseNumber });
    setSaveLabel('Saved!');
    setTimeout(() => setSaveLabel('Save'), 2000);
  };

  const handleSavePharmacy = async () => {
    await API.put('/api/profile/pharmacist', { pharmacy_name: pharmacyName, pharmacy_address: pharmacyAddress, operating_hours: operatingHours, contact_number: contactNumber });
    showToast('Pharmacy details saved');
  };

  const handleChangePassword = async () => {
    if (newPwd !== confirmPwd) { showToast('Passwords do not match'); return; }
    try {
      await API.put('/api/profile/change-password', { current_password: currentPwd, new_password: newPwd });
      showToast('Password changed!');
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed');
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
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
            <div className="pharma-profile-form">
              <label>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
              <label>Phone Number</label>
              <input value={mobile} onChange={(e) => setMobile(e.target.value)} />
              <label>Pharmacy Name</label>
              <input value={pharmacyName} onChange={(e) => setPharmacyName(e.target.value)} />
              <label>License Number</label>
              <input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
            </div>
            <button className="btn-pink" style={{ marginTop: 16 }} onClick={handleSaveProfile}>{saveLabel}</button>
          </>
        )}

        {activeTab === 'Pharmacy Details' && (
          <>
            <h2>Pharmacy Details</h2>
            <div className="pharma-profile-form">
              <label>Pharmacy Name</label>
              <input value={pharmacyName} onChange={(e) => setPharmacyName(e.target.value)} />
              <label>Address</label>
              <input value={pharmacyAddress} onChange={(e) => setPharmacyAddress(e.target.value)} />
              <label>Operating Hours</label>
              <input value={operatingHours} onChange={(e) => setOperatingHours(e.target.value)} placeholder="e.g. 9 AM - 9 PM" />
              <label>Contact Number</label>
              <input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
            </div>
            <button className="btn-pink" style={{ marginTop: 16 }} onClick={handleSavePharmacy}>Save</button>
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
