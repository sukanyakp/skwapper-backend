import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types"; 

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  console.log(authHeader , 'authHeader at middleware');

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
     res.status(401).json({ message: "Unauthorized: Token missing" });
     return;
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log('b');
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { id?: string };

    if (!decoded.id) {
      res.status(401).json({ message: "Unauthorized: Invalid token payload" });
      return;
    }

    req.userId = decoded.id;
    console.log(req.userId , 'req.userId');

    next();
  } catch (err: any) {
    console.error("JWT verification failed:", err);

    // **Send 403 only if token expired, else 401**
    if (err.name === "TokenExpiredError") {
      res.status(403).json({ message: "Forbidden: Token expired" });
    } else {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  }
};
