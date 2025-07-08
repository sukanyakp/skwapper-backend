import { Request, Response } from "express";
import { IuserService } from "../../services/Interfaces/IuserService";
import { AuthRequest } from "../../types";
import userModel from "../../models/user/userModel";
import StudentProfile from "../../models/student/studentModel";
import courseModel from "../../models/admin/courseModel";
import TutorialModel from "../../models/tutor/TutorialModel";
import { ParsedQs } from "qs"; // comes from express


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
      console.log(tutors);
      
      
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


public getSessionRequests = async(req : AuthRequest , res : Response): Promise<void> =>{
  try {

    console.log('getSwesssionRequests');
    const studentId = req?.userId

    if(!studentId){
      res.status(500).json({message : "The studentId is not found"});
      return;
    }

    const sessions = await this.service.sessionRequests(studentId)
    console.log(sessions ,'sessionss');
    
    res.status(200).json({sessions})
    
  } catch (error) {
    console.log(error);
    res.status(500).json({message : "Failed to get session Requests"})
    
  }
}



// GET /user/recommended-courses
 public getRecommendedCourses = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const rawCategory = req.query.category;

      // Ensure it's a string
      if (typeof rawCategory !== "string") {
        res.status(400).json({ message: "Category must be a string" });
        return;
      }

      const category = rawCategory.trim();

      if (!category) {
        res.status(400).json({ message: "Category is required" });
        return;
      }

      const recommendedCourses = await this.service.getRecommendedCourses(category);
      res.status(200).json(recommendedCourses);
    } catch (err: any) {
      console.error("Error in getRecommendedCourses:", err);
      res.status(500).json({ message: "Server error" });
    }
  };


 public updateProfile = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req?.userId;
      const { name, bio, instrument, location } = req.body;
      const file = req?.file;

      if(!file){
        res.status(500).json({message : "File not found"})
        return ; 
      }

      if(!userId){
        res.status(500).json({message : "userId not found"});
        return;
      }

      const profileData = {
        name,
        bio,
        instrument,
        location,
      };

      const updatedProfile = await this.service.updateStudentProfile(userId, profileData, file);

      res.status(200).json({ message: "Profile updated successfully", profile: updatedProfile });
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      res.status(500).json({ message: error.message || "Something went wrong" });
    }




}



}
