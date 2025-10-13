import React, { useState } from 'react';
import { store, useList } from './store';

const Toolbar = ({ children }) => (<div className="toolbar">{children}</div>);
const Input = (props) => (<input className="input" {...props} />);

export default function Students() {
	const [students, setStudents] = useList('students');
	const courses = store.get('courses', []);
	const [q, setQ] = useState('');
	const [course, setCourse] = useState('');

	const filtered = students.filter(s => (
		(!q || s.name.toLowerCase().includes(q.toLowerCase()) || s.studentNo.toLowerCase().includes(q.toLowerCase())) &&
		(!course || String(s.courseId) === String(course)) && s.status !== 'archived'
	));

	const [form, setForm] = useState({ id: null, studentNo: '', name: '', courseId: '', yearLevel: 1 });
	const save = () => {
		if (!form.name || !form.studentNo || !form.courseId) return;
		if (form.id) {
			setStudents(prev => prev.map(i => i.id === form.id ? { ...i, ...form, courseId: Number(form.courseId), yearLevel: Number(form.yearLevel) } : i));
		} else {
			const id = Math.max(0, ...students.map(i=>i.id)) + 1;
			setStudents(prev => [...prev, { ...form, id, status: 'active', courseId: Number(form.courseId), yearLevel: Number(form.yearLevel) }]);
		}
		setForm({ id: null, studentNo: '', name: '', courseId: '', yearLevel: 1 });
	};
	const edit = (item) => setForm({ id: item.id, studentNo: item.studentNo, name: item.name, courseId: String(item.courseId), yearLevel: Number(item.yearLevel) });
	const archive = (id) => setStudents(prev => prev.map(i => i.id === id ? { ...i, status: 'archived' } : i));

	return (
		<div className="page">
			<div className="card">
				<div className="card-title">Students</div>
				<Toolbar>
					<Input placeholder="Search by name or student no" value={q} onChange={e => setQ(e.target.value)} />
					<select className="input" value={course} onChange={e => setCourse(e.target.value)}>
						<option value="">Select course</option>
						{courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
					</select>
				</Toolbar>
				<div className="grid-2">
					<div>
						<table className="table">
							<thead><tr><th>Student No</th><th>Name</th><th>Course</th><th>Year</th><th></th></tr></thead>
							<tbody>
							{filtered.map(s => (
								<tr key={s.id}><td>{s.studentNo}</td><td>{s.name}</td><td>{courses.find(c => c.id===s.courseId)?.code}</td><td>{s.yearLevel}</td>
								<td className="actions-col"><button className="btn btn--outline" onClick={()=>edit(s)}>Edit</button><button className="btn btn--outline" onClick={()=>archive(s.id)}>Archive</button></td></tr>
							))}
							</tbody>
						</table>
					</div>
					<div>
						<div className="form">
							<div className="form-row"><label>Student No</label><Input value={form.studentNo} onChange={e=>setForm(s=>({...s,studentNo:e.target.value}))} /></div>
							<div className="form-row"><label>Name</label><Input value={form.name} onChange={e=>setForm(s=>({...s,name:e.target.value}))} /></div>
							<div className="form-row"><label>Course</label>
								<select className="input" value={form.courseId} onChange={e=>setForm(s=>({...s,courseId:e.target.value}))}>
									<option value="">Select course</option>
									{courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
								</select>
							</div>
							<div className="form-row"><label>Year Level</label>
								<input className="input" type="number" min="1" max="5" value={form.yearLevel} onChange={e=>setForm(s=>({...s,yearLevel:e.target.value}))} />
							</div>
							<div className="form-row"><button className="btn btn--primary" onClick={save}>{form.id ? 'Update' : 'Add'} Student</button></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
