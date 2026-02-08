import React from 'react';
import { Link } from 'react-router-dom';
import { List, BarChart2, TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <TrendingUp size={24} color="var(--accent-primary)" />
                <Link to="/" className={styles.title}>StockAI</Link>
            </div>

            {user && (
                <nav className={styles.nav}>
                    <Link to="/" className={styles.link}>
                        <BarChart2 size={18} />
                        Dashboard
                    </Link>
                    <Link to="/sector-analysis" className={styles.link}>
                        <List size={18} />
                        Sector Analysis
                    </Link>
                    <button onClick={logout} className={styles.logoutBtn}>
                        <LogOut size={18} />
                        Logout
                    </button>
                </nav>
            )}
        </header>
    );
};

export default Header;
