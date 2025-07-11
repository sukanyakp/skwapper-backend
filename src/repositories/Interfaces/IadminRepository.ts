import { ITutorApplication } from "../../models/tutor/tutorApplicationModel";
import { Iuser } from "../../models/user/userModel";
import { IBaseRepository } from "./IbaseRepository";

export interface IAdminRepository extends IBaseRepository<Iuser> {
  getAllUsers(): Promise<Iuser[]>

  tutorBlockStatus(userId: string, block: boolean): Promise<ITutorApplication  | null>;
  userBlockStatus(userId: string, block: boolean): Promise<Iuser | null>;

  fetchTutorApplications (page: number, limit: number) : Promise<any> 
  getTutorApplicationById(applicationId: string): Promise<any | null>;
  getUsersPaginated(skip: number, limit: number): Promise<Iuser[]>
  getUserCount(): Promise<number>

  updateTutorApplicationStatus(
    applicationId: string,
    action: "approved" | "rejected",
    role: string
  ): Promise<any>;
}
