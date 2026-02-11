import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage with automatic JSON serialization
 * and error handling
 * 
 * @param {string} key - The localStorage key
 * @param {*} initialValue - The initial value if no stored value exists
 * @returns {[value, setValue, error]} - Current value, setter function, and any error
 */
export function useLocalStorage(key, initialValue) {
    const [error, setError] = useState(null);

    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (err) {
            // If error (e.g., privacy mode, quota exceeded), return initial value
            console.error(`Error reading localStorage key "${key}":`, err);
            setError(err);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that
    // persists the new value to localStorage.
    const setValue = (value) => {
        try {
            setError(null);
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            // Save state
            setStoredValue(valueToStore);

            // Save to local storage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));

                // Dispatch custom event to sync across tabs/components
                window.dispatchEvent(new Event('local-storage'));
            }
        } catch (err) {
            // Handle errors (e.g., quota exceeded, privacy mode)
            console.error(`Error setting localStorage key "${key}":`, err);
            setError(err);
        }
    };

    // Listen for changes in other tabs/windows
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(e.newValue));
                } catch (err) {
                    console.error(`Error parsing storage event for key "${key}":`, err);
                }
            }
        };

        // Listen for custom event to sync across components
        const handleLocalStorageEvent = () => {
            try {
                const item = window.localStorage.getItem(key);
                if (item) {
                    setStoredValue(JSON.parse(item));
                }
            } catch (err) {
                console.error(`Error syncing localStorage key "${key}":`, err);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('local-storage', handleLocalStorageEvent);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage', handleLocalStorageEvent);
        };
    }, [key]);

    return [storedValue, setValue, error];
}
