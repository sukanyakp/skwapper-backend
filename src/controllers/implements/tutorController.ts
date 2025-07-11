import { NextFunction, Request, Response } from "express";
import User ,{ Iuser } from "../../models/user/userModel";
import { ITutorService } from "../../services/Interfaces/ItutorService";
import { AuthRequest } from "../../types";
import scheduledSession from "../../models/notification/scheduledSessionModel";
import Availability from "../../models/tutor/tutorAvailability";
import session from "express-session";


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
    const userId = req.userId; 

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
    const file = req.file as Express.Multer.File; // Multer + Cloudinary gives this

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
    
    const userId = req.userId; 
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


public editTutorProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('editTutorProfil');
    
    const userId = req?.userId;
    if(!userId){
      res.status(500).json({message : 'user ID not found'})
      return;
    }
    const profile = await this.service.updateProfile(userId, req.body, req.file);

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error editing profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
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



public  scheduleSession = async(req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { date, time, duration } = req.body;
    console.log(date , time ,duration , 'at schduled session');
    
    const tutorId = req.userId;

    const session = await scheduledSession.create({ tutorId, date, time, duration });
    res.status(201).json({ message: "Session scheduled", session });
  } catch (error) {
    res.status(500).json({ message: "Failed to schedule session" });
  }
}


public setAvailability = async (req: AuthRequest, res: Response) : Promise<void> => {
    try {
      const tutorId = req.userId;
      const { availability } = req.body;

      if (!availability) {
         res.status(400).json({ message: "Availability is required." });
         return
      }

      const saved = await this.service.setTutorAvailability(tutorId!, availability);
      res.status(200).json(saved);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to save availability." });
    }
  };

 public getAvailability = async (req: AuthRequest, res: Response) :Promise<void> => {
    try {
      console.log('getAvailability');
      
      const tutorId = req.userId;
      const availability = await this.service.getTutorAvailability(tutorId!);
      res.status(200).json(availability);
    } catch (error) {
      res.status(500).json({ message: "Failed to get availability." });
    }
  };



  public async updateAvailability(req: AuthRequest, res: Response): Promise<void> {
  try {
    const tutorId = req.userId;
    const { availability } = req.body;

    const updated = await Availability.findOneAndUpdate(
      { tutorId },
      { availability },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Availability updated", updated });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update availability" });
  }
}



 public approveRequest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {

      console.log('req approved');
      
      const { notificationId, scheduledTime } = req.body;
      const tutorId = req?.userId; 
      console.log(scheduledTime ,notificationId ,'');
      

      if(!tutorId){
        res.status(500).json({message : "Tutor not found"})
        return;
      }

      if (!notificationId || !scheduledTime) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      const session = await this.service.approveRequest(tutorId, notificationId, scheduledTime);

      console.log( session ,'session');
      
      res.status(200).json({ message: "Session approved and scheduled", session });
    } catch (err: any) {
      console.error("Error approving request:", err);
      res.status(500).json({ message: err.message || "Failed to approve request" });
    }
  };


   public getTutorSessions = async (req: AuthRequest, res: Response) => {
    try {
      const tutorId = req.userId;
      console.log('getTutorSessions . . . ');
      
      if(!tutorId){
        res.status(500).json({message : 'tutorId not found'});
        return
      }
      const sessions = await this.service.getTutorSessions(tutorId);
      console.log(sessions ,'sessions');
      
      res.status(200).json( {sessions} );
    } catch (err) {
      console.error("Failed to get tutor sessions:", err);
      res.status(500).json({ message: "Failed to get sessions" });
    }
  };






}