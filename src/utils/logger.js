/**
 * Global Logger Utility
 * 
 * Replaces console.log for production readiness.
 * Supports different log levels and easy integration with external 
 * analytics or crash reporting tools (e.g. Sentry, Datadog) in the future.
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const Logger = {
    /**
     * Standard informational logging
     * @param {string} message 
     * @param  {...any} args 
     */
    info: (message, ...args) => {
        if (isDevelopment) {
            console.log(`[INFO] ${message}`, ...args);
        }
        // TODO: Map to external logging service in production
    },

    /**
     * Warning logging
     * @param {string} message 
     * @param  {...any} args 
     */
    warn: (message, ...args) => {
        if (isDevelopment) {
            console.warn(`[WARN] ${message}`, ...args);
        } else {
            // Production: log warnings to telemetry if critical
        }
    },

    /**
     * Error logging
     * @param {string|Error} error 
     * @param {string} context 
     * @param  {...any} args 
     */
    error: (error, context = 'Global', ...args) => {
        const errorMsg = error instanceof Error ? error.message : error;
        const stackTrace = error instanceof Error ? error.stack : '';

        if (isDevelopment) {
            console.error(`[ERROR - ${context}] ${errorMsg}`, ...args);
            if (stackTrace) console.error(stackTrace);
        } else {
            // Production: Definitely send this to Sentry / equivalent crash reporter
            // Sentry.captureException(error, { tags: { context }});
            console.error(`[ERROR] ${errorMsg}`); // Fallback console error for basic envs
        }
    },

    /**
     * Debug logging (only visible in dev)
     * @param {string} message 
     * @param  {...any} args 
     */
    debug: (message, ...args) => {
        if (isDevelopment) {
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    }
};

export default Logger;
