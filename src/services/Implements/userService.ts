import { UserRepository } from "../../repositories/Implements/userRepository";
import { IuserRepository } from "../../repositories/Interfaces/IuserRepository";
import { Iuser } from "../../models/user/userModel";
import { IuserService } from "../Interfaces/IuserService";
import redisClient from "../../config/redis";
import { generateOTP } from "../../utils/otp.util";
import { sendOtpEmail } from "../../utils/email.util";
import StudentProfile from "../../models/student/studentModel";
import cloudinary from "../../utils/cloudinaryConfig";
import { ITutorProfile } from "../../models/tutor/tutorProfile";


export class UserService implements IuserService {
      private UserRepository: IuserRepository;

      constructor(UserRepository: IuserRepository) {
        this.UserRepository = UserRepository;
      }
public async createStudentProfile(profileData: any, file: Express.Multer.File): Promise<any> {
  console.log('Creating profile for the student');

  const existing = await StudentProfile.findOne({ userId: profileData.userId });
  if (existing) {
    throw new Error("Profile already exists");
  }

  const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const uploadResult = await cloudinary.uploader.upload(fileStr, { folder: "profile_pictures" });
  console.log(fileStr ,'fileStr at userSservie');
  console.log(uploadResult , 'uploadResult at userService');
  
  

  const profileDataWithImage = {
    ...profileData,
    profileImage: uploadResult.secure_url, // 👈 update according to your schema
  };
  console.log(profileDataWithImage , 'profileDataWIthImage');
  

  return await StudentProfile.create(profileDataWithImage);
}



 async getStudentProfile (userId: string) : Promise<any>  {
  return await StudentProfile.findOne({ userId : userId });
};


async getAllApprovedTutors(): Promise<ITutorProfile[]> {
    return await this.UserRepository.findApprovedTutors();
   
  }

public async getTutorById(tutorId: string): Promise<ITutorProfile> {
  if (!tutorId) {
    throw new Error("Tutor ID is required");
  }

  const tutor = await this.UserRepository.findTutorById(tutorId);
  if (!tutor) {
    throw new Error("Tutor not found");
  }

  return tutor;
}



 
}


