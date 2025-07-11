import { ITutorial } from "../../models/tutor/TutorialModel";
import { CourseData } from "../../types/course.types";

export interface IcourseService {
       createCourse  (data: CourseData) : Promise<any>
       fetchAllCourses(page: number, limit: number) : Promise<any>
       getCourseById(courseId: string): Promise<ITutorial | null>

}