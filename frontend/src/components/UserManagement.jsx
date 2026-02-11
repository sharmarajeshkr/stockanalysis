import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const UserManagement = () => {
    const { users, addUser } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [msg, setMsg] = useState('');

    const handleAddUser = (e) => {
        e.preventDefault();
        try {
            addUser({ username, password, role });
            setMsg(`User ${username} added successfully!`);
            setUsername('');
            setPassword('');
        } catch (err) {
            setMsg(err.message);
        }
    };

    return (
        <div className="settings-section">
            <h3>User Management</h3>

            <form onSubmit={handleAddUser} style={{ maxWidth: '400px', marginBottom: '2rem' }}>
                <div className="form-group">
                    <label>New Username</label>
                    <input value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <select
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#2a2a2a', color: 'white', border: '1px solid #333' }}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="primary-btn">Add User</button>
            </form>
            {msg && <p style={{ color: '#aaa' }}>{msg}</p>}

            <h3>Existing Users</h3>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u, idx) => (
                        <tr key={idx}>
                            <td>{u.username}</td>
                            <td>{u.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
