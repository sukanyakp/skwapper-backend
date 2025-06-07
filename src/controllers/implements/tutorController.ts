import { NextFunction, Request, Response } from "express";
import User ,{ Iuser } from "../../models/user/userModel";
import { ITutorService } from "../../services/Interfaces/ItutorService";
import { AuthRequest } from "../../types";


export class TutorController {
    private service : ITutorService;

    constructor(service : ITutorService){
        this.service = service
    }

    // Handles tutor application with file uploads
public  apply = async (req: Request, res: Response, next: NextFunction) : Promise<string | any> => {
    try {

        console.log('here we are at hte tutor controller');
        
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No documents uploaded." });
      }

      const result = await this.service.applyForTutor(files); // Pass files to service
      return res.status(200).json({ message: "Application received", data: result });

    } catch (error) {
      console.error("Error in TutorController.apply:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };


 public async checkStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;                                          // here we are returning no particular value.
      }

      const user = await User.findById(userId).select("role isApproved status");

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const hasApplied = user.role === "tutor";
      const approved = user.isApproved;
      const status = user.status;

      res.status(200).json({ hasApplied, approved, status });
    } catch (error) {
      console.error("Error checking tutor status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}