import { useState, useEffect } from 'react';
import API from '../../api/axios';
import './Pharmacist.css';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ total_revenue: 0, successful_count: 0, pending_count: 0 });

  useEffect(() => {
    API.get('/api/pharmacist/transactions').then(res => setTransactions(res.data));
    API.get('/api/pharmacist/transactions/summary').then(res => setSummary(res.data));
  }, []);

  return (
    <div className="pharma-page">
      <p className="cart-breadcrumb" style={{ marginBottom: 8 }}>Home &gt; Transactions</p>
      <h2 style={{ marginBottom: 20 }}>Transactions</h2>

      <table className="med-table">
        <thead>
          <tr>
            <th>Txn ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id}>
              <td>TXN-{t.id}</td>
              <td>{t.customer_name}</td>
              <td>{new Date(t.created_at).toLocaleDateString()}</td>
              <td>{'\u20B9'}{t.amount}</td>
              <td>{t.payment_method}</td>
              <td>
                <span className={`order-status-badge ${t.status === 'Successful' ? 'approved' : 'pending'}`}>
                  {t.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {transactions.length === 0 && <p style={{ color: 'var(--gray)', textAlign: 'center', padding: 20 }}>No transactions yet</p>}

      <div className="txn-summary">
        <div className="txn-summary-item">
          <p className="label">Total Revenue</p>
          <p className="value">{'\u20B9'}{summary.total_revenue}</p>
        </div>
        <div className="txn-summary-item">
          <p className="label">Successful</p>
          <p className="value" style={{ color: 'var(--green)' }}>{summary.successful_count}</p>
        </div>
        <div className="txn-summary-item">
          <p className="label">Pending</p>
          <p className="value" style={{ color: 'var(--orange)' }}>{summary.pending_count}</p>
        </div>
      </div>
    </div>
  );
}
