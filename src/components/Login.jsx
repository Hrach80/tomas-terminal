// src/components/Login.jsx

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
// Կարող եք ավելացնել import './Login.css'; եթե ոճավորում է պետք

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Օգտագործում ենք Supabase-ի signInWithPassword ֆունկցիան
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setMessage('Մուտքի սխալ: Ստուգեք Ձեր տվյալները։');
            console.error('Login error:', error.message);
        } else {
            // Եթե մուտքը հաջող է, Supabase-ը ավտոմատ կպահի սեսիան։
            // Կոմպոնենտը պետք է վերադարձնի ադմին վահանակին։
            setMessage('Մուտքը հաջողությամբ կատարվեց։');
            // Կարող եք նաև ուղարկել օգտատիրոջը մեկ այլ էջի, եթե Ձեր App.jsx-ն օգտագործում է routing:
            // window.location.reload(); // Թարմացնել էջը, որպեսզի AdminDashboard-ը բեռնվի
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <h3>Ադմինիստրատորի Մուտք</h3>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Էլ. Փոստ</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@example.com"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Գաղտնաբառ</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Գաղտնաբառ"
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Մուտք...' : 'Մուտք Գործել'}
                </button>
            </form>
            {message && <p className={message.includes('սխալ') ? 'error' : 'success'}>{message}</p>}
        </div>
    );
};

export default Login;