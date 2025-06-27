import { Iuser } from "../../models/user/userModel";
import { IBaseRepository } from "./IbaseRepository";

export interface IAdminRepository extends IBaseRepository<Iuser> {
  getAllUsers(): Promise<Iuser[]>

  tutorBlockStatus(userId: string, block: boolean): Promise<Iuser | null>;
  userBlockStatus(userId: string, block: boolean): Promise<Iuser | null>;

  getAllTutorApplications(): Promise<any[]>;
  getTutorApplicationById(applicationId: string): Promise<any | null>;

  updateTutorApplicationStatus(
    applicationId: string,
    action: "approved" | "rejected",
    role: string
  ): Promise<any>;
}
