import { IcourseRepository } from "../../repositories/Interfaces/IcourseRepository";
import { IcourseService } from "../Interfaces/IcourseService";

export class CourseService implements IcourseService {
    private CourseRepository : IcourseRepository;

    constructor(CourseRepository : IcourseRepository){
        this.CourseRepository = CourseRepository
    }
}
