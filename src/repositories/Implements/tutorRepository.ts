import { ItutorRepository } from "../Interfaces/ItutorRepository";
import { TutorApplication } from "../../models/tutor/tutorApplicationModel";
import { BaseRepository } from "./baseRepository";
import { Iuser } from "../../models/user/userModel";

export class TutorRepository  extends BaseRepository<Iuser> implements ItutorRepository {
  public async saveTutorApplication(documentUrls: string[]): Promise<any> {
    const newApplication = new TutorApplication({
      documents: documentUrls,
    });

    return await newApplication.save();
  }
}
