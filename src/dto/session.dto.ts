import { IScheduledSession } from "../models/notification/scheduledSessionModel";

export interface SessionDto  {
  id: string;
  tutorId: string;
  studentId: string;
  date: string;        // e.g., "2025-06-25"
  time: string;        // e.g., "15:00"
  duration: number;    // in minutes
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const mapSessionToDto = (session: IScheduledSession): SessionDto => ({
  id: session._id.toString(),
  tutorId: session.tutorId.toString(),
  studentId: session.studentId.toString(),
  date: session.date,
  time: session.time,
  duration: session.duration,
  status: session.status,
  notes: session.notes ?? "",
  createdAt: session.createdAt,
  updatedAt: session.updatedAt,
});
