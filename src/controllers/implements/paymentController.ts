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

      const tutorId = tutor._id   // changed it from userId to _id
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
        success_url: `${process.env.FRONTEND_URL }/tutors/session-requests`,  //payment-success?tutorId=${tutorId}
        cancel_url: `${process.env.FRONTEND_URL }/tutors/${tutorId}?cancelled=true`,//tutors/${tutorId}?cancelled=true
        metadata: {
          tutorId,
          studentId: studentId?.toString() || "",
          amount : amount
        },
      };

      const session = await stripe.checkout.sessions.create(sessionParams);
      console.log(session , 'session');
      console.log(session.id);
      

      res.status(200).json({ sessionId: session.id });
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({ message: "Payment session creation failed", error: error.message });
    }
  };


  public getPayments = async (req : Request , res : Response) : Promise<void> =>{
    try {
      console.log('getPaymets');
      

      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 5

      const {payments , totalPages} = await this.service.getPayments(page,limit)
      console.log(payments , totalPages);
      
      res.status(200).json({payments,totalPages})
      
      
    } catch (error) {
      console.log(error);
      res.status(500).json({message : "Failed to fetch the payments"})
      
    }
  }




}
