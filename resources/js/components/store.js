import { useEffect, useState } from 'react';
import axios from 'axios';

export const store = {
  get(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
};

export function useSeed() {
  useEffect(() => {
    (async () => {
      try {
        const [courses, departments, academicYears, students, faculty, reports] = await Promise.all([
          axios.get('/api/courses'),
          axios.get('/api/departments'),
          axios.get('/api/academic-years'),
          axios.get('/api/students'),
          axios.get('/api/faculty'),
          axios.get('/api/reports'),
        ]);
        store.set('courses', courses.data ?? []);
        store.set('departments', departments.data ?? []);
        store.set('academicYears', academicYears.data ?? []);
        store.set('students', students.data ?? []);
        store.set('faculty', faculty.data ?? []);
        store.set('reports', reports.data ?? []);
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
        if (!store.get('reports')) {
          store.set('reports', [
            { id: 1, title: 'Project Proposal', studentId: 1, facultyId: 1, filePath: '', status: 'pending', remarks: '' },
            { id: 2, title: 'Midterm Evaluation', studentId: 2, facultyId: 2, filePath: '', status: 'approved', remarks: 'Good job' },
          ]);
        }
      }
    })();
  }, []);
}

export function useList(key) {
  const [items, setItems] = useState(() => store.get(key, []));
  useEffect(() => { store.set(key, items); }, [key, items]);
  return [items, setItems];
}
