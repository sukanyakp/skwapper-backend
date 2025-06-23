import { IcourseService } from "../services/Interfaces/IcourseService";

export class CourseController {
    private service : IcourseService;

    constructor(service : IcourseService){
        this.service = service
    }


}