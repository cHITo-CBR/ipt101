import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { store, useList } from './store';

const Toolbar = ({ children }) => (<div className="toolbar">{children}</div>);
const Input = (props) => (<input className="input" {...props} />);

export default function ReportsManager() {
  const [reports, setReports] = useList('reports');
  const students = store.get('students', []);
  const faculty = store.get('faculty', []);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');

  const filtered = reports.filter(r => (
    (!q || r.title.toLowerCase().includes(q.toLowerCase())) &&
    (!status || r.status === status) && r.status !== 'archived'
  ));

  const [form, setForm] = useState({ id:null, title:'', studentId:'', facultyId:'', filePath:'', status:'pending', remarks:'' });
  const save = async () => {
    if (!form.title || !form.studentId || !form.facultyId) return;
    if (form.id) {
      const res = await axios.put(`/api/reports/${form.id}`, {
        title: form.title,
        studentId: Number(form.studentId),
        facultyId: Number(form.facultyId),
        filePath: form.filePath || null,
        status: form.status,
        remarks: form.remarks || null,
      });
      const updated = res.data;
      setReports(prev => prev.map(i => i.id === updated.id ? updated : i));
    } else {
      const res = await axios.post('/api/reports', {
        title: form.title,
        studentId: Number(form.studentId),
        facultyId: Number(form.facultyId),
        filePath: form.filePath || null,
        status: form.status,
        remarks: form.remarks || null,
      });
      setReports(prev => [...prev, res.data]);
    }
    setForm({ id:null, title:'', studentId:'', facultyId:'', filePath:'', status:'pending', remarks:'' });
  };
  const edit = (item) => setForm({ id:item.id, title:item.title, studentId:String(item.studentId), facultyId:String(item.facultyId), filePath:item.filePath||'', status:item.status, remarks:item.remarks||'' });
  const archive = async (id) => {
    await axios.post(`/api/reports/${id}/archive`);
    setReports(prev => prev.map(i => i.id === id ? { ...i, status: 'archived' } : i));
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-title">Manage Reports</div>
        <Toolbar>
          <Input placeholder="Search by title" value={q} onChange={e=>setQ(e.target.value)} />
          <select className="input" value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </Toolbar>
        <div className="grid-2">
          <div>
            <table className="table">
              <thead><tr><th>Title</th><th>Student</th><th>Faculty</th><th>Status</th><th></th></tr></thead>
              <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>{r.title}</td>
                  <td>{students.find(s=>s.id===r.studentId)?.name}</td>
                  <td>{faculty.find(f=>f.id===r.facultyId)?.name}</td>
                  <td><span className={`status-badge status-badge--${r.status}`}>{r.status}</span></td>
                  <td className="actions-col"><button className="btn btn--outline" onClick={()=>edit(r)}>Edit</button><button className="btn btn--outline" onClick={()=>archive(r.id)}>Archive</button></td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="form">
              <div className="form-row"><label>Title</label><Input value={form.title} onChange={e=>setForm(s=>({...s,title:e.target.value}))} /></div>
              <div className="form-row"><label>Student</label>
                <select className="input" value={form.studentId} onChange={e=>setForm(s=>({...s,studentId:e.target.value}))}>
                  <option value="">Select student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-row"><label>Faculty</label>
                <select className="input" value={form.facultyId} onChange={e=>setForm(s=>({...s,facultyId:e.target.value}))}>
                  <option value="">Select faculty</option>
                  {faculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div className="form-row"><label>File URL</label><Input value={form.filePath} onChange={e=>setForm(s=>({...s,filePath:e.target.value}))} /></div>
              <div className="form-row"><label>Status</label>
                <select className="input" value={form.status} onChange={e=>setForm(s=>({...s,status:e.target.value}))}>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="form-row"><label>Remarks</label><Input value={form.remarks} onChange={e=>setForm(s=>({...s,remarks:e.target.value}))} /></div>
              <div className="form-row"><button className="btn btn--primary" onClick={save}>{form.id ? 'Update' : 'Add'} Report</button></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
