import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import API from '../../api/axios';
import './Pharmacist.css';

export default function MedicineList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const [medicines, setMedicines] = useState([]);
  const [stockInputs, setStockInputs] = useState({});
  const [search, setSearch] = useState(searchParams.get('q') || '');

  useEffect(() => {
    API.get('/api/pharmacist/inventory').then(res => setMedicines(res.data.medicines));
  }, []);

  const handleStockChange = (id, value) => {
    setStockInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleAddStock = async (id) => {
    const qty = parseInt(stockInputs[id]);
    if (!qty || qty <= 0) {
      showToast('Enter a valid quantity');
      return;
    }
    try {
      const res = await API.put(`/api/medicines/${id}/add-stock`, { quantity: qty });
      setMedicines(prev => prev.map(m => m.id === id ? { ...m, quantity: res.data.quantity } : m));
      setStockInputs(prev => ({ ...prev, [id]: '' }));
      showToast(`Added ${qty} units to ${res.data.name}`);
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to add stock');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/api/medicines/${id}`);
      setMedicines(prev => prev.filter(m => m.id !== id));
      showToast(`${name} deleted`);
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to delete');
    }
  };

  return (
    <div className="pharma-page">
      <p className="cart-breadcrumb" style={{ marginBottom: 8 }}>
        <a onClick={() => navigate('/pharmacist/inventory')}>Home</a> &gt; Medicine List
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>Medicine List</h2>
        <input
          type="text"
          placeholder="Search medicines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, width: 250 }}
        />
      </div>
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
            <th>Add Stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {medicines.filter(m => {
            if (!search) return true;
            const q = search.toLowerCase();
            return m.name.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
          }).map(m => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{m.brand}</td>
              <td className={m.quantity < 15 ? 'low-stock' : ''}>{m.quantity}</td>
              <td>{m.mfg_date}</td>
              <td>{m.exp_date}</td>
              <td>₹{m.mrp}</td>
              <td>₹{m.cost_per_unit}</td>
              <td>{m.category}</td>
              <td>
                <div className="inline-stock">
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={stockInputs[m.id] || ''}
                    onChange={(e) => handleStockChange(m.id, e.target.value)}
                    className="stock-input"
                  />
                  <button className="stock-add-btn" onClick={() => handleAddStock(m.id)}>+</button>
                </div>
              </td>
              <td>
                <button className="delete-med-btn" onClick={() => handleDelete(m.id, m.name)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: 'right', marginTop: 20 }}>
        <button className="btn-pink" onClick={() => navigate('/pharmacist/add-stock')}>+ Add New Medicine</button>
      </div>
    </div>
  );
}
