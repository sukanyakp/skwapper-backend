export interface IPaymentService {
    initiateOrder(amount : number): Promise<void>
    getPayments(page: number, limit: number): Promise<any>
    createCourseCheckoutSession(studentId: string, course: any): Promise<any> 
}