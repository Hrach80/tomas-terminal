// src/components/Auth.jsx

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
// Կարող եք ավելացնել համապատասխան CSS ոճեր ավելի ուշ

const Auth = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false); // Կառավարում է Մուտք/Գրանցում վիճակը
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            if (isSignUp) {
                // ԳՐԱՆՑՈՒՄ (Sign Up)
                const { error } = await supabase.auth.signUp({
                    email,
                    password
                });

                if (error) throw error;

                setMessage('Հաստատման հղումն ուղարկվել է Ձեր էլ. փոստին։ Խնդրում ենք ստուգել։');

            } else {
                // ՄՈՒՏՔ (Sign In)
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;

                // Եթե մուտքը հաջող է, App.jsx-ը ավտոմատ կերպով կցուցադրի AdminDashboard-ը
            }
        } catch (err) {
            console.error(err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3 style={{ textAlign: 'center', color: '#007bff' }}>
                {isSignUp ? 'Գրանցվել' : 'Ադմին Մուտք'}
            </h3>

            <form onSubmit={handleAuth}>
                <div style={{ marginBottom: '15px', color: ' #1225f8ff' }}>
                    <label htmlFor="email">Էլ. Փոստ:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd'  }}
                    />
                </div>

                <div style={{ marginBottom: '20px', color: ' #1225f8ff' }}>
                    <label htmlFor="password">Գաղտնաբառ:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
                    />
                </div>

                {error && <p style={{ color: 'red', textAlign: 'center' }}>Սխալ: {error}</p>}
                {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'blue', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    {loading ? 'Բեռնվում է...' : (isSignUp ? 'Գրանցվել' : 'Մուտք Գործել')}
                </button>
            </form>

            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: '0' }}
                >
                    {isSignUp ? 'Արդեն ունե՞ք հաշիվ (Մուտք)' : 'Ցանկանո՞ւմ եք Գրանցվել'}
                </button>
            </div>
        </div>
    );
};

export default Auth;