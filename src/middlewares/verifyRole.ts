
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";

export const verifyRole = (requiredRole: "admin" | "tutor" | "student") => {
  
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    console.log('here we are at verifyRole'); 
    if (req.userRole !== requiredRole) {
       res.status(403).json({ message: `Forbidden: Only ${requiredRole}s allowed` });
       return
    }

    next();
  };
};
