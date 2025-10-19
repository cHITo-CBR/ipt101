import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { store, useList } from './store';

const Toolbar = ({ children }) => (<div className="toolbar">{children}</div>);
const Input = (props) => (<input className="input" {...props} />);

export default function Faculty() {
	const [faculty, setFaculty] = useList('faculty');
	const departments = store.get('departments', []);
	const [q, setQ] = useState('');
	const [dep, setDep] = useState('');

	const filtered = faculty.filter(f => (
		(!q || f.name.toLowerCase().includes(q.toLowerCase()) || f.employeeNo.toLowerCase().includes(q.toLowerCase())) &&
		(!dep || String(f.departmentId) === String(dep)) && f.status !== 'archived'
	));

	const [form, setForm] = useState({ id: null, employeeNo: '', name: '', departmentId: '' });
	const save = async () => {
		if (!form.name || !form.employeeNo || !form.departmentId) return;
		if (form.id) {
			const res = await axios.put(`/api/faculty/${form.id}`, {
				employeeNo: form.employeeNo,
				name: form.name,
				departmentId: Number(form.departmentId),
				status: 'active',
			});
			const updated = res.data;
			setFaculty(prev => prev.map(i => i.id === updated.id ? updated : i));
		} else {
			const res = await axios.post('/api/faculty', {
				employeeNo: form.employeeNo,
				name: form.name,
				departmentId: Number(form.departmentId),
			});
			setFaculty(prev => [...prev, res.data]);
		}
		setForm({ id: null, employeeNo: '', name: '', departmentId: '' });
	};
	const edit = (item) => setForm({ id: item.id, employeeNo: item.employeeNo, name: item.name, departmentId: String(item.departmentId) });
	const archive = async (id) => {
		await axios.post(`/api/faculty/${id}/archive`);
		setFaculty(prev => prev.map(i => i.id === id ? { ...i, status: 'archived' } : i));
	};

	useEffect(() => {
		const fetchFaculty = async () => {
			const res = await axios.get('/api/faculty');
			setFaculty(res.data);
		};
		fetchFaculty();
	}, []);

	return (
		<div className="page">
			<div className="card">
				<div className="card-title">Faculty</div>
				<Toolbar>
					<Input placeholder="Search by name or employee no" value={q} onChange={e => setQ(e.target.value)} />
					<select className="input" value={dep} onChange={e => setDep(e.target.value)}>
						<option value="">All departments</option>
						{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
					</select>
				</Toolbar>
				<div className="grid-2">
					<div>
						<table className="table">
							<thead><tr><th>Emp No</th><th>Name</th><th>Department</th><th></th></tr></thead>
							<tbody>
							{filtered.map(f => (
								<tr key={f.id}><td>{f.employeeNo}</td><td>{f.name}</td><td>{departments.find(d => d.id===f.departmentId)?.name}</td>
								<td className="actions-col"><button className="btn btn--outline" onClick={()=>edit(f)}>Edit</button><button className="btn btn--outline" onClick={()=>archive(f.id)}>Archive</button></td></tr>
							))}
							</tbody>
						</table>
					</div>
					<div>
						<div className="form">
							<div className="form-row"><label>Employee No</label><Input value={form.employeeNo} onChange={e=>setForm(s=>({...s,employeeNo:e.target.value}))} /></div>
							<div className="form-row"><label>Name</label><Input value={form.name} onChange={e=>setForm(s=>({...s,name:e.target.value}))} /></div>
							<div className="form-row"><label>Department</label>
								<select className="input" value={form.departmentId} onChange={e=>setForm(s=>({...s,departmentId:e.target.value}))}>
									<option value="">Select department</option>
									{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
								</select>
							</div>
							<div className="form-row"><button className="btn btn--primary" onClick={save}>{form.id ? 'Update' : 'Add'} Faculty</button></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
