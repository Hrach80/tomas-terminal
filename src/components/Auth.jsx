// src/components/Auth.jsx

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../assets/styles/Auth.css';

const Auth = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // [HAYTNEL]: isSignUp վիճակը հեռացված է, քանի որ պահանջվում է միայն Մուտք
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            // ՄՈՒՏՔ (Sign In) Գործողություն
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Եթե մուտքը հաջող է, AdminDashboard-ը կցուցադրվի ավտոմատ
        } catch (err) {
            console.error(err.message);

            // Փոխում ենք սխալի հաղորդագրությունը ավելի ընկալելիի
            const friendlyError = err.message.includes('Invalid login credentials')
                ? 'Սխալ էլ. փոստ կամ գաղտնաբառ:'
                : err.message;

            setError(friendlyError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h3 className="auth-header">
                Ադմինիստրատորի Մուտք
            </h3>

            <form onSubmit={handleAuth} className="auth-form">
                <div className="form-group">
                    <label htmlFor="email" className="auth-label">Էլ. Փոստ:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="auth-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="auth-label">Գաղտնաբառ:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-input"
                    />
                </div>

                {error && <p className="auth-error">Սխալ: {error}</p>}
                {message && <p className="auth-message">{message}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="auth-submit-btn"
                >
                    {loading ? 'Բեռնվում է...' : 'Մուտք Գործել'}
                </button>
            </form>

            {/* [HAYTNEL]: Գրանցման փոխարկման բաժինը հեռացված է */}
        </div>
    );
};

export default Auth;