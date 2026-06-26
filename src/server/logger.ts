type LogContext = Record<string, unknown>;

const isDebugEnabled =
  process.env.NODE_ENV !== "production" &&
  process.env.FLORA_DEBUG_LOGS === "true";

function withContext(message: string, context?: LogContext) {
  return context ? [message, context] : [message];
}

export const logger = {
  error(message: string, error?: unknown, context?: LogContext) {
    console.error(...withContext(message, context), error ?? "");
  },
  warn(message: string, context?: LogContext) {
    console.warn(...withContext(message, context));
  },
  debug(message: string, context?: LogContext) {
    if (isDebugEnabled) {
      console.debug(...withContext(message, context));
    }
  },
};

