// ============================================================================
// Helper Utility Functions
// ============================================================================

/**
 * Format a number as currency
 * @param {number|string} value - The value to format
 * @param {string} currency - Currency symbol (default: '₹')
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, currency = '₹') {
    const numValue = parseFloat(value.toString().replace(/,/g, ''));
    if (isNaN(numValue)) return `${currency}0.00`;

    return `${currency}${numValue.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

/**
 * Format a number with commas
 * @param {number|string} value - The value to format
 * @returns {string} Formatted number string
 */
export function formatNumber(value) {
    const numValue = parseFloat(value.toString().replace(/,/g, ''));
    if (isNaN(numValue)) return '0';

    return numValue.toLocaleString('en-IN');
}

/**
 * Format percentage change
 * @param {number|string} value - The percentage value
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value) {
    const numValue = parseFloat(value.toString().replace(/[%,]/g, ''));
    if (isNaN(numValue)) return '0.00%';

    return `${numValue >= 0 ? '+' : ''}${numValue.toFixed(2)}%`;
}

/**
 * Parse a string value to float, removing commas
 * @param {string|number} value - The value to parse
 * @returns {number} Parsed float value
 */
export function parseNumericValue(value) {
    if (typeof value === 'number') return value;
    return parseFloat(value.toString().replace(/,/g, '')) || 0;
}

/**
 * Get CSS class for positive/negative values
 * @param {number|string} value - The value to check
 * @returns {string} 'up' or 'down'
 */
export function getChangeClass(value) {
    const numValue = parseNumericValue(value);
    return numValue >= 0 ? 'up' : 'down';
}

/**
 * Calculate percentage change between two values
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Percentage change
 */
export function calculatePercentageChange(current, previous) {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} { isValid: boolean, message: string }
 */
export function validatePassword(password) {
    if (!password || password.length < 6) {
        return { isValid: false, message: 'Password must be at least 6 characters' };
    }
    return { isValid: true, message: '' };
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 50) {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
}

/**
 * Get user data localStorage key
 * @param {string} username - Username
 * @returns {string} LocalStorage key for user data
 */
export function getUserDataKey(username) {
    return `app_data_${username}`;
}

/**
 * Safe JSON parse with fallback
 * @param {string} jsonString - JSON string to parse
 * @param {*} fallback - Fallback value if parse fails
 * @returns {*} Parsed object or fallback
 */
export function safeJsonParse(jsonString, fallback = null) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('JSON parse error:', error);
        return fallback;
    }
}

/**
 * Deep clone an object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID string
 */
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}
