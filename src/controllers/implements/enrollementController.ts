import { Request, Response } from "express";
import { IEnrollmentService } from "../../services/Interfaces/IenrollmentService";
import { IPaymentService } from "../../services/Interfaces/IpaymentService";
import { AuthRequest } from "../../types"; // Use this if `req.userId` is coming from an authenticated request

export class EnrollmentController {
  private service: IEnrollmentService;
  private paymentService: IPaymentService;

  constructor(service: IEnrollmentService, paymentService: IPaymentService) {
    this.service = service;
    this.paymentService = paymentService; // ✅ FIXED: proper assignment
  }

  public createEnrollment = async (req: AuthRequest, res: Response): Promise<void> => {

    console.log('createEnrollment');
    
    const studentId = req?.userId;
    const { course } = req.body;

    if (!studentId || !course) {
      res.status(400).json({ message: "Missing student or course data." });
      return;
    }

    try {
      const session = await this.paymentService.createCourseCheckoutSession(studentId, course);

      console.log(session , 'enrollementController session ');
      
      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error("Stripe error:", error);
      res.status(500).json({ message: "Payment initiation failed" });
    }
  };
}
