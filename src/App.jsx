
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import AdminDashboard from './components/AdminDashboard';
import Auth from './components/Auth'; 
import './assets/styles/global.css';
import './assets/styles/AdminDashboard.css';
import './assets/styles/AddProductForm.css'; 

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Բեռնվում է...</div>;
  }

  return (
    <div className="app-container">
      <header className="admin-header">
        <h1>🎂 Քաղցրավենիքի Խանութի Ադմին Վահանակ</h1>
        <p>Ապրանքների կառավարում</p>
      </header>

      <main className="admin-main">
        {session ? <AdminDashboard /> : <Auth />}
      </main>

      <footer className="admin-footer">
        <p>&copy; {new Date().getFullYear()} Admin Dashboard. Powered by Supabase & Vercel.</p>
      </footer>
    </div>
  );
}

export default App;