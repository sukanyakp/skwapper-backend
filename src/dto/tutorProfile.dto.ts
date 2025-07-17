import { ITutorProfile } from "../models/tutor/tutorProfile";

export interface TutorProfileDto {
  _id: string;
  userId: string;
  name: string;
  bio?: string;
  skills: string[];
  experience: number;
  location?: string;
  hourlyRate?: number;
  availability?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const mapTutorToDto = (profile: ITutorProfile): TutorProfileDto => ({
  _id: profile._id.toString(),
  userId: profile.userId.toString(),
  name: profile.name,
  bio: profile.bio ?? "",
  skills: profile.skills,
  experience: profile.experience,
  location: profile.location ?? "",
  hourlyRate: profile.hourlyRate ?? 0,
  availability: profile.availability ?? "",
  profileImage: profile.profileImage ?? "",
  createdAt: profile.createdAt,
  updatedAt: profile.updatedAt,
});
