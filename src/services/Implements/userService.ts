import { IuserRepository } from "../../repositories/Interfaces/IuserRepository";
import { IuserService } from "../Interfaces/IuserService";
import { ITutorProfile } from "../../models/tutor/tutorProfile";
import StudentProfile from "../../models/student/studentModel";
import cloudinary from "../../utils/cloudinaryConfig";
import User from "../../models/user/userModel";
import { IScheduledSession } from "../../models/notification/scheduledSessionModel";

export class UserService implements IuserService {
  private UserRepository: IuserRepository;

  constructor(UserRepository: IuserRepository) {
    this.UserRepository = UserRepository;
  }

  public async createStudentProfile(profileData: any, file: Express.Multer.File): Promise<any> {
    const existing = await StudentProfile.findOne({ userId: profileData.userId });
    if (existing) throw new Error("Profile already exists");

    const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const uploadResult = await cloudinary.uploader.upload(fileStr, { folder: "profile_pictures" });

    const profileDataWithImage = {
      ...profileData,
      profileImage: uploadResult.secure_url,
    };

    return await StudentProfile.create(profileDataWithImage); // or via repo
  }

  public async getStudentProfile(userId: string): Promise<any | null> {
    return await StudentProfile.findOne({ userId });
  }

  public async getAllApprovedTutors(): Promise<ITutorProfile[]> {
    return await this.UserRepository.findApprovedTutors();
  }

  public async getTutorById(tutorId: string): Promise<ITutorProfile> {
    const tutor = await this.UserRepository.findTutorById(tutorId);
    if (!tutor) throw new Error("Tutor not found");
    return tutor;
  }

  // public async sendVideoSessionRequest(tutorId: string, studentId: string): Promise<string> {
  //   const tutor = await this.UserRepository.findTutorById(tutorId);
  //   const student = await this.UserRepository.findById(studentId);

  //   if (!tutor) throw new Error("Tutor not found");
  //   if (!student) throw new Error("Student not found");

  //   await this.UserRepository.createNotification(tutorId, studentId, "New session request");

  //   return "Request sent successfully";
  // }

  public async createSessionRequestNotification(tutorId: string, studentId: string): Promise<any> {
    const message = "You have a new session request.";
    return await this.UserRepository.createNotification(tutorId, studentId, message);
  }


   public async getRecommendedCourses(category: string): Promise<any> {
    return this.UserRepository.getCoursesByCategory(category);
  }


  public async sessionRequests(studentId : string) : Promise<IScheduledSession[] | null>{
    console.log(studentId ,'studentId');
    
    return await this.UserRepository.getSessionById(studentId)
    
  }


    public async updateStudentProfile(
    userId: string,
    profileData: any,
    file?: Express.Multer.File
  ): Promise<any> {
    const existingProfile = await StudentProfile.findOne({ userId });

    if (!existingProfile) {
      throw new Error("Profile not found");
    }

    let updatedFields = { ...profileData };

    if (file) {
      const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      const uploadResult = await cloudinary.uploader.upload(fileStr, {
        folder: "profile_pictures",
      });
      updatedFields.profileImage = uploadResult.secure_url;
    }

    const updatedProfile = await this.UserRepository.updateProfile(userId,updatedFields);

    return updatedProfile;
  }


}
