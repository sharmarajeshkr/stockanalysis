import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('demo');
    const [password, setPassword] = useState('password');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (login(username, password)) {
            navigate('/');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#0a0a0a'
        }}>
            <div className="card" style={{ width: '400px' }}>
                <h1 className="text-xl mb-4" style={{ textAlign: 'center' }}>StockAI Login</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-1">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            padding: '0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #333',
                            backgroundColor: '#121212',
                            color: 'white'
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            padding: '0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #333',
                            backgroundColor: '#121212',
                            color: 'white'
                        }}
                    />
                    {error && <p className="text-danger text-sm">{error}</p>}
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Login
                    </button>
                </form>
                <p className="text-sm mt-4 text-center" style={{ color: '#666' }}>
                    Use <strong>demo</strong> / <strong>password</strong>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
