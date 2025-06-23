import { Iuser } from "../../models/user/userModel";

export interface IAdminService {

    getTutorApplications(): Promise<any[]>;
    reviewTutorApplication(
    applicationId: string,
    action: "approved" | "rejected",
    // adminId: string,
    rejectionReason?: string
  ): Promise<any>
    getTutors(): Promise<Iuser[]>
    updateTutorStatus(id: string, action: string): Promise<Iuser | null> 
    getTutorApplicationById(applicationId: string): Promise<any | null>
    toggleBlockUser(userId: string, block: boolean) : Promise<any | null>
    getAllUsers(): Promise<Iuser[]>
 
}