import { Response } from "express";

export function sendSuccess<T>(res: Response, data: T, statusCode: number = 200) {
  return res.status(statusCode).json({ success: true, data });
}

export function sendError(res: Response, message: string, statusCode: number = 500) {
  return res.status(statusCode).json({ success: false, error: message });
}
