import { Request, Response } from "express";
import { IAdminService } from "../../services/Interfaces/IadminService";
import { AuthRequest } from "../../types";

export class AdminController {
    private service: IAdminService;

    constructor(service: IAdminService) {
        this.service = service;
    }

    public getTutorApplications = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('here we are at getTUTorapplications');
      
        const applications = await this.service.getTutorApplications();
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching tutor applications:", error);
        res.status(500).json({ message: "Server error while fetching applications" });
    }
};


public  getTutorApplicationById = async (req: Request, res: Response) : Promise<void> => {

    console.log('here we are at the getTutorApplication by id ::');
    
  const { applicationId } = req.params;

  try {
    const application = await this.service.getTutorApplicationById(applicationId);
    console.log(application , 'user to tutor details .. ');
    

    if (!application) {
       res.status(404).json({ message: "Application not found" });
       return
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("Error fetching tutor application:", error);
    res.status(500).json({ message: "Server error" });
  }
}

public reviewTutorApplication = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        console.log('here we are reviewApplication .. ..');
        
        const { applicationId } = req.params;
        const { action, rejectionReason } = req.body;
        const adminId = req?.userId; // assuming admin ID is set in req.user via middleware

        if (!["approved", "rejected"].includes(action)) {
            res.status(400).json({ message: "Invalid action" });
            return;
        }

        const result = await this.service.reviewTutorApplication(applicationId, action, rejectionReason);

        if (!result) {
            res.status(404).json({ message: "Application not found or update failed" });
            return;
        }

        res.status(200).json({ message: `Tutor ${action}d successfully`, result });
    } catch (error) {
        console.error("Error reviewing tutor application:", error);
        res.status(500).json({ message: "Server error during review" });
    }
};

    public getTutors = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log("Fetching tutors...");

            const tutors = await this.service.getTutors();
            res.status(200).json(tutors);
        } catch (error) {
            console.error("Error fetching tutors:", error);
            res.status(500).json({ message: "Server error while fetching tutors" });
        }
    };

    public updateTutorStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id, action } = req.params; // Extracting tutor ID and action from the request parameters
            console.log(`Updating tutor status for ID: ${id}, Action: ${action}`);

            const updatedTutor = await this.service.updateTutorStatus(id, action);

            if (!updatedTutor) {
                res.status(400).json({ message: "Invalid tutor ID or action" });
                return;
            }

            res.status(200).json({ message: "Tutor status updated successfully", tutor: updatedTutor });
        } catch (error) {
            console.error("Error updating tutor status:", error);
            res.status(500).json({ message: "Server error while updating tutor status" });
        }
    };



 public toggleBlockUser = async (req: Request, res: Response) : Promise <void>=> {
  const { userId } = req.params;
  
  const { block } = req.body;
  console.log(userId ,'here we are at blockUser');
  

  try {
    const user = await this.service.toggleBlockUser(userId, block);
    console.log(user , 'user at toggleBlockUser');
    

    res.status(200).json({
      message: `User ${block ? "blocked" : "unblocked"} successfully`,
      user,
    });

    console.log('everything is ok?');
    
  } catch (error: any) {
    const status = error.message === "User not found" ? 404 : 500;
    res.status(status).json({ message: error.message || "Internal Server Error" });
  }
};




  public getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.service.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ message: "Server error while fetching users" });
    }
  };





}