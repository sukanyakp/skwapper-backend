import { Iuser } from "../../models/user/userModel";

export interface IAdminService {
  getTutors(): Promise<Iuser[]>;

  getAllUsers(): Promise<Iuser[]>;

  getTutorApplications(): Promise<any[]>;

  getTutorApplicationById(applicationId: string): Promise<any | null>;

  reviewTutorApplication(
    applicationId: string,
    action: "approved" | "rejected"
  ): Promise<any>;

  toggleBlockUser(userId: string, block: boolean): Promise<Iuser | null>;
}
