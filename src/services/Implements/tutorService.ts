
import cloudinary from "../../utils/cloudinaryConfig";
import { ITutorService } from "../Interfaces/ItutorService";
import { ItutorRepository } from "../../repositories/Interfaces/ItutorRepository";
import { UploadApiResponse } from "cloudinary";

export class TutorService implements ITutorService {
  private TutorRepository: ItutorRepository;

  constructor(TutorRepository: ItutorRepository) {
    this.TutorRepository = TutorRepository;
  }

 public async applyForTutor(files: Express.Multer.File[]): Promise<any> {
  try {
    console.log('here we at intial state of service');
    console.log("Received files:", files);

    const uploadPromises = files.map((file) => {
      const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      return cloudinary.uploader.upload(fileStr, {
        folder: "tutor_documents",
      }) as Promise<UploadApiResponse>;
    });

    const uploadResults = await Promise.all(uploadPromises);
    
    console.log('here we at intial state of service 22 ');
    const documentUrls = uploadResults.map((result) => result.secure_url);

   console.log("Uploading complete. Document URLs:", documentUrls);

const result = await this.TutorRepository.saveTutorApplication(documentUrls);

console.log("Saved to DB. Result:", result);


    return result;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error;
  }
}

public async getApplicationStatus(userId: string) {
  return this.TutorRepository.findByUserId(userId);
}


}
