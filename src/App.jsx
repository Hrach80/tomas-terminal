// src/App.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Ներմուծում ենք supabase-ը ֆայլային կառուցվածքից կախված
import AdminDashboard from './components/AdminDashboard';
import Auth from './components/Auth'; // ՊԱՐՏԱԴԻՐ: Մուտքի ֆորման

// Ոճային ֆայլերը (Ձեր նշած ճանապարհներով)
import './assets/styles/global.css';
import './assets/styles/AdminDashboard.css'; // Եթե այնտեղ չի, կստանաք սխալ
import './assets/styles/AddProductForm.css'; // Եթե այնտեղ չի, կստանաք սխալ

function App() {
  // session-ը պահում է մուտք գործած օգտատիրոջ մասին ինֆորմացիան
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Ստուգել ընթացիկ session-ը
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Բաժանորդագրվել session-ի փոփոխություններին (մուտք/դուրս գալու համար)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    // Մաքրման ֆունկցիա
    return () => subscription.unsubscribe();
  }, []);

  // Ցուցադրել բեռնումը, մինչև կստուգվի սեսիան
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
        {/* Եթե session-ը գոյություն ունի, ցույց տալ AdminDashboard, հակառակ դեպքում՝ Auth ֆորման */}
        {session ? <AdminDashboard /> : <Auth />}
      </main>

      <footer className="admin-footer">
        <p>&copy; {new Date().getFullYear()} Admin Dashboard. Powered by Supabase & Vercel.</p>
      </footer>
    </div>
  );
}

export default App;