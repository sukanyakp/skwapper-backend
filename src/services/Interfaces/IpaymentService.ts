export interface IPaymentService {
    initiateOrder(amount : number): Promise<void>
}