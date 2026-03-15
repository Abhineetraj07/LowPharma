import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import API from '../../api/axios';
import './Pharmacist.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchDashboard = () => {
    const params = {};
    if (fromDate) params.from_date = fromDate;
    if (toDate) params.to_date = toDate;
    API.get('/api/pharmacist/dashboard', { params }).then(res => setData(res.data));
  };

  useEffect(() => { fetchDashboard(); }, []);

  if (!data) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;

  const salesData = {
    labels: data.sales_trend.map(d => d.day),
    datasets: [{
      label: 'Sales',
      data: data.sales_trend.map(d => d.amount),
      borderColor: '#10B981',
      backgroundColor: '#10B981',
      tension: 0.3,
      pointRadius: 5,
    }],
  };

  const turnoverData = {
    labels: ['Remaining', 'Sold', 'Expiry'],
    datasets: [{
      data: [data.stock_turnover.remaining, data.stock_turnover.sold, data.stock_turnover.expired],
      backgroundColor: ['#FFD6A5', '#3B82F6', '#FFB3D9'],
    }],
  };

  const expiryData = {
    labels: data.expiry_loss.map(d => d.name),
    datasets: [{
      label: 'Loss',
      data: data.expiry_loss.map(d => d.loss),
      backgroundColor: data.expiry_loss.map((_, i) => i % 2 === 0 ? '#EF4444' : '#10B981'),
    }],
  };

  return (
    <div className="pharma-page">
      <p className="cart-breadcrumb" style={{ marginBottom: 8 }}>
        <a onClick={() => navigate('/pharmacist/inventory')}>Home</a> &gt; Dashboard
      </p>

      <div className="dashboard-filters">
        <label>Date</label>
        <label>From:</label>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <label>To:</label>
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        <button className="btn-pink" style={{ padding: '8px 20px' }} onClick={fetchDashboard}>Go</button>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Sales Trend</h3>
          <Line data={salesData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="chart-card">
          <h3>Stock Turnover</h3>
          <Pie data={turnoverData} options={{ responsive: true }} />
        </div>
        <div className="chart-card">
          <h3>Expiry Loss</h3>
          <Bar data={expiryData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>

      <div className="dashboard-actions">
        <button className="btn-pink-outline" onClick={() => window.print()}>📄 Generate Report</button>
      </div>
    </div>
  );
}
