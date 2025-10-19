import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Toolbar = ({ children }) => (<div className="toolbar">{children}</div>);

export default function Archives() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const params = category ? { params: { category } } : {};
    axios.get('/api/archives', params).then(res => setItems(res.data || [])).catch(()=>setItems([]));
  }, [category]);

  const summary = (a) => {
    const d = a.dataSnapshot || {};
    return d.title || d.name || d.student_no || d.employee_no || JSON.stringify(d).slice(0, 60);
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-title">Archives</div>
        <Toolbar>
          <label>Category</label>
          <select className="input" value={category} onChange={e=>setCategory(e.target.value)}>
            <option value="">All</option>
            <option value="student">Students</option>
            <option value="faculty">Faculty</option>
            <option value="report">Reports</option>
          </select>
        </Toolbar>
        <table className="table">
          <thead><tr><th>Category</th><th>Type</th><th>Summary</th><th>Archived At</th></tr></thead>
          <tbody>
          {items.map(a => (
            <tr key={a.id}>
              <td>{a.category}</td>
              <td>{a.archivableType}</td>
              <td>{summary(a)}</td>
              <td>{a.archivedAt ? new Date(a.archivedAt).toLocaleString() : ''}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
