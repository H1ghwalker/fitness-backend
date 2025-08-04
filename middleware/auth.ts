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
  // Поддержка как header-based, так и cookie-based для совместимости
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '') || req.cookies?.token;
  
  console.log('Auth middleware - headers:', req.headers);
  console.log('Auth middleware - authHeader:', authHeader);
  console.log('Auth middleware - token:', token ? 'present' : 'missing');
  
  if (!token) {
    console.log('Auth middleware - no token found');
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = verifyToken(token);
    console.log('Auth middleware - decoded user:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Auth middleware - token verification failed:', err);
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
