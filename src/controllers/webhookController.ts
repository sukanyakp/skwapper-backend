import { Request, Response } from "express";
import Stripe from "stripe";
import ScheduledSession from "../models/notification/scheduledSessionModel";
import Notification from "../models/notification/notificationModel";
import Payments from "../models/student/paymentModel";
import Wallet from "../models/student/walletModel";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export class WebhookController {


  public stripeWebhook = async (req: Request, res: Response) : Promise<void>=> {

    console.log('now at stripeWebhook . . . . ');
    
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
       res.status(400).send(`Webhook Error: ${err.message}`);
       return
    }

    //  Handle successful checkout
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log(session , 'the whole data from the stripe session');
      

      const tutorId = session.metadata?.tutorId;
      const studentId = session.metadata?.studentId;
      const amount = session.metadata?.amount

      console.log(amount  , tutorId);
      

      if (!tutorId || !studentId) {
        console.warn("Missing metadata: tutorId or studentId");
         res.status(400).json({ message: "Missing tutor or student info" });
         return
      }

      try {
        // Create scheduled session entry
        await ScheduledSession.create({
          tutorId,
          studentId,
          status: "pending",
          duration: 60,
        });

        // Create a notification for the tutor
        await Notification.create({
          recipientId: tutorId,
          senderId: studentId,
          message: "You have a new video session request!",
        });

        // Create PaymentModel
        await Payments.create({
           tutorId,
           studentId,
           amount 
        })
// create walletModel
await Wallet.updateOne(
  { userId: tutorId },
  {
    $push: {
      transactions: {
        amount: Number(amount),
        type: "credit",
        reference: session.id,
        status: "pending", // ✅ Confirmed payment, but session not completed yet
        sessionId: null,   // You can add it later when session is confirmed
      },
    },
  },
  { upsert: true }
);


        console.log("Created session + notification.");
      } catch (err) {
        console.error("Failed to handle checkout completion:", err);
        res.status(500).json({ message: "Server error" });
        return
      }
    }

    // Acknowledge the event
    res.status(200).json({ received: true });
  };
}
