import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";

type UserRole = "admin" | "tutor" | "student";

interface TokenPayload {
  id: string;
  role: UserRole;
}
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  console.log(authHeader, "authHeader at middleware");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(403).json({ message: "Unauthorized: Token missing" }); // 403 for missing
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log('before decoding ');
    
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as TokenPayload;
    console.log('after decode')
    console.log(decoded ,'decoded');
    

    if (!decoded.id || !decoded.role) {
      res.status(403).json({ message: "Unauthorized: Invalid token payload" }); // 403 for bad token
      return;
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (err: any) {
    console.error("JWT verification failed:", err);

    //  Always send 403 for token errors, so frontend retries
    res.status(403).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
