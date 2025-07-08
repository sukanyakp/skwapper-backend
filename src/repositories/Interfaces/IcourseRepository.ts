import { ITutorial } from "../../models/tutor/TutorialModel";
import { CourseData } from "../../types/course.types";

export interface IcourseRepository {
     saveCourse  (data: any) : Promise<CourseData | null>
     getPaginatedCourses(page: number, limit: number) : Promise<any>
     getCourseById(courseId: string): Promise<ITutorial | null>
}