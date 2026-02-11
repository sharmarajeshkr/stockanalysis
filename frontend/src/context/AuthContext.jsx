import React, { createContext, useReducer, useEffect, useContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks';
import { STORAGE_KEYS, DEFAULT_USER } from '../utils/constants';
import { getUserDataKey, parseNumericValue } from '../utils/helpers';

const AuthContext = createContext(null);

// Action types
const AUTH_ACTIONS = {
    SET_USER: 'SET_USER',
    LOGOUT: 'LOGOUT',
    SET_USERS: 'SET_USERS',
    ADD_USER: 'ADD_USER',
    SET_USER_DATA: 'SET_USER_DATA',
    ADD_TO_WATCHLIST: 'ADD_TO_WATCHLIST',
    REMOVE_FROM_WATCHLIST: 'REMOVE_FROM_WATCHLIST',
    ADD_TO_HOLDINGS: 'ADD_TO_HOLDINGS',
};

// Initial state
const initialState = {
    user: null,
    users: [],
    userData: { watchlist: [], holdings: [] },
};

// Reducer function for managing auth state
function authReducer(state, action) {
    switch (action.type) {
        case AUTH_ACTIONS.SET_USER:
            return { ...state, user: action.payload };

        case AUTH_ACTIONS.LOGOUT:
            return { ...state, user: null, userData: { watchlist: [], holdings: [] } };

        case AUTH_ACTIONS.SET_USERS:
            return { ...state, users: action.payload };

        case AUTH_ACTIONS.ADD_USER:
            return { ...state, users: [...state.users, action.payload] };

        case AUTH_ACTIONS.SET_USER_DATA:
            return { ...state, userData: action.payload };

        case AUTH_ACTIONS.ADD_TO_WATCHLIST:
            if (state.userData.watchlist.some(s => s.symbol === action.payload.symbol)) {
                return state;
            }
            return {
                ...state,
                userData: {
                    ...state.userData,
                    watchlist: [...state.userData.watchlist, action.payload],
                },
            };

        case AUTH_ACTIONS.REMOVE_FROM_WATCHLIST:
            return {
                ...state,
                userData: {
                    ...state.userData,
                    watchlist: state.userData.watchlist.filter(s => s.symbol !== action.payload),
                },
            };

        case AUTH_ACTIONS.ADD_TO_HOLDINGS: {
            const { stock, qty, price } = action.payload;
            const existing = state.userData.holdings.find(s => s.symbol === stock.symbol);
            const buyPrice = parseNumericValue(price);

            let newHoldings;
            if (existing) {
                newHoldings = state.userData.holdings.map(s =>
                    s.symbol === stock.symbol
                        ? {
                            ...s,
                            qty: s.qty + qty,
                            avg: ((s.avg * s.qty) + (buyPrice * qty)) / (s.qty + qty),
                        }
                        : s
                );
            } else {
                newHoldings = [...state.userData.holdings, { ...stock, qty, avg: buyPrice }];
            }

            return {
                ...state,
                userData: {
                    ...state.userData,
                    holdings: newHoldings,
                },
            };
        }

        default:
            return state;
    }
}

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Use custom localStorage hooks with error handling
    const [storedUsers, setStoredUsers] = useLocalStorage(STORAGE_KEYS.USERS, [DEFAULT_USER]);
    const [storedActiveUser, setStoredActiveUser] = useLocalStorage(STORAGE_KEYS.ACTIVE_USER, null);

    // Initialize users and active session from localStorage
    useEffect(() => {
        dispatch({ type: AUTH_ACTIONS.SET_USERS, payload: storedUsers });

        if (storedActiveUser) {
            dispatch({ type: AUTH_ACTIONS.SET_USER, payload: storedActiveUser });
        }
    }, [storedUsers, storedActiveUser]);

    // Load userData when user changes
    useEffect(() => {
        if (state.user) {
            const key = getUserDataKey(state.user.username);
            const stored = localStorage.getItem(key);
            const parsed = stored ? JSON.parse(stored) : { watchlist: [], holdings: [] };
            dispatch({ type: AUTH_ACTIONS.SET_USER_DATA, payload: parsed });
        } else {
            dispatch({ type: AUTH_ACTIONS.SET_USER_DATA, payload: { watchlist: [], holdings: [] } });
        }
    }, [state.user]);

    // Save userData to localStorage whenever it changes
    useEffect(() => {
        if (state.user) {
            const key = getUserDataKey(state.user.username);
            localStorage.setItem(key, JSON.stringify(state.userData));
        }
    }, [state.userData, state.user]);

    // Memoized login function
    const login = useCallback((username, password) => {
        const foundUser = state.users.find(u => u.username === username && u.password === password);
        if (foundUser) {
            dispatch({ type: AUTH_ACTIONS.SET_USER, payload: foundUser });
            setStoredActiveUser(foundUser);
            return true;
        }
        return false;
    }, [state.users, setStoredActiveUser]);

    // Memoized logout function
    const logout = useCallback(() => {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
        setStoredActiveUser(null);
    }, [setStoredActiveUser]);

    // Memoized addUser function
    const addUser = useCallback((newUser) => {
        if (state.users.some(u => u.username === newUser.username)) {
            throw new Error('User already exists');
        }
        const updatedUsers = [...state.users, newUser];
        dispatch({ type: AUTH_ACTIONS.ADD_USER, payload: newUser });
        setStoredUsers(updatedUsers);
    }, [state.users, setStoredUsers]);

    // Memoized watchlist functions
    const addToWatchlist = useCallback((stock) => {
        dispatch({ type: AUTH_ACTIONS.ADD_TO_WATCHLIST, payload: stock });
    }, []);

    const removeFromWatchlist = useCallback((symbol) => {
        dispatch({ type: AUTH_ACTIONS.REMOVE_FROM_WATCHLIST, payload: symbol });
    }, []);

    // Memoized holdings function
    const addToHoldings = useCallback((stock, qty, price) => {
        dispatch({
            type: AUTH_ACTIONS.ADD_TO_HOLDINGS,
            payload: { stock, qty, price },
        });
    }, []);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        user: state.user,
        users: state.users,
        userData: state.userData,
        login,
        logout,
        addUser,
        addToWatchlist,
        removeFromWatchlist,
        addToHoldings,
    }), [
        state.user,
        state.users,
        state.userData,
        login,
        logout,
        addUser,
        addToWatchlist,
        removeFromWatchlist,
        addToHoldings,
    ]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
