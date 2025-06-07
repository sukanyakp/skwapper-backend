import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Extend Request interface to include userId
interface AuthRequest extends Request {
  userId?: string;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: Token missing" });
    return; // Do NOT return a value
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    req.userId = (decoded as any).userId;
    next(); // Proceed to controller
  } catch (err) {
    res.status(403).json({ message: "Forbidden: Invalid or expired token" });
  }
};
