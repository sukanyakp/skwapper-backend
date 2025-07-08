export interface IPaymentRepository {
//   createRazorpayOrder(amount: number): Promise<any>;
fetchPayments(page: number, limit: number) : Promise<any>
}
