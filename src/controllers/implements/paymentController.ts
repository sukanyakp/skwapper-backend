import { Request, Response } from 'express';
import { IPaymentService } from '../../services/Interfaces/IpaymentService';
import Stripe from 'stripe';
import { AuthRequest } from '../../types';
import mongoose from 'mongoose';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil", 
});


export class PaymentController {
  private service: IPaymentService;

  constructor(service: IPaymentService) {
    this.service = service;
  }

  public stripePayment = async (req: AuthRequest, res: Response) :Promise<any>=> {
    try {
      const studentId = req.userId;
      const { tutor } = req.body;

      const tutorId = tutor.userId
      const amount = tutor.hourlyRate
      const tutorName = tutor.name

      console.log(studentId ,'studentId' ,tutorId ,amount ,tutorName);
      

      if (!tutorId || !amount || !tutorName) {
        return res.status(400).json({ message: "Missing tutorId, name or amount" });
      }

      if (!mongoose.Types.ObjectId.isValid(tutorId)) {
        return res.status(400).json({ message: "Invalid tutor ID" });
      }

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: `Video Session with ${tutorName}`,
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL }/payment-success?tutorId=${tutorId}`,
        cancel_url: `${process.env.FRONTEND_URL }/tutors/${tutorId}?cancelled=true`,
        metadata: {
          tutorId,
          studentId: studentId?.toString() || "",
        },
      };

      const session = await stripe.checkout.sessions.create(sessionParams);
      console.log(session , 'session');
      console.log(session.id);
      

      res.status(200).json({ sessionId: session.id });
    } catch (error: any) {
      console.error("❌ Stripe error:", error);
      res.status(500).json({ message: "Payment session creation failed", error: error.message });
    }
  };
}
