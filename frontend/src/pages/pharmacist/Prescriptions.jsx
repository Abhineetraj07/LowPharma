import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import './Pharmacist.css';

export default function Prescriptions() {
  const { showToast } = useToast();
  const [pending, setPending] = useState([]);
  const [resolved, setResolved] = useState([]);
  const [users, setUsers] = useState({});

  const fetchData = async () => {
    const all = await API.get('/api/prescriptions/all');
    const p = all.data.filter(x => x.status === 'Pending');
    const r = all.data.filter(x => x.status !== 'Pending');
    setPending(p);
    setResolved(r);
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id) => {
    await API.put(`/api/prescriptions/${id}/approve`);
    showToast('Prescription approved');
    fetchData();
  };

  const handleDeny = async (id) => {
    await API.put(`/api/prescriptions/${id}/deny`);
    showToast('Prescription denied');
    fetchData();
  };

  return (
    <div className="pharma-page">
      <p className="cart-breadcrumb" style={{ marginBottom: 8 }}>Home &gt; Prescriptions</p>
      <h2 style={{ marginBottom: 20 }}>Pending Prescription</h2>

      <div style={{ display: 'flex', gap: 20, marginBottom: 8, padding: '0 8px' }}>
        <span style={{ flex: 1, color: 'var(--pink)', fontWeight: 700, fontSize: 13 }}>Name</span>
        <span style={{ flex: 1, color: 'var(--pink)', fontWeight: 700, fontSize: 13 }}>Medicine</span>
        <span style={{ flex: 1, color: 'var(--pink)', fontWeight: 700, fontSize: 13 }}>Doctor</span>
        <span style={{ flex: 1, color: 'var(--pink)', fontWeight: 700, fontSize: 13 }}>Prescription</span>
      </div>

      {pending.length === 0 && <p style={{ color: 'var(--gray)', padding: 20 }}>No pending prescriptions</p>}

      {pending.map(p => (
        <div key={p.id} className="prescription-card">
          <div className="prescription-card-header">
            <div><span>Patient</span><p>User #{p.user_id}</p></div>
            <div><span>Medicines</span><p>{p.original_name || 'Prescription'}</p></div>
            <div><span>Doctor</span><p>{p.doctor_name || 'N/A'}</p></div>
            <div>
              <a className="prescription-actions view-link"
                 href={`http://localhost:8000/uploads/${p.filename}`}
                 target="_blank" rel="noopener noreferrer"
              >
                View Prescription
              </a>
            </div>
          </div>
          <div className="prescription-actions">
            <button className="approve-btn" onClick={() => handleApprove(p.id)}>Approve</button>
            <button className="deny-btn" onClick={() => handleDeny(p.id)}>Deny</button>
          </div>
        </div>
      ))}

      {resolved.length > 0 && (
        <div className="resolved-section">
          <h3>Resolved</h3>
          {resolved.map(p => (
            <div key={p.id} className="prescription-card" style={{ opacity: 0.8 }}>
              <div className="prescription-card-header">
                <div><span>Patient</span><p>User #{p.user_id}</p></div>
                <div><span>File</span><p>{p.original_name}</p></div>
                <div><span>Doctor</span><p>{p.doctor_name || 'N/A'}</p></div>
                <div>
                  <span className={`status-badge ${p.status === 'Approved' ? 'approved' : 'denied'}`}>
                    {p.status === 'Approved' ? '\u2713 Approved' : '\u2717 Denied'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
