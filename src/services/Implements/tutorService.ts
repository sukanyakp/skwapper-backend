
import cloudinary from "../../utils/cloudinaryConfig";
import { ITutorService } from "../Interfaces/ItutorService";
import { ItutorRepository } from "../../repositories/Interfaces/ItutorRepository";
import { UploadApiResponse } from "cloudinary";
import tutorApplicationModel from "../../models/tutor/tutorApplicationModel";
import User from '../../models/user/userModel'
import { uploadToCloudinary } from "../../utils/cloudinaryUpload"; // adjust path

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


}
