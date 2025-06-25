
import cloudinary from "../../utils/cloudinaryConfig";
import { ITutorService } from "../Interfaces/ItutorService";
import { ItutorRepository } from "../../repositories/Interfaces/ItutorRepository";
import { UploadApiResponse } from "cloudinary";
import tutorApplicationModel from "../../models/tutor/tutorApplicationModel";
import User from '../../models/user/userModel'
import { uploadToCloudinary } from "../../utils/cloudinaryUpload"; // adjust path
import TutorProfile from "../../models/tutor/tutorProfile"
import { ITutorial } from "../../models/tutor/TutorialModel";
import { IAvailability } from "../../models/tutor/tutorAvailability";


export class TutorService implements ITutorService {
  private TutorRepository: ItutorRepository;

  constructor(TutorRepository: ItutorRepository) {
    this.TutorRepository = TutorRepository;
  }
public async applyForTutor(
  userId: string,
  files: Express.Multer.File[],
  formData: { category: string; bio: string; skills: string; experience: string }
) {
  try {
    // Upload files to Cloudinary
    const uploadResults = await Promise.all(files.map(file => uploadToCloudinary(file)));
    const documentUrls = uploadResults.map(result => result.secure_url);

    // Save tutor application with additional info
    const result = await this.TutorRepository.saveTutorApplication(userId, {
      category: formData.category,
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


async createCourse(
  data: any,
  file?: Express.Multer.File,
  tutorId?: string
): Promise<ITutorial> {
  let thumbnailUrl = "";

  if (file) {
    // Convert buffer to base64 and upload to Cloudinary
    const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

    try {
      const uploadResult = await cloudinary.uploader.upload(fileStr, {
        folder: "course_thumbnails", // you can customize the folder name
      });

      console.log("Upload result:", uploadResult);
      thumbnailUrl = uploadResult.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      throw new Error("Thumbnail upload failed");
    }
  }
  if(!tutorId){
    throw new Error("tutor Id is not present")
  }

  const category = this.TutorRepository.findByUserId(tutorId)

  const courseData = {
    ...data,
    price: Number(data.price),
    tutorId,
    thumbnail: thumbnailUrl,
  };

  console.log("Final course data to be saved:", courseData);
  return await this.TutorRepository.createCourse(courseData);
}


async getCoursesByTutor(tutorId: string): Promise<ITutorial[]> {
  console.log(tutorId,'tutorId at service');
  
    return await this.TutorRepository.findCoursesByTutorId(tutorId);
  }


  public async getSessionRequests(tutorId: string) : Promise<string>{
  return await this.TutorRepository.getSessionRequests(tutorId);
}


 async setTutorAvailability(tutorId: string, availability: any): Promise<IAvailability> {
    return await this.TutorRepository.saveAvailability(tutorId, availability);
  }

  async getTutorAvailability(tutorId: string): Promise<IAvailability | null> {
    return await this.TutorRepository.getAvailability(tutorId);
  }



}
