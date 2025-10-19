import React, { useMemo } from 'react';
import 'chart.js/auto';
import { Bar, Doughnut } from 'react-chartjs-2';
import { store } from './store';

const MetricCard = ({ label, value, change }) => (
	<div className="metric-card">
		<div className="metric-value">{value}</div>
		<div className="metric-label">{label}</div>
		{change && <div className="metric-change">{change}</div>}
	</div>
);

export default function Dashboard() {
	const courses = store.get('courses', []);
	const depts = store.get('departments', []);
	const students = store.get('students', []);
	const faculty = store.get('faculty', []);

	const studentsByCourseData = useMemo(() => {
		const counts = courses.map(c => students.filter(s => s.courseId === c.id && s.status !== 'archived').length);
		return { labels: courses.map(c => c.code), datasets: [{ label: 'Number of Students', data: counts, backgroundColor: '#7c9df1' }] };
	}, [courses, students]);

	const facultyByDeptData = useMemo(() => {
		const counts = depts.map(d => faculty.filter(f => f.departmentId === d.id && f.status !== 'archived').length);
		return { labels: depts.map(d => d.name), datasets: [{ data: counts, backgroundColor: ['#ff7aa2','#6fe3c1','#ffd166','#7ea6ff','#c38fff'] }] };
	}, [depts, faculty]);

	return (
		<div className="page">
			<div className="welcome-card">Welcome back. Here's what's happening in your campus today</div>
			<div className="metrics">
				<MetricCard label="Total Students" value={students.filter(s=>s.status!=='archived').length.toLocaleString()} change="+2.1% vs last term" />
				<MetricCard label="Total Faculty" value={faculty.filter(f=>f.status!=='archived').length.toLocaleString()} change="+1.3% new hires" />
				<MetricCard label="Active Courses" value={courses.filter(c=>c.status==='active').length} change="— No change" />
				<MetricCard label="Departments" value={depts.filter(d=>d.status==='active').length} change="• 1 inactive" />
			</div>
			<div className="grid-2">
				<div className="card chart-card">
					<div className="card-title">Students by Course</div>
					<Bar data={studentsByCourseData} options={{ maintainAspectRatio: false }} />
				</div>
				<div className="card chart-card">
					<div className="card-title">Faculty by Department</div>
					<Doughnut data={facultyByDeptData} options={{ maintainAspectRatio: false, cutout: '60%' }} />
				</div>
			</div>
		</div>
	);
}
