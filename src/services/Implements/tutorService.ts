
import cloudinary from "../../utils/cloudinaryConfig";
import { ITutorService } from "../Interfaces/ItutorService";
import { ItutorRepository } from "../../repositories/Interfaces/ItutorRepository";
import { UploadApiResponse } from "cloudinary";
import tutorApplicationModel from "../../models/tutor/tutorApplicationModel";
import User from '../../models/user/userModel'
import { uploadToCloudinary } from "../../utils/cloudinaryUpload"; // adjust path
import TutorProfile from "../../models/tutor/tutorModel"

export class TutorService implements ITutorService {
  private TutorRepository: ItutorRepository;

  constructor(TutorRepository: ItutorRepository) {
    this.TutorRepository = TutorRepository;
  }
public async applyForTutor(
  userId: string,
  files: Express.Multer.File[],
  formData: { title: string; bio: string; skills: string; experience: string }
) {
  try {
    // Upload files to Cloudinary
    const uploadResults = await Promise.all(files.map(file => uploadToCloudinary(file)));
    const documentUrls = uploadResults.map(result => result.secure_url);

    // Save tutor application with additional info
    const result = await this.TutorRepository.saveTutorApplication(userId, {
      title: formData.title,
      bio: formData.bio,
      skills: formData.skills,
      experience: formData.experience,
      documents: documentUrls,
    });

    // Update user status
    await User.findByIdAndUpdate(userId, { status: "applied" });

    return { success: true, application: result };
  } catch (error) {
    console.error("Error applying for tutor:", error);
    throw error;
  }
}


public async getApplicationStatus(userId: string) {
  return this.TutorRepository.findByUserId(userId);
}


public async createTutorProfile(profileData: any, file: Express.Multer.File): Promise<any> {
  console.log('Creating profile for the student');

  const existing = await TutorProfile.findOne({ userId: profileData.userId });
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
  

  return await TutorProfile.create(profileDataWithImage);
}

 async getTutorProfile (userId: string) : Promise<any>  {
  return await TutorProfile.findOne({ userId : userId });
};



}
