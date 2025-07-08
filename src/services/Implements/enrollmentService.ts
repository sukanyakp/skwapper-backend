import { IEnrollmentRepository } from "../../repositories/Interfaces/IenrollementRepository";
import { IEnrollmentService } from "../Interfaces/IenrollmentService";

export class EnrollmentService implements IEnrollmentService {

    private repository : IEnrollmentRepository;
    constructor(repository : IEnrollmentRepository){
        this.repository = repository
    }
    



}