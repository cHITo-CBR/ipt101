import React from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Faculty from './Faculty';
import Students from './Students';
import Reports from './Reports';
import Settings from './Settings';
import Profile from './Profile';
import { useSeed } from './store';

const Sidebar = ({ onLogout }) => (
  <aside className="sidebar">
    <div className="brand"><div className="brand-logo">SFMS</div><div className="brand-name">Profile System</div></div>
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
        <div className="user-box">Welcome</div>
      </div>
    </header>
  );
};

export default function AdminApp() {
  useSeed();
  const onLogout = async () => { try { await fetch('/logout', { method: 'POST' }); window.location.href = '/login'; } catch (e) { window.location.href = '/login'; } };

  return (
    <div className="admin-app">
      <Sidebar onLogout={onLogout} />
      <div className="main">
        <Topbar />
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="faculty" element={<Faculty />} />
          <Route path="students" element={<Students />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
