import React, { useState } from 'react';
import { useList } from './store';

const Tabs = ({ tab, setTab }) => (
	<div className="tabs">
		{['courses','departments','academicYears'].map(t => (
			<button key={t} className={`tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t}</button>
		))}
	</div>
);

const Toolbar = ({ children }) => (<div className="toolbar">{children}</div>);
const Input = (props) => (<input className="input" {...props} />);

export default function Settings() {
	const [tab, setTab] = useState('courses');
	const [courses, setCourses] = useList('courses');
	const [departments, setDepartments] = useList('departments');
	const [academicYears, setAys] = useList('academicYears');

	const addItem = (collSetter, coll, item) => {
		const id = Math.max(0, ...coll.map(i=>i.id)) + 1;
		collSetter(prev => [...prev, { ...item, id }]);
	};
	const updateItem = (collSetter, item) => collSetter(prev => prev.map(i=>i.id===item.id? item : i));
	const archiveItem = (collSetter, id) => collSetter(prev => prev.map(i=>i.id===id? { ...i, status:'archived' } : i));

	const renderList = (items, cols, onEdit, onArchive) => (
		<table className="table"><thead><tr>{cols.map(c=> <th key={c}>{c}</th>)}<th></th></tr></thead>
			<tbody>{items.filter(i=>i.status!=='archived').map(i=> (
				<tr key={i.id}>{cols.map(c=> <td key={c}>{i[c]}</td>)}<td className="actions-col"><button className="btn btn--outline" onClick={()=>onEdit(i)}>Edit</button><button className="btn btn--outline" onClick={()=>onArchive(i.id)}>Archive</button></td></tr>
			))}</tbody>
		</table>
	);

	const [form, setForm] = useState({ id:null, field1:'', field2:'' });
	const resetForm = () => setForm({ id:null, field1:'', field2:'' });
	const save = () => {
		if (tab==='courses') {
			if (!form.field1 || !form.field2) return;
			const obj = { id: form.id, code: form.field1, name: form.field2, status:'active' };
			form.id ? updateItem(setCourses, obj) : addItem(setCourses, courses, obj);
		} else if (tab==='departments') {
			if (!form.field1 || !form.field2) return;
			const obj = { id: form.id, code: form.field1, name: form.field2, status:'active' };
			form.id ? updateItem(setDepartments, obj) : addItem(setDepartments, departments, obj);
		} else {
			if (!form.field1) return;
			const obj = { id: form.id, label: form.field1, status:'active' };
			form.id ? updateItem(setAys, obj) : addItem(setAys, academicYears, obj);
		}
		resetForm();
	};
	const edit = (item) => {
		if (tab==='courses' || tab==='departments') setForm({ id:item.id, field1:item.code, field2:item.name });
		else setForm({ id:item.id, field1:item.label, field2:'' });
	};

	return (
		<div className="page">
			<div className="card">
				<div className="card-title">System Settings</div>
				<Tabs tab={tab} setTab={setTab} />
				{tab==='courses' && renderList(courses, ['code','name','status'], edit, (id)=>archiveItem(setCourses, id))}
				{tab==='departments' && renderList(departments, ['code','name','status'], edit, (id)=>archiveItem(setDepartments, id))}
				{tab==='academicYears' && renderList(academicYears, ['label','status'], edit, (id)=>archiveItem(setAys, id))}
				<div className="form form-inline">
					{tab!=='academicYears' && <><label>Code</label><Input value={form.field1} onChange={e=>setForm(s=>({...s,field1:e.target.value}))} /><label>Name</label><Input value={form.field2} onChange={e=>setForm(s=>({...s,field2:e.target.value}))} /></>}
					{tab==='academicYears' && <><label>Label</label><Input value={form.field1} onChange={e=>setForm(s=>({...s,field1:e.target.value}))} /></>}
					<button className="btn btn--primary" onClick={save}>{form.id ? 'Update' : 'Add'}</button>
					{form.id && <button className="btn btn--outline" onClick={resetForm}>Cancel</button>}
				</div>
			</div>
		</div>
	);
}
