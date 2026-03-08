import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import './Pharmacist.css';

export default function MedicineList() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    API.get('/api/pharmacist/inventory').then(res => setMedicines(res.data.medicines));
  }, []);

  return (
    <div className="pharma-page">
      <h2 style={{ marginBottom: 20 }}>Medicine List</h2>
      <table className="med-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Quantity</th>
            <th>Mfg Date</th>
            <th>Exp Date</th>
            <th>MRP</th>
            <th>Cost per Unit</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map(m => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{m.brand}</td>
              <td className={m.quantity < 15 ? 'low-stock' : ''}>{m.quantity}</td>
              <td>{m.mfg_date}</td>
              <td>{m.exp_date}</td>
              <td>{'\u20B9'}{m.mrp}</td>
              <td>{'\u20B9'}{m.cost_per_unit}</td>
              <td>{m.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: 'right', marginTop: 20 }}>
        <button className="btn-pink" onClick={() => navigate('/pharmacist/add-stock')}>+ Add Stock</button>
      </div>
    </div>
  );
}
