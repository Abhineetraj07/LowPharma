import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import './Pharmacist.css';

export default function Inventory() {
  const navigate = useNavigate();
  const [data, setData] = useState({ medicines: [], alerts: [] });

  useEffect(() => {
    API.get('/api/pharmacist/inventory').then(res => setData(res.data));
  }, []);

  return (
    <div className="pharma-page">
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <button className="btn-pink" onClick={() => navigate('/pharmacist/add-stock')}>+ Add Stock</button>
      </div>

      <div className="inventory-layout">
        <div className="alerts-panel">
          <h3>{'\u26A0\uFE0F'} Alerts</h3>
          {data.alerts.map((a, i) => (
            <div key={i} className="alert-item">
              <span className="alert-name">{a.name}</span>
              <span className="alert-msg">{a.alert}</span>
            </div>
          ))}
          {data.alerts.length === 0 && <p style={{ color: 'var(--gray)', fontSize: 13 }}>No alerts</p>}
        </div>

        <div className="inventory-right">
          <div className="inventory-header">
            <h3>Medicine List</h3>
            <button className="btn-pink-outline" onClick={() => navigate('/pharmacist/medicine-list')}>View Full List</button>
          </div>
          <div className="table-scroll">
            <table className="med-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Quantity</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.medicines.slice(0, 10).map(m => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.brand}</td>
                    <td className={m.quantity < 15 ? 'low-stock' : ''}>{m.quantity}</td>
                    <td>{m.exp_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
