import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: { id: number; role: "Trainer" | "Client" };
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

export function requireRole(role: "Trainer" | "Client") {
  return (req: AuthRequest, res: Response, next: NextFunction):void => {
    if (!req.user || req.user.role !== role) {
     res.status(403).json({ message: "Forbidden" });
     return;
    }
    next();
  };
}
