type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function timestamp(): string {
    return new Date().toISOString();
}

function format(level: LogLevel, message: string): string {
    return `[${timestamp()}] [${level.toUpperCase()}] ${message}`;
}

function info(message: string, ...meta: unknown[]): void {
    console.log(format('info', message), ...meta);
}

function warn(message: string, ...meta: unknown[]): void {
    console.warn(format('warn', message), ...meta);
}

function error(message: string, ...meta: unknown[]): void {
    console.error(format('error', message), ...meta);
}

function debug(message: string, ...meta: unknown[]): void {
    if (process.env.NODE_ENV === 'development') {
        console.debug(format('debug', message), ...meta);
    }
}

// Console-based logger exposing info/warn/error/debug methods with a timestamped prefix
export const logger = {
    info,
    warn,
    error,
    debug,
};
