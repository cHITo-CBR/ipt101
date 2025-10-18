// Reference: https://github.com/Jovi0125/JV-Profile-Management-Final
import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import 'chart.js/auto';
import { Bar, Doughnut } from 'react-chartjs-2';

// ---------------------- Data helpers (localStorage + API sync) ----------------------
const store = {
  get(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
};

// Seed demo datasets if empty
function useSeed() {
  useEffect(() => {
    // Try to pull from API; fallback to demo seed if API not available
    (async () => {
      try {
        const [courses, departments, academicYears, students, faculty] = await Promise.all([
          axios.get('/api/courses'),
          axios.get('/api/departments'),
          axios.get('/api/academic-years'),
          axios.get('/api/students'),
          axios.get('/api/faculty'),
        ]);
        store.set('courses', courses.data ?? []);
        store.set('departments', departments.data ?? []);
        store.set('academicYears', academicYears.data ?? []);
        store.set('students', students.data ?? []);
        store.set('faculty', faculty.data ?? []);
      } catch (e) {
        if (!store.get('courses')) {
          store.set('courses', [
            { id: 1, code: 'BSIT', name: 'Information Technology', status: 'active' },
            { id: 2, code: 'BSCS', name: 'Computer Science', status: 'active' },
            { id: 3, code: 'BSBA', name: 'Business Administration', status: 'active' },
            { id: 4, code: 'BSA', name: 'Accountancy', status: 'active' },
          ]);
        }
        if (!store.get('departments')) {
          store.set('departments', [
            { id: 1, code: 'CS', name: 'Computer Science', status: 'active' },
            { id: 2, code: 'ENG', name: 'Engineering', status: 'active' },
            { id: 3, code: 'BUS', name: 'Business', status: 'active' },
            { id: 4, code: 'ART', name: 'Arts & Humanities', status: 'active' },
            { id: 5, code: 'SCI', name: 'Science', status: 'active' },
          ]);
        }
        if (!store.get('academicYears')) {
          store.set('academicYears', [
            { id: 1, label: '2024-2025', status: 'active' },
            { id: 2, label: '2023-2024', status: 'archived' },
          ]);
        }
        if (!store.get('students')) {
          store.set('students', [
            { id: 1, studentNo: 'S-0001', name: 'John Doe', courseId: 1, yearLevel: 3, status: 'active' },
            { id: 2, studentNo: 'S-0002', name: 'Jane Smith', courseId: 2, yearLevel: 2, status: 'active' },
            { id: 3, studentNo: 'S-0003', name: 'Amy Santiago', courseId: 3, yearLevel: 4, status: 'active' },
            { id: 4, studentNo: 'S-0004', name: 'Jake Peralta', courseId: 1, yearLevel: 1, status: 'active' },
          ]);
        }
        if (!store.get('faculty')) {
          store.set('faculty', [
            { id: 1, employeeNo: 'F-1001', name: 'Dr. Sarah Johnson', departmentId: 1, status: 'active' },
            { id: 2, employeeNo: 'F-1002', name: 'Prof. Michael Brown', departmentId: 2, status: 'active' },
            { id: 3, employeeNo: 'F-1003', name: 'Dr. Anna Garcia', departmentId: 3, status: 'active' },
          ]);
        }
      }
    })();
  }, []);
}

function useList(key) {
  const [items, setItems] = useState(() => store.get(key, []));
  useEffect(() => { store.set(key, items); }, [key, items]);
  return [items, setItems];
}

// ---------------------- Shared UI ----------------------
const Sidebar = ({ onLogout }) => (
  <aside className="sidebar">
    <div className="brand">
      <div className="brand-logo">SFMS</div>
      <div className="brand-name">Profile System</div>
    </div>
    <nav className="menu">
      <NavLink end to="/" className={({ isActive }) => `menu-item${isActive ? ' active' : ''}`}>Dashboard</NavLink>
      <NavLink to="/faculty" className={({ isActive }) => `menu-item${isActive ? ' active' : ''}`}>Faculty</NavLink>
      <NavLink to="/students" className={({ isActive }) => `menu-item${isActive ? ' active' : ''}`}>Students</NavLink>
      <NavLink to="/reports" className={({ isActive }) => `menu-item${isActive ? ' active' : ''}`}>Reports</NavLink>
      <NavLink to="/settings" className={({ isActive }) => `menu-item${isActive ? ' active' : ''}`}>Settings</NavLink>
      <NavLink to="/profile" className={({ isActive }) => `menu-item${isActive ? ' active' : ''}`}>My Profile</NavLink>
      <button className="menu-item logout" onClick={onLogout}>Logout</button>
    </nav>
  </aside>
);

const Topbar = () => {
  const navigate = useNavigate();
  return (
    <header className="topbar">
      <div className="page-title">Dashboard</div>
      <div className="actions">
        <button className="btn btn--primary" onClick={() => navigate('/students')}>Add Student</button>
        <button className="btn btn--outline" onClick={() => navigate('/faculty')}>Add Faculty</button>
        <button className="btn btn--outline" onClick={() => navigate('/reports')}>Reports</button>
        <div className="user-box">Welcome, Admin</div>
      </div>
    </header>
  );
};

const MetricCard = ({ label, value, change }) => (
  <div className="metric-card">
    <div className="metric-value">{value}</div>
    <div className="metric-label">{label}</div>
    {change && <div className="metric-change">{change}</div>}
  </div>
);

// ---------------------- Pages: Dashboard ----------------------
const DashboardPage = () => {
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
};

// ---------------------- Utility components ----------------------
const Toolbar = ({ children }) => (<div className="toolbar">{children}</div>);
const Input = (props) => (<input className="input" {...props} />);
const Select = ({ options, value, onChange }) => (
  <select className="input" value={value} onChange={onChange}>
    <option value="">All</option>
    {options.map(opt => <option key={opt.id} value={opt.id}>{opt.code || opt.name || opt.label}</option>)}
  </select>
);

// ---------------------- Pages: Faculty ----------------------
const FacultyPage = () => {
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

  return (
    <div className="page">
      <div className="card">
        <div className="card-title">Faculty</div>
        <Toolbar>
          <Input placeholder="Search by name or employee no" value={q} onChange={e => setQ(e.target.value)} />
          <Select options={departments} value={dep} onChange={e => setDep(e.target.value)} />
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
};

// ---------------------- Pages: Students ----------------------
const StudentsPage = () => {
  const [students, setStudents] = useList('students');
  const courses = store.get('courses', []);
  const [q, setQ] = useState('');
  const [course, setCourse] = useState('');

  const filtered = students.filter(s => (
    (!q || s.name.toLowerCase().includes(q.toLowerCase()) || s.studentNo.toLowerCase().includes(q.toLowerCase())) &&
    (!course || String(s.courseId) === String(course)) && s.status !== 'archived'
  ));

  const [form, setForm] = useState({ id: null, studentNo: '', name: '', courseId: '', yearLevel: 1 });
  const save = async () => {
    if (!form.name || !form.studentNo || !form.courseId) return;
    if (form.id) {
      const res = await axios.put(`/api/students/${form.id}`, {
        studentNo: form.studentNo,
        name: form.name,
        courseId: Number(form.courseId),
        yearLevel: Number(form.yearLevel),
        status: 'active',
      });
      const updated = res.data;
      setStudents(prev => prev.map(i => i.id === updated.id ? updated : i));
    } else {
      const res = await axios.post('/api/students', {
        studentNo: form.studentNo,
        name: form.name,
        courseId: Number(form.courseId),
        yearLevel: Number(form.yearLevel),
      });
      setStudents(prev => [...prev, res.data]);
    }
    setForm({ id: null, studentNo: '', name: '', courseId: '', yearLevel: 1 });
  };
  const edit = (item) => setForm({ id: item.id, studentNo: item.studentNo, name: item.name, courseId: String(item.courseId), yearLevel: Number(item.yearLevel) });
  const archive = async (id) => {
    await axios.post(`/api/students/${id}/archive`);
    setStudents(prev => prev.map(i => i.id === id ? { ...i, status: 'archived' } : i));
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-title">Students</div>
        <Toolbar>
          <Input placeholder="Search by name or student no" value={q} onChange={e => setQ(e.target.value)} />
          <Select options={courses} value={course} onChange={e => setCourse(e.target.value)} />
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
};

// ---------------------- Pages: Reports ----------------------
const ReportsPage = () => {
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
};

// ---------------------- Pages: Settings ----------------------
const Tabs = ({ tab, setTab }) => (
  <div className="tabs">
    {['courses','departments','academicYears'].map(t => (
      <button key={t} className={`tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t}</button>
    ))}
  </div>
);

const SettingsPage = () => {
  const [tab, setTab] = useState('courses');
  const [courses, setCourses] = useList('courses');
  const [departments, setDepartments] = useList('departments');
  const [academicYears, setAys] = useList('academicYears');

  const addItem = async (type, collSetter, item) => {
    const endpoints = { courses: '/api/courses', departments: '/api/departments', academicYears: '/api/academic-years' };
    const res = await axios.post(endpoints[type], item);
    collSetter(prev => [...prev, res.data]);
  };
  const updateItem = async (type, collSetter, item) => {
    const endpoints = { courses: '/api/courses', departments: '/api/departments', academicYears: '/api/academic-years' };
    const res = await axios.put(`${endpoints[type]}/${item.id}`, item);
    collSetter(prev => prev.map(i=>i.id===item.id? res.data : i));
  };
  const archiveItem = async (type, collSetter, id) => {
    const endpoints = { courses: '/api/courses', departments: '/api/departments', academicYears: '/api/academic-years' };
    await axios.post(`${endpoints[type]}/${id}/archive`);
    collSetter(prev => prev.map(i=>i.id===id? { ...i, status:'archived' } : i));
  };

  const renderList = (items, cols, onEdit, onArchive) => (
    <table className="table"><thead><tr>{cols.map(c=> <th key={c}>{c}</th>)}<th></th></tr></thead>
      <tbody>{items.filter(i=>i.status!=='archived').map(i=> (
        <tr key={i.id}>{cols.map(c=> <td key={c}>{i[c]}</td>)}<td className="actions-col"><button className="btn btn--outline" onClick={()=>onEdit(i)}>Edit</button><button className="btn btn--outline" onClick={()=>onArchive(i.id)}>Archive</button></td></tr>
      ))}</tbody>
    </table>
  );

  const [form, setForm] = useState({ id:null, field1:'', field2:'' });
  const resetForm = () => setForm({ id:null, field1:'', field2:'' });
  const save = async () => {
    if (tab==='courses') {
      if (!form.field1 || !form.field2) return;
      const obj = { id: form.id, code: form.field1, name: form.field2, status:'active' };
      form.id ? await updateItem('courses', setCourses, obj) : await addItem('courses', setCourses, obj);
    } else if (tab==='departments') {
      if (!form.field1 || !form.field2) return;
      const obj = { id: form.id, code: form.field1, name: form.field2, status:'active' };
      form.id ? await updateItem('departments', setDepartments, obj) : await addItem('departments', setDepartments, obj);
    } else {
      if (!form.field1) return;
      const obj = { id: form.id, label: form.field1, status:'active' };
      form.id ? await updateItem('academicYears', setAys, obj) : await addItem('academicYears', setAys, obj);
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
        {tab==='courses' && renderList(courses, ['code','name','status'], edit, (id)=>archiveItem('courses', setCourses, id))}
        {tab==='departments' && renderList(departments, ['code','name','status'], edit, (id)=>archiveItem('departments', setDepartments, id))}
        {tab==='academicYears' && renderList(academicYears, ['label','status'], edit, (id)=>archiveItem('academicYears', setAys, id))}
        <div className="form form-inline">
          {tab!=='academicYears' && <><label>Code</label><Input value={form.field1} onChange={e=>setForm(s=>({...s,field1:e.target.value}))} /><label>Name</label><Input value={form.field2} onChange={e=>setForm(s=>({...s,field2:e.target.value}))} /></>}
          {tab==='academicYears' && <><label>Label</label><Input value={form.field1} onChange={e=>setForm(s=>({...s,field1:e.target.value}))} /></>}
          <button className="btn btn--primary" onClick={save}>{form.id ? 'Update' : 'Add'}</button>
          {form.id && <button className="btn btn--outline" onClick={resetForm}>Cancel</button>}
        </div>
      </div>
    </div>
  );
};

// ---------------------- Pages: Profile ----------------------
const ProfilePage = () => {
  const [me, setMe] = useState(() => store.get('me', { name: 'Admin', email: 'admin@example.com' }));
  const save = () => { store.set('me', me); alert('Profile saved (client-side demo).'); };
  return (
    <div className="page">
      <div className="card"><div className="card-title">My Profile</div>
        <div className="form">
          <div className="form-row"><label>Name</label><Input value={me.name} onChange={e=>setMe(s=>({...s,name:e.target.value}))} /></div>
          <div className="form-row"><label>Email</label><Input value={me.email} onChange={e=>setMe(s=>({...s,email:e.target.value}))} /></div>
          <div className="form-row"><button className="btn btn--primary" onClick={save}>Save</button></div>
        </div>
      </div>
    </div>
  );
};

// ---------------------- Layout / Shell ----------------------
const AdminShell = () => {
  useSeed();
  const onLogout = async () => { try { await axios.post('/logout'); window.location.href = '/login'; } catch (e) {} };
  return (
    <div className="admin-app">
      <Sidebar onLogout={onLogout} />
      <div className="main">
        <Topbar />
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="faculty" element={<FacultyPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

// ---------------------- Login ----------------------
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('/login', { username, password });
      window.location.href = '/admin';
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-card-header">
          <div className="logo-circle">SFMS</div>
          <h2>SFMS Management System</h2>
          <p className="subtitle">Student & Faculty Management</p>
        </div>
        <div className="login-card-body">
          <form onSubmit={handleSubmit}>
            <label className="input-label">Username</label>
            <input type="text" className="input" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
            <label className="input-label">Password</label>
            <input type="password" className="input" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <div className="alert-error">{error}</div>}
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
          </form>
          <div className="demo-box">
            <strong>Demo Accounts:</strong>
            <div>Admin: admin / admin123</div>
            <div>Faculty: faculty / faculty123</div>
            <div>Student: student / student123</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------- Mounting ----------------------
const loginMount = document.getElementById('login-root');
if (loginMount) {
  ReactDOM.render(<Login />, loginMount);
}

const adminMount = document.getElementById('admin-root');
if (adminMount) {
  ReactDOM.render(
    <BrowserRouter basename="/admin">
      <AdminShell />
    </BrowserRouter>,
    adminMount
  );
}

