import { IStudentProfile } from "../models/student/studentModel";

// The DTO that defines what you want to return to the client
export interface StudentProfileDto {
  id: string;
  userId: string;
  name: string;
  bio?: string;
  instrument: string;
  location?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mapping function to convert Mongoose document to DTO
export const mapStudentToDto = (profile: IStudentProfile): StudentProfileDto => ({
  id: profile._id.toString(),
  userId: profile.userId.toString(),
  name: profile.name,
  bio: profile.bio ?? "",
  instrument: profile.instrument,
  location: profile.location ?? "",
  profileImage: profile.profileImage ?? "",
  createdAt: profile.createdAt,
  updatedAt: profile.updatedAt,
});
