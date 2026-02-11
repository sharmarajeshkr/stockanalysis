import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks';
import '../styles/index.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useLocalStorage('remember_me', false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const { login } = useAuth();
    const navigate = useNavigate();

    // Validate form fields
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'username':
                if (!value.trim()) {
                    newErrors.username = 'Username is required';
                } else if (value.length < 3) {
                    newErrors.username = 'Username must be at least 3 characters';
                } else {
                    delete newErrors.username;
                }
                break;
            case 'password':
                if (!value) {
                    newErrors.password = 'Password is required';
                } else if (value.length < 4) {
                    newErrors.password = 'Password must be at least 4 characters';
                } else {
                    delete newErrors.password;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
        validateField(field, field === 'username' ? username : password);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Mark all fields as touched
        setTouched({ username: true, password: true });

        // Validate all fields
        const isUsernameValid = validateField('username', username);
        const isPasswordValid = validateField('password', password);

        if (!isUsernameValid || !isPasswordValid) {
            return;
        }

        if (login(username, password)) {
            navigate('/dashboard');
        } else {
            setErrors({ ...errors, submit: 'Invalid credentials. Try demo/password' });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Welcome Back</h1>
                <p className="login-subtitle">Stock & Mutual Fund Analyzer</p>

                {errors.submit && <div className="error-message">{errors.submit}</div>}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (touched.username) {
                                    validateField('username', e.target.value);
                                }
                            }}
                            onBlur={() => handleBlur('username')}
                            placeholder="Enter username"
                            className={touched.username && errors.username ? 'input-error' : ''}
                            aria-invalid={touched.username && errors.username ? 'true' : 'false'}
                            aria-describedby={touched.username && errors.username ? 'username-error' : undefined}
                        />
                        {touched.username && errors.username && (
                            <span id="username-error" className="field-error">{errors.username}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (touched.password) {
                                        validateField('password', e.target.value);
                                    }
                                }}
                                onBlur={() => handleBlur('password')}
                                placeholder="Enter password"
                                className={touched.password && errors.password ? 'input-error' : ''}
                                aria-invalid={touched.password && errors.password ? 'true' : 'false'}
                                aria-describedby={touched.password && errors.password ? 'password-error' : undefined}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {touched.password && errors.password && (
                            <span id="password-error" className="field-error">{errors.password}</span>
                        )}
                    </div>

                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span>Remember me</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={Object.keys(errors).length > 0 && (touched.username || touched.password)}
                    >
                        Login
                    </button>
                </form>

                <div className="demo-hint">
                    <p>Demo: username: <strong>demo</strong> / password: <strong>password</strong></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
