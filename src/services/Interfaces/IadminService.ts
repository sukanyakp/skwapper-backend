import { ITutorApplication } from "../../models/tutor/tutorApplicationModel";
import { Iuser } from "../../models/user/userModel";

export interface IAdminService {
  getTutors(): Promise<Iuser[]>;

 getAllUsers(page: number, limit: number,search: string): Promise<{ users: Iuser[]; totalPages: number }> 

  getTutorApplications  (page: number, limit: number ,search : string) : Promise<any>;

  getTutorApplicationById(applicationId: string): Promise<any | null>;

  reviewTutorApplication(
    applicationId: string,
    action: "approved" | "rejected"
  ): Promise<any>;

  toggleBlockUser(userId: string, block: boolean): Promise<Iuser |ITutorApplication| null>;
}
