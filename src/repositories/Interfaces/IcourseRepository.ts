import { CourseData } from "../../types/course.types";

export interface IcourseRepository {
     saveCourse  (data: any) : Promise<CourseData | null>
     getAllCourses(): Promise<any> 
}