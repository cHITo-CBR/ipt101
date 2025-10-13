import React, { useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { store } from './store';

const Toolbar = ({ children }) => (<div className="toolbar">{children}</div>);

export default function Reports() {
	const courses = store.get('courses', []);
	const depts = store.get('departments', []);
	const students = store.get('students', []);
	const faculty = store.get('faculty', []);

	const [course, setCourse] = useState('');
	const [dept, setDept] = useState('');

	const filteredCourses = course ? courses.filter(c => String(c.id) === String(course)) : courses;
	const filteredDepts = dept ? depts.filter(d => String(d.id) === String(dept)) : depts;

	const studentCounts = filteredCourses.map(c => students.filter(s => s.courseId===c.id && s.status!=='archived').length);
	const facultyCounts = filteredDepts.map(d => faculty.filter(f => f.departmentId===d.id && f.status!=='archived').length);

	return (
		<div className="page">
			<Toolbar>
				<label>Filter Course</label>
				<select className="input" value={course} onChange={e=>setCourse(e.target.value)}>
					<option value="">All</option>
					{courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
				</select>
				<label>Filter Department</label>
				<select className="input" value={dept} onChange={e=>setDept(e.target.value)}>
					<option value="">All</option>
					{depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
				</select>
			</Toolbar>
			<div className="grid-2">
				<div className="card chart-card"><div className="card-title">Students per Course</div>
					<Bar data={{ labels: filteredCourses.map(c=>c.code), datasets: [{ label:'Students', data: studentCounts, backgroundColor:'#7c9df1' }] }} options={{ maintainAspectRatio:false }} />
				</div>
				<div className="card chart-card"><div className="card-title">Faculty per Department</div>
					<Doughnut data={{ labels: filteredDepts.map(d=>d.name), datasets: [{ data: facultyCounts, backgroundColor:['#ff7aa2','#6fe3c1','#ffd166','#7ea6ff','#c38fff'] }] }} options={{ maintainAspectRatio:false, cutout:'60%' }} />
				</div>
			</div>
		</div>
	);
}
