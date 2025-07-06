import { IPaymentRepository } from "../../repositories/Interfaces/IpaymentRepository";
import { IPaymentService } from "../Interfaces/IpaymentService";

export class PaymentService implements IPaymentService {
    private repository : IPaymentRepository ; 

    constructor(repository : IPaymentRepository){
        this.repository = repository
    }

    public async initiateOrder(amount : number): Promise<any>{
       
    }

    
    public async getPayments(page: number, limit: number): Promise<any> {
    const { payments, totalCount } = await this.repository.fetchPayments(page, limit);

    const totalPages = Math.ceil(totalCount / limit);
    return { payments, totalPages };
  }
};