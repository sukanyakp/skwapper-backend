import { Request, Response } from "express";
import { IAdminService } from "../../services/Interfaces/IadminService";
import { AuthRequest } from "../../types";

export class AdminController {
  private service: IAdminService;

  constructor(service: IAdminService) {
    this.service = service;
  }

  //  Get all tutor applications
  public getTutorApplications = async (req: Request, res: Response): Promise<void> => {
    try {
console.log('get tutor applications ');

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string 
    console.log(search ,'searching .... ... ');
    
      const applications = await this.service.getTutorApplications(page,limit,search);
      console.log(applications ,'applications');
      
      res.status(200).json(applications);
    } catch (error) {
      console.error("Error fetching tutor applications:", error);
      res.status(500).json({ message: "Server error while fetching applications" });
    }
  };

  //  Get a single tutor application by ID
  public getTutorApplicationById = async (req: Request, res: Response): Promise<void> => {
    const { applicationId } = req.params;

    try {
      const application = await this.service.getTutorApplicationById(applicationId);

      if (!application) {
        res.status(404).json({ message: "Application not found" });
        return;
      }

      res.status(200).json(application);
    } catch (error) {
      console.error("Error fetching tutor application:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  //  Review a tutor application
  public reviewTutorApplication = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { applicationId } = req.params;
      const { action, rejectionReason } = req.body;

      if (!["approved", "rejected"].includes(action)) {
        res.status(400).json({ message: "Invalid action" });
        return;
      }

      const result = await this.service.reviewTutorApplication(applicationId, action, ); //rejectionReason

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

  //  Get all tutors
  public getTutors = async (req: Request, res: Response): Promise<void> => {
    try {
      
      const tutors = await this.service.getTutors();
      // console.log(tutors , 'getTutors');
      
      res.status(200).json(tutors);
    } catch (error) {
      console.error("Error fetching tutors:", error);
      res.status(500).json({ message: "Server error while fetching tutors" });
    }
  };

  //  Toggle block/unblock user
  public toggleBlockUser = async (req: Request, res: Response): Promise<void> => {
    console.log('here we are at the toggleBlockUser');
    
    const { userId } = req.params;
    const { block } = req.body;
console.log(userId , block , 'at blockUser controller ');

    try {
      const user = await this.service.toggleBlockUser(userId, block);
      console.log(user , 'user details ');
      

      res.status(200).json({
        message: `User ${block ? "blocked" : "unblocked"} successfully`,
        user,
      });
    } catch (error: any) {
      const status = error.message === "User not found" ? 404 : 500;
      res.status(status).json({ message: error.message || "Internal Server Error" });
    }
  };

  //  Get all students
  public getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = req.query.search as string

      const { users, totalPages } = await this.service.getAllUsers(page, limit,search);
      res.status(200).json({ users, totalPages });
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ message: "Server error while fetching users" });
    }
  };
}
