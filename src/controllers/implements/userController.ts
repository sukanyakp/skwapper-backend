import { Request, Response } from "express";
import { IuserService } from "../../services/Interfaces/IuserService";
import { AuthRequest } from "../../types";


export class UserController {
  private service: IuserService;

  constructor(service: IuserService) {
    this.service = service;
  }

public createProfile = async (req: AuthRequest, res: Response) => {
  try {
    console.log('at createProfile controller');

    const userId = req.userId;
    const file = req.file as Express.Multer.File; //  Multer + Cloudinary gives this

    console.log(file ,'files');
    

    const profileData = {
      ...req.body,
      userId,
  
    };
    console.log(profileData , 'profileData');
    

    const profile = await this.service.createStudentProfile(profileData ,file);
    res.status(201).json(profile);
  } catch (error: any) {
    console.error("Create profile error:", error);
    res.status(400).json({ message: error.message || "Failed to create profile" });
  }
};




 

 public getStudentProfile = async (req: AuthRequest, res: Response) : Promise<void> => {
  try {

    console.log('getstudentProfile');
    
    const userId = req.userId; 
    console.log(userId , 'userId');
    

    if(!userId){
      res.status(401).json({ message : "Unauthorized: No user ID found"})
      return
    }
    const profile = await this.service.getStudentProfile(userId);
    console.log(profile , 'profile');
    

    if (!profile) {
       res.status(404).json({ message: "Profile not found" });
      return
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};


public getApprovedTutors = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('get approved tutors for users ');
      
      
      
      const tutors = await this.service.getAllApprovedTutors();
      
      res.status(200).json(tutors);
    } catch (error) {
      console.error("Error fetching tutors:", error);
      res.status(500).json({ message: "Failed to fetch tutors" });
    }
  };


public getTutorById = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('tutorId details');
      console.log('a');
      
      const {tutorId} = req.params;
      console.log(tutorId,'tutorId details');
      
      const tutor = await this.service.getTutorById(tutorId);
      if (!tutor) {
        res.status(404).json({ message: "Tutor not found" });
        return;
      }
      res.status(200).json(tutor);
    } catch (error) {
      console.error("Error fetching tutor details:", error);
      res.status(500).json({ message: "Failed to fetch tutor details" });
    }
  };


public sendSessionRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tutorId } = req.params;
    const studentId = req.userId;
    if(!studentId){
      res.status(401).json({message :"Unauthorized: student ID not found" })
      return;
    }

    const message = await this.service.createSessionRequestNotification(tutorId, studentId);
    res.status(200).json({ message });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to send request" });
  }
};




}
