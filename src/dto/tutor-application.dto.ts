export interface TutorApplicationDto {
  id: string;
  status: "pending" | "approved" | "rejected";
  isBlocked: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    isBlocked: boolean;
  };
}

import { ITutorApplication } from "../models/tutor/tutorApplicationModel";

export const mapTutorApplicationToDto = (app: ITutorApplication): TutorApplicationDto => ({
  id: app._id.toString(),
  status: app.status,
  isBlocked: app.isBlocked ?? false,
  user: {
    id: (app.user as any)._id.toString(),
    name: (app.user as any).name,
    email: (app.user as any).email,
    isBlocked: (app.user as any).isBlocked ?? false,
  },
});
