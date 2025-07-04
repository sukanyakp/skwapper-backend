import { Request, Response } from "express";
import Stripe from "stripe";
import ScheduledSession from "../models/notification/scheduledSessionModel";
import Notification from "../models/notification/notificationModel";

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

      const tutorId = session.metadata?.tutorId;
      const studentId = session.metadata?.studentId;

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
          date: "",   // Optional — you can update this after confirmation
          time: "",   // Optional — or add logic to auto-schedule
          duration: 60,
        });

        // Create a notification for the tutor
        await Notification.create({
          recipientId: tutorId,
          senderId: studentId,
          message: "You have a new video session request!",
        });

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
