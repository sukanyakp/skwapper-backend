import { Iuser } from "../../models/user/userModel";

export interface ItutorRepository {
  saveTutorApplication(documentUrls: string[]): Promise<any>;
  findByUserId(userId: string) : Promise<Iuser | null >
}
