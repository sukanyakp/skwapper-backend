import { IPaymentRepository } from "../../repositories/Interfaces/IpaymentRepository";
import { IPaymentService } from "../Interfaces/IpaymentService";

export class PaymentService implements IPaymentService {
    private repository : IPaymentRepository ; 

    constructor(repository : IPaymentRepository){
        this.repository = repository
    }

    public async initiateOrder(amount : number): Promise<any>{
       
    }
};