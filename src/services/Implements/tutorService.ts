import cloudinary from "../../utils/cloudinaryConfig";
import { ITutorService } from "../Interfaces/ItutorService";
import { ItutorRepository } from "../../repositories/Interfaces/ItutorRepository";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

import User from "../../models/user/userModel";
import TutorProfile, { ITutorProfile } from "../../models/tutor/tutorProfile";
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
    formData: {
      category: string;
      bio: string;
      skills: string;
      experience: string;
    }
  ): Promise<{ success: boolean; application: any }> {
    try {
      const uploadResults = await Promise.all(
        files.map((file) => uploadToCloudinary(file))
      );
      const documentUrls = uploadResults.map((result) => result.secure_url);

      const result = await this.TutorRepository.saveTutorApplication(userId, {
        category: formData.category,
        bio: formData.bio,
        skills: formData.skills,
        experience: formData.experience,
        documents: documentUrls,
      });

      await User.findByIdAndUpdate(userId, { status: "applied" });

      return { success: true, application: result };
    } catch (error) {
      console.error("Error applying for tutor:", error);
      throw error;
    }
  }

  public async getApplicationStatus(userId: string): Promise<any> {
    return this.TutorRepository.findById(userId); // From BaseRepository
  }

  public async createTutorProfile(
    profileData: any,
    file: Express.Multer.File
  ): Promise<ITutorProfile> {
    const existing = await TutorProfile.findOne({ userId: profileData.userId });
    if (existing) {
      throw new Error("Profile already exists");
    }

    const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const uploadResult = await cloudinary.uploader.upload(fileStr, {
      folder: "profile_pictures",
    });

    const profileDataWithImage = {
      ...profileData,
      profileImage: uploadResult.secure_url,
    };

    return await TutorProfile.create(profileDataWithImage);
  }

  public async getTutorProfile(userId: string): Promise<ITutorProfile | null> {
    return await TutorProfile.findOne({ userId });
  }

  public async updateProfile(
    userId: string,
    profileData: any,
    file?: Express.Multer.File
  ): Promise<ITutorProfile | null> {
    let imageUrl = "";

    if (file) {
      const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      const uploadResult = await cloudinary.uploader.upload(fileStr, {
        folder: "profile_pictures",
      });
      imageUrl = uploadResult.secure_url;
    }

    const profileDataWithImage = {
      ...profileData,
      ...(imageUrl && { profileImage: imageUrl }),
    };

    return await this.TutorRepository.updateTutorByUserId(userId, profileDataWithImage);
  }

  public async createCourse(
    data: any,
    file?: Express.Multer.File,
    tutorId?: string
  ): Promise<ITutorial> {
    if (!tutorId) {
      throw new Error("tutor Id is not present");
    }

    let thumbnailUrl = "";

    if (file) {
      const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      try {
        const uploadResult = await cloudinary.uploader.upload(fileStr, {
          folder: "course_thumbnails",
        });
        thumbnailUrl = uploadResult.secure_url;
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
        throw new Error("Thumbnail upload failed");
      }
    }

    const courseData = {
      ...data,
      price: Number(data.price),
      tutorId,
      thumbnail: thumbnailUrl,
    };

    return await this.TutorRepository.createCourse(courseData);
  }

  public async getCoursesByTutor(tutorId: string): Promise<ITutorial[]> {
    return await this.TutorRepository.findCoursesByTutorId(tutorId);
  }

  public async getSessionRequests(tutorId: string): Promise<any> {
    return await this.TutorRepository.getSessionRequests(tutorId);
  }

  public async setTutorAvailability(
    tutorId: string,
    availability: any
  ): Promise<IAvailability> {
    return await this.TutorRepository.saveAvailability(tutorId, availability);
  }

  public async getTutorAvailability(tutorId: string): Promise<IAvailability | null> {
    return await this.TutorRepository.getAvailability(tutorId);
  }
}
