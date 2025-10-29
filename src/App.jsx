// src/App.jsx

import React from 'react';
import AdminDashboard from './components/AdminDashboard';
import './assets/styles/global.css'; // Ներմուծում ենք գլոբալ ոճերը
import './assets/styles/AdminDashboard.css'; // Ներմուծում ենք կոմպոնենտի ոճերը

function App() {
  return (
    <div className="app-container">
      <header className="admin-header">
        <h1>🎂 Քաղցրավենիքի Խանութի Ադմին Վահանակ</h1>
        <p>Ապրանքների կառավարում</p>
      </header>
      <main className="admin-main">
        <AdminDashboard />
      </main>
      <footer className="admin-footer">
        <p>&copy; {new Date().getFullYear()} Admin Dashboard. Powered by Supabase & Vercel.</p>
      </footer>
    </div>
  );
}

export default App;