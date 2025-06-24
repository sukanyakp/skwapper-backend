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
public apply = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const userId = req.userId;
  const files = req.files as Express.Multer.File[];

  
if (!userId) {
  return res.status(401).json({ message: "Unauthorized: Missing user ID" });
}

  const { category, bio, skills, experience } = req.body;

    if (!category || !bio || !skills || !experience) {
    return res.status(400).json({ message: "All fields are required." });
  }

  

  console.log(files, 'files at TutorController');
  console.log({ category, bio, skills, experience }, 'fields at TutorController');

  try {
    const result = await this.service.applyForTutor(userId, files, {
      category,
      bio,
      skills,
      experience,
    });

    if (result.alreadyApplied) {
      return res.status(409).json({
        message: "You have already submitted an application. Please wait for admin review.",
        application: result.application,
      });
    }

    res.status(201).json({
      message: "Application submitted successfully",
      application: result.application,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};


public  checkTutorApplicationStatus = async (req: AuthRequest, res: Response) : Promise<any>=> {
  try {
    const userId = req.userId; // Assuming you use a JWT middleware and attach userId

    console.log('here we are at the bakend of checkTutorApplicationStatus');
    

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      status: user.status, // "applied" or "notApplied"
      isApproved: user.isApproved,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};




 public async checkStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      console.log('checkstatus');
      

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;                                        
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



  public createProfile = async (req: AuthRequest, res: Response) => {
  try {
    console.log('at createProfile controller');

    const userId = req.userId;
    const file = req.file as Express.Multer.File; // 🔥 Multer + Cloudinary gives this

    console.log(file ,'files');
    

    const profileData = {
      ...req.body,
      userId,
  
    };
    console.log(profileData , 'profileData');
    

    const profile = await this.service.createTutorProfile(profileData ,file);
    res.status(201).json(profile);
  } catch (error: any) {
    console.error("Create profile error:", error);
    res.status(400).json({ message: error.message || "Failed to create profile" });
  }
};

 public getTutorProfile = async (req: AuthRequest, res: Response) : Promise<void> => {
  try {

    console.log('getstudentProfile');
    
    const userId = req.userId; // assuming JWT middleware adds `user` to req
    console.log(userId , 'userId');
    

    if(!userId){
      res.status(401).json({ message : "Unauthorized: No user ID found"})
      return
    }
    const profile = await this.service.getTutorProfile(userId);
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


public createCourse = async (req: AuthRequest, res: Response) => {
  try {
    console.log('tutor createCrs');
    
    const tutorId = req?.userId ; 
    console.log(req.file);
     const file = req.file as Express.Multer.File; 
    
    
    const newCourse = await this.service.createCourse(req.body, file, tutorId);
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Course creation error:", error);
    res.status(500).json({ message: "Failed to create course" });
  }
};


public getMyCourses = async (req: AuthRequest, res: Response) : Promise<void> => {
    try {
      console.log('we are at getMyCOurses');
      
      const tutorId = req?.userId;
      if (!tutorId) {
      res.status(401).json({ message: "Unauthorized: Tutor ID missing" });
      return;
    }
      
      const courses = await this.service.getCoursesByTutor(tutorId);
      console.log(courses ,'cour');
      
      res.status(200).json(courses);
    } catch (error) {
      console.error("Error fetching tutor courses:", error);
      res.status(500).json({ message: "Failed to fetch your courses" });
    }
  };


  public getSessionRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('at getSessionReq');
    
    const tutorId = req.userId;
    if (!tutorId) {
     res.status(400).json({ message: "Tutor ID missing" });
     return;
    }
     

    const requests = await this.service.getSessionRequests(tutorId);
    console.log(requests ,'req');
    
    res.status(200).json(requests);
  } catch (error) {
    console.error("Failed to fetch session requests:", error);
    res.status(500).json({ message: "Failed to load requests" });
  }
};




}