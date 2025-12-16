// src/pages/Admin.jsx
import React from 'react';
import AttendanceList from '../components/AttendanceList';

function Admin() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>管理者ページ</h1>
      <AttendanceList />
    </div>
  );
}

export default Admin;
