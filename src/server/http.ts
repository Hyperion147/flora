import { NextResponse } from "next/server";
import { isHttpError } from "./errors";
import { logger } from "./logger";

export function jsonError(message: string, status = 500, details?: unknown) {
  return NextResponse.json(
    {
      error: message,
      ...(details ? { details } : {}),
    },
    { status },
  );
}

export function handleRouteError(error: unknown, message = "Internal server error") {
  if (isHttpError(error)) {
    return jsonError(error.message, error.status, error.details);
  }

  logger.error(message, error);
  return jsonError(message, 500);
}

