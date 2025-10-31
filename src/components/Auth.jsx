// src/components/Auth.jsx

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../assets/styles/Auth.css'; // ԿԱՐԵՎՈՐ՝ Ավելացնում ենք CSS ֆայլի իմպորտը

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
                // Ուշադրություն: Խորհուրդ է տրվում Admin Dashboard-ի համար օգտագործել
                // միայն մուտքը, կամ գրանցումից հետո օգտատիրոջը պարտադիր դարձնել Ադմին:
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password
                });

                if (error) throw error;

                // Եթե գրանցումը հաջող է, բայց չկա սեսիա (պահանջվում է հաստատում)
                if (data.user === null) {
                    setMessage('Հաստատման հղումն ուղարկվել է Ձեր էլ. փոստին։ Խնդրում ենք ստուգել և մուտք գործել։');
                } else {
                    // Եթե ավտոմատ մուտք է լինում (կախված Supabase-ի կարգավորումներից)
                    setMessage('Հաջողությամբ գրանցվել եք և մուտք եք գործել։');
                }

                setIsSignUp(false); // Ցուցադրել Մուտքի էկրանը հաստատումից հետո։

            } else {
                // ՄՈՒՏՔ (Sign In)
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;

                // Եթե մուտքը հաջող է, AdminDashboard-ը կցուցադրվի ավտոմատ
            }
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
                {isSignUp ? 'Ադմին Գրանցում' : 'Ադմին Մուտք'}
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
                    {loading ? 'Բեռնվում է...' : (isSignUp ? 'Գրանցվել' : 'Մուտք Գործել')}
                </button>
            </form>

            <div className="auth-footer">
                <button
                    type="button"
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError('');
                        setMessage('');
                    }}
                    className="auth-toggle-btn"
                >
                    {isSignUp ? 'Արդեն ունե՞ք հաշիվ (Մուտք)' : 'Ցանկանո՞ւմ եք Գրանցվել'}
                </button>
            </div>
        </div>
    );
};

export default Auth;