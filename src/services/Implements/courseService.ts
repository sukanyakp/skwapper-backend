import { IcourseRepository } from "../../repositories/Interfaces/IcourseRepository";
import { CourseData } from "../../types/course.types";
import { IcourseService } from "../Interfaces/IcourseService";


export class CourseService implements IcourseService {
    private CourseRepository : IcourseRepository;

    constructor(CourseRepository : IcourseRepository){
        this.CourseRepository = CourseRepository
    }

    
public async createCourse  (data: CourseData) : Promise<any> {
  return await this.CourseRepository.saveCourse(data);
};

   public async fetchAllCourses(page: number, limit: number): Promise<any> {
    return await this.CourseRepository.getPaginatedCourses(page, limit);
  }

}
