const LOG_LEVELS = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
};

class Logger {
    constructor() {
        this.logs = [];
    }

    formatMessage(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            data,
        };
        return logEntry;
    }

    log(level, message, data) {
        const logEntry = this.formatMessage(level, message, data);
        this.logs.push(logEntry);

        // Console output with colors
        const styles = {
            INFO: 'color: #00d09c',
            WARN: 'color: #ffcc00',
            ERROR: 'color: #ff4d4d',
        };

        console.log(`%c[${level}] ${message}`, styles[level], data || '');
    }

    info(message, data) {
        this.log(LOG_LEVELS.INFO, message, data);
    }

    warn(message, data) {
        this.log(LOG_LEVELS.WARN, message, data);
    }

    error(message, data) {
        this.log(LOG_LEVELS.ERROR, message, data);
    }

    getLogs() {
        return this.logs;
    }
}

export const logger = new Logger();
